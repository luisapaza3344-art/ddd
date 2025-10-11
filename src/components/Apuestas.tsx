import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContextDB';
import { Plus, Filter, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { calcularResultadoApuesta, formatearMoneda, getColorClase } from '../utils/calculations';
import FormularioApuesta from './FormularioApuesta';
import { Apuesta, ResultadoApuesta, TipoApuesta } from '../types';

export default function Apuestas() {
  const { apuestas, casas, eliminarApuesta } = useApp();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [apuestaEditar, setApuestaEditar] = useState<Apuesta | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Filtros
  const [filtroCasa, setFiltroCasa] = useState<string>('todas');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroResultado, setFiltroResultado] = useState<string>('todos');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState<string>('');
  const [filtroFechaFin, setFiltroFechaFin] = useState<string>('');

  const apuestasFiltradas = useMemo(() => {
    return apuestas.filter(apuesta => {
      if (filtroCasa !== 'todas' && apuesta.casaId !== filtroCasa) return false;
      if (filtroTipo !== 'todos' && apuesta.tipo !== filtroTipo) return false;
      if (filtroResultado !== 'todos' && apuesta.resultado !== filtroResultado) return false;
      
      if (filtroFechaInicio && apuesta.fecha < filtroFechaInicio) return false;
      if (filtroFechaFin && apuesta.fecha > filtroFechaFin) return false;
      
      return true;
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [apuestas, filtroCasa, filtroTipo, filtroResultado, filtroFechaInicio, filtroFechaFin]);

  const handleEditar = (apuesta: Apuesta) => {
    setApuestaEditar(apuesta);
    setMostrarFormulario(true);
  };

  const handleEliminar = (id: string, evento: string) => {
    if (window.confirm(`¿Eliminar la apuesta "${evento}"?`)) {
      eliminarApuesta(id);
    }
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setApuestaEditar(null);
  };

  const limpiarFiltros = () => {
    setFiltroCasa('todas');
    setFiltroTipo('todos');
    setFiltroResultado('todos');
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
  };

  const obtenerNombreCasa = (casaId: string) => {
    return casas.find(c => c.id === casaId)?.nombre || 'Desconocida';
  };

  const getResultadoBadgeClass = (resultado: ResultadoApuesta) => {
    switch (resultado) {
      case 'ganada':
        return 'bg-green-600 text-white';
      case 'perdida':
        return 'bg-red-600 text-white';
      case 'pendiente':
        return 'bg-yellow-600 text-white';
      case 'devolución':
        return 'bg-gray-600 text-white';
      case 'medio ganada':
        return 'bg-green-500 text-white';
      case 'medio perdida':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Mis Apuestas</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`btn-secondary flex items-center gap-2 ${mostrarFiltros ? 'bg-blue-600' : ''}`}
          >
            <Filter size={20} />
            Filtros
          </button>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Nueva Apuesta
          </button>
        </div>
      </div>

      {mostrarFormulario && (
        <FormularioApuesta
          apuestaEditar={apuestaEditar}
          onCerrar={handleCerrarFormulario}
        />
      )}

      {/* Panel de filtros */}
      {mostrarFiltros && (
        <div className="card bg-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Filtros</h3>
            <button
              onClick={limpiarFiltros}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Limpiar filtros
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="label text-sm">Casa de Apuestas</label>
              <select
                value={filtroCasa}
                onChange={(e) => setFiltroCasa(e.target.value)}
                className="input-field text-sm"
              >
                <option value="todas">Todas</option>
                {casas.map(casa => (
                  <option key={casa.id} value={casa.id}>{casa.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-sm">Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="input-field text-sm"
              >
                <option value="todos">Todos</option>
                <option value="normal">Normal</option>
                <option value="surebet">Surebet</option>
              </select>
            </div>

            <div>
              <label className="label text-sm">Resultado</label>
              <select
                value={filtroResultado}
                onChange={(e) => setFiltroResultado(e.target.value)}
                className="input-field text-sm"
              >
                <option value="todos">Todos</option>
                <option value="ganada">Ganada</option>
                <option value="perdida">Perdida</option>
                <option value="pendiente">Pendiente</option>
                <option value="devolución">Devolución</option>
                <option value="medio ganada">Medio Ganada</option>
                <option value="medio perdida">Medio Perdida</option>
              </select>
            </div>

            <div>
              <label className="label text-sm">Fecha Desde</label>
              <input
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="label text-sm">Fecha Hasta</label>
              <input
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Lista de apuestas */}
      {apuestasFiltradas.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">No hay apuestas registradas</p>
          <p className="text-gray-500 mt-2">
            {apuestas.length === 0 
              ? 'Comienza agregando tu primera apuesta'
              : 'No se encontraron apuestas con los filtros aplicados'
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-gray-300 font-semibold">Fecha</th>
                <th className="px-4 py-3 text-gray-300 font-semibold">Evento</th>
                <th className="px-4 py-3 text-gray-300 font-semibold">Casa</th>
                <th className="px-4 py-3 text-gray-300 font-semibold">Tipo</th>
                <th className="px-4 py-3 text-gray-300 font-semibold">Selección</th>
                <th className="px-4 py-3 text-gray-300 font-semibold text-right">Cuota</th>
                <th className="px-4 py-3 text-gray-300 font-semibold text-right">Monto</th>
                <th className="px-4 py-3 text-gray-300 font-semibold">Resultado</th>
                <th className="px-4 py-3 text-gray-300 font-semibold text-right">Beneficio</th>
                <th className="px-4 py-3 text-gray-300 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {apuestasFiltradas.map(apuesta => {
                const resultado = calcularResultadoApuesta(apuesta.monto, apuesta.cuota, apuesta.resultado);
                return (
                  <tr key={apuesta.id} className="border-t border-slate-700 hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-3 text-gray-300">
                      {format(new Date(apuesta.fecha), 'dd MMM yyyy', { locale: es })}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{apuesta.evento}</td>
                    <td className="px-4 py-3 text-gray-300">{obtenerNombreCasa(apuesta.casaId)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        apuesta.tipo === 'surebet' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {apuesta.tipo === 'surebet' ? 'Surebet' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{apuesta.seleccion}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{apuesta.cuota.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-300">${apuesta.monto.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getResultadoBadgeClass(apuesta.resultado)}`}>
                        {apuesta.resultado.charAt(0).toUpperCase() + apuesta.resultado.slice(1)}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${getColorClase(resultado)}`}>
                      {apuesta.resultado === 'pendiente' ? '-' : formatearMoneda(resultado)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditar(apuesta)}
                          className="p-2 hover:bg-slate-700 rounded transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleEliminar(apuesta.id, apuesta.evento)}
                          className="p-2 hover:bg-slate-700 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="card bg-slate-700">
        <p className="text-gray-300">
          Mostrando <span className="font-bold text-white">{apuestasFiltradas.length}</span> de{' '}
          <span className="font-bold text-white">{apuestas.length}</span> apuestas
        </p>
      </div>
    </div>
  );
}

