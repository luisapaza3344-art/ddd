# Instrucciones de Instalación y Uso

## 🚀 Instalación Rápida

### Paso 1: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Este comando instalará todas las dependencias necesarias:
- React y React DOM
- TypeScript
- Vite (servidor de desarrollo)
- Tailwind CSS
- React Router
- Recharts (para gráficos)
- date-fns (manejo de fechas)
- Lucide React (iconos)

### Paso 2: Iniciar la Aplicación

Una vez instaladas las dependencias, ejecuta:

```bash
npm run dev
```

La aplicación se abrirá automáticamente en tu navegador en:
**http://localhost:5173**

## 📱 Primeros Pasos

### 1. Crear tu Primera Casa de Apuestas

1. Navega a **"Casas de Apuestas"** en el menú
2. Haz clic en **"Nueva Casa"**
3. Ingresa el nombre (ej: Bet365, Codere, Betsson, etc.)
4. Haz clic en **"Crear Casa"**

### 2. Registrar un Depósito

1. En la tarjeta de la casa que acabas de crear
2. Haz clic en **"Gestionar Depósitos/Retiros"**
3. Selecciona "Depósito" como tipo de operación
4. Ingresa el monto (ej: 100)
5. Selecciona la fecha
6. Haz clic en **"Agregar Depósito"**

### 3. Crear tu Primera Apuesta

1. Navega a **"Mis Apuestas"**
2. Haz clic en **"Nueva Apuesta"**
3. Completa todos los campos:
   - **Casa de apuestas**: Selecciona la que creaste
   - **Tipo**: Normal o Surebet
   - **Evento**: Ej: "Real Madrid vs Barcelona"
   - **Fecha**: Fecha del evento
   - **Selección**: Ej: "Real Madrid gana"
   - **Cuota**: Ej: 1.85
   - **Monto Apostado**: Ej: 20
   - **Resultado**: Deja en "Pendiente" hasta que se resuelva
4. Haz clic en **"Crear Apuesta"**

### 4. Actualizar el Resultado de una Apuesta

1. En la lista de apuestas, haz clic en el ícono de **editar** (lápiz)
2. Cambia el **Resultado** a:
   - **Ganada**: Si tu selección ganó
   - **Perdida**: Si tu selección perdió
   - **Devolución**: Si se devolvió el dinero
   - **Medio Ganada**: Si ganó la mitad de la apuesta
   - **Medio Perdida**: Si perdió la mitad de la apuesta
3. Haz clic en **"Guardar Cambios"**

El sistema calculará automáticamente tu ganancia o pérdida.

### 5. Registrar un Retiro

1. Ve a **"Casas de Apuestas"**
2. En la casa desde donde vas a retirar, haz clic en **"Gestionar Depósitos/Retiros"**
3. Selecciona "Retiro" como tipo
4. Ingresa el monto y fecha
5. Haz clic en **"Agregar Retiro"**

### 6. Ver Estadísticas

#### Dashboard
- Navega a **"Dashboard"** para ver:
  - Balance total de todas las casas
  - Beneficio neto (solo de apuestas)
  - Total depositado y retirado
  - Gráficos de evolución
  - Distribución de resultados

#### Historial Financiero
- Navega a **"Historial Financiero"**
- Selecciona una casa de apuestas
- Verás todas las operaciones en orden cronológico:
  - Depósitos (verde)
  - Retiros (rojo)
  - Apuestas resueltas (azul)
  - Saldo acumulado después de cada operación

## 💡 Conceptos Importantes

### Diferencia entre Saldo y Beneficio

- **Saldo**: Es el dinero que tienes actualmente en la casa
  - Fórmula: `Depósitos - Retiros + Beneficio de Apuestas`
  
- **Beneficio Neto**: Es cuánto has ganado o perdido apostando
  - Solo cuenta los resultados de las apuestas
  - NO incluye depósitos ni retiros

### Ejemplo Práctico

```
1. Depositas $100
   → Saldo: $100
   → Beneficio: $0 (porque no has apostado)

2. Apuestas $20 a cuota 2.0 y GANAS
   → Ganancia: $20 (apostaste $20 y recuperas $40)
   → Saldo: $120 ($100 + $20 de ganancia)
   → Beneficio: +$20

3. Retiras $50
   → Saldo: $70 ($120 - $50)
   → Beneficio: +$20 (sigue igual, el retiro no afecta)

4. Apuestas $10 y PIERDES
   → Pérdida: $10
   → Saldo: $60 ($70 - $10)
   → Beneficio: +$10 ($20 - $10)
```

## 🎯 Tipos de Resultado de Apuestas

### Ganada
- **Cálculo**: `(Monto × Cuota) - Monto`
- **Ejemplo**: Apostaste $20 a cuota 2.5
  - Ganancia: `($20 × 2.5) - $20 = $30`

### Perdida
- **Cálculo**: `-Monto`
- **Ejemplo**: Apostaste $20
  - Pérdida: `-$20`

### Devolución
- **Cálculo**: `$0`
- No ganas ni pierdes

### Medio Ganada
- **Cálculo**: `((Monto / 2) × Cuota) - (Monto / 2)`
- **Ejemplo**: Apostaste $20 a cuota 2.0
  - Ganancia: `(($20 / 2) × 2.0) - ($20 / 2) = $10`
  - La otra mitad ($10) se devuelve

### Medio Perdida
- **Cálculo**: `-(Monto / 2)`
- **Ejemplo**: Apostaste $20
  - Pérdida: `-$10`
  - La otra mitad ($10) se devuelve

## 🔍 Filtros en "Mis Apuestas"

Puedes filtrar tus apuestas por:
- **Casa de Apuestas**: Ver apuestas de una casa específica
- **Tipo**: Normal o Surebet
- **Resultado**: Ganada, Perdida, Pendiente, etc.
- **Rango de Fechas**: Desde - Hasta

## 💾 Almacenamiento de Datos

### ✅ Compatible con Modo Incógnito

La aplicación **funciona perfectamente en modo incógnito**:

- **Navegación normal**: Los datos se guardan en `localStorage` (permanente)
- **Modo incógnito**: Los datos se guardan en `sessionStorage` (durante la sesión)
- La aplicación detecta automáticamente el mejor método disponible

### Diferencias entre modos:

| Modo | Almacenamiento | Duración |
|------|----------------|----------|
| **Normal** | localStorage | Permanente (hasta que lo borres) |
| **Incógnito** | sessionStorage | Solo mientras el navegador esté abierto |
| **Restricción total** | Memoria RAM | Solo mientras la pestaña esté abierta |

### 🔍 Cómo Saberlo

En el **Dashboard** verás un indicador que muestra el tipo de almacenamiento activo:
- 🟢 "LocalStorage (Permanente)" - Modo normal
- 🟡 "SessionStorage (Solo esta sesión)" - Modo incógnito
- 🔴 "Memoria (Se perderá al recargar)" - Sin almacenamiento

### Para resetear los datos:

**Modo normal:**
```javascript
localStorage.clear()
```

**Modo incógnito:**
```javascript
sessionStorage.clear()
```

Luego recarga la página.

## 🎨 Personalización

Los colores y estilos están en `src/index.css`. Puedes modificar:
- Colores de los botones
- Fondos de las tarjetas
- Tamaños de fuente
- Y mucho más usando clases de Tailwind CSS

## 🐛 Solución de Problemas

### La aplicación no inicia
```bash
# Elimina node_modules y package-lock.json
rm -rf node_modules package-lock.json
# Reinstala las dependencias
npm install
# Inicia de nuevo
npm run dev
```

### Los datos no se guardan
- En **modo incógnito**: Los datos se guardan pero se borran al cerrar el navegador (esto es normal)
- Verifica que tu navegador permita al menos sessionStorage
- Si usas file:// (sin servidor), algunos navegadores pueden tener restricciones

### Error al compilar
- Asegúrate de tener Node.js versión 16 o superior
- Ejecuta `npm install` nuevamente

## 📦 Construir para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

Para previsualizar la versión de producción:

```bash
npm run preview
```

## 🌐 Despliegue

Puedes desplegar esta aplicación en:

### Vercel (Recomendado)
1. Sube tu código a GitHub
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Vercel detectará automáticamente que es un proyecto Vite
4. ¡Despliega!

### Netlify
1. Ejecuta `npm run build`
2. Arrastra la carpeta `dist/` a [netlify.com/drop](https://app.netlify.com/drop)

### GitHub Pages
1. Instala: `npm install --save-dev gh-pages`
2. Modifica `package.json`:
   ```json
   "homepage": "https://TU_USUARIO.github.io/TU_REPO",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Ejecuta: `npm run deploy`

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, puedes:
- Revisar el código en `src/`
- Consultar la documentación de React, TypeScript y Tailwind CSS
- Modificar el código según tus necesidades

## ✨ Próximas Funcionalidades (Ideas)

Algunas ideas para expandir la aplicación:
- Exportar datos a CSV o Excel
- Importar apuestas desde archivos
- Estadísticas avanzadas (ROI, strike rate, etc.)
- Categorías o etiquetas para apuestas
- Notas o comentarios en cada apuesta
- Múltiples monedas
- Modo oscuro/claro
- Notificaciones de apuestas pendientes
- Backup en la nube

¡Disfruta gestionando tus apuestas! 🎲📊

