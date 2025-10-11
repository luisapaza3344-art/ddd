# 🚀 Servidor Backend - Guardado Automático

## ✅ Sistema Implementado

He creado un **servidor backend simple** que guarda automáticamente tu base de datos.

---

## 🎯 Cómo Funciona

### Con Servidor (Recomendado)
```
1. Inicias el servidor backend
2. Abres la aplicación web
3. Trabajas normalmente
4. ✅ Cada cambio se guarda AUTOMÁTICAMENTE en el servidor
5. ✅ Funciona en modo incógnito
6. ✅ Funciona entre diferentes PCs
7. ✅ No pierdes datos al cerrar
```

### Sin Servidor (Fallback)
```
1. No inicias el servidor
2. La app detecta que no hay servidor
3. Usa localStorage/sessionStorage (como antes)
4. En incógnito: debes exportar .db manualmente
```

---

## 🚀 Iniciar el Servidor

### Opción 1: WSL (Recomendado)
```bash
# Terminal 1: Servidor
cd server
npm install
npm start

# Terminal 2: Aplicación web (ya está corriendo)
# Ya tienes esto: npm run dev
```

### Opción 2: Desde la raíz
```bash
# Terminal 1: Instalar dependencias del servidor
cd server
npm install

# Terminal 2: Iniciar servidor
cd server
npm start

# Terminal 3: Aplicación web
npm run dev
```

---

## 📋 Configuración

### Puertos
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Estructura
```
proyecto/
├── src/              # Frontend React
├── server/           # Backend Node.js
│   ├── server.js     # Servidor Express
│   ├── package.json  # Dependencias del servidor
│   └── databases/    # Carpeta donde se guardan los .db
```

---

## 🔐 Identificación de Usuario

Cada navegador/sesión obtiene un ID único:
```
user_1234567890_abc123
```

Este ID se guarda en localStorage/sessionStorage y se usa para:
- Identificar tu base de datos en el servidor
- Permitir múltiples usuarios

---

## 💡 Ventajas del Sistema

### ✅ Modo Incógnito
```
Antes:
- Trabajabas
- Cerrabas navegador
- ❌ Perdías todo

Ahora:
- Trabajas
- Se guarda automáticamente en servidor
- Cierras navegador
- Vuelves a abrir
- ✅ Todo está ahí
```

### ✅ Múltiples PCs
```
PC 1 (Casa):
- Trabajas
- Se guarda en servidor

PC 2 (Oficina):
- Abres la app
- Usa el mismo ID de usuario
- ✅ Carga automáticamente del servidor
```

### ✅ Sin Exportar/Importar
```
Ya no necesitas:
❌ Exportar .db manualmente
❌ Guardar archivos
❌ Importar al volver

Todo es AUTOMÁTICO
```

---

## 🔄 Sincronización

### Automática
```
Cada vez que:
- Creas una casa
- Agregas un depósito
- Creas una apuesta
- Editas algo
- Eliminas algo

→ Se guarda AUTOMÁTICAMENTE en el servidor
```

### Dual (Local + Servidor)
```
Se guarda en DOS lugares:
1. localStorage/sessionStorage (rápido)
2. Servidor (persistente)

Ventaja: Si el servidor está caído, 
sigue funcionando con almacenamiento local
```

---

## 🎯 Usar en Múltiples PCs

### Setup Inicial
```
PC 1:
1. Inicias servidor
2. Trabajas normalmente
3. Nota tu user_id en consola (opcional)

PC 2:
1. Copias el user_id de PC 1
2. Lo guardas manualmente en localStorage:
   localStorage.setItem('user_id', 'user_xxx')
3. Recargas la app
4. ✅ Carga tus datos del servidor
```

### O Más Simple
```
PC 2:
1. Importas tu .db una vez
2. El servidor lo guarda
3. De ahí en adelante es automático
```

---

## 📊 Endpoints del API

### Guardar Base de Datos
```
POST /api/db/save
Body: { userId: string, dbData: number[] }
```

### Cargar Base de Datos
```
GET /api/db/load/:userId
Response: { success: true, dbData: number[] }
```

### Listar Bases de Datos
```
GET /api/db/list
Response: { databases: string[] }
```

### Eliminar Base de Datos
```
DELETE /api/db/delete/:userId
```

### Obtener Tipo de Cambio
```
GET /api/exchange-rate
Response: { USD_PEN: number, fuente: string }
```

---

## 🔧 Comandos Útiles

### Iniciar Todo
```bash
# Terminal 1: Servidor
cd server
npm install
npm start

# Terminal 2: Frontend (ya corriendo)
# npm run dev
```

### Ver Bases de Datos Guardadas
```bash
ls server/databases/
# Verás: user_xxx.db, user_yyy.db, etc.
```

### Backup del Servidor
```bash
# Copiar todas las bases de datos
cp -r server/databases/ ~/backup-apuestas/
```

---

## 🌐 Configuración Avanzada

### Cambiar Puerto del Servidor
Edita `server/server.js`:
```javascript
const PORT = 3001; // Cambiar a otro puerto
```

### Usar en Red Local
```javascript
app.listen(PORT, '0.0.0.0', () => {
  // Ahora es accesible desde otras PCs en tu red
});
```

Luego en `src/utils/apiDatabase.ts`:
```javascript
const API_URL = 'http://192.168.1.X:3001/api'; // IP de tu PC
```

---

## ⚡ Resumen Rápido

**Iniciar:**
```bash
cd server
npm install
npm start
```

**Usar:**
1. Abre http://localhost:5173
2. Trabaja normalmente
3. ✅ Se guarda automáticamente
4. Cierra cuando quieras
5. ✅ Tus datos están a salvo

**Ventajas:**
- ✅ Guardado 100% automático
- ✅ Funciona en modo incógnito
- ✅ Sincroniza entre PCs
- ✅ No pierdes datos nunca
- ✅ Sin exportar/importar manual

**¡Tu base de datos ahora se guarda sola!** 💾🚀

