# ⚡ Inicio Rápido - Sistema Completo

## 🎯 Tu Aplicación Ahora Tiene

✅ **Gestión completa de apuestas**  
✅ **Multi-moneda** (Soles y Dólares)  
✅ **Tipo de cambio automático** (Google Finance + ExchangeRate-API)  
✅ **Base de datos SQLite**  
✅ **Servidor backend** para guardado automático  
✅ **Compatible con modo incógnito**  

---

## 🚀 Iniciar Todo (3 Pasos)

### Paso 1: Instalar Dependencias

```bash
# Frontend
npm install

# Servidor
cd server
npm install
cd ..
```

### Paso 2: Iniciar Servidor Backend

**Opción A - WSL (Lo que estás usando):**
```bash
wsl bash -c "cd '/mnt/c/Users/luis/Downloads/New folder (3)/server' && npm start"
```

**Opción B - Nueva Terminal PowerShell:**
```bash
cd server
npm start
```

Verás:
```
🚀 ============================================
   Servidor de Apuestas corriendo en:
   http://localhost:3001
🚀 ============================================
```

### Paso 3: Abrir la Aplicación

El frontend YA está corriendo en:
**http://localhost:5173**

Abre tu navegador (normal o incógnito) y verás:
- 🟢 **"Servidor Conectado"** (arriba derecha)
- ✅ Guardado automático activado

---

## 💡 Verificar que Funciona

### Test Rápido:
```
1. Abre http://localhost:5173
2. Verifica que diga: 🟢 "Servidor Conectado"
3. Crea una casa de apuestas
4. Abre consola del navegador (F12)
5. Deberías ver: "💾 Base de datos guardada en servidor"
6. ✅ ¡Funciona!
```

### Sin Servidor:
```
Si no ves "Servidor Conectado":
- Verifica que el servidor esté corriendo
- Ve a http://localhost:3001/api/health
- Debería responder: {"status":"ok"}
```

---

## 🕵️ Modo Incógnito

### Con Servidor:
```
1. Abre incógnito
2. Ve a http://localhost:5173
3. Trabaja normalmente
4. TODO se guarda automáticamente en el servidor
5. Cierra el navegador
6. Vuelve a abrir incógnito
7. ✅ Todo está ahí (cargado del servidor)

¡CERO ESFUERZO!
```

### Sin Servidor:
```
1. Abre incógnito
2. Trabaja
3. Click "Backup" → Exportar .db
4. Guarda el archivo
5. Cierra
6. Importa al volver

Requiere exportar/importar manual
```

---

## 🌐 Usar en Múltiples PCs

### Con Servidor:
```
PC Casa:
- Servidor corriendo
- Trabajas normalmente
- Se guarda en server/databases/

PC Oficina:
- Copias la carpeta server/databases/ (o usas red local)
- Inicias servidor
- Abres la app
- ✅ Carga automáticamente

O mejor aún: Servidor en PC principal, 
otras PCs se conectan por red local
```

---

## 📊 Características del Sistema

### Guardado Automático
- ✅ Cada cambio → Se guarda SOLO
- ✅ No pierdes datos nunca
- ✅ Funciona en segundo plano

### Tipo de Cambio Inteligente
- ✅ Google Finance (primero)
- ✅ ExchangeRate-API (fallback)
- ✅ Storage (offline)
- ✅ Manual (último recurso)

### Multi-Moneda
- ✅ Casas en Soles (PEN)
- ✅ Casas en Dólares (USD)
- ✅ Balance usa TC actual
- ✅ Ganancias históricas con TC congelado

---

## 🎯 URLs Importantes

| Servicio | URL |
|----------|-----|
| **Aplicación Web** | http://localhost:5173 |
| **Servidor API** | http://localhost:3001 |
| **Health Check** | http://localhost:3001/api/health |

---

## 📁 Archivos de la Base de Datos

Se guardan en:
```
server/databases/user_xxx.db
```

Puedes:
- Copiarlos como backup
- Compartirlos entre PCs
- Abrirlos con DB Browser for SQLite

---

## ⚡ Comandos Rápidos

### Iniciar Todo (WSL):
```bash
# Terminal 1: Servidor
wsl bash -c "cd '/mnt/c/Users/luis/Downloads/New folder (3)/server' && npm install && npm start"

# Terminal 2: Frontend (ya está)
# Ya corriendo en http://localhost:5173
```

### Parar Todo:
```bash
# Ctrl+C en ambas terminales
```

### Ver Logs:
```bash
# En la terminal del servidor verás:
💾 Base de datos guardada para usuario: user_xxx
📂 Base de datos cargada para usuario: user_xxx
```

---

## 🎉 ¡Listo para Usar!

**Con servidor:**
- ✅ Guardado automático
- ✅ Modo incógnito sin problemas
- ✅ Sincronización entre PCs
- ✅ Cero mantenimiento

**Sin servidor:**
- ✅ Funciona igual
- ⚠️ Requiere exportar/importar en incógnito

---

## 🚀 Próximo Paso

**Inicia el servidor ahora:**

```bash
wsl bash -c "cd '/mnt/c/Users/luis/Downloads/New folder (3)/server' && npm install && npm start"
```

Luego abre: **http://localhost:5173**

**¡Disfruta tu aplicación con guardado automático!** 💾🎉


