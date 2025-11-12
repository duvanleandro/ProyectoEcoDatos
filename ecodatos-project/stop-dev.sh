#!/bin/bash

# Script para detener todos los servicios del proyecto
# Uso: ./stop-dev.sh

echo "🛑 Deteniendo servicios de EcoDatos..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Detener procesos de node (servicios backend)
echo -e "${RED}Deteniendo servicios del backend...${NC}"
pkill -f 'nodemon.*src/index.js' && echo -e "${GREEN}✓ Servicios backend detenidos${NC}"

# Detener frontend (Vite)
echo -e "${RED}Deteniendo frontend...${NC}"
pkill -f 'vite' && echo -e "${GREEN}✓ Frontend detenido${NC}"

echo ""
echo -e "${GREEN}✅ Todos los servicios han sido detenidos${NC}"
