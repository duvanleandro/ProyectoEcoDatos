-- =====================================================
-- EcoDatos - Script de Inicialización de Base de Datos
-- Base de datos: PostgreSQL (Supabase)
-- =====================================================

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Para funciones geoespaciales futuras

-- =====================================================
-- TABLA: usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  tipo_usuario VARCHAR(20) NOT NULL DEFAULT 'brigadista',
  id_integrante INTEGER,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_tipo_usuario CHECK (tipo_usuario IN ('admin', 'jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador', 'laboratorio', 'coordinador'))
);

CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- =====================================================
-- TABLA: integrante
-- =====================================================
CREATE TABLE IF NOT EXISTS integrante (
  id SERIAL PRIMARY KEY,
  nombre_apellidos VARCHAR(150) NOT NULL,
  rol VARCHAR(50),
  telefono VARCHAR(20),
  email VARCHAR(100),
  especialidad VARCHAR(100)
);

CREATE INDEX idx_integrante_rol ON integrante(rol);

-- =====================================================
-- TABLA: brigada
-- =====================================================
CREATE TABLE IF NOT EXISTS brigada (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  zona_designada VARCHAR(100),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT true
);

CREATE INDEX idx_brigada_activo ON brigada(activo);

-- =====================================================
-- TABLA: brigadaintegrante (relación N:M)
-- =====================================================
CREATE TABLE IF NOT EXISTS brigadaintegrante (
  id_brigada INTEGER NOT NULL,
  id_integrante INTEGER NOT NULL,
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_brigada, id_integrante),
  FOREIGN KEY (id_brigada) REFERENCES brigada(id) ON DELETE CASCADE,
  FOREIGN KEY (id_integrante) REFERENCES integrante(id) ON DELETE CASCADE
);

CREATE INDEX idx_brigadaintegrante_brigada ON brigadaintegrante(id_brigada);
CREATE INDEX idx_brigadaintegrante_integrante ON brigadaintegrante(id_integrante);

-- =====================================================
-- TABLA: conglomerado
-- =====================================================
CREATE TABLE IF NOT EXISTS conglomerado (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(100) NOT NULL,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  municipio VARCHAR(100),
  departamento VARCHAR(100),
  brigada_id INTEGER,
  brigada_nombre VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'Pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_aprobacion TIMESTAMP,
  fecha_asignacion TIMESTAMP,
  fecha_inicio TIMESTAMP,
  CONSTRAINT chk_estado_conglomerado CHECK (estado IN ('Pendiente', 'Aprobado', 'Rechazado', 'Asignado', 'En_Proceso', 'Completado'))
);

CREATE INDEX idx_conglomerado_brigada ON conglomerado(brigada_id);
CREATE INDEX idx_conglomerado_estado ON conglomerado(estado);
CREATE INDEX idx_conglomerado_coords ON conglomerado(latitud, longitud);

-- =====================================================
-- TABLA: brigadaconglomerado (relación N:M)
-- =====================================================
CREATE TABLE IF NOT EXISTS brigadaconglomerado (
  id_brigada INTEGER NOT NULL,
  id_conglomerado INTEGER NOT NULL,
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'Pendiente',
  PRIMARY KEY (id_brigada, id_conglomerado),
  FOREIGN KEY (id_brigada) REFERENCES brigada(id) ON DELETE CASCADE,
  FOREIGN KEY (id_conglomerado) REFERENCES conglomerado(id) ON DELETE CASCADE,
  CONSTRAINT chk_estado_bc CHECK (estado IN ('Pendiente', 'En_Proceso', 'Completado'))
);

CREATE INDEX idx_brigadaconglomerado_brigada ON brigadaconglomerado(id_brigada);
CREATE INDEX idx_brigadaconglomerado_conglomerado ON brigadaconglomerado(id_conglomerado);

-- =====================================================
-- TABLA: subparcela
-- =====================================================
CREATE TABLE IF NOT EXISTS subparcela (
  id SERIAL PRIMARY KEY,
  id_conglomerado INTEGER NOT NULL,
  numero INTEGER NOT NULL,
  nombre VARCHAR(20) NOT NULL,
  coordenadas VARCHAR(100) NOT NULL,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  FOREIGN KEY (id_conglomerado) REFERENCES conglomerado(id) ON DELETE CASCADE,
  CONSTRAINT chk_numero_subparcela CHECK (numero BETWEEN 1 AND 5)
);

CREATE INDEX idx_subparcela_conglomerado ON subparcela(id_conglomerado);

-- =====================================================
-- TABLA: especie
-- =====================================================
CREATE TABLE IF NOT EXISTS especie (
  id SERIAL PRIMARY KEY,
  nombre_cientifico VARCHAR(200) UNIQUE NOT NULL,
  familia VARCHAR(100),
  genero VARCHAR(100),
  nombre_comun VARCHAR(200),
  descripcion TEXT,
  usos TEXT,
  estado_conservacion VARCHAR(50)
);

CREATE INDEX idx_especie_nombre ON especie(nombre_cientifico);
CREATE INDEX idx_especie_familia ON especie(familia);
CREATE INDEX idx_especie_genero ON especie(genero);

-- =====================================================
-- TABLA: observacion
-- =====================================================
CREATE TABLE IF NOT EXISTS observacion (
  id SERIAL PRIMARY KEY,
  id_conglomerado INTEGER NOT NULL,
  id_subparcela INTEGER,
  id_brigada INTEGER NOT NULL,
  fecha_observacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hora_inicio TIME,
  hora_fin TIME,
  temperatura DECIMAL(5, 2),
  humedad INTEGER,
  condiciones_clima VARCHAR(50),
  precipitacion VARCHAR(50),
  observaciones_generales TEXT,
  descripcion_vegetacion TEXT,
  fauna_observada TEXT,
  notas_coinvestigador TEXT,
  pendiente_grados INTEGER,
  tipo_suelo VARCHAR(100),
  cobertura_vegetal VARCHAR(100),
  erosion VARCHAR(50),
  presencia_agua VARCHAR(50),
  latitud_verificada DECIMAL(10, 8),
  longitud_verificada DECIMAL(11, 8),
  altitud_msnm INTEGER,
  precision_gps VARCHAR(20),
  fotos JSONB DEFAULT '[]'::jsonb,
  archivos_adjuntos JSONB DEFAULT '[]'::jsonb,
  disturbios_humanos TEXT,
  evidencia_fauna TEXT,
  especies_invasoras TEXT,
  registrado_por INTEGER,
  validado_por_jefe BOOLEAN DEFAULT false,
  jefe_validador_id INTEGER,
  fecha_validacion_jefe TIMESTAMP,
  validado BOOLEAN DEFAULT false,
  validado_por INTEGER,
  fecha_validacion TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_conglomerado) REFERENCES conglomerado(id) ON DELETE CASCADE,
  FOREIGN KEY (id_subparcela) REFERENCES subparcela(id) ON DELETE SET NULL,
  FOREIGN KEY (id_brigada) REFERENCES brigada(id) ON DELETE CASCADE,
  FOREIGN KEY (registrado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (jefe_validador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (validado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX idx_observacion_conglomerado ON observacion(id_conglomerado);
CREATE INDEX idx_observacion_brigada ON observacion(id_brigada);
CREATE INDEX idx_observacion_fecha ON observacion(fecha_observacion);
CREATE INDEX idx_observacion_validado ON observacion(validado);

-- =====================================================
-- TABLA: observacionespecie (relación N:M entre observacion y especie)
-- =====================================================
CREATE TABLE IF NOT EXISTS observacionespecie (
  id SERIAL PRIMARY KEY,
  id_observacion INTEGER NOT NULL,
  id_especie INTEGER NOT NULL,
  numero_arbol INTEGER,
  dap DECIMAL(10, 2),
  altura DECIMAL(10, 2),
  estado_salud VARCHAR(50),
  notas TEXT,
  FOREIGN KEY (id_observacion) REFERENCES observacion(id) ON DELETE CASCADE,
  FOREIGN KEY (id_especie) REFERENCES especie(id) ON DELETE CASCADE
);

CREATE INDEX idx_observacionespecie_obs ON observacionespecie(id_observacion);
CREATE INDEX idx_observacionespecie_esp ON observacionespecie(id_especie);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para observacion
DROP TRIGGER IF EXISTS update_observacion_updated_at ON observacion;
CREATE TRIGGER update_observacion_updated_at
    BEFORE UPDATE ON observacion
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (debes cambiarla en producción)
-- Hash bcrypt de "admin123": $2b$10$YourHashHere
INSERT INTO usuarios (usuario, contraseña, tipo_usuario, activo)
VALUES ('admin', '$2b$10$rFHvKx2xvK9fTJGqJZFH1eZWxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'admin', true)
ON CONFLICT (usuario) DO NOTHING;

-- Insertar usuario coordinador por defecto
-- Contraseña: coord123
INSERT INTO usuarios (usuario, contraseña, tipo_usuario, activo)
VALUES ('coordinador', '$2b$10$rFHvKx2xvK9fTJGqJZFH1eZWxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'coordinador', true)
ON CONFLICT (usuario) DO NOTHING;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Brigadas con conteo de integrantes
CREATE OR REPLACE VIEW v_brigadas_resumen AS
SELECT
  b.id,
  b.nombre,
  b.zona_designada,
  b.activo,
  b.fecha_creacion,
  COUNT(DISTINCT bi.id_integrante) as total_integrantes,
  COUNT(DISTINCT bc.id_conglomerado) as total_conglomerados
FROM brigada b
LEFT JOIN brigadaintegrante bi ON b.id = bi.id_brigada
LEFT JOIN brigadaconglomerado bc ON b.id = bc.id_brigada
GROUP BY b.id;

-- Vista: Conglomerados con información de brigada
CREATE OR REPLACE VIEW v_conglomerados_completo AS
SELECT
  c.*,
  b.nombre as brigada_nombre_completo,
  b.activo as brigada_activa,
  COUNT(DISTINCT o.id) as total_observaciones
FROM conglomerado c
LEFT JOIN brigada b ON c.brigada_id = b.id
LEFT JOIN observacion o ON c.id = o.id_conglomerado
GROUP BY c.id, b.nombre, b.activo;

-- Vista: Estadísticas de observaciones
CREATE OR REPLACE VIEW v_estadisticas_observaciones AS
SELECT
  b.id as brigada_id,
  b.nombre as brigada_nombre,
  COUNT(DISTINCT o.id) as total_observaciones,
  COUNT(DISTINCT o.id_conglomerado) as conglomerados_con_observaciones,
  COUNT(DISTINCT CASE WHEN o.validado = true THEN o.id END) as observaciones_validadas,
  AVG(o.temperatura) as temperatura_promedio,
  AVG(o.humedad) as humedad_promedio
FROM brigada b
LEFT JOIN observacion o ON b.id = o.id_brigada
GROUP BY b.id, b.nombre;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- =====================================================

-- Habilitar RLS en tablas sensibles
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE observacion ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propios datos
CREATE POLICY usuarios_select_policy ON usuarios
  FOR SELECT
  USING (auth.uid()::text = id::text OR tipo_usuario = 'admin');

-- Política: Solo administradores pueden insertar usuarios
CREATE POLICY usuarios_insert_policy ON usuarios
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id::text = auth.uid()::text
      AND tipo_usuario = 'admin'
    )
  );

-- =====================================================
-- ÍNDICES ADICIONALES PARA RENDIMIENTO
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_observacion_created_at ON observacion(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conglomerado_municipio ON conglomerado(municipio);
CREATE INDEX IF NOT EXISTS idx_usuarios_id_integrante ON usuarios(id_integrante);

-- =====================================================
-- COMENTARIOS EN TABLAS
-- =====================================================

COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema con autenticación';
COMMENT ON TABLE integrante IS 'Integrantes de las brigadas de campo';
COMMENT ON TABLE brigada IS 'Brigadas de trabajo de campo';
COMMENT ON TABLE conglomerado IS 'Conglomerados forestales para inventario';
COMMENT ON TABLE subparcela IS 'Subparcelas dentro de cada conglomerado';
COMMENT ON TABLE especie IS 'Catálogo de especies forestales';
COMMENT ON TABLE observacion IS 'Observaciones de campo realizadas por las brigadas';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

SELECT 'Base de datos EcoDatos inicializada correctamente' as mensaje;
