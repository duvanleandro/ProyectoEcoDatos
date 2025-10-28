const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection, sequelize } = require('./config/database');
const conglomeradoRoutes = require('./routes/conglomeradoRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(cors());
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
