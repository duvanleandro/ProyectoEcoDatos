const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Conglomerado = sequelize.define('Conglomerado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Coordenadas lat,lon del centro'
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  municipio: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  departamento: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  brigada_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  brigada_nombre: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'Pendiente',
    validate: {
      isIn: [['Pendiente', 'Aprobado', 'Rechazado', 'Asignado', 'En_Proceso', 'Completado']]
    }
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_aprobacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'conglomerado',
  timestamps: false
});

module.exports = Conglomerado;
