#!/bin/bash

# Script para iniciar todos los servicios del proyecto en modo desarrollo
# Uso: ./start-dev.sh

echo "🚀 Iniciando servicios de EcoDatos..."

# Directorio base del proyecto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para iniciar un servicio
start_service() {
    local service_name=$1
    local service_path=$2

    echo -e "${BLUE}Iniciando ${service_name}...${NC}"
    cd "$service_path"
    npm run dev > /dev/null 2>&1 &
    echo -e "${GREEN}✓ ${service_name} iniciado (PID: $!)${NC}"
}

# Iniciar servicios del backend
echo ""
echo "📦 Iniciando servicios del backend..."
start_service "Auth Service" "$PROJECT_DIR/backend/services/auth-service"
start_service "Brigada Service" "$PROJECT_DIR/backend/services/brigada-service"
start_service "Conglomerado Service" "$PROJECT_DIR/backend/services/conglomerado-service"
start_service "Especie Service" "$PROJECT_DIR/backend/services/especie-service"
start_service "Observacion Service" "$PROJECT_DIR/backend/services/observacion-service"

# Esperar un poco para que los servicios inicien
sleep 3

# Iniciar frontend
echo ""
echo "🌐 Iniciando frontend..."
cd "$PROJECT_DIR/frontend"
npm run dev > /dev/null 2>&1 &
echo -e "${GREEN}✓ Frontend iniciado (PID: $!)${NC}"

echo ""
echo -e "${GREEN}✅ Todos los servicios han sido iniciados${NC}"
echo ""
echo "URLs de los servicios:"
echo "  - Frontend:              http://localhost:5173"
echo "  - Auth Service:          http://localhost:3001"
echo "  - Conglomerado Service:  http://localhost:3002"
echo "  - Brigada Service:       http://localhost:3003"
echo "  - Especie Service:       http://localhost:3004"
echo "  - Observacion Service:   http://localhost:3005"
echo ""
echo "Para detener todos los servicios, ejecuta: ./stop-dev.sh"
echo "O usa: pkill -f 'node.*src/index.js' && pkill -f 'vite'"
