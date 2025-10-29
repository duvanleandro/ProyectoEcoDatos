const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Especie = sequelize.define('Especie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_cientifico: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  familia: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  genero: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nombre_comun: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  usos: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Medicinal, Alimenticio, Maderable, etc.'
  },
  estado_conservacion: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'En Peligro, Vulnerable, Estable, etc.'
  }
}, {
  tableName: 'especie',
  timestamps: false
});

module.exports = Especie;
