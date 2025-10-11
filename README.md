# Gestión de Apuestas Deportivas

Una aplicación web moderna desarrollada con React y TypeScript para gestionar tus apuestas deportivas y el flujo de dinero en cada casa de apuestas.

## 🎯 Características

### 1. Gestión de Casas de Apuestas
- Crear, editar y eliminar casas de apuestas
- Visualizar saldo actual de cada casa
- Registrar depósitos y retiros por casa
- Ver estadísticas detalladas por casa

### 2. Gestión de Apuestas
- Registrar apuestas normales y surebets
- Tipos de resultado: ganada, perdida, pendiente, devolución, medio ganada, medio perdida
- Filtros avanzados por casa, tipo, resultado y fecha
- Cálculo automático de beneficios y pérdidas

### 3. Dashboard Interactivo
- Balance total de todas las casas
- Beneficio/pérdida neto total (solo de apuestas)
- Gráficos de evolución del beneficio
- Distribución de resultados de apuestas
- Comparativa de saldos por casa

### 4. Historial Financiero
- Vista cronológica de todas las operaciones por casa
- Depósitos, retiros y apuestas en una sola vista
- Saldo acumulado en tiempo real
- Estadísticas completas por casa

### 5. Cálculos Precisos
- **Saldo de casa** = (Depósitos) - (Retiros) + (Beneficio de apuestas)
- **Beneficio neto** = Solo resultados de apuestas (excluye depósitos/retiros)
- Los depósitos y retiros NO afectan las ganancias/pérdidas
- Solo los resultados de apuestas afectan el beneficio neto

## 🚀 Instalación

### Opción 1: Con Servidor Backend (Recomendado) ⭐

**Guardado automático + Modo incógnito + Sincronización entre PCs**

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del servidor
cd server
npm install
cd ..

# Iniciar servidor (Terminal 1)
cd server
npm start

# Iniciar frontend (Terminal 2)
npm run dev
```

O usa el script automático:
```bash
# Linux/Mac/WSL
./iniciar-todo.sh

# Windows
iniciar-todo.bat
```

### Opción 2: Solo Frontend (Sin servidor)

```bash
npm install
npm run dev
```

**Nota**: Sin servidor, en modo incógnito debes exportar/importar .db manualmente.

---

## 🏗️ Construir para Producción

```bash
npm run build
```

## 💾 Persistencia de Datos - Sistema Dual

### 🚀 Con Servidor Backend (Recomendado)
**Guardado 100% automático** - Sin exportar/importar manualmente:

- ✅ **Guardado Automático**: Cada cambio se sincroniza con el servidor
- ✅ **Modo Incógnito**: Funciona perfecto, datos persisten al cerrar
- ✅ **Sincronización**: Accede desde múltiples PCs automáticamente
- ✅ **Sin Esfuerzo**: No necesitas exportar/importar

El servidor corre en tu propia PC (localhost), mantiene total privacidad.

Ver [README_SERVIDOR.md](README_SERVIDOR.md) y [INSTRUCCIONES_SERVIDOR.md](INSTRUCCIONES_SERVIDOR.md)

### 💾 Sin Servidor (Fallback)
Sistema SQLite portable con exportación manual:

- 🟢 **Modo Normal**: Se guarda en localStorage (permanente)
- 🟡 **Modo Incógnito**: Se guarda en sessionStorage (temporal)
- 💾 **Exportar .db**: Botón "Backup" para exportar/importar

Ver [README_BASE_DATOS.md](README_BASE_DATOS.md)

## 📱 Diseño Responsive

La aplicación está completamente optimizada para:
- 📱 Dispositivos móviles
- 💻 Tablets
- 🖥️ Escritorio

## 🎨 Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Diseño moderno y responsive
- **React Router** - Navegación
- **Recharts** - Gráficos interactivos
- **date-fns** - Manejo de fechas
- **Lucide React** - Iconos modernos

## 📊 Estructura del Proyecto

```
src/
├── components/          # Componentes de React
│   ├── Dashboard.tsx    # Página principal con métricas
│   ├── Apuestas.tsx     # Gestión de apuestas
│   ├── CasasApuestas.tsx # Gestión de casas
│   ├── HistorialFinanciero.tsx # Historial por casa
│   ├── Navigation.tsx   # Barra de navegación
│   └── ...
├── context/             # Contexto global de la app
│   └── AppContext.tsx   # Estado global y lógica
├── utils/               # Utilidades
│   ├── calculations.ts  # Cálculos financieros
│   └── storage.ts       # Persistencia en localStorage
├── types.ts             # Definiciones de TypeScript
├── App.tsx              # Componente principal
├── main.tsx             # Punto de entrada
└── index.css            # Estilos globales
```

## 📝 Cómo Usar

### Paso 1: Crear Casas de Apuestas
1. Ve a "Casas de Apuestas"
2. Haz clic en "Nueva Casa"
3. Ingresa el nombre de la casa (ej: Bet365, Codere, etc.)

### Paso 2: Registrar Depósitos
1. En la tarjeta de cada casa, haz clic en "Gestionar Depósitos/Retiros"
2. Selecciona "Depósito", ingresa el monto y la fecha
3. Haz clic en "Agregar Depósito"

### Paso 3: Registrar Apuestas
1. Ve a "Mis Apuestas"
2. Haz clic en "Nueva Apuesta"
3. Completa los datos:
   - Casa de apuestas
   - Tipo (normal o surebet)
   - Evento, fecha, selección
   - Cuota y monto apostado
   - Resultado (pendiente por defecto)

### Paso 4: Actualizar Resultados
1. Edita la apuesta cuando conozcas el resultado
2. Cambia el resultado a: ganada, perdida, devolución, medio ganada o medio perdida
3. El beneficio se calcula automáticamente

### Paso 5: Ver Estadísticas
- **Dashboard**: Visualiza métricas generales y gráficos
- **Historial Financiero**: Selecciona una casa para ver todas sus operaciones

## 🧮 Fórmulas de Cálculo

### Resultados de Apuestas
- **Ganada**: Ganancia = (monto × cuota) - monto
- **Perdida**: Pérdida = monto
- **Devolución**: Resultado = 0
- **Medio Ganada**: Ganancia = ((monto / 2) × cuota) - (monto / 2)
- **Medio Perdida**: Pérdida = monto / 2

### Saldo de Casa
```
Saldo = (Σ Depósitos) - (Σ Retiros) + (Σ Beneficios de Apuestas)
```

### Beneficio Neto
```
Beneficio = Σ (Resultados de Apuestas Resueltas)
```
*No incluye depósitos ni retiros*

## 🎯 Ejemplo Práctico

1. **Depósito**: $100 → Saldo = $100, Beneficio = $0
2. **Apuesta ganada**: Apostado $20 a cuota 2.5 → Ganancia = $30 → Saldo = $130, Beneficio = +$30
3. **Retiro**: $60 → Saldo = $70, Beneficio = +$30 (no cambia)
4. **Apuesta perdida**: Apostado $10 → Pérdida = $10 → Saldo = $60, Beneficio = +$20

## 🔒 Privacidad y Seguridad

**100% Privado y Portable:**
- Base de datos SQLite que funciona **localmente en tu navegador**
- No se envía información a ningún servidor externo
- No hay backend, APIs ni seguimiento
- **Perfecto para modo incógnito** con exportación .db
- Funciona completamente offline
- Lleva tus datos a cualquier PC con un solo archivo

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

Desarrollado con ❤️ usando React + TypeScript + Tailwind CSS

