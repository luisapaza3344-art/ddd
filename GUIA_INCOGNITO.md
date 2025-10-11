# 🕵️ Guía de Uso en Modo Incógnito

## ⚠️ Limitación del Modo Incógnito

**IMPORTANTE**: El modo incógnito del navegador está diseñado para NO guardar datos permanentemente. Cuando cierres el navegador, **todos los datos se borrarán automáticamente**. Esto es una característica de seguridad que ninguna aplicación web puede evitar.

## ✅ Solución: Sistema de Backup

Para usar esta aplicación en modo incógnito y mantener tus datos, debes usar el sistema de **Backup y Restauración**:

### 📥 Flujo de Trabajo Recomendado

#### Al Terminar tu Sesión:
```
1. Haz clic en el botón verde "Backup" en la barra de navegación
2. Haz clic en "Exportar Todo (JSON)"
3. Se descargará un archivo: apuestas-backup-2025-01-10.json
4. Guarda este archivo en un lugar seguro:
   - Tu carpeta de Descargas
   - Google Drive
   - Dropbox
   - OneDrive
   - USB
   - etc.
5. Ahora puedes cerrar el navegador sin perder nada
```

#### Al Iniciar una Nueva Sesión:
```
1. Abre la aplicación en modo incógnito
2. Haz clic en el botón verde "Backup" 
3. En la sección "Importar Datos"
4. Selecciona "Fusionar" o "Reemplazar"
5. Haz clic en "Selecciona un archivo JSON"
6. Busca tu archivo apuestas-backup-XXXX.json
7. ¡Listo! Todos tus datos están de vuelta
```

## 🎯 Modos de Importación

### Fusionar (Recomendado)
- **Qué hace**: Agrega los datos del archivo a los que ya tienes
- **Usa esto cuando**: Quieres recuperar un backup sin perder lo nuevo
- **Seguro**: No borra nada

### Reemplazar (Con cuidado)
- **Qué hace**: Borra todo y pone solo lo del archivo
- **Usa esto cuando**: Quieres restaurar un backup limpio
- **Advertencia**: Pedirá confirmación antes de borrar

## 💾 Opciones de Guardado

### Opción 1: Archivo Local
```
✅ Ventajas:
- Rápido y fácil
- No necesita internet
- Total privacidad

❌ Desventajas:
- Solo en esta PC
- Puedes perder el archivo
```

### Opción 2: Nube (Google Drive, Dropbox, etc.)
```
✅ Ventajas:
- Accesible desde cualquier PC
- Respaldo automático
- No se pierde

❌ Desventajas:
- Necesitas internet
- Menos privacidad
```

### Opción 3: USB / Disco Externo
```
✅ Ventajas:
- Portátil
- Privado
- Offline

❌ Desventajas:
- Puedes perder el USB
- Tienes que llevarlo contigo
```

## 🔄 Ejemplo Completo

### Lunes - Primera Vez
```bash
1. Abres incógnito
2. Creas casas y apuestas
3. Al terminar: Exportar → apuestas-backup-lunes.json
4. Guardas en Google Drive
5. Cierras el navegador (datos se borran del navegador)
```

### Martes - Continuar
```bash
1. Abres incógnito (aplicación vacía)
2. Backup → Importar → Seleccionar apuestas-backup-lunes.json
3. ¡Tus datos vuelven!
4. Agregas nuevas apuestas
5. Al terminar: Exportar → apuestas-backup-martes.json
6. Cierras el navegador
```

### Miércoles - Desde otra PC
```bash
1. Abres incógnito en otra PC
2. Descargas apuestas-backup-martes.json de Google Drive
3. Backup → Importar → Seleccionar el archivo
4. ¡Tienes todo desde la otra PC!
```

## 📊 Comparación: Normal vs Incógnito

| Característica | Modo Normal | Modo Incógnito |
|----------------|-------------|----------------|
| **Guardado automático** | ✅ Permanente | ⚠️ Solo durante sesión |
| **Cerrar ventana** | ✅ Datos persisten | ❌ Datos se borran |
| **Cerrar navegador** | ✅ Datos persisten | ❌ Datos se borran |
| **Recargar página** | ✅ Datos persisten | ✅ Datos persisten (si no cierras) |
| **Exportar/Importar** | ✅ Funciona | ✅ Funciona |
| **Llevar a otra PC** | ❌ No, solo en esta PC | ✅ Sí, con archivos JSON |

## 💡 Consejos y Trucos

### 🎯 Mejor Práctica: Exporta Frecuentemente
```
- Al terminar cada sesión
- Después de agregar varias apuestas importantes
- Antes de cerrar el navegador
- Una vez al día/semana
```

### 🗂️ Organiza tus Backups
```
Carpeta: Apuestas-Backups/
├── 2025-01-semana1.json
├── 2025-01-semana2.json
├── 2025-02-semana1.json
└── ultimo-backup.json (siempre el más reciente)
```

### ⏰ Rutina Recomendada
```
Al iniciar sesión:
1. Importar último backup (5 segundos)
2. Trabajar normalmente
3. Exportar antes de cerrar (5 segundos)

Total: 10 segundos de trabajo extra para no perder nada
```

## 🚨 Preguntas Frecuentes

### ¿Por qué no guarda automáticamente en incógnito?
**R**: Es una limitación de seguridad del navegador. El modo incógnito está diseñado para NO dejar rastros. Ninguna aplicación web puede saltarse esto.

### ¿Puedo usar otra solución?
**R**: Las únicas alternativas son:
1. Usar navegación normal (no incógnito) - guardado automático permanente
2. Usar un servidor/base de datos (requiere backend y cuenta)
3. Usar este sistema de exportar/importar

### ¿Es seguro el archivo JSON?
**R**: El archivo JSON es solo texto con tus datos. Puedes:
- Abrirlo con cualquier editor de texto
- Encriptarlo si quieres más seguridad
- Guardarlo donde quieras

### ¿Qué pasa si olvido exportar?
**R**: Si cierras el navegador sin exportar, **perderás todos los datos de esa sesión**. Por eso recomendamos exportar frecuentemente.

### ¿Puedo tener múltiples archivos?
**R**: ¡Sí! Puedes tener tantos backups como quieras:
- Un backup por día
- Un backup por semana
- Un backup antes de cambios grandes
- Un backup "maestro" limpio

### ¿El archivo es compatible entre navegadores?
**R**: ¡Sí! El mismo archivo funciona en:
- Chrome incógnito
- Firefox incógnito
- Edge incógnito
- Safari incógnito
- Cualquier navegador en cualquier PC

## 🎓 Flujo Avanzado: Múltiples PCs

### Configuración con Google Drive
```
1. Crea una carpeta "Apuestas" en Google Drive
2. Exporta: apuestas-sync.json
3. Guarda en Drive/Apuestas/
4. En otra PC:
   - Abre Drive
   - Descarga apuestas-sync.json
   - Importa en la aplicación
5. Al terminar, exporta y reemplaza el archivo en Drive
```

### Con Dropbox/OneDrive
Mismo proceso, diferente servicio de nube.

## ⚡ Resumen Rápido

**Para usar en modo incógnito:**

```
✅ DO (Hacer):
1. Exportar antes de cerrar el navegador
2. Guardar el archivo en lugar seguro
3. Importar al volver a abrir
4. Mantener múltiples backups

❌ DON'T (No hacer):
1. Cerrar sin exportar
2. Confiar en que se guardará solo
3. Guardar el archivo solo en una ubicación
4. Olvidar dónde guardaste el archivo
```

---

## 🎯 Conclusión

El modo incógnito + esta aplicación = **Privacidad total** con **portabilidad completa**

**Ventajas:**
- ✅ No dejas rastro en el navegador
- ✅ Llevas tus datos a cualquier PC
- ✅ Control total sobre tus backups
- ✅ Privacidad máxima

**Compromiso:**
- ⏰ 10 segundos extra por sesión (exportar/importar)
- 📁 Gestionar tus archivos de backup

**¿Vale la pena?** Si valoras la privacidad y la portabilidad, ¡absolutamente sí! 🎲



