# 🎯 MaaS Waitlist - Landing Page & Admin

Landing page complète avec waitlist pour **MATA as a Service (MaaS)** — Votre boucherie clé-en-main au Sénégal.

## 📦 Stack Technique

- **Backend:** Node.js + Express.js
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Stockage:** Google Sheets API v4
- **Hosting:** Render (ou tout service Node.js)

## 🚀 Installation

### 1. Prérequis

- Node.js v16+ installé
- Compte Google avec accès à Google Cloud Console
- Git (optionnel)

### 2. Cloner le projet

```bash
git clone <votre-repo>
cd maas-waitlist
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Configuration Google Sheets

#### A. Créer un Google Sheet

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez un nouveau fichier nommé "MaaS Waitlist"
3. Dans la première ligne (header), ajoutez les colonnes suivantes :
   ```
   Timestamp | Prénom | Nom | Email | LinkedIn | Commentaire | IP
   ```
4. Notez l'**ID du Sheet** depuis l'URL :
   ```
   https://docs.google.com/spreadsheets/d/VOTRE_SHEET_ID/edit
   ```

#### B. Créer un Service Account

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet (ou sélectionnez-en un existant)
3. Activez **Google Sheets API** :
   - Menu APIs & Services → Library
   - Recherchez "Google Sheets API"
   - Cliquez sur "Enable"
4. Créez un Service Account :
   - APIs & Services → Credentials
   - Create Credentials → Service Account
   - Donnez un nom (ex: "maas-bot")
   - Skip les permissions (cliquez Continue puis Done)
5. Créez une clé JSON :
   - Cliquez sur le Service Account créé
   - Keys → Add Key → Create new key
   - Choisissez JSON
   - Le fichier `credentials.json` se télécharge

#### C. Partager le Sheet avec le Service Account

1. Ouvrez le fichier `credentials.json`
2. Copiez la valeur du champ `client_email` (ex: `maas-bot@project-id.iam.gserviceaccount.com`)
3. Dans votre Google Sheet :
   - Cliquez sur "Partager" (en haut à droite)
   - Collez l'email du Service Account
   - Donnez les droits **Éditeur**
   - Décochez "Notify people"
   - Cliquez sur "Partager"

### 5. Configuration des variables d'environnement

#### A. Encoder le fichier credentials.json en base64

**Windows (PowerShell) :**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("credentials.json"))
```

**Linux/Mac :**
```bash
base64 -w 0 credentials.json
```

Copiez la longue chaîne résultante.

#### B. Générer un token admin

**Windows (PowerShell) :**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Linux/Mac/Git Bash :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### C. Créer le fichier .env

Créez un fichier `.env` à la racine du projet :

```env
PORT=3000
GOOGLE_SHEET_ID=votre_sheet_id_ici
GOOGLE_CREDENTIALS=votre_base64_credentials_ici
ADMIN_TOKEN=votre_token_64_chars_ici
NODE_ENV=development
```

Remplacez les valeurs par :
- `GOOGLE_SHEET_ID` : L'ID copié depuis l'URL du Sheet
- `GOOGLE_CREDENTIALS` : Le base64 des credentials JSON
- `ADMIN_TOKEN` : Le token généré (64 caractères hex)

## 🏃 Lancement en local

```bash
npm start
```

Ou pour le développement avec auto-reload :

```bash
npm run dev
```

L'application sera accessible sur :
- **Landing page :** http://localhost:3000
- **Page admin :** http://localhost:3000/admin/VOTRE_TOKEN

## 📤 Déploiement sur Render

### 1. Créer un compte Render

Allez sur [render.com](https://render.com) et créez un compte (gratuit).

### 2. Créer un nouveau Web Service

1. Cliquez sur "New +" → "Web Service"
2. Connectez votre dépôt Git (GitHub/GitLab) ou utilisez "Public Git repository"
3. Configuration :
   - **Name :** `maas-waitlist`
   - **Environment :** `Node`
   - **Region :** Choisissez la plus proche (ex: Frankfurt)
   - **Branch :** `main`
   - **Build Command :** `npm install`
   - **Start Command :** `node server.js`
   - **Plan :** Free

### 3. Ajouter les variables d'environnement

Dans la section "Environment Variables", ajoutez :

| Key | Value |
|-----|-------|
| `GOOGLE_SHEET_ID` | Votre Sheet ID |
| `GOOGLE_CREDENTIALS` | Votre base64 credentials |
| `ADMIN_TOKEN` | Votre token admin |
| `NODE_ENV` | `production` |

**⚠️ Important :** Ne mettez PAS la variable `PORT`, Render la définit automatiquement.

### 4. Déployer

Cliquez sur "Create Web Service". Render va :
1. Cloner votre code
2. Installer les dépendances
3. Démarrer l'application

Le déploiement prend 2-3 minutes.

### 5. Accéder à votre app

Une fois déployé, Render vous donne une URL :
```
https://maas-waitlist.onrender.com
```

Votre page admin sera accessible sur :
```
https://maas-waitlist.onrender.com/admin/VOTRE_TOKEN
```

### 6. Auto-déploiement

Render redéploie automatiquement à chaque `git push` sur la branche `main`.

## 🎯 Utilisation

### Pour les visiteurs

1. Accédez à la landing page
2. Remplissez le formulaire (3 champs obligatoires, 2 optionnels)
3. Cliquez sur "S'inscrire"
4. Message de confirmation s'affiche

### Pour l'admin

1. Accédez à `/admin/VOTRE_TOKEN`
2. Consultez le nombre d'inscrits
3. Visualisez le tableau complet
4. Cliquez sur "Actualiser" pour rafraîchir
5. Cliquez sur "Export CSV" pour télécharger les données

**Format CSV exporté :**
```
Timestamp,Prénom,Nom,Email,LinkedIn,Commentaire,IP
2026-01-02T10:15:00Z,Jean,Dupont,jean@example.com,https://linkedin.com/in/jeandupont,Diaspora,102.16.45.123
```

Le CSV est compatible Excel (UTF-8 avec BOM).

## 🔐 Sécurité

### Token Admin

- Le token admin est un secret de 64 caractères hexadécimaux
- Ne le partagez jamais publiquement
- Changez-le régulièrement (modifier dans `.env` puis redéployer)

### Validation

- Email validé côté front et backend (regex)
- LinkedIn validé (doit commencer par `https://linkedin.com/in/`)
- Protection contre les double-clics (bouton disabled)
- Retry automatique en cas d'échec API (3 tentatives)

### Google Sheets

- Les credentials sont encodés en base64
- Le Service Account a accès uniquement au Sheet partagé
- Pas d'accès public au Sheet

## 📊 Monitoring & Logs

### Logs Render

Pour voir les logs en production :
1. Allez dans votre Web Service sur Render
2. Cliquez sur l'onglet "Logs"
3. Vous verrez :
   - ✅ Inscriptions réussies
   - ❌ Erreurs (avec détails)
   - 🔄 Tentatives de retry

### Codes de logging

```
✅ Ligne ajoutée au Sheet pour email@example.com
❌ Tentative 1/3 échouée: Error message
⏳ Retry dans 1000ms...
```

## 🐛 Résolution de problèmes

### Erreur : "Impossible d'initialiser Google Sheets API"

**Cause :** Credentials invalides ou mal encodés

**Solution :**
1. Vérifiez que `GOOGLE_CREDENTIALS` est bien encodé en base64
2. Vérifiez qu'il n'y a pas d'espaces ou de retours à la ligne
3. Testez l'encodage localement avant de déployer

### Erreur : "Échec insertion après 3 tentatives"

**Cause :** Service Account n'a pas les droits sur le Sheet

**Solution :**
1. Ouvrez votre Google Sheet
2. Vérifiez que l'email du Service Account a les droits "Éditeur"
3. Essayez de partager à nouveau

### Erreur : "Accès refusé" sur la page admin

**Cause :** Token invalide ou URL incorrecte

**Solution :**
1. Vérifiez que le token dans l'URL correspond exactement à `ADMIN_TOKEN`
2. Pas d'espaces avant/après le token
3. Token sensible à la casse

### L'app ne démarre pas sur Render

**Cause :** Variable d'environnement manquante

**Solution :**
1. Allez dans Settings → Environment
2. Vérifiez que toutes les variables sont définies
3. Cliquez sur "Manual Deploy" pour redéployer

## 📁 Structure du projet

```
maas-waitlist/
├── server.js              # Serveur Express principal
├── package.json           # Dépendances npm
├── .env                   # Variables locales (git ignored)
├── .gitignore
├── README.md
├── env.example            # Template .env
├── lib/
│   ├── sheetsClient.js   # Wrapper Google Sheets API
│   └── validators.js     # Fonctions validation
└── public/
    ├── index.html        # Landing page
    ├── style.css         # Styles
    ├── script.js         # Logique formulaire
    ├── admin.html        # Page admin
    ├── admin.js          # Logique admin
    └── assets/
        ├── logo-mata.png
        └── maas-visual.png
```

## 🔄 Mises à jour futures (hors scope MVP)

- [ ] Email de confirmation automatique
- [ ] Déduplication automatique des doublons
- [ ] Dashboard avec graphiques
- [ ] Export multi-formats (Excel, JSON)
- [ ] Intégration CRM (Mailchimp, HubSpot)
- [ ] Traduction EN/FR
- [ ] A/B testing landing page

## 📞 Support

Pour toute question technique :
1. Vérifiez les logs Render
2. Consultez la section "Résolution de problèmes"
3. Vérifiez que Google Sheets API est activée dans GCP

## 📄 Licence

© MATA 2026 - Tous droits réservés

---

**Fait avec ❤️ pour la diaspora sénégalaise**

