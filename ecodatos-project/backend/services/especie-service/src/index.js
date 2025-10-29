const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection, sequelize } = require('./config/database');
const especieRoutes = require('./routes/especieRoutes');

const app = express();
const PORT = process.env.PORT || 3004;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/especies', especieRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    service: 'especie-service', 
    status: 'running' 
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await testConnection();
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Especie Service corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
