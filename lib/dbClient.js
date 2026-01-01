const { Pool } = require('pg');

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'maas_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  // Configuration SSL pour Render (production)
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  // Configuration pour la production
  max: 20, // Nombre max de connexions
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Test de connexion
 */
pool.on('connect', () => {
  console.log('✅ Connecté à PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL:', err);
});

/**
 * Initialise la table waitlist si elle n'existe pas
 */
async function initDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
      prenom VARCHAR(100) NOT NULL,
      nom VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      linkedin VARCHAR(500),
      commentaire TEXT,
      ip VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    -- Index pour optimiser les recherches
    CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
    CREATE INDEX IF NOT EXISTS idx_waitlist_timestamp ON waitlist(timestamp DESC);
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Table waitlist initialisée');
  } catch (error) {
    console.error('❌ Erreur initialisation table:', error);
    throw error;
  }
}

/**
 * Ajoute une inscription à la waitlist
 */
async function addToWaitlist(data) {
  const query = `
    INSERT INTO waitlist (timestamp, prenom, nom, email, linkedin, commentaire, ip)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    data.timestamp,
    data.prenom,
    data.nom,
    data.email,
    data.linkedin || null,
    data.commentaire || null,
    data.ip
  ];

  try {
    const result = await pool.query(query, values);
    console.log(`✅ Inscription ajoutée: ${data.email}`);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Erreur insertion:', error);
    throw error;
  }
}

/**
 * Récupère toutes les inscriptions (tri par date décroissante)
 */
async function getAllWaitlist() {
  const query = `
    SELECT 
      id,
      TO_CHAR(timestamp, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as timestamp,
      prenom,
      nom,
      email,
      linkedin,
      commentaire,
      ip
    FROM waitlist
    ORDER BY timestamp DESC
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('❌ Erreur récupération données:', error);
    throw error;
  }
}

/**
 * Compte le nombre total d'inscriptions
 */
async function countWaitlist() {
  const query = 'SELECT COUNT(*) as total FROM waitlist';
  
  try {
    const result = await pool.query(query);
    return parseInt(result.rows[0].total);
  } catch (error) {
    console.error('❌ Erreur comptage:', error);
    throw error;
  }
}

/**
 * Vérifie si un email existe déjà
 */
async function emailExists(email) {
  const query = 'SELECT id FROM waitlist WHERE email = $1 LIMIT 1';
  
  try {
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('❌ Erreur vérification email:', error);
    return false;
  }
}

/**
 * Ferme la connexion (pour les tests)
 */
async function closeConnection() {
  await pool.end();
  console.log('✅ Connexion PostgreSQL fermée');
}

module.exports = {
  initDatabase,
  addToWaitlist,
  getAllWaitlist,
  countWaitlist,
  emailExists,
  closeConnection
};

