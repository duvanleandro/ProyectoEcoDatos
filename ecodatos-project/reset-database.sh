#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║                                                        ║${NC}"
echo -e "${RED}║     ⚠️  ADVERTENCIA: RESETEO DE BASE DE DATOS  ⚠️      ║${NC}"
echo -e "${RED}║                                                        ║${NC}"
echo -e "${RED}║  Esta acción eliminará TODOS los datos excepto admin  ║${NC}"
echo -e "${RED}║                                                        ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Solicitar confirmación
read -p "$(echo -e ${YELLOW}¿Estás seguro? Escribe 'SI' para continuar: ${NC})" confirmacion

if [ "$confirmacion" != "SI" ]; then
    echo -e "${GREEN}✅ Operación cancelada${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}🔄 Iniciando reseteo de base de datos...${NC}"
echo ""

# Ejecutar SQL
sudo -u postgres psql -d ecodatos << 'EOSQL'

-- Deshabilitar restricciones de foreign key temporalmente
SET session_replication_role = 'replica';

-- 1. ELIMINAR DATOS DE TODAS LAS TABLAS
TRUNCATE TABLE brigadaconglomerado CASCADE;
TRUNCATE TABLE brigadaintegrante CASCADE;
TRUNCATE TABLE conglomeradosubparcela CASCADE;
TRUNCATE TABLE subparcelamuestra CASCADE;
TRUNCATE TABLE muestraespecie CASCADE;
TRUNCATE TABLE conglomeradoindicador CASCADE;
TRUNCATE TABLE clasificaciontaxonomica CASCADE;

TRUNCATE TABLE subparcela CASCADE;
TRUNCATE TABLE muestra CASCADE;
TRUNCATE TABLE especie CASCADE;
TRUNCATE TABLE indicador CASCADE;
TRUNCATE TABLE conglomerado CASCADE;
TRUNCATE TABLE brigada CASCADE;
TRUNCATE TABLE integrante CASCADE;
TRUNCATE TABLE proyectobrigada CASCADE;

-- Eliminar todos los usuarios
TRUNCATE TABLE usuarios CASCADE;

-- 2. REINICIAR SECUENCIAS (IDs) A 1
ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;
ALTER SEQUENCE integrante_id_seq RESTART WITH 1;
ALTER SEQUENCE brigada_id_seq RESTART WITH 1;
ALTER SEQUENCE conglomerado_id_seq RESTART WITH 1;
ALTER SEQUENCE subparcela_id_seq RESTART WITH 1;
ALTER SEQUENCE muestra_id_seq RESTART WITH 1;
ALTER SEQUENCE especie_id_seq RESTART WITH 1;
ALTER SEQUENCE indicador_id_seq RESTART WITH 1;
ALTER SEQUENCE clasificaciontaxonomica_id_seq RESTART WITH 1;

-- 3. RECREAR USUARIO ADMIN
-- Contraseña: 1234 (hash bcrypt generado)
INSERT INTO usuarios (usuario, contraseña, tipo_usuario, activo, fecha_creacion) 
VALUES (
  'admin', 
  '$2b$10$aTf9gmgY7RZTqbE1jL0pSu85.5HcuGXtYu0sg0GQELCKLt8itnQK.',
  'admin', 
  true, 
  CURRENT_TIMESTAMP
);

-- Rehabilitar restricciones
SET session_replication_role = 'origin';

-- 4. VERIFICAR ESTADO
SELECT 'Usuarios restantes:' as tabla, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'Integrantes:', COUNT(*) FROM integrante
UNION ALL
SELECT 'Brigadas:', COUNT(*) FROM brigada
UNION ALL
SELECT 'Conglomerados:', COUNT(*) FROM conglomerado
UNION ALL
SELECT 'Subparcelas:', COUNT(*) FROM subparcela
UNION ALL
SELECT 'Especies:', COUNT(*) FROM especie;

-- 5. MOSTRAR USUARIO ADMIN CREADO
SELECT 'Usuario admin creado:' as info, id, usuario, tipo_usuario FROM usuarios WHERE usuario = 'admin';

EOSQL

echo ""
echo -e "${GREEN}✅ Base de datos reseteada exitosamente${NC}"
echo -e "${GREEN}✅ Usuario admin recreado (ID=1)${NC}"
echo -e "${GREEN}✅ Todas las secuencias reiniciadas${NC}"
echo ""
echo -e "${YELLOW}📝 Credenciales de acceso:${NC}"
echo -e "${YELLOW}   Usuario: admin${NC}"
echo -e "${YELLOW}   Contraseña: 1234${NC}"
echo ""

