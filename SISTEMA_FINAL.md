# 🎯 Sistema de Gestión de Apuestas - Versión Final

## ✅ Todo Implementado y Funcionando

### 🗄️ Base de Datos SQLite Portable
- ✅ Archivo `.db` exportable e importable
- ✅ Funciona en modo incógnito
- ✅ Compatible entre PCs y navegadores
- ✅ Sin backend, 100% local

### 💱 Sistema Multi-Moneda Inteligente
- ✅ Soles Peruanos (PEN) y Dólares (USD)
- ✅ API de tipo de cambio en tiempo real
- ✅ **Balance varía** con TC actual (dinero que tienes)
- ✅ **Ganancias NO varían** (TC congelado al resolver)

---

## 🎯 Lógica de Conversión (CORRECTA)

### Balance en USD 📈
```
Balance = Depósitos - Retiros + Ganancias

En Soles:
- (Depósitos - Retiros) × TC_ACTUAL ✅ Varía cada día
- Ganancias × TC_Congelado_al_resolver 🔒 NO varía

¿Por qué?
- Los depósitos-retiros son dinero que AÚN tienes
- Su valor en S/ cambia con el mercado
- Las ganancias ya se realizaron, son históricas
```

### Ejemplo Práctico
```
Tienes en Stake (USD):
- Depósitos: $1,000
- Retiros: $200
- Balance Dep-Ret: $800
- Ganancia 1: $50 (resuelta con TC 3.70) = S/ 185 🔒
- Ganancia 2: $30 (resuelta con TC 3.75) = S/ 112.50 🔒

Hoy (TC 3.80):
Balance en S/ = ($800 × 3.80) + S/ 185 + S/ 112.50
              = S/ 3,040 + S/ 297.50
              = S/ 3,337.50

Mañana (TC 3.90):
Balance en S/ = ($800 × 3.90) + S/ 185 + S/ 112.50
              = S/ 3,120 + S/ 297.50
              = S/ 3,417.50 ✅ Subió

Si TC baja a 3.70:
Balance en S/ = ($800 × 3.70) + S/ 185 + S/ 112.50
              = S/ 2,960 + S/ 297.50
              = S/ 3,257.50 ✅ Bajó

Ganancias históricas: SIEMPRE S/ 297.50 🔒
```

---

## 🗄️ Base de Datos - Estructura

```sql
CREATE TABLE casas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  moneda TEXT DEFAULT 'PEN'  -- PEN o USD
);

CREATE TABLE depositos (
  id TEXT PRIMARY KEY,
  casaId TEXT NOT NULL,
  monto REAL NOT NULL,
  fecha TEXT NOT NULL,
  tipoCambioUSD REAL  -- NULL (no se usa para balance)
);

CREATE TABLE retiros (
  id TEXT PRIMARY KEY,
  casaId TEXT NOT NULL,
  monto REAL NOT NULL,
  fecha TEXT NOT NULL,
  tipoCambioUSD REAL  -- NULL (no se usa para balance)
);

CREATE TABLE apuestas (
  id TEXT PRIMARY KEY,
  casaId TEXT NOT NULL,
  tipo TEXT NOT NULL,
  evento TEXT NOT NULL,
  fecha TEXT NOT NULL,
  seleccion TEXT NOT NULL,
  cuota REAL NOT NULL,
  monto REAL NOT NULL,
  resultado TEXT NOT NULL,
  tipoCambioUSD REAL,      -- ✅ TC al resolver (congelado)
  fechaResolucion TEXT     -- ✅ Fecha de resolución
);
```

---

## 🎮 Flujo de Uso Completo

### 1️⃣ Modo Normal (Navegación Normal)
```
1. Abre http://localhost:5173
2. Crea casas (con su moneda)
3. Registra depósitos
4. Crea apuestas
5. Resuelve apuestas (se guarda TC automáticamente)
6. Todo se guarda automáticamente
7. Puedes cerrar y volver cuando quieras
```

### 2️⃣ Modo Incógnito
```
Al Iniciar:
1. Abre incógnito
2. Click "Backup" → Importar .db
3. Trabajas normalmente

Al Terminar:
4. Click "Backup" → Exportar .db
5. Guarda en Drive/Dropbox/USB
6. Cierra el navegador

Próxima Sesión:
- Repite desde paso 1
```

### 3️⃣ Llevar a Otra PC
```
PC 1:
1. Exporta: apuestas.db
2. Sube a Google Drive

PC 2:
1. Descarga: apuestas.db
2. Importa en la app
3. ¡Todo funciona!
```

---

## 📊 Dashboard - Lo que Verás

### Tarjeta Morada Grande
```
💰 Balance Total (Consolidado)
S/ X,XXX.XX

Desglose:
🇵🇪 En Soles: S/ XXX
🇺🇸 En Dólares: $XXX (≈ S/ XXX) 📈

Tipo de Cambio Actual: $1 = S/ 3.XXXX
```

### Tabla de Casas
```
Casa          | Moneda | Saldo    | Beneficio
Bet365        | PEN    | S/ 500   | +S/ 150
Stake         | USD    | $ 300    | +$ 50
              |        | ≈ S/ XXX | ≈ S/ XXX
```

### Gráficos
- Evolución del beneficio (en S/, conversión congelada)
- Distribución de resultados
- Saldos por casa
- Beneficio por casa

---

## 🔄 Actualización de Tipo de Cambio

### Automática
- Cada 1 hora se actualiza
- Al cargar la app por primera vez
- Usa ExchangeRate-API (gratis)

### Manual
- Botón ⟳ en la tarjeta morada
- Actualiza inmediatamente
- El balance en USD se recalcula

---

## ✅ Verificar que Funciona

### Test 1: Balance Varía
```
1. Crea casa en USD
2. Deposita $100
3. Nota el balance en S/
4. Click botón ⟳ para actualizar TC
5. El balance en S/ debería cambiar ✅
```

### Test 2: Ganancia NO Varía
```
1. Crea y resuelve una apuesta en USD
2. Nota la ganancia en S/
3. Click botón ⟳ para actualizar TC
4. La ganancia en S/ NO cambia ✅
```

---

## 📱 La Aplicación Está Corriendo

**URL**: http://localhost:5173

### Próximos Pasos:
1. ✅ Crear una casa en Soles
2. ✅ Crear una casa en Dólares
3. ✅ Depositar en ambas
4. ✅ Crear apuestas
5. ✅ Resolver apuestas
6. ✅ Ver el dashboard consolidado
7. ✅ Exportar .db antes de cerrar (si estás en incógnito)

---

## 🎉 Resumen de Características

| Funcionalidad | Estado |
|---------------|--------|
| CRUD Casas de Apuestas | ✅ |
| Moneda por casa (PEN/USD) | ✅ |
| CRUD Depósitos/Retiros | ✅ |
| CRUD Apuestas | ✅ |
| 6 tipos de resultados | ✅ |
| Cálculos financieros | ✅ |
| Dashboard con métricas | ✅ |
| 4 gráficos interactivos | ✅ |
| Filtros avanzados | ✅ |
| Historial financiero | ✅ |
| Base de datos SQLite | ✅ |
| Exportar/Importar .db | ✅ |
| Exportar JSON | ✅ |
| Exportar CSV | ✅ |
| Modo incógnito | ✅ |
| Multi-moneda | ✅ |
| TC actual para balance | ✅ |
| TC congelado para ganancias | ✅ |
| API de tipo de cambio | ✅ |
| Diseño responsive | ✅ |
| Tema oscuro moderno | ✅ |

---

## 🚀 ¡A Gestionar Tus Apuestas!

Todo está listo y funcionando correctamente:
- 💾 Base de datos portable
- 🕵️ Compatible con incógnito
- 💱 Multi-moneda con conversión inteligente
- 📊 Dashboard completo
- 🎯 Sistema preciso y confiable

**¡Disfruta tu nueva herramienta profesional de gestión!** 🎲📈


