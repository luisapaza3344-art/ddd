import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContextDB';
import { X } from 'lucide-react';
import { Apuesta, TipoApuesta, ResultadoApuesta } from '../types';

interface Props {
  apuestaEditar: Apuesta | null;
  onCerrar: () => void;
}

export default function FormularioApuesta({ apuestaEditar, onCerrar }: Props) {
  const { casas, agregarApuesta, editarApuesta } = useApp();
  
  const [casaId, setCasaId] = useState('');
  const [tipo, setTipo] = useState<TipoApuesta>('normal');
  const [evento, setEvento] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [seleccion, setSeleccion] = useState('');
  const [cuota, setCuota] = useState('');
  const [monto, setMonto] = useState('');
  const [resultado, setResultado] = useState<ResultadoApuesta>('pendiente');

  useEffect(() => {
    if (apuestaEditar) {
      setCasaId(apuestaEditar.casaId);
      setTipo(apuestaEditar.tipo);
      setEvento(apuestaEditar.evento);
      setFecha(apuestaEditar.fecha);
      setSeleccion(apuestaEditar.seleccion);
      setCuota(apuestaEditar.cuota.toString());
      setMonto(apuestaEditar.monto.toString());
      setResultado(apuestaEditar.resultado);
    } else if (casas.length > 0 && !casaId) {
      setCasaId(casas[0].id);
    }
  }, [apuestaEditar, casas, casaId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!casaId || !evento.trim() || !seleccion.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const cuotaNum = parseFloat(cuota);
    const montoNum = parseFloat(monto);

    if (isNaN(cuotaNum) || cuotaNum <= 0) {
      alert('Por favor ingresa una cuota válida');
      return;
    }

    if (isNaN(montoNum) || montoNum <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    const apuestaData = {
      casaId,
      tipo,
      evento: evento.trim(),
      fecha,
      seleccion: seleccion.trim(),
      cuota: cuotaNum,
      monto: montoNum,
      resultado,
    };

    if (apuestaEditar) {
      editarApuesta(apuestaEditar.id, apuestaData);
    } else {
      agregarApuesta(apuestaData);
    }

    onCerrar();
  };

  if (casas.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="card max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Error</h2>
            <button
              onClick={onCerrar}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
          <p className="text-gray-300 mb-4">
            Debes crear al menos una casa de apuestas antes de agregar apuestas.
          </p>
          <button onClick={onCerrar} className="btn-primary w-full">
            Entendido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="card max-w-3xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {apuestaEditar ? 'Editar Apuesta' : 'Nueva Apuesta'}
          </h2>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Casa de Apuestas *</label>
              <select
                value={casaId}
                onChange={(e) => setCasaId(e.target.value)}
                className="input-field"
                required
              >
                {casas.map(casa => (
                  <option key={casa.id} value={casa.id}>{casa.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Tipo de Apuesta</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoApuesta)}
                className="input-field"
              >
                <option value="normal">Normal</option>
                <option value="surebet">Surebet</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Evento *</label>
            <input
              type="text"
              value={evento}
              onChange={(e) => setEvento(e.target.value)}
              className="input-field"
              placeholder="Ej: Real Madrid vs Barcelona"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Fecha *</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Selección *</label>
              <input
                type="text"
                value={seleccion}
                onChange={(e) => setSeleccion(e.target.value)}
                className="input-field"
                placeholder="Ej: Real Madrid gana"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Cuota *</label>
              <input
                type="number"
                step="0.01"
                value={cuota}
                onChange={(e) => setCuota(e.target.value)}
                className="input-field"
                placeholder="1.50"
                required
              />
            </div>

            <div>
              <label className="label">Monto Apostado *</label>
              <input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="input-field"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="label">Resultado</label>
              <select
                value={resultado}
                onChange={(e) => setResultado(e.target.value as ResultadoApuesta)}
                className="input-field"
              >
                <option value="pendiente">Pendiente</option>
                <option value="ganada">Ganada</option>
                <option value="perdida">Perdida</option>
                <option value="devolución">Devolución</option>
                <option value="medio ganada">Medio Ganada</option>
                <option value="medio perdida">Medio Perdida</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {apuestaEditar ? 'Guardar Cambios' : 'Crear Apuesta'}
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

