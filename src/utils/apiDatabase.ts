// Cliente para comunicarse con el servidor backend

const API_URL = 'http://localhost:3001/api';

// Obtener o crear ID de usuario único
function obtenerUserId(): string {
  let userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
  
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      localStorage.setItem('user_id', userId);
    } catch {
      sessionStorage.setItem('user_id', userId);
    }
  }
  
  return userId;
}

/**
 * Guarda la base de datos en el servidor
 */
export async function guardarDBEnServidor(dbData: Uint8Array): Promise<boolean> {
  try {
    const userId = obtenerUserId();
    const dataArray = Array.from(dbData);
    
    const response = await fetch(`${API_URL}/db/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        dbData: dataArray,
      }),
    });

    if (!response.ok) {
      throw new Error('Error guardando en servidor');
    }

    const result = await response.json();
    console.log('💾 Base de datos guardada en servidor');
    return result.success;
    
  } catch (error) {
    console.error('Error guardando en servidor:', error);
    return false;
  }
}

/**
 * Carga la base de datos desde el servidor
 */
export async function cargarDBDesdeServidor(): Promise<Uint8Array | null> {
  try {
    const userId = obtenerUserId();
    
    const response = await fetch(`${API_URL}/db/load/${userId}`);
    
    if (response.status === 404) {
      console.log('📭 No hay base de datos en el servidor para este usuario');
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Error cargando desde servidor');
    }

    const result = await response.json();
    
    if (result.success && result.dbData) {
      console.log('📂 Base de datos cargada desde servidor');
      return new Uint8Array(result.dbData);
    }
    
    return null;
    
  } catch (error) {
    console.error('Error cargando desde servidor:', error);
    return null;
  }
}

/**
 * Verifica si el servidor está disponible
 */
export async function verificarServidor(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // Timeout de 2 segundos
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Obtiene el tipo de cambio desde el servidor
 */
export async function obtenerTipoCambioDesdeServidor(): Promise<{ USD_PEN: number; fuente: string } | null> {
  try {
    const response = await fetch(`${API_URL}/exchange-rate`);
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    
    if (result.success) {
      return {
        USD_PEN: result.USD_PEN,
        fuente: result.fuente,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo TC desde servidor:', error);
    return null;
  }
}


