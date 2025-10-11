import React, { useMemo } from 'react';
import { useApp } from '../context/AppContextDB';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Target,
  Database,
  Info
} from 'lucide-react';
import { formatearMoneda, getColorClase, calcularResultadoApuesta } from '../utils/calculations';
import { obtenerTipoAlmacenamiento } from '../utils/storage';
import { getSimboloMoneda } from '../utils/currency';
import { verificarServidor } from '../utils/apiDatabase';
import BalanceMultimoneda from './BalanceMultimoneda';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export default function Dashboard() {
  const { apuestas, obtenerEstadisticasTotales, obtenerEstadisticasTodasCasas } = useApp();
  const tipoAlmacenamiento = obtenerTipoAlmacenamiento();
  const [servidorConectado, setServidorConectado] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    verificarServidor().then(setServidorConectado);
  }, []);
  
  const estadisticasTotales = obtenerEstadisticasTotales();
  const estadisticasCasas = obtenerEstadisticasTodasCasas();

  // Datos para gráfico de evolución
  const datosEvolucion = useMemo(() => {
    const apuestasResueltas = apuestas
      .filter(a => a.resultado !== 'pendiente')
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    let beneficioAcumulado = 0;
    return apuestasResueltas.map(apuesta => {
      const resultado = calcularResultadoApuesta(apuesta.monto, apuesta.cuota, apuesta.resultado);
      beneficioAcumulado += resultado;
      return {
        fecha: format(new Date(apuesta.fecha), 'dd/MM', { locale: es }),
        beneficio: parseFloat(beneficioAcumulado.toFixed(2)),
      };
    });
  }, [apuestas]);

  // Datos para gráfico de saldos por casa
  const datosSaldosCasas = useMemo(() => {
    return estadisticasCasas.map(stats => ({
      nombre: stats.casa.nombre,
      saldo: parseFloat(stats.saldoActual.toFixed(2)),
      beneficio: parseFloat(stats.beneficioNeto.toFixed(2)),
    }));
  }, [estadisticasCasas]);

  // Datos para distribución de apuestas
  const datosDistribucion = useMemo(() => {
    const conteo = {
      ganada: 0,
      perdida: 0,
      pendiente: 0,
      'devolución': 0,
      'medio ganada': 0,
      'medio perdida': 0,
    };

    apuestas.forEach(apuesta => {
      conteo[apuesta.resultado]++;
    });

    return Object.entries(conteo)
      .filter(([_, count]) => count > 0)
      .map(([resultado, count]) => ({
        name: resultado.charAt(0).toUpperCase() + resultado.slice(1),
        value: count,
      }));
  }, [apuestas]);

  // Colores para el gráfico de pie
  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280', '#84cc16', '#f97316'];

  // Estadísticas de apuestas por tipo
  const estadisticasTipo = useMemo(() => {
    const normal = apuestas.filter(a => a.tipo === 'normal').length;
    const surebet = apuestas.filter(a => a.tipo === 'surebet').length;
    return { normal, surebet, total: apuestas.length };
  }, [apuestas]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg border border-slate-600">
            <Database size={18} className="text-blue-400" />
            <span className="text-sm text-gray-300">{tipoAlmacenamiento}</span>
            {tipoAlmacenamiento.includes('SessionStorage') && !servidorConectado && (
              <div className="group relative">
                <Info size={16} className="text-yellow-400 cursor-help" />
                <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-64 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-10 text-xs text-gray-300">
                  Modo incógnito detectado. Los datos se guardan durante esta sesión y se eliminarán al cerrar el navegador.
                </div>
              </div>
            )}
          </div>
          
          {servidorConectado !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              servidorConectado 
                ? 'bg-green-600/20 border-green-600' 
                : 'bg-gray-600/20 border-gray-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                servidorConectado ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                servidorConectado ? 'text-green-300' : 'text-gray-400'
              }`}>
                {servidorConectado ? 'Servidor Conectado' : 'Servidor Offline'}
              </span>
              {servidorConectado && (
                <div className="group relative">
                  <Info size={14} className="text-green-400 cursor-help" />
                  <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-64 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-10 text-xs text-gray-300">
                    ✅ Guardado automático activado. Tus cambios se sincronizan con el servidor automáticamente.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Balance Multi-moneda */}
      <BalanceMultimoneda />

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Balance Total</h3>
            <DollarSign size={24} className="text-blue-200" />
          </div>
          <p className={`text-3xl font-bold ${getColorClase(estadisticasTotales.balanceTotal)}`}>
            ${estadisticasTotales.balanceTotal.toFixed(2)}
          </p>
          <p className="text-blue-200 text-sm mt-1">Suma de todas las casas</p>
        </div>

        <div className="card bg-gradient-to-br from-green-600 to-green-800 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Beneficio Neto</h3>
            {estadisticasTotales.beneficioTotal >= 0 ? (
              <TrendingUp size={24} className="text-green-200" />
            ) : (
              <TrendingDown size={24} className="text-red-200" />
            )}
          </div>
          <p className={`text-3xl font-bold ${getColorClase(estadisticasTotales.beneficioTotal)}`}>
            {formatearMoneda(estadisticasTotales.beneficioTotal)}
          </p>
          <p className="text-green-200 text-sm mt-1">Solo de apuestas</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Total Depositado</h3>
            <ArrowUpCircle size={24} className="text-purple-200" />
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticasTotales.totalDepositado.toFixed(2)}
          </p>
          <p className="text-purple-200 text-sm mt-1">En todas las casas</p>
        </div>

        <div className="card bg-gradient-to-br from-orange-600 to-orange-800 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Total Retirado</h3>
            <ArrowDownCircle size={24} className="text-orange-200" />
          </div>
          <p className="text-3xl font-bold text-white">
            ${estadisticasTotales.totalRetirado.toFixed(2)}
          </p>
          <p className="text-orange-200 text-sm mt-1">De todas las casas</p>
        </div>
      </div>

      {/* Estadísticas por casa */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4">Estadísticas por Casa</h2>
        
        {estadisticasCasas.length === 0 ? (
          <p className="text-gray-400">No hay casas de apuestas registradas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Casa</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">Saldo</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">Beneficio</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">Depositado</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">Retirado</th>
                </tr>
              </thead>
              <tbody>
                {estadisticasCasas.map(stats => (
                  <tr key={stats.casa.id} className="border-t border-slate-700">
                    <td className="px-4 py-3 text-white font-medium">
                      {stats.casa.nombre}
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                        stats.casa.moneda === 'PEN' ? 'bg-blue-600' : 'bg-green-600'
                      }`}>
                        {stats.casa.moneda === 'PEN' ? 'PEN' : 'USD'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${getColorClase(stats.saldoActual)}`}>
                      {getSimboloMoneda(stats.casa.moneda)} {stats.saldoActual.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${getColorClase(stats.beneficioNeto)}`}>
                      {getSimboloMoneda(stats.casa.moneda)} {stats.beneficioNeto >= 0 ? '+' : ''}{stats.beneficioNeto.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {getSimboloMoneda(stats.casa.moneda)} {stats.totalDepositado.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {getSimboloMoneda(stats.casa.moneda)} {stats.totalRetirado.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolución del beneficio */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Evolución del Beneficio</h2>
          {datosEvolucion.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay apuestas resueltas aún</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosEvolucion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="fecha" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="beneficio" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Beneficio ($)"
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Distribución de resultados */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Distribución de Resultados</h2>
          {datosDistribucion.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay apuestas registradas</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosDistribucion}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosDistribucion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Comparativa de saldos */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Saldos por Casa</h2>
          {datosSaldosCasas.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay casas registradas</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosSaldosCasas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="nombre" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="saldo" fill="#3b82f6" name="Saldo ($)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Beneficio por casa */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Beneficio por Casa</h2>
          {datosSaldosCasas.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay casas registradas</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosSaldosCasas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="nombre" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="beneficio" fill="#10b981" name="Beneficio ($)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Estadísticas Generales</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Target size={32} className="text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{estadisticasTipo.total}</p>
            <p className="text-gray-400 text-sm">Total Apuestas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{estadisticasTipo.normal}</p>
            <p className="text-gray-400 text-sm">Apuestas Normales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{estadisticasTipo.surebet}</p>
            <p className="text-gray-400 text-sm">Surebets</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{estadisticasCasas.length}</p>
            <p className="text-gray-400 text-sm">Casas Activas</p>
          </div>
        </div>
      </div>
    </div>
  );
}

