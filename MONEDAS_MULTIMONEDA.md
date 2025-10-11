# 💱 Sistema Multi-Moneda

## ✅ ¡IMPLEMENTADO!

La aplicación ahora soporta **Soles Peruanos (PEN) y Dólares Americanos (USD)** con conversión automática en tiempo real.

---

## 🎯 Características

### 1. Moneda por Casa de Apuestas
- Cada casa de apuestas tiene su propia moneda
- Puedes tener casas en Soles y casas en Dólares
- La moneda se muestra claramente en cada tarjeta

### 2. Conversión Automática en Tiempo Real
- Se obtiene el tipo de cambio desde una API pública
- Se actualiza automáticamente cada hora
- Puedes actualizar manualmente con el botón de refresh
- Si la API falla, usa un valor guardado o fallback

### 3. Dashboard Consolidado
- **Balance Total Convertido a Soles**: Muestra todo tu dinero unificado en S/
- **Desglose por Moneda**: Ve cuánto tienes en Soles y Dólares por separado
- **Tipo de Cambio Actual**: Siempre visible con fecha y fuente

---

## 📋 Cómo Usar

### Crear Casa con Moneda
```
1. Haz clic en "Nueva Casa"
2. Ingresa el nombre
3. Selecciona la moneda:
   🇵🇪 Soles Peruanos (S/)
   🇺🇸 Dólares Americanos ($)
4. Crear Casa
```

### Ver Balance Consolidado
En el Dashboard verás una tarjeta especial con:
- **Balance Total en Soles**: Todo convertido a S/
- **Desglose por Moneda**: S/ y $ por separado
- **Tipo de Cambio**: $1 USD = S/ X.XXXX
- **Botón de Actualizar**: Para refrescar el tipo de cambio

### Ejemplo Real
```
Casa 1 (Bet365): S/ 500 en Soles
Casa 2 (Stake): $100 en Dólares

Si $1 USD = S/ 3.75, entonces:
$100 USD = S/ 375

Balance Total Consolidado:
S/ 500 + S/ 375 = S/ 875
```

---

## 💡 Detalles Técnicos

### API de Tipo de Cambio
- **Fuente**: ExchangeRate-API (gratuita, sin API key)
- **URL**: `https://api.exchangerate-api.com/v4/latest/USD`
- **Actualización**: Automática cada 1 hora
- **Cache**: Se guarda en localStorage/sessionStorage
- **Fallback**: Si la API falla, usa valor guardado o S/ 3.75 aprox.

### Cálculos
```typescript
// USD a PEN (Dólares a Soles)
soles = dolares * tipoCambio.USD_PEN

// PEN a USD (Soles a Dólares)
dolares = soles / tipoCambio.USD_PEN
```

### Formato de Moneda
- **Soles**: `S/ 100.00`
- **Dólares**: `$ 100.00`
- **Con signo**: `+S/ 50.00` (ganancia) o `-S/ 25.00` (pérdida)

---

## 🗄️ Base de Datos

La columna `moneda` se agregó a la tabla de casas:

```sql
CREATE TABLE casas (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  moneda TEXT DEFAULT 'PEN'  -- Nueva columna
)
```

Si ya tienes datos antiguos:
- Se migran automáticamente a PEN (Soles)
- Puedes editar cada casa y cambiar su moneda

---

## 🎨 Interfaz

### Dashboard
- 💰 **Tarjeta Grande Morada**: Balance Total Consolidado en Soles
- 🔄 **Botón de Refresh**: Actualizar tipo de cambio manualmente
- 📊 **Desglose**: Cuánto tienes en cada moneda

### Casas de Apuestas
- 🏷️ **Badge de Moneda**: Muestra si es PEN o USD
- 💵 **Símbolo Correcto**: S/ para soles, $ para dólares
- ✏️ **Editor**: Puedes cambiar la moneda al editar

### Formularios
- 🇵🇪/🇺🇸 **Selector de Moneda**: Con banderas y nombres claros
- ℹ️ **Ayuda**: Texto explicativo sobre qué moneda elegir

---

## 🔧 Actualizar Tipo de Cambio

### Automático
- Se actualiza cada hora sin que hagas nada
- Al cargar la aplicación por primera vez

### Manual
- Haz clic en el botón ⟳ en la tarjeta morada
- El ícono girará mientras actualiza
- Verás el nuevo tipo de cambio inmediatamente

---

## 💾 Persistencia

### Base de Datos
- La moneda de cada casa se guarda en la base de datos
- Se exporta en el archivo `.db`
- Compatible con el sistema de backup

### Tipo de Cambio
- Se guarda en localStorage/sessionStorage
- Se carga automáticamente al iniciar
- Se actualiza desde la API cuando expira (1 hora)

---

## 📊 Ejemplos de Uso

### Caso 1: Usuario con Casas Mixtas
```
Casas en Soles:
- Bet365: S/ 300
- Inkabet: S/ 200

Casas en Dólares:
- Stake: $50 ($50 × 3.75 = S/ 187.50)
- Betway: $100 ($100 × 3.75 = S/ 375)

Balance Total Consolidado:
S/ 300 + S/ 200 + S/ 187.50 + S/ 375 = S/ 1,062.50
```

### Caso 2: Beneficio Multi-Moneda
```
Ganancias en Soles: +S/ 150
Ganancias en Dólares: +$25 (≈ +S/ 93.75)

Beneficio Total: S/ 243.75
```

### Caso 3: Cambio de Moneda
```
Antes: Casa Bet365 en USD con $200
Después: Editas y cambias a PEN

⚠️ Nota: Los montos históricos (depósitos, retiros, apuestas) 
NO se convierten. Solo afecta operaciones futuras.
```

---

## ⚠️ Consideraciones Importantes

### 1. Consistencia de Moneda
- Mantén la moneda de cada casa consistente
- Si una casa trabaja en USD, déjala en USD
- Si cambias la moneda, los datos históricos no se convierten

### 2. Tipo de Cambio
- El tipo de cambio es referencial (para informar)
- No afecta los montos reales en cada casa
- Sirve para ver tu balance total consolidado

### 3. Depósitos y Retiros
- Se registran en la moneda de la casa
- Ejemplo: Casa en USD → Depósito en dólares

### 4. Apuestas
- Se registran en la moneda de la casa
- Los cálculos de ganancia/pérdida respetan la moneda original

---

## 🚀 Ventajas del Sistema

### ✅ Para Usuarios Multi-Moneda
- Ve todo tu dinero unificado en Soles
- Compara fácilmente casas en diferentes monedas
- Toma decisiones informadas sobre dónde apostar

### ✅ Para Seguimiento Preciso
- Cada casa mantiene su moneda real
- No hay confusiones con conversiones
- Histórico confiable y preciso

### ✅ Para Planificación
- Sabes exactamente cuánto tienes en total
- Puedes planificar retiros considerando el tipo de cambio
- Identificas mejores oportunidades

---

## 🎯 Próximas Mejoras Posibles

Ideas para futuras versiones:
- 🌍 Más monedas (EUR, BRL, CLP, etc.)
- 📈 Historial de tipo de cambio (ver evolución)
- 🔔 Alertas cuando el tipo de cambio suba/baje
- 💹 Gráfico de beneficio por moneda
- 🎨 Selector de moneda preferida para dashboard

---

## 📞 Preguntas Frecuentes

### ¿Puedo cambiar la moneda de una casa existente?
**R**: Sí, edita la casa y selecciona otra moneda. Pero los datos históricos no se convierten automáticamente.

### ¿De dónde sale el tipo de cambio?
**R**: De ExchangeRate-API, una API pública y gratuita. Se actualiza diariamente.

### ¿Funciona offline?
**R**: Sí, usa el último tipo de cambio guardado. Si nunca se conectó, usa S/ 3.75 aprox.

### ¿Qué pasa si la API falla?
**R**: Usa el tipo de cambio guardado en cache. Si no hay cache, usa S/ 3.75 como fallback.

### ¿Puedo tener todas mis casas en USD?
**R**: ¡Sí! Puedes tener todas en USD, todas en PEN, o mixtas.

### ¿El balance se actualiza solo?
**R**: El balance de cada casa NO. El tipo de cambio SÍ (cada hora). El balance consolidado se recalcula con el nuevo tipo de cambio.

---

## 🎲 ¡Disfruta la Nueva Funcionalidad!

Ahora puedes:
- ✅ Manejar casas en Soles y Dólares
- ✅ Ver tu balance total consolidado
- ✅ Saber exactamente cuánto tienes en cada moneda
- ✅ Tomar mejores decisiones basadas en el tipo de cambio

**¡Tu gestión de apuestas ahora es multi-moneda!** 💱🚀



