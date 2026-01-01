require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const { initDatabase, addToWaitlist, getAllWaitlist, countWaitlist } = require('./lib/dbClient');
const { validateFormData } = require('./lib/validators');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialiser la base de données au démarrage
initDatabase().catch(err => {
  console.error('❌ Impossible d\'initialiser la base de données:', err);
  process.exit(1);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'maas-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

app.use(express.static('public'));

// Fonction pour extraire l'IP client
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.ip;
}

// ============================================
// ROUTES PUBLIQUES
// ============================================

/**
 * GET / - Landing page
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * POST /api/submit - Soumission formulaire waitlist
 */
app.post('/api/submit', async (req, res) => {
  try {
    const { prenom, nom, email, linkedin, commentaire } = req.body;

    // Validation des données
    const validation = validateFormData({ prenom, nom, email, linkedin, commentaire });
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.errors[0]
      });
    }

    // Préparation des données
    const data = {
      timestamp: new Date().toISOString(),
      prenom: prenom.trim(),
      nom: nom.trim(),
      email: email.trim(),
      linkedin: linkedin?.trim() || '',
      commentaire: commentaire?.trim() || '',
      ip: getClientIp(req)
    };

    // Insertion dans PostgreSQL
    await addToWaitlist(data);

    res.json({
      success: true,
      message: 'Inscription enregistrée'
    });

  } catch (error) {
    console.error('❌ Erreur soumission formulaire:', error);
    
    // Erreur de doublon email
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Cet email est déjà inscrit'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erreur serveur, veuillez réessayer'
    });
  }
});

// ============================================
// ROUTES ADMIN
// ============================================

/**
 * Middleware de vérification de session admin
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.status(403).json({ error: 'Non authentifié' });
}

/**
 * POST /api/admin/login - Connexion admin
 */
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  
  if (username === adminUsername && password === adminPassword) {
    req.session.isAdmin = true;
    req.session.username = username;
    
    console.log(`✅ Admin connecté: ${username}`);
    
    res.json({
      success: true,
      message: 'Connexion réussie'
    });
  } else {
    console.log(`❌ Tentative de connexion échouée: ${username}`);
    
    res.status(401).json({
      success: false,
      error: 'Identifiants incorrects'
    });
  }
});

/**
 * POST /api/admin/logout - Déconnexion admin
 */
app.post('/api/admin/logout', (req, res) => {
  const username = req.session.username;
  req.session.destroy();
  
  console.log(`✅ Admin déconnecté: ${username}`);
  
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

/**
 * GET /api/admin/check - Vérifier si connecté
 */
app.get('/api/admin/check', (req, res) => {
  if (req.session && req.session.isAdmin) {
    res.json({
      authenticated: true,
      username: req.session.username
    });
  } else {
    res.json({
      authenticated: false
    });
  }
});

/**
 * GET /admin - Page admin
 */
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

/**
 * GET /api/admin/data - Récupération des données
 */
app.get('/api/admin/data', requireAuth, async (req, res) => {
  try {
    const data = await getAllWaitlist();
    const total = await countWaitlist();
    
    res.json({
      total,
      data
    });
  } catch (error) {
    console.error('❌ Erreur récupération données admin:', error);
    res.status(500).json({
      error: 'Impossible de charger les données'
    });
  }
});

/**
 * GET /api/admin/export - Export CSV
 */
app.get('/api/admin/export', requireAuth, async (req, res) => {
  try {
    const data = await getAllWaitlist();
    
    // Génération CSV avec BOM UTF-8 pour Excel
    const BOM = '\uFEFF';
    let csv = BOM + 'Timestamp,Prénom,Nom,Email,LinkedIn,Commentaire,IP\n';
    
    data.forEach(row => {
      csv += [
        row.timestamp,
        escapeCSV(row.prenom),
        escapeCSV(row.nom),
        escapeCSV(row.email),
        escapeCSV(row.linkedin),
        escapeCSV(row.commentaire),
        escapeCSV(row.ip)
      ].join(',') + '\n';
    });
    
    // Format de date pour le nom du fichier
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="maas-waitlist-${dateStr}.csv"`);
    res.send(csv);
    
  } catch (error) {
    console.error('❌ Erreur export CSV:', error);
    res.status(500).send('Erreur lors de l\'export');
  }
});

/**
 * Échappe les valeurs CSV
 */
function escapeCSV(value) {
  if (!value) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// ============================================
// DÉMARRAGE SERVEUR
// ============================================

app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 MaaS Waitlist Server');
  console.log('=================================');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`🔐 Admin: http://localhost:${PORT}/admin`);
  console.log(`👤 Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
  console.log('=================================');
});

