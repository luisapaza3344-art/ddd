#!/bin/bash

echo "🚀 Iniciando Sistema de Gestión de Apuestas"
echo "=========================================="
echo ""

# Verificar si el servidor ya está instalado
if [ ! -d "server/node_modules" ]; then
  echo "📦 Instalando dependencias del servidor..."
  cd server
  npm install
  cd ..
fi

# Iniciar servidor en background
echo "🔧 Iniciando servidor backend..."
cd server
npm start &
SERVER_PID=$!
cd ..

echo "⏳ Esperando que el servidor inicie..."
sleep 3

echo ""
echo "✅ Sistema listo!"
echo ""
echo "📊 Accede a:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo ""
echo "🎯 Características activas:"
echo "   ✅ Guardado automático en servidor"
echo "   ✅ Compatible con modo incógnito"
echo "   ✅ Sincronización entre PCs"
echo ""
echo "Para detener: Ctrl+C"
echo ""

# Esperar
wait $SERVER_PID


