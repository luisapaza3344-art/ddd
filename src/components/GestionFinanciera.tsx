import React, { useState } from 'react';
import { useApp } from '../context/AppContextDB';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

interface Props {
  casaId: string;
  onCerrar: () => void;
}

export default function GestionFinanciera({ casaId, onCerrar }: Props) {
  const { casas, depositos, retiros, agregarDeposito, agregarRetiro, eliminarDeposito, eliminarRetiro } = useApp();
  const [tipoOperacion, setTipoOperacion] = useState<'deposito' | 'retiro'>('deposito');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const casa = casas.find(c => c.id === casaId);
  if (!casa) return null;

  const depositosCasa = depositos.filter(d => d.casaId === casaId).sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
  const retirosCasa = retiros.filter(r => r.casaId === casaId).sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    if (tipoOperacion === 'deposito') {
      agregarDeposito(casaId, montoNum, fecha);
    } else {
      agregarRetiro(casaId, montoNum, fecha);
    }

    setMonto('');
    setFecha(new Date().toISOString().split('T')[0]);
  };

  const handleEliminarDeposito = (id: string) => {
    if (window.confirm('¿Eliminar este depósito?')) {
      eliminarDeposito(id);
    }
  };

  const handleEliminarRetiro = (id: string) => {
    if (window.confirm('¿Eliminar este retiro?')) {
      eliminarRetiro(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="card max-w-4xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Gestión Financiera - {casa.nombre}
          </h2>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Formulario para nueva operación */}
        <form onSubmit={handleSubmit} className="card bg-slate-700 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Nueva Operación</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Tipo de Operación</label>
              <select
                value={tipoOperacion}
                onChange={(e) => setTipoOperacion(e.target.value as 'deposito' | 'retiro')}
                className="input-field"
              >
                <option value="deposito">Depósito</option>
                <option value="retiro">Retiro</option>
              </select>
            </div>

            <div>
              <label className="label">Monto</label>
              <input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="label">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary mt-4 w-full md:w-auto">
            {tipoOperacion === 'deposito' ? (
              <span className="flex items-center gap-2">
                <Plus size={20} />
                Agregar Depósito
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Minus size={20} />
                Agregar Retiro
              </span>
            )}
          </button>
        </form>

        {/* Historial de operaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Depósitos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Plus size={20} className="text-green-400" />
              Depósitos
            </h3>
            
            {depositosCasa.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay depósitos registrados</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {depositosCasa.map(deposito => (
                  <div key={deposito.id} className="bg-slate-700 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-green-400 font-semibold">+${deposito.monto.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">
                        {format(new Date(deposito.fecha), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEliminarDeposito(deposito.id)}
                      className="p-2 hover:bg-slate-600 rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Retiros */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Minus size={20} className="text-red-400" />
              Retiros
            </h3>
            
            {retirosCasa.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay retiros registrados</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {retirosCasa.map(retiro => (
                  <div key={retiro.id} className="bg-slate-700 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-red-400 font-semibold">-${retiro.monto.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">
                        {format(new Date(retiro.fecha), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEliminarRetiro(retiro.id)}
                      className="p-2 hover:bg-slate-600 rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
