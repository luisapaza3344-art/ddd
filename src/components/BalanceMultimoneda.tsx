import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContextDB';
import { RefreshCw, TrendingUp, Info } from 'lucide-react';
import { convertirMoneda, obtenerTipoCambio, TipoCambio } from '../utils/currency';

export default function BalanceMultimoneda() {
  const { casas, depositos, retiros, apuestas, obtenerEstadisticasCasa, tipoCambio: tipoCambioInicial } = useApp();
  const [tipoCambio, setTipoCambio] = useState<TipoCambio | null>(tipoCambioInicial);
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    if (tipoCambioInicial) {
      setTipoCambio(tipoCambioInicial);
    }
  }, [tipoCambioInicial]);

  const actualizarTipoCambio = async () => {
    setActualizando(true);
    try {
      const nuevoTipoCambio = await obtenerTipoCambio();
      setTipoCambio(nuevoTipoCambio);
    } catch (error) {
      console.error('Error actualizando tipo de cambio:', error);
    } finally {
      setActualizando(false);
    }
  };

  if (!tipoCambio) {
    return (
      <div className="card bg-gradient-to-br from-purple-600 to-purple-800">
        <p className="text-white">Cargando tipo de cambio...</p>
      </div>
    );
  }

  // Calcular balances y ganancias
  let balancePEN = 0;
  let balanceUSD = 0;
  let beneficioPEN = 0; // Ganancias con TC congelado (para reportes)
  let beneficioUSD = 0;
  
  const tcActual = tipoCambio?.USD_PEN || 3.75;

  casas.forEach(casa => {
    if (casa.moneda === 'PEN') {
      // Casas en soles: sumar directamente
      const depositosCasa = depositos.filter(d => d.casaId === casa.id).reduce((sum, d) => sum + d.monto, 0);
      const retirosCasa = retiros.filter(r => r.casaId === casa.id).reduce((sum, r) => sum + r.monto, 0);
      const apuestasCasa = apuestas.filter(a => a.casaId === casa.id);
      
      const beneficio = apuestasCasa.reduce((sum, a) => {
        if (a.resultado === 'pendiente') return sum;
        return sum + ((a.monto * a.cuota) - a.monto);
      }, 0);
      
      balancePEN += depositosCasa - retirosCasa + beneficio;
      beneficioPEN += beneficio;
      
    } else {
      // Casas en USD
      const depositosCasa = depositos.filter(d => d.casaId === casa.id);
      const retirosCasa = retiros.filter(r => r.casaId === casa.id);
      const apuestasCasa = apuestas.filter(a => a.casaId === casa.id);
      
      const totalDepositosUSD = depositosCasa.reduce((sum, d) => sum + d.monto, 0);
      const totalRetirosUSD = retirosCasa.reduce((sum, r) => sum + r.monto, 0);
      
      // Calcular ganancias en USD
      const gananciasUSD = apuestasCasa.reduce((sum, a) => {
        if (a.resultado === 'pendiente') return sum;
        return sum + ((a.monto * a.cuota) - a.monto);
      }, 0);
      
      // BALANCE: TODO en USD usa TC actual (incluye ganancias)
      balanceUSD += totalDepositosUSD - totalRetirosUSD + gananciasUSD;
      
      // REPORTE DE GANANCIAS: Usa TC congelado de cada apuesta (solo para mostrar)
      let gananciasReporteEnPEN = 0;
      apuestasCasa.forEach(a => {
        if (a.resultado === 'pendiente') return;
        const ganancia = (a.monto * a.cuota) - a.monto;
        const tc = a.tipoCambioUSD || tcActual;
        gananciasReporteEnPEN += ganancia * tc;
      });
      
      beneficioUSD += gananciasUSD;
      beneficioPEN += gananciasReporteEnPEN;
    }
  });

  // BALANCE TOTAL: Todo el dinero (incluido ganancias) usa TC actual
  const balanceUSDenPEN = balanceUSD * tcActual;
  const balanceTotalPEN = balancePEN + balanceUSDenPEN;

  return (
    <div className="card bg-gradient-to-br from-purple-600 to-indigo-700 border-purple-400 border-2">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">💰 Balance Total (Consolidado)</h2>
          <p className="text-purple-200 text-sm">Convertido a Soles Peruanos</p>
        </div>
        <button
          onClick={actualizarTipoCambio}
          disabled={actualizando}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
          title="Actualizar tipo de cambio"
        >
          <RefreshCw size={20} className={`text-white ${actualizando ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Balance Total */}
      <div className="bg-white/10 rounded-lg p-6 mb-4">
        <p className="text-purple-200 text-sm mb-2">Balance Total Actual (TC Actual)</p>
        <p className="text-5xl font-bold text-white mb-1">
          S/ {balanceTotalPEN.toFixed(2)}
        </p>
        <div className="flex items-center gap-2 text-purple-200 text-sm">
          <TrendingUp size={16} />
          <span>Ganancias históricas: S/ {beneficioPEN.toFixed(2)}</span>
        </div>
      </div>

      {/* Desglose por moneda */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-purple-200 text-xs mb-1">🇵🇪 En Soles</p>
          <p className="text-xl font-bold text-white">S/ {balancePEN.toFixed(2)}</p>
          <p className="text-purple-200 text-xs mt-1">
            Beneficio: S/ {beneficioPEN.toFixed(2)}
          </p>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-purple-200 text-xs mb-1">🇺🇸 En Dólares</p>
          <p className="text-xl font-bold text-white">$ {balanceUSD.toFixed(2)}</p>
          <p className="text-purple-200 text-xs mt-1">
            ≈ S/ {balanceUSDenPEN.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tipo de cambio */}
      <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-yellow-300 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-yellow-100 text-sm font-semibold">
              Tipo de Cambio Actual: $1 USD = S/ {tipoCambio.USD_PEN.toFixed(4)}
            </p>
            <p className="text-yellow-200 text-xs mt-1">
              Fuente: {tipoCambio.fuente} • {new Date(tipoCambio.fecha).toLocaleTimeString('es-PE')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-green-500/20 border border-green-400/50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-green-300 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-100 text-xs">
              <strong>✓ Balance:</strong> TODO tu dinero actual (depósitos, retiros, ganancias) usa el TC actual. 
              <strong>Ganancias históricas:</strong> Guardan TC del día de resolución solo para análisis (no afecta balance).
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="text-purple-200 text-xs">
          📊 Balance total usa TC actual • Ganancias históricas guardan TC congelado para análisis
        </p>
      </div>
    </div>
  );
}

