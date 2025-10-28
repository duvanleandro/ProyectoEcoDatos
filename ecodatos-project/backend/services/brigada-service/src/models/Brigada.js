const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Brigada = sequelize.define('Brigada', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  zona_designada: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'brigada',
  timestamps: false
});

module.exports = Brigada;
