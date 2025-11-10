#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   📊 ESTADO DE LA BASE DE DATOS ECODATOS  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

sudo -u postgres psql -d ecodatos << 'EOSQL'

\pset border 2

SELECT 
    'Usuarios' as "Tabla",
    COUNT(*) as "Total",
    COALESCE(MAX(id), 0) as "Último ID"
FROM usuarios
UNION ALL
SELECT 'Integrantes', COUNT(*), COALESCE(MAX(id), 0) FROM integrante
UNION ALL
SELECT 'Brigadas', COUNT(*), COALESCE(MAX(id), 0) FROM brigada
UNION ALL
SELECT 'Conglomerados', COUNT(*), COALESCE(MAX(id), 0) FROM conglomerado
UNION ALL
SELECT 'Subparcelas', COUNT(*), COALESCE(MAX(id), 0) FROM subparcela
UNION ALL
SELECT 'Observaciones', COUNT(*), COALESCE(MAX(id), 0) FROM observacion
UNION ALL
SELECT 'Muestras', COUNT(*), COALESCE(MAX(id), 0) FROM muestra
UNION ALL
SELECT 'Especies', COUNT(*), COALESCE(MAX(id), 0) FROM especie;

EOSQL

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo -e "${YELLOW}  ESTADO DE CONGLOMERADOS POR BRIGADA${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo ""

sudo -u postgres psql -d ecodatos << 'EOSQL'

\pset border 2

SELECT 
    b.id as "ID Brigada",
    b.nombre as "Brigada",
    COUNT(c.id) as "Total Conglomerados",
    COUNT(CASE WHEN c.estado = 'Pendiente' THEN 1 END) as "Pendientes",
    COUNT(CASE WHEN c.estado = 'Aprobado' THEN 1 END) as "Aprobados",
    COUNT(CASE WHEN c.estado = 'Asignado' THEN 1 END) as "Asignados",
    COUNT(CASE WHEN c.estado = 'En_Proceso' THEN 1 END) as "En Proceso",
    COUNT(CASE WHEN c.estado = 'Completado' THEN 1 END) as "Completados"
FROM brigada b
LEFT JOIN conglomerado c ON b.id = c.brigada_id
GROUP BY b.id, b.nombre
ORDER BY b.id;

EOSQL

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo -e "${YELLOW}  ESTADO DE OBSERVACIONES${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo ""

sudo -u postgres psql -d ecodatos << 'EOSQL'

\pset border 2

SELECT
    COUNT(*) as "Total Observaciones",
    COUNT(CASE WHEN validado_por_jefe = false THEN 1 END) as "Sin Enviar",
    COUNT(CASE WHEN validado_por_jefe = true AND validado = false THEN 1 END) as "Pendientes",
    COUNT(CASE WHEN validado = true THEN 1 END) as "Validadas"
FROM observacion;

EOSQL

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo -e "${YELLOW}  ESTADO DE USUARIOS${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo ""

sudo -u postgres psql -d ecodatos << 'EOSQL'

\pset border 2

SELECT
    tipo_usuario as "Tipo de Usuario",
    COUNT(*) as "Total",
    COUNT(CASE WHEN activo = true THEN 1 END) as "Activos",
    COUNT(CASE WHEN activo = false THEN 1 END) as "Inactivos"
FROM usuarios
GROUP BY tipo_usuario
ORDER BY tipo_usuario;

EOSQL

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo -e "${YELLOW}  CONGLOMERADOS POR ESTADO${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo ""

sudo -u postgres psql -d ecodatos << 'EOSQL'

\pset border 2

SELECT
    estado as "Estado",
    COUNT(*) as "Total"
FROM conglomerado
GROUP BY estado
ORDER BY
    CASE estado
        WHEN 'Pendiente' THEN 1
        WHEN 'Aprobado' THEN 2
        WHEN 'Rechazado' THEN 3
        WHEN 'Asignado' THEN 4
        WHEN 'En_Proceso' THEN 5
        WHEN 'Completado' THEN 6
    END;

EOSQL

echo ""
echo -e "${GREEN}✅ Consulta completada${NC}"
echo ""

