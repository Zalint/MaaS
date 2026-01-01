# MaaS Waitlist - Quick Start

## 🎯 Objectif
Application waitlist pour MATA as a Service avec Google Sheets comme base de données.

## ⚡ Démarrage rapide (5 minutes)

### 1. Installation
```bash
npm install
```

### 2. Configuration minimale

Copiez `env.example` en `.env` et remplissez :

```env
GOOGLE_SHEET_ID=votre_sheet_id
GOOGLE_CREDENTIALS=credentials_base64
ADMIN_TOKEN=généré_avec_npm_run_generate-token
```

### 3. Générer un token admin
```bash
npm run generate-token
```

### 4. Lancer l'app
```bash
npm start
```

### 5. Tester

**Landing page :**
http://localhost:3000

**Page admin :**
http://localhost:3000/admin/VOTRE_TOKEN

## 📋 Checklist de configuration

- [ ] Google Sheet créé avec headers
- [ ] Service Account créé (Google Cloud)
- [ ] Sheet partagé avec Service Account email
- [ ] credentials.json téléchargé et encodé en base64
- [ ] .env configuré avec toutes les variables
- [ ] `npm install` exécuté
- [ ] Application démarrée avec `npm start`
- [ ] Landing page accessible
- [ ] Page admin accessible
- [ ] Test d'inscription effectué
- [ ] Données visibles dans Google Sheet

## 🚀 Prêt pour la production ?

1. Poussez le code sur GitHub
2. Créez un Web Service sur render.com
3. Configurez les variables d'environnement
4. Déployez !

**Documentation complète :** Voir [README.md](README.md) et [SETUP.md](SETUP.md)

---

**Support :** Tous les détails techniques sont dans README.md

