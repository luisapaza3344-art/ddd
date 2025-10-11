import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContextDB';
import { X, DollarSign } from 'lucide-react';
import { Moneda } from '../types';

interface Props {
  casaEditar: { id: string; nombre: string; moneda: Moneda } | null;
  onCerrar: () => void;
}

export default function FormularioCasa({ casaEditar, onCerrar }: Props) {
  const { agregarCasa, editarCasa } = useApp();
  const [nombre, setNombre] = useState('');
  const [moneda, setMoneda] = useState<Moneda>('PEN');

  useEffect(() => {
    if (casaEditar) {
      setNombre(casaEditar.nombre);
      setMoneda(casaEditar.moneda);
    }
  }, [casaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      alert('Por favor ingresa un nombre para la casa de apuestas');
      return;
    }

    if (casaEditar) {
      editarCasa(casaEditar.id, nombre.trim(), moneda);
    } else {
      agregarCasa(nombre.trim(), moneda);
    }

    setNombre('');
    onCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {casaEditar ? 'Editar Casa de Apuestas' : 'Nueva Casa de Apuestas'}
          </h2>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nombre de la Casa</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-field"
              placeholder="Ej: Bet365, Codere, etc."
              autoFocus
            />
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <DollarSign size={18} className="text-gray-400" />
              Moneda de la Casa
            </label>
            <select
              value={moneda}
              onChange={(e) => setMoneda(e.target.value as Moneda)}
              className="input-field"
            >
              <option value="PEN">🇵🇪 Soles Peruanos (S/)</option>
              <option value="USD">🇺🇸 Dólares Americanos ($)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Esta es la moneda en la que depositarás y apostarás en esta casa
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {casaEditar ? 'Guardar Cambios' : 'Crear Casa'}
            </button>
            <button type="button" onClick={onCerrar} className="btn-secondary flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

