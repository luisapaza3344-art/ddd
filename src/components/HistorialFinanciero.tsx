import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContextDB';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { calcularResultadoApuesta, formatearMoneda, getColorClase } from '../utils/calculations';
import { OperacionFinanciera } from '../types';

export default function HistorialFinanciero() {
  const { casas, depositos, retiros, apuestas, obtenerEstadisticasCasa } = useApp();
  const [casaSeleccionada, setCasaSeleccionada] = useState<string>('');

  // Obtener historial de operaciones para la casa seleccionada
  const historialOperaciones = useMemo(() => {
    if (!casaSeleccionada) return [];

    const operaciones: OperacionFinanciera[] = [];

    // Agregar depósitos
    depositos
      .filter(d => d.casaId === casaSeleccionada)
      .forEach(deposito => {
        operaciones.push({
          id: deposito.id,
          tipo: 'deposito',
          monto: deposito.monto,
          fecha: deposito.fecha,
          descripcion: 'Depósito',
        });
      });

    // Agregar retiros
    retiros
      .filter(r => r.casaId === casaSeleccionada)
      .forEach(retiro => {
        operaciones.push({
          id: retiro.id,
          tipo: 'retiro',
          monto: retiro.monto,
          fecha: retiro.fecha,
          descripcion: 'Retiro',
        });
      });

    // Agregar apuestas resueltas
    apuestas
      .filter(a => a.casaId === casaSeleccionada && a.resultado !== 'pendiente')
      .forEach(apuesta => {
        const beneficio = calcularResultadoApuesta(apuesta.monto, apuesta.cuota, apuesta.resultado);
        operaciones.push({
          id: apuesta.id,
          tipo: 'apuesta',
          monto: apuesta.monto,
          fecha: apuesta.fecha,
          descripcion: `${apuesta.evento} - ${apuesta.resultado}`,
          beneficio,
        });
      });

    // Ordenar por fecha (más reciente primero)
    return operaciones.sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }, [casaSeleccionada, depositos, retiros, apuestas]);

  // Calcular saldo acumulado para cada operación
  const historialConSaldo = useMemo(() => {
    if (historialOperaciones.length === 0) return [];

    // Ordenar por fecha ascendente para calcular el saldo
    const operacionesOrdenadas = [...historialOperaciones].reverse();
    let saldoAcumulado = 0;

    const resultado = operacionesOrdenadas.map(operacion => {
      if (operacion.tipo === 'deposito') {
        saldoAcumulado += operacion.monto;
      } else if (operacion.tipo === 'retiro') {
        saldoAcumulado -= operacion.monto;
      } else if (operacion.tipo === 'apuesta' && operacion.beneficio !== undefined) {
        saldoAcumulado += operacion.beneficio;
      }

      return {
        ...operacion,
        saldoAcumulado,
      };
    });

    // Devolver en orden descendente (más reciente primero)
    return resultado.reverse();
  }, [historialOperaciones]);

  const estadisticasCasa = casaSeleccionada 
    ? obtenerEstadisticasCasa(casaSeleccionada) 
    : null;

  const getIconoOperacion = (tipo: string) => {
    switch (tipo) {
      case 'deposito':
        return <ArrowUpCircle size={20} className="text-green-400" />;
      case 'retiro':
        return <ArrowDownCircle size={20} className="text-red-400" />;
      case 'apuesta':
        return <DollarSign size={20} className="text-blue-400" />;
      default:
        return null;
    }
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'deposito':
        return 'text-green-400';
      case 'retiro':
        return 'text-red-400';
      case 'apuesta':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Historial Financiero</h1>

      {/* Selector de casa */}
      <div className="card">
        <label className="label">Selecciona una Casa de Apuestas</label>
        <select
          value={casaSeleccionada}
          onChange={(e) => setCasaSeleccionada(e.target.value)}
          className="input-field"
        >
          <option value="">-- Seleccionar --</option>
          {casas.map(casa => (
            <option key={casa.id} value={casa.id}>{casa.nombre}</option>
          ))}
        </select>
      </div>

      {/* Estadísticas de la casa seleccionada */}
      {estadisticasCasa && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-blue-600 to-blue-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Saldo Actual</h3>
              <DollarSign size={24} className="text-blue-200" />
            </div>
            <p className={`text-3xl font-bold ${getColorClase(estadisticasCasa.saldoActual)}`}>
              ${estadisticasCasa.saldoActual.toFixed(2)}
            </p>
          </div>

          <div className="card bg-gradient-to-br from-green-600 to-green-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Beneficio Neto</h3>
              {estadisticasCasa.beneficioNeto >= 0 ? (
                <TrendingUp size={24} className="text-green-200" />
              ) : (
                <TrendingDown size={24} className="text-red-200" />
              )}
            </div>
            <p className={`text-3xl font-bold ${getColorClase(estadisticasCasa.beneficioNeto)}`}>
              {formatearMoneda(estadisticasCasa.beneficioNeto)}
            </p>
          </div>

          <div className="card bg-gradient-to-br from-purple-600 to-purple-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Depositado</h3>
              <ArrowUpCircle size={24} className="text-purple-200" />
            </div>
            <p className="text-3xl font-bold text-white">
              ${estadisticasCasa.totalDepositado.toFixed(2)}
            </p>
          </div>

          <div className="card bg-gradient-to-br from-orange-600 to-orange-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Retirado</h3>
              <ArrowDownCircle size={24} className="text-orange-200" />
            </div>
            <p className="text-3xl font-bold text-white">
              ${estadisticasCasa.totalRetirado.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Historial de operaciones */}
      {!casaSeleccionada ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">Selecciona una casa de apuestas para ver su historial</p>
        </div>
      ) : historialConSaldo.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">No hay operaciones registradas para esta casa</p>
        </div>
      ) : (
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-4">
            Historial de Operaciones - {casas.find(c => c.id === casaSeleccionada)?.nombre}
          </h2>
          
          <div className="space-y-3">
            {historialConSaldo.map((operacion, index) => (
              <div
                key={`${operacion.tipo}-${operacion.id}-${index}`}
                className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getIconoOperacion(operacion.tipo)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold ${getColorTipo(operacion.tipo)}`}>
                          {operacion.tipo === 'deposito' && 'DEPÓSITO'}
                          {operacion.tipo === 'retiro' && 'RETIRO'}
                          {operacion.tipo === 'apuesta' && 'APUESTA'}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {format(new Date(operacion.fecha), "dd 'de' MMMM, yyyy", { locale: es })}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-2">{operacion.descripcion}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        {operacion.tipo === 'deposito' && (
                          <span className="text-green-400 font-semibold">
                            +${operacion.monto.toFixed(2)}
                          </span>
                        )}
                        {operacion.tipo === 'retiro' && (
                          <span className="text-red-400 font-semibold">
                            -${operacion.monto.toFixed(2)}
                          </span>
                        )}
                        {operacion.tipo === 'apuesta' && (
                          <>
                            <span className="text-gray-400">
                              Apostado: ${operacion.monto.toFixed(2)}
                            </span>
                            {operacion.beneficio !== undefined && (
                              <span className={`font-semibold ${getColorClase(operacion.beneficio)}`}>
                                {formatearMoneda(operacion.beneficio)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-gray-400 text-xs mb-1">Saldo</p>
                    <p className={`text-lg font-bold ${getColorClase(operacion.saldoAcumulado)}`}>
                      ${operacion.saldoAcumulado.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

