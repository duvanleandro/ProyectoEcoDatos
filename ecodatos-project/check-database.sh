#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
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
SELECT 'Muestras', COUNT(*), COALESCE(MAX(id), 0) FROM muestra
UNION ALL
SELECT 'Especies', COUNT(*), COALESCE(MAX(id), 0) FROM especie;

EOSQL

echo ""

