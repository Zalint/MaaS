@echo off
echo ============================================
echo   MaaS Waitlist - Installation Windows
echo ============================================
echo.

REM Vérification Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe
    echo Telechargez-le sur https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js detecte
node --version
echo.

REM Installation des dépendances
echo [1/4] Installation des dependances npm...
call npm install
if %errorlevel% neq 0 (
    echo [ERREUR] npm install a echoue
    pause
    exit /b 1
)
echo [OK] Dependances installees
echo.

REM Vérification du fichier .env
if not exist .env (
    echo [2/4] Creation du fichier .env...
    if exist env.example (
        copy env.example .env >nul
        echo [OK] Fichier .env cree depuis env.example
        echo.
        echo [ACTION REQUISE] Editez le fichier .env et remplissez :
        echo   - GOOGLE_SHEET_ID
        echo   - GOOGLE_CREDENTIALS
        echo   - ADMIN_TOKEN
        echo.
        echo Utilisez : npm run generate-token pour generer le token
        echo Consultez SETUP.md pour plus de details
    ) else (
        echo [ERREUR] env.example introuvable
        pause
        exit /b 1
    )
) else (
    echo [2/4] Fichier .env deja existant
)
echo.

REM Test de l'environnement
echo [3/4] Test de la configuration...
call npm run test-env
if %errorlevel% neq 0 (
    echo.
    echo [ATTENTION] La configuration contient des erreurs
    echo Veuillez corriger le fichier .env avant de continuer
    echo.
    echo Pour aide : consultez SETUP.md
    pause
    exit /b 1
)
echo.

echo [4/4] Installation terminee !
echo.
echo ============================================
echo   Installation reussie !
echo ============================================
echo.
echo Demarrer l'application : npm start
echo Mode developpement : npm run dev
echo Page admin : http://localhost:3000/admin/VOTRE_TOKEN
echo.
echo Documentation :
echo   - QUICKSTART.md : Demarrage rapide
echo   - SETUP.md : Configuration detaillee
echo   - README.md : Documentation complete
echo.
pause

