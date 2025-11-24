const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection, sequelize } = require('./config/database');
const conglomeradoRoutes = require('./routes/conglomeradoRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos desde variable de entorno o valores por defecto
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost:5173',
          'http://localhost:3000',
          'https://ecodatos.vercel.app'
        ];

    // Permitir requests sin origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 Origen bloqueado por CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api/conglomerados', conglomeradoRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    service: 'conglomerado-service', 
    status: 'running' 
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a base de datos
    await testConnection();
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Conglomerado Service corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
