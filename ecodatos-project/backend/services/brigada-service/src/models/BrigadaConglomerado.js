const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BrigadaConglomerado = sequelize.define('BrigadaConglomerado', {
  id_brigada: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'brigada',
      key: 'id'
    }
  },
  id_conglomerado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'conglomerado',
      key: 'id'
    }
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'Pendiente',
    validate: {
      isIn: [['Pendiente', 'En_Proceso', 'Completado']]
    }
  }
}, {
  tableName: 'brigadaconglomerado',
  timestamps: false
});

module.exports = BrigadaConglomerado;
