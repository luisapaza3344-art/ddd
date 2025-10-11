# 🗄️ Sistema de Base de Datos Portable

## ✅ ¡FUNCIONA EN MODO INCÓGNITO!

Esta aplicación ahora usa **SQLite** (base de datos real) que se guarda como un archivo `.db` portable.

---

## 🎯 ¿Cómo Funciona?

### Almacenamiento Automático
- La aplicación crea una base de datos SQLite en memoria
- Se guarda automáticamente en sessionStorage (incógnito) o localStorage (normal)
- **En modo incógnito**: Los datos persisten mientras no cierres el navegador

### Sistema Portable
- Puedes exportar tu base de datos a un archivo `.db`
- Ese archivo funciona en **cualquier PC, cualquier navegador**
- Solo importa el `.db` y ¡listo!

---

## 📥 Exportar Base de Datos

### Paso a Paso:
```
1. Haz clic en "Backup" (botón verde en la navegación)
2. Haz clic en "Exportar Base de Datos (.db)"
3. Se descarga: apuestas-2025-01-10.db
4. Guarda el archivo en:
   - Google Drive
   - Dropbox
   - OneDrive
   - USB
   - Tu carpeta de Descargas
```

---

## 📤 Importar Base de Datos

### Paso a Paso:
```
1. Haz clic en "Backup"
2. En la sección "Importar Base de Datos (.db)"
3. Haz clic en "Selecciona archivo .db"
4. Busca tu archivo apuestas-XXXX.db
5. Confirma la importación
6. ¡Listo! Todos tus datos están de vuelta
```

---

## 🕵️ Usar en Modo Incógnito

### Rutina Recomendada:

#### 🔹 Al Terminar tu Sesión:
```bash
1. Abre la aplicación en incógnito
2. Trabaja normalmente (crea casas, apuestas, etc.)
3. ANTES DE CERRAR: Haz clic en "Backup"
4. Exporta tu base de datos (.db)
5. Guarda el archivo en Google Drive / Dropbox / etc.
6. Cierra el navegador tranquilo
```

#### 🔹 Al Iniciar una Nueva Sesión:
```bash
1. Abre la aplicación en incógnito (estará vacía)
2. Haz clic en "Backup"
3. Importa tu archivo .db
4. ¡Todo vuelve! Casas, apuestas, depósitos, retiros
5. Continúa trabajando
6. Repite el ciclo
```

---

## 🆚 Comparación: JSON vs .db

| Característica | .db (SQLite) | JSON |
|----------------|--------------|------|
| **Tamaño** | Más pequeño | Más grande |
| **Velocidad** | Muy rápido | Rápido |
| **Portabilidad** | ✅ Total | ✅ Total |
| **Modo Incógnito** | ✅ Perfecto | ✅ Funciona |
| **Profesional** | ✅ Sí (base de datos real) | ❌ Archivo de texto |
| **Editable** | ❌ (requiere herramientas) | ✅ Cualquier editor |
| **Integridad** | ✅ Garantizada | ⚠️ Manual |

### 🎯 Recomendación:
- **Uso principal**: Archivos `.db` (más profesional y pequeño)
- **Backup adicional**: JSON (por si acaso)
- **Exportar a Excel**: CSV (solo apuestas)

---

## 💡 Ventajas del Sistema

### ✅ Para Modo Incógnito:
- Guardas todo en un solo archivo
- Lo llevas a cualquier PC
- Importas y sigues trabajando
- Sin rastros en el navegador

### ✅ Para Uso General:
- Base de datos real (SQLite)
- Mejor rendimiento
- Archivos más pequeños
- Compatible con herramientas profesionales

### ✅ Portabilidad Total:
- Un archivo = toda tu información
- Chrome → Firefox → Edge → Safari
- PC → Mac → Linux
- Google Drive → Dropbox → USB

---

## 🔧 Herramientas Opcionales

Si quieres ver/editar tu archivo `.db` fuera de la aplicación:

### DB Browser for SQLite (Gratis)
- **Windows/Mac/Linux**: https://sqlitebrowser.org/
- Abre tu archivo `.db`
- Ve todas las tablas, datos, etc.
- Edita directamente en la base de datos

### Extensión de Navegador
- **Chrome**: SQLite Viewer
- Abre archivos `.db` directamente en el navegador

---

## 📊 Estructura de la Base de Datos

Tu archivo `.db` contiene 4 tablas:

```sql
casas (id, nombre)
depositos (id, casaId, monto, fecha)
retiros (id, casaId, monto, fecha)
apuestas (id, casaId, tipo, evento, fecha, seleccion, cuota, monto, resultado)
```

---

## 🚀 Casos de Uso

### Caso 1: Usuario con Múltiples PCs
```
PC Casa:
1. Trabajo en la aplicación
2. Exporto: apuestas-sync.db
3. Subo a Google Drive

PC Oficina:
1. Descargo apuestas-sync.db de Drive
2. Importo en la aplicación
3. Continúo trabajando
4. Exporto y reemplazo en Drive
```

### Caso 2: Usuario Paranóico (Máxima Privacidad)
```
Siempre en modo incógnito:
1. Abro incógnito
2. Importo mi .db
3. Trabajo
4. Exporto .db
5. Guardo en USB encriptado
6. Cierro navegador (todo se borra)
```

### Caso 3: Backup Múltiple
```
Estrategia:
- apuestas-diario.db (exporto cada día)
- apuestas-semanal.db (exporto cada semana)
- apuestas-mensual.db (exporto cada mes)
- apuestas-master.db (versión limpia principal)
```

---

## ⚡ Preguntas Frecuentes

### ¿Funciona sin internet?
**R**: ¡Sí! La aplicación funciona 100% offline. SQLite está en tu navegador.

### ¿Cuánto pesa un archivo .db?
**R**: Muy poco. Con 1000 apuestas ≈ 100-200 KB (muy pequeño).

### ¿Puedo perder datos?
**R**: Si exportas regularmente, NO. Siempre tendrás un backup.

### ¿El archivo .db es seguro?
**R**: Sí, pero no está encriptado. Si quieres más seguridad:
- Guárdalo en carpeta protegida con contraseña
- Usa herramientas de encriptación (7-Zip con password)
- Guárdalo en disco encriptado

### ¿Puedo tener múltiples archivos .db?
**R**: ¡Sí! Puedes tener tantos como quieras:
- apuestas-futbol.db
- apuestas-tenis.db
- apuestas-2024.db
- apuestas-2025.db

### ¿Qué pasa si abro el .db en otra herramienta y lo modifico?
**R**: Los cambios se reflejarán cuando lo importes de nuevo. Pero ten cuidado de no corromper la estructura de las tablas.

---

## 🎯 Resumen Rápido

**Modo Normal:**
- ✅ Todo se guarda automáticamente
- ✅ Persiste aunque cierres el navegador
- 💡 Exporta `.db` ocasionalmente para backup

**Modo Incógnito:**
- ⚠️ Se borra al cerrar el navegador
- ✅ Exporta `.db` ANTES de cerrar
- ✅ Importa `.db` al volver
- 🎯 10 segundos extra, privacidad total

**Portabilidad:**
- 🌐 Funciona en cualquier navegador
- 💻 Funciona en cualquier sistema operativo
- 📁 Un archivo = toda tu información
- ☁️ Súbelo a la nube que prefieras

---

## 🎲 ¡A Apostar con Confianza!

Ahora tienes:
- ✅ Base de datos real (SQLite)
- ✅ Portabilidad total
- ✅ Compatible con modo incógnito
- ✅ Backup fácil y rápido
- ✅ Sin límites de almacenamiento
- ✅ Profesional y confiable

**¡Tu información siempre contigo, en cualquier PC, con total privacidad!** 🚀



