# 🚀 Déploiement Production - Render

## ✅ Fix SSL/TLS appliqué

Le code a été mis à jour pour supporter SSL/TLS requis par PostgreSQL sur Render.

## 📋 Variables d'environnement à configurer sur Render

Dans **Settings > Environment**, ajoutez ces variables :

```
DB_HOST=dpg-d5bal7shg0os73ddt9q0-a.frankfurt-postgres.render.com
DB_PORT=5432
DB_NAME=maas_db_2aut
DB_USER=maas_db_2aut_user
DB_PASSWORD=iMcu2g66ERmFwmcBDaHCOVTxL3Wxf9gv
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Talibe50ansMaas
SESSION_SECRET=maas-prod-secret-key-87a3f2e9b4c1d8f6a5e3b2c9d1f8e7a4b6c3d5e2f9a1b8c7d4e6f3a2b5c8d1e9
NODE_ENV=production
```

⚠️ **Ne PAS ajouter la variable PORT** (Render la définit automatiquement)

## 🔄 Redéploiement

Render redéploiera automatiquement après le push GitHub.

Ou manuellement :
1. Allez dans votre service Render
2. Cliquez sur "Manual Deploy" > "Deploy latest commit"

## ✅ Vérifications après déploiement

1. Les logs doivent montrer :
   ```
   ✅ Table waitlist initialisée
   ✅ Connecté à PostgreSQL
   🚀 MaaS Waitlist Server
   ```

2. Testez l'URL de votre service Render

3. Testez le login admin : `https://votre-app.onrender.com/admin`

## 📊 Base de données

- **Région :** Frankfurt, Allemagne 🇩🇪
- **SSL :** Activé automatiquement en production
- **Table :** Créée automatiquement au premier démarrage

## 🔐 Sécurité

✅ SSL/TLS activé pour PostgreSQL  
✅ Sessions sécurisées avec httpOnly cookies  
✅ Credentials protégés par variables d'environnement  

## 📝 Notes

- Le warning "MemoryStore" est normal pour un service avec une seule instance
- Pour scaler horizontalement, utilisez `connect-pg-simple` comme session store

