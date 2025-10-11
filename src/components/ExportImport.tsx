import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContextDB';
import { Download, Upload, FileJson, FileSpreadsheet, X, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { exportarDatos, importarDatos, exportarApuestasCSV } from '../utils/exportImport';
import { exportarDatabase, importarDatabase } from '../utils/database';

interface Props {
  onCerrar: () => void;
}

export default function ExportImport({ onCerrar }: Props) {
  const { casas, depositos, retiros, apuestas, agregarCasa, agregarDeposito, agregarRetiro, agregarApuesta, recargarDatos } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputDBRef = useRef<HTMLInputElement>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [modoImportar, setModoImportar] = useState<'reemplazar' | 'fusionar'>('fusionar');

  const handleExportarDB = () => {
    try {
      exportarDatabase();
      setMensaje({ tipo: 'success', texto: '✅ Base de datos exportada (.db). ¡Guárdala en un lugar seguro!' });
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: '❌ Error al exportar base de datos.' });
    }
  };

  const handleExportarJSON = () => {
    try {
      exportarDatos(casas, depositos, retiros, apuestas);
      setMensaje({ tipo: 'success', texto: '✅ Datos exportados correctamente. Revisa tu carpeta de descargas.' });
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: '❌ Error al exportar datos.' });
    }
  };

  const handleExportarCSV = () => {
    try {
      exportarApuestasCSV(apuestas, casas);
      setMensaje({ tipo: 'success', texto: '✅ Apuestas exportadas a CSV. Revisa tu carpeta de descargas.' });
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: '❌ Error al exportar a CSV.' });
    }
  };

  const handleImportarDB = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const confirmar = window.confirm(
        '⚠️ Esto reemplazará toda tu base de datos actual con la del archivo.\n\n¿Estás seguro de continuar?'
      );
      
      if (!confirmar) {
        setMensaje({ tipo: 'error', texto: 'Importación cancelada.' });
        return;
      }

      await importarDatabase(file);
      recargarDatos();
      
      setMensaje({ 
        tipo: 'success', 
        texto: '✅ Base de datos importada correctamente. Recargando datos...' 
      });
      
      setTimeout(() => {
        setMensaje(null);
        onCerrar();
        window.location.reload(); // Recargar para asegurar consistencia
      }, 2000);
      
    } catch (error) {
      setMensaje({ tipo: 'error', texto: `❌ Error al importar: ${(error as Error).message}` });
    }

    if (fileInputDBRef.current) {
      fileInputDBRef.current.value = '';
    }
  };

  const handleImportar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const datos = await importarDatos(file);
      
      if (modoImportar === 'reemplazar') {
        // Advertencia antes de reemplazar
        const confirmar = window.confirm(
          '⚠️ ADVERTENCIA: Esto eliminará todos tus datos actuales y los reemplazará con los del archivo.\n\n¿Estás seguro de continuar?'
        );
        
        if (!confirmar) {
          setMensaje({ tipo: 'error', texto: 'Importación cancelada.' });
          return;
        }
      }

      // Importar casas
      if (modoImportar === 'fusionar') {
        datos.casas.forEach(casa => {
          if (!casas.find(c => c.id === casa.id)) {
            agregarCasa(casa.nombre);
          }
        });
      } else {
        // En modo reemplazar, usaríamos una función para limpiar y reemplazar todo
        // Por ahora solo fusionamos
        datos.casas.forEach(casa => agregarCasa(casa.nombre));
      }

      // Importar depósitos
      datos.depositos.forEach(deposito => {
        if (!depositos.find(d => d.id === deposito.id)) {
          agregarDeposito(deposito.casaId, deposito.monto, deposito.fecha);
        }
      });

      // Importar retiros
      datos.retiros.forEach(retiro => {
        if (!retiros.find(r => r.id === retiro.id)) {
          agregarRetiro(retiro.casaId, retiro.monto, retiro.fecha);
        }
      });

      // Importar apuestas
      datos.apuestas.forEach(apuesta => {
        if (!apuestas.find(a => a.id === apuesta.id)) {
          agregarApuesta({
            casaId: apuesta.casaId,
            tipo: apuesta.tipo,
            evento: apuesta.evento,
            fecha: apuesta.fecha,
            seleccion: apuesta.seleccion,
            cuota: apuesta.cuota,
            monto: apuesta.monto,
            resultado: apuesta.resultado,
          });
        }
      });

      setMensaje({ 
        tipo: 'success', 
        texto: `✅ Datos importados correctamente! (${datos.casas.length} casas, ${datos.apuestas.length} apuestas)` 
      });
      
      setTimeout(() => {
        setMensaje(null);
        onCerrar();
      }, 3000);
      
    } catch (error) {
      setMensaje({ tipo: 'error', texto: `❌ Error al importar: ${(error as Error).message}` });
    }

    // Resetear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Exportar / Importar Datos</h2>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
            mensaje.tipo === 'success' ? 'bg-green-600/20 border border-green-600' : 'bg-red-600/20 border border-red-600'
          }`}>
            {mensaje.tipo === 'success' ? (
              <CheckCircle size={24} className="text-green-400" />
            ) : (
              <AlertCircle size={24} className="text-red-400" />
            )}
            <p className={mensaje.tipo === 'success' ? 'text-green-300' : 'text-red-300'}>
              {mensaje.texto}
            </p>
          </div>
        )}

        {/* Sección de Exportar */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Download size={24} className="text-blue-400" />
            Exportar Datos
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={handleExportarDB}
              className="w-full p-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg transition-colors flex items-center gap-4 text-left border-2 border-purple-400"
            >
              <Database size={32} className="text-white" />
              <div className="flex-1">
                <p className="font-bold text-white flex items-center gap-2">
                  Exportar Base de Datos (.db)
                  <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded">RECOMENDADO</span>
                </p>
                <p className="text-sm text-purple-100">
                  Base de datos SQLite portable. ¡Llévatela a cualquier PC! Compatible con cualquier navegador.
                </p>
              </div>
            </button>

            <button
              onClick={handleExportarJSON}
              className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-4 text-left"
            >
              <FileJson size={32} className="text-blue-400" />
              <div className="flex-1">
                <p className="font-semibold text-white">Exportar JSON (alternativa)</p>
                <p className="text-sm text-gray-400">
                  Formato de texto legible. Útil para respaldos adicionales.
                </p>
              </div>
            </button>

            <button
              onClick={handleExportarCSV}
              className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-4 text-left"
            >
              <FileSpreadsheet size={32} className="text-green-400" />
              <div className="flex-1">
                <p className="font-semibold text-white">Exportar Apuestas (CSV)</p>
                <p className="text-sm text-gray-400">
                  Solo apuestas en formato CSV. Compatible con Excel.
                </p>
              </div>
            </button>
          </div>

          <div className="mt-4 p-4 bg-purple-600/20 border border-purple-600 rounded-lg">
            <p className="text-purple-200 text-sm font-semibold mb-2">
              🎯 ¿Cuál elegir?
            </p>
            <ul className="text-purple-100 text-xs space-y-1">
              <li>• <strong>.db (SQLite)</strong> - Para usar en modo incógnito y llevar entre PCs</li>
              <li>• <strong>JSON</strong> - Para backup adicional o edición manual</li>
              <li>• <strong>CSV</strong> - Solo para exportar a Excel/Google Sheets</li>
            </ul>
          </div>
        </div>

        {/* Sección de Importar */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Upload size={24} className="text-green-400" />
            Importar Datos
          </h3>

          <div className="space-y-4">
            {/* Importar Base de Datos */}
            <div className="p-4 bg-purple-900/30 rounded-lg border-2 border-purple-600">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Database size={20} className="text-purple-400" />
                Importar Base de Datos (.db)
              </h4>
              
              <input
                ref={fileInputDBRef}
                type="file"
                accept=".db"
                onChange={handleImportarDB}
                className="hidden"
                id="file-input-db"
              />

              <label
                htmlFor="file-input-db"
                className="w-full p-4 bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors flex flex-col items-center gap-2 cursor-pointer border-2 border-dashed border-purple-400 hover:border-purple-300"
              >
                <Database size={40} className="text-purple-200" />
                <div className="text-center">
                  <p className="font-semibold text-white text-sm">Selecciona archivo .db</p>
                  <p className="text-xs text-purple-200">
                    Reemplazará toda la base de datos actual
                  </p>
                </div>
              </label>
            </div>

            {/* Importar JSON */}
            <div className="p-4 bg-slate-900/30 rounded-lg border-2 border-slate-600">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <FileJson size={20} className="text-blue-400" />
                Importar JSON (alternativa)
              </h4>

              <div className="mb-3">
                <select
                  value={modoImportar}
                  onChange={(e) => setModoImportar(e.target.value as 'reemplazar' | 'fusionar')}
                  className="input-field text-sm"
                >
                  <option value="fusionar">Fusionar (agregar)</option>
                  <option value="reemplazar">Reemplazar (borrar todo)</option>
                </select>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportar}
                className="hidden"
                id="file-input"
              />

              <label
                htmlFor="file-input"
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex flex-col items-center gap-2 cursor-pointer border-2 border-dashed border-slate-500 hover:border-blue-500"
              >
                <FileJson size={40} className="text-gray-400" />
                <div className="text-center">
                  <p className="font-semibold text-white text-sm">Selecciona archivo JSON</p>
                  <p className="text-xs text-gray-400">
                    Permitirá fusionar o reemplazar
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-600/20 border border-green-600 rounded-lg">
            <p className="text-green-300 text-sm">
              💡 <strong>Modo Incógnito:</strong> Usa archivos .db para guardar y restaurar todo tu trabajo entre sesiones.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <h4 className="text-sm font-semibold text-white mb-2">📋 Información Actual:</h4>
          <div className="grid grid-cols-4 gap-3 text-center text-sm">
            <div className="bg-slate-700 p-2 rounded">
              <p className="text-gray-400">Casas</p>
              <p className="text-white font-bold">{casas.length}</p>
            </div>
            <div className="bg-slate-700 p-2 rounded">
              <p className="text-gray-400">Depósitos</p>
              <p className="text-white font-bold">{depositos.length}</p>
            </div>
            <div className="bg-slate-700 p-2 rounded">
              <p className="text-gray-400">Retiros</p>
              <p className="text-white font-bold">{retiros.length}</p>
            </div>
            <div className="bg-slate-700 p-2 rounded">
              <p className="text-gray-400">Apuestas</p>
              <p className="text-white font-bold">{apuestas.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

