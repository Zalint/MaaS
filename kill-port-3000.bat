@echo off
echo ============================================
echo   Nettoyage du port 3000
echo ============================================
echo.

echo Recherche du processus utilisant le port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Processus trouve : PID %%a
    echo Arret du processus...
    taskkill /PID %%a /F
    if %errorlevel% equ 0 (
        echo [OK] Processus arrete avec succes
    ) else (
        echo [ERREUR] Impossible d'arreter le processus
        echo Essayez de l'arreter manuellement ou changez le port dans .env
    )
    goto :done
)

echo Aucun processus trouve sur le port 3000
:done
echo.
echo Vous pouvez maintenant lancer : npm start
echo.
pause

