# 🚀 Sistema con Servidor Backend

## ✨ Nueva Funcionalidad: Guardado Automático

He creado un **servidor backend simple** que guarda automáticamente tu base de datos sin necesidad de exportar manualmente.

---

## 🎯 Ventajas

### ✅ Guardado 100% Automático
```
Cada cambio se guarda automáticamente en el servidor:
- Crear casa → Guardado
- Agregar apuesta → Guardado
- Editar resultado → Guardado
- TODO se guarda SOLO
```

### ✅ Perfecto para Modo Incógnito
```
Modo incógnito + Servidor = Sin problemas

1. Abres incógnito
2. Trabajas normalmente
3. Cierras el navegador
4. Vuelves a abrir
5. ✅ TODO está ahí (cargado del servidor)
```

### ✅ Sincronización entre PCs
```
PC Casa:
- Trabajas
- Se guarda en servidor

PC Oficina:
- Abres la app
- ✅ Carga automáticamente del servidor
- Continúas trabajando
```

---

## 🚀 Inicio Rápido

### Paso 1: Instalar Dependencias del Servidor
```bash
cd server
npm install
```

### Paso 2: Iniciar el Servidor
```bash
npm start
```

Verás:
```
🚀 ============================================
   Servidor de Apuestas corriendo en:
   http://localhost:3001
🚀 ============================================
```

### Paso 3: Verificar Conexión
1. Abre http://localhost:5173 (frontend ya está corriendo)
2. En el Dashboard verás: 🟢 **"Servidor Conectado"**
3. ¡Listo! Ya funciona el guardado automático

---

## 📁 Estructura del Proyecto

```
proyecto/
├── src/                    # Frontend React
├── server/                 # Backend Node.js
│   ├── server.js          # Servidor Express
│   ├── package.json       # Dependencias
│   └── databases/         # 📁 Aquí se guardan los .db
│       ├── user_xxx.db    # Tu base de datos
│       └── user_yyy.db    # Otras bases de datos
├── package.json           # Frontend
└── README.md
```

---

## 🔄 Cómo Funciona

### Detección Automática
```
1. La app intenta conectarse al servidor
2. Si encuentra el servidor:
   → Usa guardado automático en servidor
   → Muestra: 🟢 "Servidor Conectado"

3. Si NO encuentra el servidor:
   → Usa localStorage/sessionStorage
   → Muestra: 🔴 "Servidor Offline"
   → Funciona igual (sin auto-sync)
```

### Guardado Dual
```
Cada cambio se guarda en DOS lugares:

1. localStorage/sessionStorage (inmediato)
   → Para que la app sea rápida

2. Servidor (background)
   → Para persistencia permanente
   
Si el servidor falla, sigue funcionando con local.
```

---

## 💻 Comandos para Iniciar Todo

### WSL (Recomendado)
```bash
# Terminal 1: Servidor
wsl bash -c "cd '/mnt/c/Users/luis/Downloads/New folder (3)/server' && npm install && npm start"

# Terminal 2: Frontend (ya está corriendo)
# El que tienes: npm run dev
```

### PowerShell (Alternativa)
```powershell
# Terminal 1: Servidor
cd server
npm install
npm start

# Terminal 2: Frontend
# Ya está corriendo
```

---

## 🌐 Endpoints del API

### Guardar (Automático)
```
POST http://localhost:3001/api/db/save
Body: { userId, dbData }
```

### Cargar (Automático al iniciar)
```
GET http://localhost:3001/api/db/load/:userId
```

### Health Check
```
GET http://localhost:3001/api/health
```

---

## 🔐 Identificación de Usuario

Cada navegador obtiene un ID único automático:
```
user_1736470123456_abc123def
```

Se guarda en localStorage/sessionStorage y se usa para identificar tu base de datos en el servidor.

### Usar en Múltiples PCs

**Opción 1: Mismo User ID**
```javascript
// En PC 2, abre consola del navegador (F12):
localStorage.setItem('user_id', 'user_xxx'); // El ID de PC 1
// Recarga la página
```

**Opción 2: Importar .db una vez**
```
PC 2:
1. Importa tu .db manualmente (una sola vez)
2. El servidor lo guarda
3. De ahí en adelante es automático
```

---

## 🎯 Casos de Uso

### Caso 1: Usuario en Modo Incógnito
```
ANTES (sin servidor):
- Trabajabas
- Exportabas .db manualmente
- Cerrabas
- ❌ Molesto

AHORA (con servidor):
- Trabajas
- ✅ Se guarda solo
- Cierras
- Vuelves y todo está ahí
- ✅ Cero esfuerzo
```

### Caso 2: Usuario con Múltiples PCs
```
ANTES:
- Exportabas en PC1
- Subías a Drive
- Descargabas en PC2
- Importabas
- ❌ Tedioso

AHORA:
- Trabajas en PC1 (se guarda en servidor)
- Abres en PC2
- ✅ Carga automáticamente
- ✅ Instantáneo
```

### Caso 3: Usuario Paranóico
```
Quieres privacidad total + comodidad:

- Servidor corriendo en TU PC (localhost)
- Modo incógnito en el navegador
- Guardado automático
- No subes nada a la nube
- ✅ Privacidad + Comodidad
```

---

## 🔧 Configuración Avanzada

### Cambiar Puerto del Servidor
`server/server.js`:
```javascript
const PORT = 3001; // Cambiar a 4000, 5000, etc.
```

`src/utils/apiDatabase.ts`:
```javascript
const API_URL = 'http://localhost:4000/api'; // Mismo puerto
```

### Servidor en Otra PC (Red Local)
`server/server.js`:
```javascript
app.listen(PORT, '0.0.0.0', () => {
  // Ahora accesible desde tu red local
});
```

`src/utils/apiDatabase.ts`:
```javascript
const API_URL = 'http://192.168.1.X:3001/api'; // IP de la PC con servidor
```

---

## 📊 Monitoreo

### Ver Logs del Servidor
```
💾 Base de datos guardada para usuario: user_xxx
📂 Base de datos cargada para usuario: user_xxx
```

### Ver Archivos Guardados
```bash
ls server/databases/
# Verás tus archivos .db
```

### Backup del Servidor
```bash
# Copiar todas las bases de datos
cp server/databases/*.db ~/backup/
```

---

## ⚡ Resumen Ejecutivo

**Con servidor:**
- ✅ Guardado automático
- ✅ Funciona en incógnito
- ✅ Sincroniza entre PCs
- ✅ Cero esfuerzo

**Sin servidor:**
- ✅ Sigue funcionando (local)
- ⚠️ En incógnito: exportar manual
- ⚠️ No sincroniza entre PCs

---

## 🎯 Estado Actual

El código ya está implementado. Solo necesitas:

```bash
# Iniciar el servidor
cd server
npm install
npm start
```

**¡Guardado automático activado!** 💾🚀


