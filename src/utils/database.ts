// Base de datos SQLite portable usando sql.js

import initSqlJs, { Database } from 'sql.js';
import { CasaApuestas, Deposito, Retiro, Apuesta } from '../types';
import { guardarDBEnServidor, cargarDBDesdeServidor, verificarServidor } from './apiDatabase';

let db: Database | null = null;
let SQL: any = null;
let servidorDisponible = false;

// Inicializar SQL.js
export async function inicializarDB(): Promise<void> {
  if (SQL) return; // Ya inicializado
  
  try {
    SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`
    });
    
    // Verificar si el servidor está disponible
    servidorDisponible = await verificarServidor();
    
    if (servidorDisponible) {
      console.log('🌐 Servidor backend detectado, usando sincronización automática');
    } else {
      console.log('💾 Servidor no disponible, usando almacenamiento local');
    }
    
    let dbData: Uint8Array | null = null;
    
    // Intentar cargar desde servidor primero si está disponible
    if (servidorDisponible) {
      dbData = await cargarDBDesdeServidor();
      if (dbData) {
        console.log('✅ Base de datos cargada desde servidor');
      }
    }
    
    // Si no hay datos del servidor, intentar desde storage local
    if (!dbData) {
      dbData = cargarDBDeStorage();
      if (dbData) {
        console.log('✅ Base de datos cargada desde storage local');
      }
    }
    
    if (dbData) {
      db = new SQL.Database(dbData);
    } else {
      db = new SQL.Database();
      crearTablas();
      console.log('✅ Nueva base de datos creada');
    }
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    throw error;
  }
}

// Crear las tablas si no existen
function crearTablas(): void {
  if (!db) return;

  db.run(`
    CREATE TABLE IF NOT EXISTS casas (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      moneda TEXT DEFAULT 'PEN'
    )
  `);
  
  // Migración: agregar columna moneda si no existe
  try {
    db.run(`ALTER TABLE casas ADD COLUMN moneda TEXT DEFAULT 'PEN'`);
  } catch (e) {
    // La columna ya existe, ignorar error
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS depositos (
      id TEXT PRIMARY KEY,
      casaId TEXT NOT NULL,
      monto REAL NOT NULL,
      fecha TEXT NOT NULL,
      tipoCambioUSD REAL,
      FOREIGN KEY (casaId) REFERENCES casas(id)
    )
  `);
  
  // Migración: agregar columna tipoCambioUSD si no existe
  try {
    db.run(`ALTER TABLE depositos ADD COLUMN tipoCambioUSD REAL`);
  } catch (e) {
    // La columna ya existe, ignorar error
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS retiros (
      id TEXT PRIMARY KEY,
      casaId TEXT NOT NULL,
      monto REAL NOT NULL,
      fecha TEXT NOT NULL,
      tipoCambioUSD REAL,
      FOREIGN KEY (casaId) REFERENCES casas(id)
    )
  `);
  
  // Migración: agregar columna tipoCambioUSD si no existe
  try {
    db.run(`ALTER TABLE retiros ADD COLUMN tipoCambioUSD REAL`);
  } catch (e) {
    // La columna ya existe, ignorar error
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS apuestas (
      id TEXT PRIMARY KEY,
      casaId TEXT NOT NULL,
      tipo TEXT NOT NULL,
      evento TEXT NOT NULL,
      fecha TEXT NOT NULL,
      seleccion TEXT NOT NULL,
      cuota REAL NOT NULL,
      monto REAL NOT NULL,
      resultado TEXT NOT NULL,
      tipoCambioUSD REAL,
      fechaResolucion TEXT,
      FOREIGN KEY (casaId) REFERENCES casas(id)
    )
  `);
  
  // Migración: agregar columnas si no existen
  try {
    db.run(`ALTER TABLE apuestas ADD COLUMN tipoCambioUSD REAL`);
  } catch (e) {
    // La columna ya existe, ignorar error
  }
  
  try {
    db.run(`ALTER TABLE apuestas ADD COLUMN fechaResolucion TEXT`);
  } catch (e) {
    // La columna ya existe, ignorar error
  }

  guardarDBEnStorage();
}

// Guardar DB en storage (sessionStorage para incógnito, localStorage para normal)
function guardarDBEnStorage(): void {
  if (!db) return;
  
  try {
    const data = db.export();
    const buffer = Array.from(data);
    const jsonString = JSON.stringify(buffer);
    
    // Intentar localStorage primero, luego sessionStorage
    try {
      localStorage.setItem('apuestas_db', jsonString);
    } catch {
      sessionStorage.setItem('apuestas_db', jsonString);
    }
    
    // Si el servidor está disponible, guardar también ahí (async, no bloqueante)
    if (servidorDisponible) {
      guardarDBEnServidor(data).catch(err => {
        console.warn('No se pudo guardar en servidor (continuando con storage local):', err);
      });
    }
  } catch (error) {
    console.error('Error guardando DB en storage:', error);
  }
}

// Cargar DB desde storage
function cargarDBDeStorage(): Uint8Array | null {
  try {
    let jsonString = localStorage.getItem('apuestas_db');
    if (!jsonString) {
      jsonString = sessionStorage.getItem('apuestas_db');
    }
    
    if (jsonString) {
      const buffer = JSON.parse(jsonString);
      return new Uint8Array(buffer);
    }
  } catch (error) {
    console.error('Error cargando DB desde storage:', error);
  }
  
  return null;
}

// Exportar base de datos a archivo .db
export function exportarDatabase(): void {
  if (!db) return;
  
  try {
    const data = db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `apuestas-${new Date().toISOString().split('T')[0]}.db`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Base de datos exportada');
  } catch (error) {
    console.error('Error exportando base de datos:', error);
    throw error;
  }
}

// Importar base de datos desde archivo .db
export async function importarDatabase(file: File): Promise<void> {
  if (!SQL) {
    throw new Error('Base de datos no inicializada');
  }
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Cerrar DB actual si existe
    if (db) {
      db.close();
    }
    
    // Crear nueva DB con los datos importados
    db = new SQL.Database(uint8Array);
    guardarDBEnStorage();
    
    console.log('✅ Base de datos importada correctamente');
  } catch (error) {
    console.error('Error importando base de datos:', error);
    throw error;
  }
}

// CASAS DE APUESTAS
export function obtenerCasas(): CasaApuestas[] {
  if (!db) return [];
  
  const result = db.exec('SELECT * FROM casas ORDER BY nombre');
  if (result.length === 0) return [];
  
  return result[0].values.map(row => ({
    id: row[0] as string,
    nombre: row[1] as string,
    moneda: (row[2] as string || 'PEN') as 'PEN' | 'USD',
  }));
}

export function agregarCasa(nombre: string, moneda: 'PEN' | 'USD' = 'PEN'): void {
  if (!db) return;
  
  const id = Date.now().toString();
  db.run('INSERT INTO casas (id, nombre, moneda) VALUES (?, ?, ?)', [id, nombre, moneda]);
  guardarDBEnStorage();
}

export function editarCasa(id: string, nombre: string, moneda?: 'PEN' | 'USD'): void {
  if (!db) return;
  
  if (moneda) {
    db.run('UPDATE casas SET nombre = ?, moneda = ? WHERE id = ?', [nombre, moneda, id]);
  } else {
    db.run('UPDATE casas SET nombre = ? WHERE id = ?', [nombre, id]);
  }
  guardarDBEnStorage();
}

export function eliminarCasa(id: string): void {
  if (!db) return;
  
  db.run('DELETE FROM casas WHERE id = ?', [id]);
  db.run('DELETE FROM depositos WHERE casaId = ?', [id]);
  db.run('DELETE FROM retiros WHERE casaId = ?', [id]);
  db.run('DELETE FROM apuestas WHERE casaId = ?', [id]);
  guardarDBEnStorage();
}

// DEPÓSITOS
export function obtenerDepositos(): Deposito[] {
  if (!db) return [];
  
  const result = db.exec('SELECT * FROM depositos ORDER BY fecha DESC');
  if (result.length === 0) return [];
  
  return result[0].values.map(row => ({
    id: row[0] as string,
    casaId: row[1] as string,
    monto: row[2] as number,
    fecha: row[3] as string,
    tipoCambioUSD: row[4] ? (row[4] as number) : undefined,
  }));
}

export function agregarDeposito(casaId: string, monto: number, fecha: string, tipoCambioUSD?: number): void {
  if (!db) return;
  
  const id = Date.now().toString();
  db.run('INSERT INTO depositos (id, casaId, monto, fecha, tipoCambioUSD) VALUES (?, ?, ?, ?, ?)', 
    [id, casaId, monto, fecha, tipoCambioUSD || null]);
  guardarDBEnStorage();
}

export function eliminarDeposito(id: string): void {
  if (!db) return;
  
  db.run('DELETE FROM depositos WHERE id = ?', [id]);
  guardarDBEnStorage();
}

// RETIROS
export function obtenerRetiros(): Retiro[] {
  if (!db) return [];
  
  const result = db.exec('SELECT * FROM retiros ORDER BY fecha DESC');
  if (result.length === 0) return [];
  
  return result[0].values.map(row => ({
    id: row[0] as string,
    casaId: row[1] as string,
    monto: row[2] as number,
    fecha: row[3] as string,
    tipoCambioUSD: row[4] ? (row[4] as number) : undefined,
  }));
}

export function agregarRetiro(casaId: string, monto: number, fecha: string, tipoCambioUSD?: number): void {
  if (!db) return;
  
  const id = Date.now().toString();
  db.run('INSERT INTO retiros (id, casaId, monto, fecha, tipoCambioUSD) VALUES (?, ?, ?, ?, ?)', 
    [id, casaId, monto, fecha, tipoCambioUSD || null]);
  guardarDBEnStorage();
}

export function eliminarRetiro(id: string): void {
  if (!db) return;
  
  db.run('DELETE FROM retiros WHERE id = ?', [id]);
  guardarDBEnStorage();
}

// APUESTAS
export function obtenerApuestas(): Apuesta[] {
  if (!db) return [];
  
  const result = db.exec('SELECT * FROM apuestas ORDER BY fecha DESC');
  if (result.length === 0) return [];
  
  return result[0].values.map(row => ({
    id: row[0] as string,
    casaId: row[1] as string,
    tipo: row[2] as 'normal' | 'surebet',
    evento: row[3] as string,
    fecha: row[4] as string,
    seleccion: row[5] as string,
    cuota: row[6] as number,
    monto: row[7] as number,
    resultado: row[8] as any,
    tipoCambioUSD: row[9] ? (row[9] as number) : undefined,
    fechaResolucion: row[10] ? (row[10] as string) : undefined,
  }));
}

export function agregarApuesta(apuesta: Omit<Apuesta, 'id'>): void {
  if (!db) return;
  
  const id = Date.now().toString();
  db.run(
    'INSERT INTO apuestas (id, casaId, tipo, evento, fecha, seleccion, cuota, monto, resultado, tipoCambioUSD, fechaResolucion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, apuesta.casaId, apuesta.tipo, apuesta.evento, apuesta.fecha, apuesta.seleccion, apuesta.cuota, apuesta.monto, apuesta.resultado, apuesta.tipoCambioUSD || null, apuesta.fechaResolucion || null]
  );
  guardarDBEnStorage();
}

export function editarApuesta(id: string, apuesta: Partial<Apuesta>): void {
  if (!db) return;
  
  const campos: string[] = [];
  const valores: any[] = [];
  
  if (apuesta.casaId !== undefined) { campos.push('casaId = ?'); valores.push(apuesta.casaId); }
  if (apuesta.tipo !== undefined) { campos.push('tipo = ?'); valores.push(apuesta.tipo); }
  if (apuesta.evento !== undefined) { campos.push('evento = ?'); valores.push(apuesta.evento); }
  if (apuesta.fecha !== undefined) { campos.push('fecha = ?'); valores.push(apuesta.fecha); }
  if (apuesta.seleccion !== undefined) { campos.push('seleccion = ?'); valores.push(apuesta.seleccion); }
  if (apuesta.cuota !== undefined) { campos.push('cuota = ?'); valores.push(apuesta.cuota); }
  if (apuesta.monto !== undefined) { campos.push('monto = ?'); valores.push(apuesta.monto); }
  if (apuesta.resultado !== undefined) { campos.push('resultado = ?'); valores.push(apuesta.resultado); }
  if (apuesta.tipoCambioUSD !== undefined) { campos.push('tipoCambioUSD = ?'); valores.push(apuesta.tipoCambioUSD); }
  if (apuesta.fechaResolucion !== undefined) { campos.push('fechaResolucion = ?'); valores.push(apuesta.fechaResolucion); }
  
  if (campos.length === 0) return;
  
  valores.push(id);
  db.run(`UPDATE apuestas SET ${campos.join(', ')} WHERE id = ?`, valores);
  guardarDBEnStorage();
}

export function eliminarApuesta(id: string): void {
  if (!db) return;
  
  db.run('DELETE FROM apuestas WHERE id = ?', [id]);
  guardarDBEnStorage();
}

