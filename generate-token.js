/**
 * Script utilitaire pour générer un token admin sécurisé
 * 
 * Usage: node generate-token.js
 */

const crypto = require('crypto');

console.log('');
console.log('===========================================');
console.log('🔐 Générateur de Token Admin MaaS');
console.log('===========================================');
console.log('');

// Génère un token de 64 caractères hexadécimaux (32 bytes)
const token = crypto.randomBytes(32).toString('hex');

console.log('Votre nouveau token admin :');
console.log('');
console.log(`  ${token}`);
console.log('');
console.log('⚠️  IMPORTANT :');
console.log('   1. Ajoutez ce token dans votre fichier .env :');
console.log(`      ADMIN_TOKEN=${token}`);
console.log('');
console.log('   2. Sur Render, ajoutez-le dans Environment Variables');
console.log('');
console.log('   3. Votre URL admin sera :');
console.log(`      http://localhost:3000/admin/${token}`);
console.log('');
console.log('   4. Ne partagez JAMAIS ce token publiquement !');
console.log('');
console.log('===========================================');
console.log('');

