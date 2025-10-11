import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Directorio donde se guardarán las bases de datos
const DB_DIR = path.join(__dirname, 'databases');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));

// Crear directorio de bases de datos si no existe
async function inicializarDirectorios() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    console.log('✅ Directorio de bases de datos listo');
  } catch (error) {
    console.error('Error creando directorio:', error);
  }
}

// Endpoint: Guardar base de datos
app.post('/api/db/save', async (req, res) => {
  try {
    const { userId, dbData } = req.body;
    
    if (!userId || !dbData) {
      return res.status(400).json({ error: 'userId y dbData son requeridos' });
    }

    // Convertir array de bytes a Buffer
    const buffer = Buffer.from(dbData);
    const filePath = path.join(DB_DIR, `${userId}.db`);
    
    await fs.writeFile(filePath, buffer);
    
    console.log(`💾 Base de datos guardada para usuario: ${userId}`);
    res.json({ success: true, mensaje: 'Base de datos guardada correctamente' });
    
  } catch (error) {
    console.error('Error guardando base de datos:', error);
    res.status(500).json({ error: 'Error guardando base de datos' });
  }
});

// Endpoint: Cargar base de datos
app.get('/api/db/load/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const filePath = path.join(DB_DIR, `${userId}.db`);
    
    // Verificar si existe
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Base de datos no encontrada' });
    }
    
    const buffer = await fs.readFile(filePath);
    const dbData = Array.from(buffer);
    
    console.log(`📂 Base de datos cargada para usuario: ${userId}`);
    res.json({ success: true, dbData });
    
  } catch (error) {
    console.error('Error cargando base de datos:', error);
    res.status(500).json({ error: 'Error cargando base de datos' });
  }
});

// Endpoint: Listar bases de datos
app.get('/api/db/list', async (req, res) => {
  try {
    const files = await fs.readdir(DB_DIR);
    const databases = files
      .filter(f => f.endsWith('.db'))
      .map(f => f.replace('.db', ''));
    
    res.json({ success: true, databases });
  } catch (error) {
    console.error('Error listando bases de datos:', error);
    res.status(500).json({ error: 'Error listando bases de datos' });
  }
});

// Endpoint: Eliminar base de datos
app.delete('/api/db/delete/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const filePath = path.join(DB_DIR, `${userId}.db`);
    
    await fs.unlink(filePath);
    
    console.log(`🗑️ Base de datos eliminada: ${userId}`);
    res.json({ success: true, mensaje: 'Base de datos eliminada' });
    
  } catch (error) {
    console.error('Error eliminando base de datos:', error);
    res.status(500).json({ error: 'Error eliminando base de datos' });
  }
});

// Endpoint: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensaje: 'Servidor funcionando correctamente' });
});

// Endpoint: Obtener tipo de cambio (proxy para evitar CORS)
app.get('/api/exchange-rate', async (req, res) => {
  try {
    // Intentar con ExchangeRate-API
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    res.json({
      success: true,
      USD_PEN: data.rates.PEN,
      fuente: 'ExchangeRate-API',
      fecha: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Error obteniendo tipo de cambio',
      fallback: 3.75
    });
  }
});

// Iniciar servidor
inicializarDirectorios().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ============================================');
    console.log(`   Servidor de Apuestas corriendo en:`);
    console.log(`   http://localhost:${PORT}`);
    console.log('🚀 ============================================');
    console.log('');
    console.log('📊 Endpoints disponibles:');
    console.log(`   POST   /api/db/save        - Guardar base de datos`);
    console.log(`   GET    /api/db/load/:userId - Cargar base de datos`);
    console.log(`   GET    /api/db/list        - Listar bases de datos`);
    console.log(`   DELETE /api/db/delete/:userId - Eliminar base de datos`);
    console.log(`   GET    /api/health         - Estado del servidor`);
    console.log(`   GET    /api/exchange-rate  - Obtener tipo de cambio`);
    console.log('');
  });
});

