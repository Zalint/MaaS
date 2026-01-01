#!/bin/bash

echo "============================================"
echo "  MaaS Waitlist - Installation Linux/Mac"
echo "============================================"
echo ""

# Vérification Node.js
if ! command -v node &> /dev/null; then
    echo "[ERREUR] Node.js n'est pas installé"
    echo "Téléchargez-le sur https://nodejs.org"
    exit 1
fi

echo "[OK] Node.js détecté"
node --version
echo ""

# Installation des dépendances
echo "[1/4] Installation des dépendances npm..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERREUR] npm install a échoué"
    exit 1
fi
echo "[OK] Dépendances installées"
echo ""

# Vérification du fichier .env
if [ ! -f .env ]; then
    echo "[2/4] Création du fichier .env..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "[OK] Fichier .env créé depuis env.example"
        echo ""
        echo "[ACTION REQUISE] Éditez le fichier .env et remplissez :"
        echo "  - GOOGLE_SHEET_ID"
        echo "  - GOOGLE_CREDENTIALS"
        echo "  - ADMIN_TOKEN"
        echo ""
        echo "Utilisez : npm run generate-token pour générer le token"
        echo "Consultez SETUP.md pour plus de détails"
    else
        echo "[ERREUR] env.example introuvable"
        exit 1
    fi
else
    echo "[2/4] Fichier .env déjà existant"
fi
echo ""

# Test de l'environnement
echo "[3/4] Test de la configuration..."
npm run test-env
if [ $? -ne 0 ]; then
    echo ""
    echo "[ATTENTION] La configuration contient des erreurs"
    echo "Veuillez corriger le fichier .env avant de continuer"
    echo ""
    echo "Pour aide : consultez SETUP.md"
    exit 1
fi
echo ""

echo "[4/4] Installation terminée !"
echo ""
echo "============================================"
echo "  Installation réussie !"
echo "============================================"
echo ""
echo "Démarrer l'application : npm start"
echo "Mode développement : npm run dev"
echo "Page admin : http://localhost:3000/admin/VOTRE_TOKEN"
echo ""
echo "Documentation :"
echo "  - QUICKSTART.md : Démarrage rapide"
echo "  - SETUP.md : Configuration détaillée"
echo "  - README.md : Documentation complète"
echo ""

