-- Crear tabla de logs de auditoría para PostgreSQL
CREATE TABLE IF NOT EXISTS logs_auditoria (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NULL,
    accion VARCHAR(100) NOT NULL,
    entidad VARCHAR(100) NOT NULL,
    id_entidad INTEGER NULL,
    detalles TEXT NULL,
    ip_address VARCHAR(45) NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Crear índices para mejorar el rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_auditoria(id_usuario);
CREATE INDEX IF NOT EXISTS idx_logs_accion ON logs_auditoria(accion);
CREATE INDEX IF NOT EXISTS idx_logs_entidad ON logs_auditoria(entidad);
CREATE INDEX IF NOT EXISTS idx_logs_fecha ON logs_auditoria(fecha);

-- Comentarios de la tabla
COMMENT ON TABLE logs_auditoria IS 'Registro de auditoría de acciones del sistema';
COMMENT ON COLUMN logs_auditoria.accion IS 'Tipo de acción: crear, editar, eliminar, login, logout, etc';
COMMENT ON COLUMN logs_auditoria.entidad IS 'Entidad afectada: usuario, conglomerado, brigada, observacion, etc';
COMMENT ON COLUMN logs_auditoria.id_entidad IS 'ID del registro afectado';
COMMENT ON COLUMN logs_auditoria.detalles IS 'JSON con detalles adicionales';
COMMENT ON COLUMN logs_auditoria.ip_address IS 'Dirección IP del usuario';
