const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Observacion = sequelize.define('Observacion', {
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
  id_subparcela: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'subparcela',
      key: 'id'
    }
  },
  id_brigada: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'brigada',
      key: 'id'
    }
  },
  fecha_observacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: true
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: true
  },
  temperatura: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  humedad: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  condiciones_clima: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  precipitacion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  observaciones_generales: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  descripcion_vegetacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fauna_observada: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notas_coinvestigador: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pendiente_grados: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tipo_suelo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  cobertura_vegetal: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  erosion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  presencia_agua: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  latitud_verificada: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitud_verificada: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  altitud_msnm: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  precision_gps: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  fotos: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  archivos_adjuntos: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  disturbios_humanos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  evidencia_fauna: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  especies_invasoras: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  registrado_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  validado_por_jefe: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  jefe_validador_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  fecha_validacion_jefe: {
    type: DataTypes.DATE,
    allowNull: true
  },
  validado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  validado_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  fecha_validacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'observacion',
  timestamps: false
});

module.exports = Observacion;
