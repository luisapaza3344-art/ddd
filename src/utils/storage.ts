// Utilidades para persistencia en localStorage/sessionStorage/memoria

const STORAGE_KEYS = {
  CASAS: 'apuestas_casas',
  DEPOSITOS: 'apuestas_depositos',
  RETIROS: 'apuestas_retiros',
  APUESTAS: 'apuestas_apuestas',
};

// Almacenamiento en memoria como último recurso
const memoryStorage: { [key: string]: string } = {};

// Detectar qué tipo de almacenamiento está disponible
function getStorageType(): 'localStorage' | 'sessionStorage' | 'memory' {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return 'localStorage';
  } catch (e) {
    try {
      const test = '__storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return 'sessionStorage';
    } catch (e) {
      return 'memory';
    }
  }
}

const storageType = getStorageType();

// Mostrar mensaje informativo
if (storageType === 'sessionStorage') {
  console.info('📝 Usando sessionStorage (modo incógnito): Los datos se guardarán solo durante esta sesión del navegador.');
} else if (storageType === 'memory') {
  console.warn('⚠️ Almacenamiento en memoria: Los datos se perderán al recargar la página.');
} else {
  console.info('✅ Usando localStorage: Los datos se guardarán permanentemente.');
}

export function guardarEnStorage<T>(key: string, data: T): void {
  try {
    const jsonData = JSON.stringify(data);
    
    if (storageType === 'localStorage') {
      localStorage.setItem(key, jsonData);
    } else if (storageType === 'sessionStorage') {
      sessionStorage.setItem(key, jsonData);
    } else {
      memoryStorage[key] = jsonData;
    }
  } catch (error) {
    console.error('Error guardando datos:', error);
    // Fallback a memoria si falla
    try {
      memoryStorage[key] = JSON.stringify(data);
    } catch (e) {
      console.error('Error en fallback a memoria:', e);
    }
  }
}

export function cargarDeStorage<T>(key: string, defaultValue: T): T {
  try {
    let item: string | null = null;
    
    if (storageType === 'localStorage') {
      item = localStorage.getItem(key);
    } else if (storageType === 'sessionStorage') {
      item = sessionStorage.getItem(key);
    } else {
      item = memoryStorage[key] || null;
    }
    
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error cargando datos:', error);
    return defaultValue;
  }
}

export function obtenerTipoAlmacenamiento(): string {
  if (storageType === 'localStorage') {
    return 'LocalStorage (Permanente)';
  } else if (storageType === 'sessionStorage') {
    return 'SessionStorage (Solo esta sesión)';
  } else {
    return 'Memoria (Se perderá al recargar)';
  }
}

export const storage = {
  casas: {
    guardar: (data: any) => guardarEnStorage(STORAGE_KEYS.CASAS, data),
    cargar: () => cargarDeStorage(STORAGE_KEYS.CASAS, []),
  },
  depositos: {
    guardar: (data: any) => guardarEnStorage(STORAGE_KEYS.DEPOSITOS, data),
    cargar: () => cargarDeStorage(STORAGE_KEYS.DEPOSITOS, []),
  },
  retiros: {
    guardar: (data: any) => guardarEnStorage(STORAGE_KEYS.RETIROS, data),
    cargar: () => cargarDeStorage(STORAGE_KEYS.RETIROS, []),
  },
  apuestas: {
    guardar: (data: any) => guardarEnStorage(STORAGE_KEYS.APUESTAS, data),
    cargar: () => cargarDeStorage(STORAGE_KEYS.APUESTAS, []),
  },
};

