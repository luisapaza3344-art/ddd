// Utilidades para manejo de monedas y conversión

export type Moneda = 'PEN' | 'USD';

export interface TipoCambio {
  USD_PEN: number; // Cuántos soles vale 1 dólar
  fecha: string;
  fuente: string;
}

// Cache del tipo de cambio
let tipoCambioCache: TipoCambio | null = null;
let ultimaActualizacion: number = 0;
const CACHE_DURACION = 1000 * 60 * 60; // 1 hora

/**
 * Obtiene el tipo de cambio desde Google Finance
 */
async function obtenerTipoCambioGoogle(): Promise<number> {
  try {
    // Usar una API más simple de Google Finance
    const response = await fetch(
      'https://www.google.com/finance/quote/USD-PEN',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Google Finance no disponible');
    }

    const html = await response.text();
    
    // Buscar el valor en el HTML
    // Google muestra el tipo de cambio en diferentes formatos
    const patterns = [
      /data-last-price="([0-9.]+)"/,
      /data-value="([0-9.]+)"/,
      /"([0-9.]+)"\s*PEN/,
      /class="YMlKec fxKbKc">([0-9.]+)</,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const valor = parseFloat(match[1]);
        if (!isNaN(valor) && valor > 0) {
          return valor;
        }
      }
    }

    throw new Error('No se pudo parsear el tipo de cambio de Google');
    
  } catch (error) {
    console.warn('Error obteniendo TC de Google Finance:', error);
    throw error;
  }
}

/**
 * Obtiene el tipo de cambio desde ExchangeRate-API (fallback)
 */
async function obtenerTipoCambioExchangeRate(): Promise<number> {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  
  if (!response.ok) {
    throw new Error('Error obteniendo tipo de cambio');
  }

  const data = await response.json();
  return data.rates.PEN || 3.75;
}

/**
 * Obtiene el tipo de cambio actual desde múltiples fuentes
 */
export async function obtenerTipoCambio(): Promise<TipoCambio> {
  // Si tenemos cache válido (menos de 1 hora), usar cache
  const ahora = Date.now();
  if (tipoCambioCache && (ahora - ultimaActualizacion) < CACHE_DURACION) {
    return tipoCambioCache;
  }

  let USD_PEN: number | null = null;
  let fuente = '';

  // 1. Intentar primero con Google Finance
  try {
    USD_PEN = await obtenerTipoCambioGoogle();
    fuente = 'Google Finance';
    console.log(`✅ Tipo de cambio de Google: $1 USD = S/ ${USD_PEN.toFixed(4)}`);
  } catch (error) {
    console.warn('Google Finance no disponible, intentando ExchangeRate-API...');
  }

  // 2. Si Google falla, usar ExchangeRate-API
  if (!USD_PEN) {
    try {
      USD_PEN = await obtenerTipoCambioExchangeRate();
      fuente = 'ExchangeRate-API';
      console.log(`✅ Tipo de cambio de ExchangeRate: $1 USD = S/ ${USD_PEN.toFixed(4)}`);
    } catch (error) {
      console.warn('ExchangeRate-API tampoco disponible:', error);
    }
  }

  // 3. Si ambas APIs fallan, intentar cargar desde storage
  if (!USD_PEN) {
    try {
      const stored = localStorage.getItem('tipo_cambio') || sessionStorage.getItem('tipo_cambio');
      if (stored) {
        tipoCambioCache = JSON.parse(stored);
        console.log('📦 Usando tipo de cambio guardado');
        return tipoCambioCache;
      }
    } catch (e) {
      // Ignorar error de storage
    }
  }

  // 4. Fallback manual si todo falla
  if (!USD_PEN) {
    USD_PEN = 3.75;
    fuente = 'Fallback Manual';
    console.warn('⚠️ Usando tipo de cambio fallback: S/ 3.75');
  }

  // Guardar en cache
  tipoCambioCache = {
    USD_PEN,
    fecha: new Date().toISOString(),
    fuente,
  };
  
  ultimaActualizacion = ahora;
  
  // Guardar en storage
  try {
    localStorage.setItem('tipo_cambio', JSON.stringify(tipoCambioCache));
  } catch (e) {
    try {
      sessionStorage.setItem('tipo_cambio', JSON.stringify(tipoCambioCache));
    } catch (e2) {
      // Ignorar si ambos fallan
    }
  }

  return tipoCambioCache;
}

/**
 * Convierte un monto de una moneda a otra
 */
export function convertirMoneda(
  monto: number,
  monedaOrigen: Moneda,
  monedaDestino: Moneda,
  tipoCambio: TipoCambio
): number {
  if (monedaOrigen === monedaDestino) {
    return monto;
  }

  if (monedaOrigen === 'USD' && monedaDestino === 'PEN') {
    // Dólares a Soles
    return monto * tipoCambio.USD_PEN;
  }

  if (monedaOrigen === 'PEN' && monedaDestino === 'USD') {
    // Soles a Dólares
    return monto / tipoCambio.USD_PEN;
  }

  return monto;
}

/**
 * Formatea un monto con su símbolo de moneda
 */
export function formatearMontoConMoneda(monto: number, moneda: Moneda): string {
  const simbolo = moneda === 'PEN' ? 'S/' : '$';
  const valor = monto.toFixed(2);
  
  if (monto >= 0) {
    return `${simbolo} ${valor}`;
  } else {
    return `-${simbolo} ${Math.abs(monto).toFixed(2)}`;
  }
}

/**
 * Formatea ganancia/pérdida con símbolo + o -
 */
export function formatearGananciaConMoneda(monto: number, moneda: Moneda): string {
  const simbolo = moneda === 'PEN' ? 'S/' : '$';
  const valor = Math.abs(monto).toFixed(2);
  
  if (monto > 0) {
    return `+${simbolo} ${valor}`;
  } else if (monto < 0) {
    return `-${simbolo} ${valor}`;
  } else {
    return `${simbolo} 0.00`;
  }
}

/**
 * Obtiene el nombre completo de la moneda
 */
export function getNombreMoneda(moneda: Moneda): string {
  return moneda === 'PEN' ? 'Soles Peruanos' : 'Dólares Americanos';
}

/**
 * Obtiene el símbolo de la moneda
 */
export function getSimboloMoneda(moneda: Moneda): string {
  return moneda === 'PEN' ? 'S/' : '$';
}

