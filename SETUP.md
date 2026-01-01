# Guide de configuration rapide

## Étape 1 : Installer les dépendances
```bash
npm install
```

## Étape 2 : Configurer Google Sheets

### 2.1 Créer le Google Sheet
1. Créez un Google Sheet nommé "MaaS Waitlist"
2. Ajoutez les en-têtes (première ligne) :
   ```
   Timestamp | Prénom | Nom | Email | LinkedIn | Commentaire | IP
   ```
3. Copiez l'ID depuis l'URL (entre `/d/` et `/edit`)

### 2.2 Créer le Service Account
1. Allez sur https://console.cloud.google.com
2. Créez un projet ou sélectionnez-en un
3. Activez "Google Sheets API"
4. Créez un Service Account (APIs & Services > Credentials)
5. Téléchargez la clé JSON (`credentials.json`)

### 2.3 Partager le Sheet
1. Ouvrez `credentials.json` et copiez le `client_email`
2. Dans votre Google Sheet, cliquez "Partager"
3. Collez l'email et donnez les droits "Éditeur"

## Étape 3 : Configurer les variables d'environnement

### 3.1 Encoder les credentials en base64

**Windows PowerShell :**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("credentials.json"))
```

**Linux/Mac/Git Bash :**
```bash
base64 -w 0 credentials.json
```

### 3.2 Générer le token admin
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.3 Créer le fichier .env

Créez `.env` à la racine :
```env
PORT=3000
GOOGLE_SHEET_ID=votre_sheet_id
GOOGLE_CREDENTIALS=votre_base64_credentials
ADMIN_TOKEN=votre_token_hex_64chars
NODE_ENV=development
```

## Étape 4 : Lancer l'application

```bash
npm start
```

Accès :
- Landing page : http://localhost:3000
- Admin : http://localhost:3000/admin/VOTRE_TOKEN

## Étape 5 : Déployer sur Render

1. Poussez le code sur GitHub/GitLab
2. Sur render.com, créez un "Web Service"
3. Configurez :
   - Build : `npm install`
   - Start : `node server.js`
4. Ajoutez les variables d'environnement (sauf PORT)
5. Déployez !

---

**Besoin d'aide ?** Consultez le README.md complet.

