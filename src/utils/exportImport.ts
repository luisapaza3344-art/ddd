// Utilidades para exportar e importar datos

import { CasaApuestas, Deposito, Retiro, Apuesta } from '../types';

export interface DatosExportados {
  version: string;
  fechaExportacion: string;
  casas: CasaApuestas[];
  depositos: Deposito[];
  retiros: Retiro[];
  apuestas: Apuesta[];
}

/**
 * Exporta todos los datos a un archivo JSON
 */
export function exportarDatos(
  casas: CasaApuestas[],
  depositos: Deposito[],
  retiros: Retiro[],
  apuestas: Apuesta[]
): void {
  const datos: DatosExportados = {
    version: '1.0',
    fechaExportacion: new Date().toISOString(),
    casas,
    depositos,
    retiros,
    apuestas,
  };

  const jsonString = JSON.stringify(datos, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `apuestas-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Importa datos desde un archivo JSON
 */
export function importarDatos(file: File): Promise<DatosExportados> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const datos: DatosExportados = JSON.parse(content);
        
        // Validar estructura básica
        if (!datos.casas || !datos.depositos || !datos.retiros || !datos.apuestas) {
          throw new Error('Formato de archivo inválido');
        }
        
        resolve(datos);
      } catch (error) {
        reject(new Error('Error al leer el archivo: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Exporta datos a CSV (solo apuestas)
 */
export function exportarApuestasCSV(
  apuestas: Apuesta[],
  casas: CasaApuestas[]
): void {
  const obtenerNombreCasa = (casaId: string) => {
    return casas.find(c => c.id === casaId)?.nombre || 'Desconocida';
  };

  // Encabezados
  const headers = [
    'Fecha',
    'Casa',
    'Tipo',
    'Evento',
    'Selección',
    'Cuota',
    'Monto',
    'Resultado',
  ];

  // Filas
  const rows = apuestas.map(apuesta => [
    apuesta.fecha,
    obtenerNombreCasa(apuesta.casaId),
    apuesta.tipo,
    apuesta.evento,
    apuesta.seleccion,
    apuesta.cuota.toString(),
    apuesta.monto.toString(),
    apuesta.resultado,
  ]);

  // Crear CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `apuestas-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}



