-- Agregar columna fecha_inicio a la tabla conglomerado
ALTER TABLE conglomerado
ADD COLUMN fecha_inicio TIMESTAMP NULL;

-- Comentario de la columna
COMMENT ON COLUMN conglomerado.fecha_inicio IS 'Fecha y hora en que el conglomerado cambia a estado En_Proceso';
