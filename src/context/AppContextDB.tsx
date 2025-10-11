import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CasaApuestas,
  Deposito,
  Retiro,
  Apuesta,
  EstadisticasCasa,
  Moneda,
} from '../types';
import { calcularResultadoApuesta } from '../utils/calculations';
import { TipoCambio, obtenerTipoCambio, convertirMoneda } from '../utils/currency';
import * as DB from '../utils/database';

interface AppContextType {
  // Estado
  casas: CasaApuestas[];
  depositos: Deposito[];
  retiros: Retiro[];
  apuestas: Apuesta[];
  dbLista: boolean;
  tipoCambio: TipoCambio | null;
  
  // Casas de apuestas
  agregarCasa: (nombre: string, moneda: Moneda) => void;
  editarCasa: (id: string, nombre: string, moneda: Moneda) => void;
  eliminarCasa: (id: string) => void;
  
  // Depósitos
  agregarDeposito: (casaId: string, monto: number, fecha: string) => void;
  eliminarDeposito: (id: string) => void;
  
  // Retiros
  agregarRetiro: (casaId: string, monto: number, fecha: string) => void;
  eliminarRetiro: (id: string) => void;
  
  // Apuestas
  agregarApuesta: (apuesta: Omit<Apuesta, 'id'>) => void;
  editarApuesta: (id: string, apuesta: Partial<Apuesta>) => void;
  eliminarApuesta: (id: string) => void;
  
  // Cálculos
  obtenerEstadisticasCasa: (casaId: string) => EstadisticasCasa | null;
  obtenerEstadisticasTotales: () => {
    balanceTotal: number;
    beneficioTotal: number;
    totalDepositado: number;
    totalRetirado: number;
  };
  obtenerEstadisticasTodasCasas: () => EstadisticasCasa[];
  
  // Base de datos
  recargarDatos: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [casas, setCasas] = useState<CasaApuestas[]>([]);
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [retiros, setRetiros] = useState<Retiro[]>([]);
  const [apuestas, setApuestas] = useState<Apuesta[]>([]);
  const [dbLista, setDbLista] = useState(false);
  const [tipoCambio, setTipoCambio] = useState<TipoCambio | null>(null);

  // Inicializar base de datos y tipo de cambio
  useEffect(() => {
    async function init() {
      try {
        await DB.inicializarDB();
        recargarDatos();
        setDbLista(true);
        
        // Obtener tipo de cambio
        const tc = await obtenerTipoCambio();
        setTipoCambio(tc);
      } catch (error) {
        console.error('Error inicializando DB:', error);
      }
    }
    init();
  }, []);

  // Recargar todos los datos desde la BD
  const recargarDatos = () => {
    setCasas(DB.obtenerCasas());
    setDepositos(DB.obtenerDepositos());
    setRetiros(DB.obtenerRetiros());
    setApuestas(DB.obtenerApuestas());
  };

  // Casas de apuestas
  const agregarCasa = (nombre: string, moneda: Moneda) => {
    DB.agregarCasa(nombre, moneda);
    recargarDatos();
  };

  const editarCasa = (id: string, nombre: string, moneda: Moneda) => {
    DB.editarCasa(id, nombre, moneda);
    recargarDatos();
  };

  const eliminarCasa = (id: string) => {
    DB.eliminarCasa(id);
    recargarDatos();
  };

  // Depósitos
  const agregarDeposito = (casaId: string, monto: number, fecha: string) => {
    // NO guardamos TC para depósitos - siempre usan el TC actual
    DB.agregarDeposito(casaId, monto, fecha);
    recargarDatos();
  };

  const eliminarDeposito = (id: string) => {
    DB.eliminarDeposito(id);
    recargarDatos();
  };

  // Retiros
  const agregarRetiro = (casaId: string, monto: number, fecha: string) => {
    // NO guardamos TC para retiros - siempre usan el TC actual
    DB.agregarRetiro(casaId, monto, fecha);
    recargarDatos();
  };

  const eliminarRetiro = (id: string) => {
    DB.eliminarRetiro(id);
    recargarDatos();
  };

  // Apuestas
  const agregarApuesta = (apuesta: Omit<Apuesta, 'id'>) => {
    const casa = casas.find(c => c.id === apuesta.casaId);
    
    // Si la apuesta ya se está creando como resuelta (no pendiente) y la casa es USD, guardar tipo de cambio
    const tipoCambioUSD = (casa?.moneda === 'USD' && apuesta.resultado !== 'pendiente' && tipoCambio) 
      ? tipoCambio.USD_PEN 
      : undefined;
    
    const fechaResolucion = apuesta.resultado !== 'pendiente' 
      ? new Date().toISOString() 
      : undefined;
    
    DB.agregarApuesta({
      ...apuesta,
      tipoCambioUSD,
      fechaResolucion,
    });
    recargarDatos();
  };

  const editarApuesta = (id: string, apuestaActualizada: Partial<Apuesta>) => {
    // Obtener la apuesta actual
    const apuestaActual = apuestas.find(a => a.id === id);
    if (!apuestaActual) {
      DB.editarApuesta(id, apuestaActualizada);
      recargarDatos();
      return;
    }
    
    const casa = casas.find(c => c.id === apuestaActual.casaId);
    
    // Si el resultado está cambiando de "pendiente" a otro estado, guardar el tipo de cambio
    if (apuestaActual.resultado === 'pendiente' && 
        apuestaActualizada.resultado && 
        apuestaActualizada.resultado !== 'pendiente' &&
        casa?.moneda === 'USD' &&
        tipoCambio) {
      
      DB.editarApuesta(id, {
        ...apuestaActualizada,
        tipoCambioUSD: tipoCambio.USD_PEN,
        fechaResolucion: new Date().toISOString(),
      });
    } else {
      DB.editarApuesta(id, apuestaActualizada);
    }
    
    recargarDatos();
  };

  const eliminarApuesta = (id: string) => {
    DB.eliminarApuesta(id);
    recargarDatos();
  };

  // Cálculos (igual que antes)
  const obtenerEstadisticasCasa = (casaId: string): EstadisticasCasa | null => {
    const casa = casas.find(c => c.id === casaId);
    if (!casa) return null;

    const depositosCasa = depositos.filter(d => d.casaId === casaId);
    const retirosCasa = retiros.filter(r => r.casaId === casaId);
    const apuestasCasa = apuestas.filter(a => a.casaId === casaId);

    const totalDepositado = depositosCasa.reduce((sum, d) => sum + d.monto, 0);
    const totalRetirado = retirosCasa.reduce((sum, r) => sum + r.monto, 0);

    const beneficioNeto = apuestasCasa.reduce((sum, apuesta) => {
      return sum + calcularResultadoApuesta(apuesta.monto, apuesta.cuota, apuesta.resultado);
    }, 0);

    const saldoActual = totalDepositado - totalRetirado + beneficioNeto;

    return {
      casa,
      saldoActual,
      beneficioNeto,
      totalDepositado,
      totalRetirado,
    };
  };

  const obtenerEstadisticasTotales = () => {
    const totalDepositado = depositos.reduce((sum, d) => sum + d.monto, 0);
    const totalRetirado = retiros.reduce((sum, r) => sum + r.monto, 0);

    const beneficioTotal = apuestas.reduce((sum, apuesta) => {
      return sum + calcularResultadoApuesta(apuesta.monto, apuesta.cuota, apuesta.resultado);
    }, 0);

    const balanceTotal = totalDepositado - totalRetirado + beneficioTotal;

    return {
      balanceTotal,
      beneficioTotal,
      totalDepositado,
      totalRetirado,
    };
  };

  const obtenerEstadisticasTodasCasas = (): EstadisticasCasa[] => {
    return casas
      .map((casa: CasaApuestas) => obtenerEstadisticasCasa(casa.id))
      .filter((stats): stats is EstadisticasCasa => stats !== null);
  };

  const value: AppContextType = {
    casas,
    depositos,
    retiros,
    apuestas,
    dbLista,
    tipoCambio,
    agregarCasa,
    editarCasa,
    eliminarCasa,
    agregarDeposito,
    eliminarDeposito,
    agregarRetiro,
    eliminarRetiro,
    agregarApuesta,
    editarApuesta,
    eliminarApuesta,
    obtenerEstadisticasCasa,
    obtenerEstadisticasTotales,
    obtenerEstadisticasTodasCasas,
    recargarDatos,
  };

  if (!dbLista) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Inicializando base de datos...</p>
        </div>
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
}

