@echo off
echo.
echo ============================================
echo  Iniciando Sistema de Gestion de Apuestas
echo ============================================
echo.

REM Verificar si el servidor esta instalado
if not exist "server\node_modules" (
  echo Instalando dependencias del servidor...
  cd server
  call npm install
  cd ..
)

echo Iniciando servidor backend...
start "Servidor Apuestas" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo  Sistema listo!
echo ============================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo.
echo Caracteristicas activas:
echo   - Guardado automatico en servidor
echo   - Compatible con modo incognito
echo   - Sincronizacion entre PCs
echo.
pause


