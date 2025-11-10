#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

-- 1. ELIMINAR DATOS DE TODAS LAS TABLAS (en orden por dependencias)
TRUNCATE TABLE muestraespecie CASCADE;
TRUNCATE TABLE subparcelamuestra CASCADE;
TRUNCATE TABLE clasificaciontaxonomica CASCADE;
TRUNCATE TABLE conglomeradoindicador CASCADE;
TRUNCATE TABLE conglomeradosubparcela CASCADE;
TRUNCATE TABLE brigadaconglomerado CASCADE;
TRUNCATE TABLE brigadaintegrante CASCADE;
TRUNCATE TABLE proyectobrigada CASCADE;

-- Tablas principales
TRUNCATE TABLE observacion CASCADE;
TRUNCATE TABLE muestra CASCADE;
TRUNCATE TABLE especie CASCADE;
TRUNCATE TABLE subparcela CASCADE;
TRUNCATE TABLE conglomerado CASCADE;
TRUNCATE TABLE indicador CASCADE;
TRUNCATE TABLE brigada CASCADE;
TRUNCATE TABLE integrante CASCADE;

-- Eliminar todos los usuarios
TRUNCATE TABLE usuarios CASCADE;

-- 2. REINICIAR SECUENCIAS (IDs) A 1
DO $$
DECLARE
    seq RECORD;
BEGIN
    -- Reiniciar todas las secuencias automáticamente
    FOR seq IN
        SELECT sequence_name
        FROM information_schema.sequences
        WHERE sequence_schema = 'public'
    LOOP
        EXECUTE 'ALTER SEQUENCE ' || seq.sequence_name || ' RESTART WITH 1';
    END LOOP;
END $$;

-- 3. RECREAR USUARIO ADMIN
-- Contraseña: 1234 (hash bcrypt)
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
\echo ''
\echo '═══════════════════════════════════════════'
\echo '  📊 ESTADO POST-RESETEO'
\echo '═══════════════════════════════════════════'
\echo ''

SELECT 
    'Usuarios' as "Tabla",
    COUNT(*) as "Total"
FROM usuarios
UNION ALL
SELECT 'Integrantes', COUNT(*) FROM integrante
UNION ALL
SELECT 'Brigadas', COUNT(*) FROM brigada
UNION ALL
SELECT 'Conglomerados', COUNT(*) FROM conglomerado
UNION ALL
SELECT 'Subparcelas', COUNT(*) FROM subparcela
UNION ALL
SELECT 'Observaciones', COUNT(*) FROM observacion
UNION ALL
SELECT 'Muestras', COUNT(*) FROM muestra
UNION ALL
SELECT 'Especies', COUNT(*) FROM especie;

-- 5. MOSTRAR USUARIO ADMIN CREADO
\echo ''
SELECT '✅ Usuario admin creado:' as "Info", id, usuario, tipo_usuario FROM usuarios WHERE usuario = 'admin';

EOSQL

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ BASE DE DATOS RESETEADA EXITOSAMENTE  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📝 Credenciales de acceso:${NC}"
echo -e "${GREEN}   👤 Usuario: ${NC}admin"
echo -e "${GREEN}   🔑 Contraseña: ${NC}1234"
echo ""
echo -e "${YELLOW}🔄 Servicios a reiniciar:${NC}"
echo -e "   • auth-service (puerto 3001)"
echo -e "   • conglomerado-service (puerto 3002)"
echo -e "   • brigada-service (puerto 3003)"
echo -e "   • especie-service (puerto 3004)"
echo -e "   • observacion-service (puerto 3005)"
echo ""
echo -e "${YELLOW}💡 Comandos útiles:${NC}"
echo -e "   • Ver estado: ${GREEN}./check-database.sh${NC}"
echo -e "   • Reiniciar servicios: ${GREEN}cd backend/services/[servicio] && npm run dev${NC}"
echo ""

