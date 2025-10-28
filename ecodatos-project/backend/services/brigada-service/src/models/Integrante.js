const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Integrante = sequelize.define('Integrante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_apellidos: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'jefe_brigada, tecnico, botanico, coinvestigador'
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  especialidad: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'integrante',
  timestamps: false
});

module.exports = Integrante;
