# 📡 API Documentation - MaaS Waitlist

## Base URL
```
Production: https://votre-app.onrender.com
Local: http://localhost:3000
```

---

## 🌐 Routes Publiques

### `GET /`
Landing page HTML

**Réponse :** Page HTML

---

### `POST /api/submit`
Soumet une inscription à la waitlist

**Headers :**
```
Content-Type: application/json
```

**Body :**
```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com",
  "linkedin": "https://linkedin.com/in/jeandupont",
  "commentaire": "Diaspora, j'ai un local à Dakar"
}
```

**Champs :**
| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| `prenom` | string | ✅ Oui | 1-100 caractères |
| `nom` | string | ✅ Oui | 1-100 caractères |
| `email` | string | ✅ Oui | Format email valide |
| `linkedin` | string | ❌ Non | URL LinkedIn valide ou vide |
| `commentaire` | string | ❌ Non | Max 500 caractères |

**Réponse Success (200) :**
```json
{
  "success": true,
  "message": "Inscription enregistrée"
}
```

**Réponse Error (400) :**
```json
{
  "success": false,
  "error": "Email invalide"
}
```

**Réponse Error (500) :**
```json
{
  "success": false,
  "error": "Erreur serveur, veuillez réessayer"
}
```

**Logique :**
1. Validation des champs (front + back)
2. Génération timestamp ISO 8601
3. Capture de l'IP client
4. Tentative d'insertion Google Sheets avec retry (3x)
5. Retour success ou erreur

---

## 🔐 Routes Admin

### `GET /admin/:token`
Page d'administration

**Paramètres :**
- `:token` - Token admin (64 chars hex)

**Exemple :**
```
http://localhost:3000/admin/a3f9b2e1c5d7...
```

**Réponse :**
- Token valide : Page HTML admin
- Token invalide : `403 Forbidden`

---

### `GET /api/admin/data`
Récupère toutes les inscriptions

**Headers requis :**
```
X-Admin-Token: votre_token_admin
```

**Réponse Success (200) :**
```json
{
  "total": 23,
  "data": [
    {
      "timestamp": "2026-01-02T10:15:00Z",
      "prenom": "Jean",
      "nom": "Dupont",
      "email": "jean@example.com",
      "linkedin": "https://linkedin.com/in/jeandupont",
      "commentaire": "Diaspora, local à Dakar",
      "ip": "102.16.45.123"
    },
    {
      "timestamp": "2026-01-02T11:30:00Z",
      "prenom": "Marie",
      "nom": "Fall",
      "email": "marie@example.sn",
      "linkedin": "",
      "commentaire": "",
      "ip": "41.82.123.45"
    }
  ]
}
```

**Réponse Error (403) :**
```json
{
  "error": "Accès refusé"
}
```

**Réponse Error (500) :**
```json
{
  "error": "Impossible de charger les données"
}
```

**Logique :**
1. Vérification du token dans le header
2. Lecture du Google Sheet
3. Tri par date décroissante (plus récent en premier)
4. Retour JSON

---

### `GET /api/admin/export`
Exporte les données en CSV

**Headers requis :**
```
X-Admin-Token: votre_token_admin
```

**Réponse Success (200) :**
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="maas-waitlist-20260102.csv"`

**Contenu CSV :**
```csv
Timestamp,Prénom,Nom,Email,LinkedIn,Commentaire,IP
2026-01-02T10:15:00Z,Jean,Dupont,jean@example.com,https://linkedin.com/in/jeandupont,Diaspora,102.16.45.123
2026-01-02T11:30:00Z,Marie,Fall,marie@example.sn,,,41.82.123.45
```

**Réponse Error (403) :**
```
Accès refusé
```

**Réponse Error (500) :**
```
Erreur lors de l'export
```

**Logique :**
1. Vérification du token
2. Lecture du Google Sheet
3. Génération CSV avec BOM UTF-8 (compatible Excel)
4. Échappement des valeurs (virgules, guillemets)
5. Téléchargement avec nom de fichier daté

---

## 🔄 Retry Logic

### Insertion Google Sheets

En cas d'échec d'insertion, le système retry automatiquement :

| Tentative | Délai | Action |
|-----------|-------|--------|
| 1 | 0ms | Tentative initiale |
| 2 | 1000ms (1s) | Premier retry |
| 3 | 2000ms (2s) | Deuxième retry |
| Échec | - | Retour erreur 500 |

**Logs serveur :**
```
❌ Tentative 1/3 échouée: Error message
⏳ Retry dans 1000ms...
❌ Tentative 2/3 échouée: Error message
⏳ Retry dans 2000ms...
❌ Tentative 3/3 échouée: Error message
```

---

## 🛡️ Sécurité

### Validation Email
```regex
^[^\s@]+@[^\s@]+\.[^\s@]+$
```

### Validation LinkedIn
```
Doit commencer par :
- https://linkedin.com/in/
- https://www.linkedin.com/in/
```

### Token Admin
- Format : 64 caractères hexadécimaux
- Généré via `crypto.randomBytes(32).toString('hex')`
- Stocké en variable d'environnement
- Pas de session/cookie : auth via URL + header

---

## 📊 Structure Google Sheet

### Colonnes (ordre)
```
A: Timestamp (ISO 8601)
B: Prénom
C: Nom
D: Email
E: LinkedIn
F: Commentaire
G: IP
```

### Permissions requises
- Owner : Votre compte Google
- Editor : Service Account email

---

## 🧪 Tests

### Test inscription (curl)
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Jean",
    "nom": "Dupont",
    "email": "jean@example.com",
    "linkedin": "https://linkedin.com/in/jeandupont",
    "commentaire": "Test inscription"
  }'
```

### Test admin data (curl)
```bash
curl http://localhost:3000/api/admin/data \
  -H "X-Admin-Token: VOTRE_TOKEN"
```

### Test export CSV (curl)
```bash
curl http://localhost:3000/api/admin/export \
  -H "X-Admin-Token: VOTRE_TOKEN" \
  -o export.csv
```

---

## ⚠️ Codes d'erreur

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Validation échouée | Vérifier les données du formulaire |
| 403 | Token invalide | Vérifier ADMIN_TOKEN dans .env |
| 500 | Erreur serveur | Vérifier logs Render + config Google Sheets |

---

## 📝 Notes techniques

### Format timestamp
```
ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ
Exemple: 2026-01-02T10:15:00.123Z
```

### Capture IP
Ordre de priorité :
1. `x-forwarded-for` (proxy/load balancer)
2. `x-real-ip` (nginx)
3. `req.connection.remoteAddress` (direct)
4. `req.ip` (Express fallback)

### Encodage CSV
- UTF-8 with BOM (`\uFEFF`)
- Échappement : guillemets doublés (`""`)
- Délimiteur : virgule (`,`)

---

**Version :** 1.0.0  
**Dernière mise à jour :** 2026-01-02

