const { google } = require('googleapis');

let sheets = null;
let auth = null;

/**
 * Initialise le client Google Sheets API
 */
function initSheetsClient() {
  if (sheets) return sheets;

  try {
    // Décoder les credentials depuis la variable d'environnement
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString('utf-8')
    );

    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets client initialisé');
    return sheets;
  } catch (error) {
    console.error('❌ Erreur initialisation Google Sheets:', error);
    throw new Error('Impossible d\'initialiser Google Sheets API');
  }
}

/**
 * Utilitaire pour attendre un délai
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Ajoute une ligne au Google Sheet avec retry automatique
 * @param {Object} data - Données à insérer
 * @param {number} retries - Nombre de tentatives
 */
async function appendRow(data, retries = 3) {
  const client = initSheetsClient();
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;

  const values = [[
    data.timestamp,
    data.prenom,
    data.nom,
    data.email,
    data.linkedin || '',
    data.commentaire || '',
    data.ip
  ]];

  for (let i = 0; i < retries; i++) {
    try {
      await client.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Sheet1!A:G',
        valueInputOption: 'RAW',
        resource: { values }
      });
      
      console.log(`✅ Ligne ajoutée au Sheet pour ${data.email}`);
      return true;
    } catch (error) {
      console.error(`❌ Tentative ${i + 1}/${retries} échouée:`, error.message);
      
      if (i < retries - 1) {
        const delay = 1000 * (i + 1); // Délai exponentiel: 1s, 2s, 3s
        console.log(`⏳ Retry dans ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  throw new Error('Échec insertion après 3 tentatives');
}

/**
 * Lit toutes les données du Google Sheet
 */
async function readAll() {
  const client = initSheetsClient();
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;

  try {
    const response = await client.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A:G'
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return [];
    }

    // Skip header row (première ligne)
    return rows.slice(1).map(row => ({
      timestamp: row[0] || '',
      prenom: row[1] || '',
      nom: row[2] || '',
      email: row[3] || '',
      linkedin: row[4] || '',
      commentaire: row[5] || '',
      ip: row[6] || ''
    }));
  } catch (error) {
    console.error('❌ Erreur lecture Google Sheet:', error);
    throw new Error('Impossible de lire les données');
  }
}

module.exports = {
  appendRow,
  readAll
};

