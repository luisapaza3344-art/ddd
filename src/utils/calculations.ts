// Utilidades para cálculos financieros

import { Apuesta, ResultadoApuesta } from '../types';

/**
 * Calcula el resultado financiero de una apuesta
 * @param monto Monto apostado
 * @param cuota Cuota de la apuesta
 * @param resultado Resultado de la apuesta
 * @returns Beneficio o pérdida (negativo si es pérdida)
 */
export function calcularResultadoApuesta(
  monto: number,
  cuota: number,
  resultado: ResultadoApuesta
): number {
  switch (resultado) {
    case 'ganada':
      // Ganancia = (monto × cuota) - monto
      return (monto * cuota) - monto;
    
    case 'perdida':
      // Pérdida = monto (como negativo)
      return -monto;
    
    case 'devolución':
      // Sin ganancia ni pérdida
      return 0;
    
    case 'medio ganada':
      // Ganancia = ((monto / 2) × cuota) - (monto / 2)
      // La otra mitad se devuelve, así que no se pierde
      return ((monto / 2) * cuota) - (monto / 2);
    
    case 'medio perdida':
      // Pérdida = monto / 2
      // La otra mitad se devuelve
      return -(monto / 2);
    
    case 'pendiente':
      // No se calcula hasta que se resuelva
      return 0;
    
    default:
      return 0;
  }
}

/**
 * Calcula el beneficio total de un array de apuestas
 */
export function calcularBeneficioTotal(apuestas: Apuesta[]): number {
  return apuestas.reduce((total, apuesta) => {
    if (apuesta.resultado === 'pendiente') return total;
    return total + calcularResultadoApuesta(apuesta.monto, apuesta.cuota, apuesta.resultado);
  }, 0);
}

/**
 * Formatea un número como moneda
 */
export function formatearMoneda(valor: number): string {
  const signo = valor >= 0 ? '+' : '';
  return `${signo}$${valor.toFixed(2)}`;
}

/**
 * Obtiene la clase CSS según el valor (positivo/negativo)
 */
export function getColorClase(valor: number): string {
  if (valor > 0) return 'text-green-400';
  if (valor < 0) return 'text-red-400';
  return 'text-gray-400';
}



