import React, { useState } from 'react';
import { useApp } from '../context/AppContextDB';
import { Pencil, Trash2, Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatearMoneda, getColorClase } from '../utils/calculations';
import { getSimboloMoneda } from '../utils/currency';
import FormularioCasa from './FormularioCasa';
import GestionFinanciera from './GestionFinanciera';
import { Moneda } from '../types';

export default function CasasApuestas() {
  const { casas, eliminarCasa, obtenerEstadisticasCasa } = useApp();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [casaEditar, setCasaEditar] = useState<{ id: string; nombre: string; moneda: Moneda } | null>(null);
  const [casaGestionFinanciera, setCasaGestionFinanciera] = useState<string | null>(null);

  const handleEditar = (id: string, nombre: string, moneda: Moneda) => {
    setCasaEditar({ id, nombre, moneda });
    setMostrarFormulario(true);
  };

  const handleEliminar = (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la casa "${nombre}"? Se eliminarán todos sus datos asociados.`)) {
      eliminarCasa(id);
    }
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setCasaEditar(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Casas de Apuestas</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Casa
        </button>
      </div>

      {mostrarFormulario && (
        <FormularioCasa
          casaEditar={casaEditar}
          onCerrar={handleCerrarFormulario}
        />
      )}

      {casaGestionFinanciera && (
        <GestionFinanciera
          casaId={casaGestionFinanciera}
          onCerrar={() => setCasaGestionFinanciera(null)}
        />
      )}

      {casas.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">No hay casas de apuestas registradas</p>
          <p className="text-gray-500 mt-2">Comienza agregando tu primera casa de apuestas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {casas.map(casa => {
            const stats = obtenerEstadisticasCasa(casa.id);
            if (!stats) return null;

            return (
              <div key={casa.id} className="card hover:border-blue-500 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{casa.nombre}</h3>
                    <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                      casa.moneda === 'PEN' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {casa.moneda === 'PEN' ? '🇵🇪 Soles' : '🇺🇸 Dólares'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(casa.id, casa.nombre, casa.moneda)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil size={18} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleEliminar(casa.id, casa.nombre)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign size={20} className="text-blue-400" />
                      <span className="text-gray-300">Saldo Actual</span>
                    </div>
                    <span className={`font-bold text-lg ${getColorClase(stats.saldoActual)}`}>
                      {getSimboloMoneda(casa.moneda)} {stats.saldoActual.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      {stats.beneficioNeto >= 0 ? (
                        <TrendingUp size={20} className="text-green-400" />
                      ) : (
                        <TrendingDown size={20} className="text-red-400" />
                      )}
                      <span className="text-gray-300">Beneficio Neto</span>
                    </div>
                    <span className={`font-bold ${getColorClase(stats.beneficioNeto)}`}>
                      {formatearMoneda(stats.beneficioNeto)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-slate-700 rounded">
                      <p className="text-gray-400">Depositado</p>
                      <p className="font-semibold text-blue-300">
                        {getSimboloMoneda(casa.moneda)} {stats.totalDepositado.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-2 bg-slate-700 rounded">
                      <p className="text-gray-400">Retirado</p>
                      <p className="font-semibold text-orange-300">
                        {getSimboloMoneda(casa.moneda)} {stats.totalRetirado.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCasaGestionFinanciera(casa.id)}
                    className="w-full btn-secondary text-sm py-2"
                  >
                    Gestionar Depósitos/Retiros
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

