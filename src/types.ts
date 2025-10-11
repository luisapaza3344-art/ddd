// Tipos para la aplicación de gestión de apuestas

export type Moneda = 'PEN' | 'USD';

export interface CasaApuestas {
  id: string;
  nombre: string;
  moneda: Moneda; // Moneda de la casa de apuestas
}

export interface Deposito {
  id: string;
  casaId: string;
  monto: number;
  fecha: string; // ISO string
  tipoCambioUSD?: number; // Tipo de cambio del día (solo si casa es USD)
}

export interface Retiro {
  id: string;
  casaId: string;
  monto: number;
  fecha: string; // ISO string
  tipoCambioUSD?: number; // Tipo de cambio del día (solo si casa es USD)
}

export type TipoApuesta = 'normal' | 'surebet';

export type ResultadoApuesta = 
  | 'ganada' 
  | 'perdida' 
  | 'pendiente' 
  | 'devolución' 
  | 'medio ganada' 
  | 'medio perdida';

export interface Apuesta {
  id: string;
  casaId: string;
  tipo: TipoApuesta;
  evento: string;
  fecha: string; // ISO string
  seleccion: string;
  cuota: number;
  monto: number;
  resultado: ResultadoApuesta;
  tipoCambioUSD?: number; // Tipo de cambio al momento de resolver (solo si casa es USD)
  fechaResolucion?: string; // Fecha en que se resolvió la apuesta
}

export interface EstadisticasCasa {
  casa: CasaApuestas;
  saldoActual: number;
  beneficioNeto: number; // Solo de apuestas
  totalDepositado: number;
  totalRetirado: number;
}

export interface OperacionFinanciera {
  id: string;
  tipo: 'deposito' | 'retiro' | 'apuesta';
  monto: number;
  fecha: string;
  descripcion: string;
  beneficio?: number; // Solo para apuestas
}

