const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subparcela = sequelize.define('Subparcela', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_conglomerado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'conglomerado',
      key: 'id'
    }
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número de subparcela (1-5): 1=centro, 2=norte, 3=este, 4=sur, 5=oeste'
  },
  nombre: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'SPF-1, SPF-2, SPF-3, SPF-4, SPF-5'
  },
  coordenadas: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Coordenadas lat,lon'
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  }
}, {
  tableName: 'subparcela',
  timestamps: false
});

module.exports = Subparcela;
