const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'contraseña'
  },
  tipo_usuario: {
    type: DataTypes.STRING(20),
    defaultValue: 'brigadista',
    validate: {
      isIn: [['admin', 'jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador', 'laboratorio', 'coordinador']]
    }
  },
  id_integrante: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false
});

module.exports = Usuario;
