/**
 * Script de test de l'environnement
 * Vérifie que toutes les variables d'environnement sont correctement configurées
 * 
 * Usage: node test-env.js
 */

require('dotenv').config();

console.log('');
console.log('===========================================');
console.log('🔍 Test de Configuration MaaS Waitlist');
console.log('===========================================');
console.log('');

let hasErrors = false;

// Vérification PORT
console.log('📍 PORT');
if (process.env.PORT) {
    console.log(`   ✅ Défini: ${process.env.PORT}`);
} else {
    console.log('   ⚠️  Non défini (utilisera 3000 par défaut)');
}
console.log('');

// Vérification GOOGLE_SHEET_ID
console.log('📊 GOOGLE_SHEET_ID');
if (process.env.GOOGLE_SHEET_ID) {
    const id = process.env.GOOGLE_SHEET_ID;
    if (id.includes('your_sheet_id') || id.length < 20) {
        console.log('   ❌ Valeur invalide ou exemple');
        hasErrors = true;
    } else {
        console.log(`   ✅ Défini: ${id.substring(0, 20)}...`);
    }
} else {
    console.log('   ❌ Non défini');
    hasErrors = true;
}
console.log('');

// Vérification GOOGLE_CREDENTIALS
console.log('🔑 GOOGLE_CREDENTIALS');
if (process.env.GOOGLE_CREDENTIALS) {
    const creds = process.env.GOOGLE_CREDENTIALS;
    if (creds.includes('your_base64') || creds.length < 100) {
        console.log('   ❌ Valeur invalide ou exemple');
        hasErrors = true;
    } else {
        try {
            const decoded = Buffer.from(creds, 'base64').toString('utf-8');
            const parsed = JSON.parse(decoded);
            
            if (parsed.type === 'service_account' && parsed.client_email) {
                console.log(`   ✅ Valide (Service Account: ${parsed.client_email})`);
            } else {
                console.log('   ❌ JSON invalide (pas un Service Account)');
                hasErrors = true;
            }
        } catch (e) {
            console.log('   ❌ Impossible de décoder le base64 ou JSON invalide');
            console.log(`      Erreur: ${e.message}`);
            hasErrors = true;
        }
    }
} else {
    console.log('   ❌ Non défini');
    hasErrors = true;
}
console.log('');

// Vérification ADMIN_TOKEN
console.log('🔐 ADMIN_TOKEN');
if (process.env.ADMIN_TOKEN) {
    const token = process.env.ADMIN_TOKEN;
    if (token.includes('your_') || token.length < 32) {
        console.log('   ❌ Valeur invalide ou exemple (doit faire 64 caractères hex)');
        hasErrors = true;
    } else if (token.length === 64 && /^[a-f0-9]+$/i.test(token)) {
        console.log(`   ✅ Valide (${token.substring(0, 16)}...)`);
        console.log(`      URL admin: http://localhost:3000/admin/${token}`);
    } else {
        console.log('   ⚠️  Défini mais format inhabituel (devrait être 64 chars hex)');
    }
} else {
    console.log('   ❌ Non défini');
    hasErrors = true;
}
console.log('');

// Vérification NODE_ENV
console.log('⚙️  NODE_ENV');
if (process.env.NODE_ENV) {
    console.log(`   ✅ Défini: ${process.env.NODE_ENV}`);
} else {
    console.log('   ⚠️  Non défini (ok pour développement local)');
}
console.log('');

// Résumé
console.log('===========================================');
if (hasErrors) {
    console.log('❌ ERREURS DÉTECTÉES');
    console.log('');
    console.log('Actions requises :');
    console.log('  1. Copiez env.example en .env');
    console.log('  2. Remplacez les valeurs exemple par vos vraies données');
    console.log('  3. Pour générer un token : npm run generate-token');
    console.log('  4. Relancez ce test : node test-env.js');
    console.log('');
    console.log('Documentation : README.md et SETUP.md');
} else {
    console.log('✅ CONFIGURATION VALIDE');
    console.log('');
    console.log('Vous pouvez démarrer l\'application :');
    console.log('  npm start');
    console.log('');
    console.log('Puis accédez à :');
    console.log('  Landing page : http://localhost:3000');
    console.log(`  Admin : http://localhost:3000/admin/${process.env.ADMIN_TOKEN}`);
}
console.log('===========================================');
console.log('');

process.exit(hasErrors ? 1 : 0);

