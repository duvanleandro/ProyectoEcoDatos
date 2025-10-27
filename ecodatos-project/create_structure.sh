#!/bin/bash

# Estructura principal
mkdir -p {frontend,backend,docs,docker}

# Frontend React
mkdir -p frontend/{public,src/{components,pages,services,utils,assets/{css,images},contexts,hooks}}
mkdir -p frontend/src/components/{auth,admin,conglomerados,brigadas,common,maps}
mkdir -p frontend/src/pages/{auth,admin,conglomerados,brigadas,dashboard}

# Backend - Arquitectura de Microservicios
mkdir -p backend/{gateway,services,shared}

# Microservicio de Autenticación
mkdir -p backend/services/auth-service/{src/{controllers,services,repositories,models,middleware,routes,config},tests}

# Microservicio de Conglomerados
mkdir -p backend/services/conglomerado-service/{src/{controllers,services,repositories,models,middleware,routes,config},tests}

# Microservicio de Brigadas
mkdir -p backend/services/brigada-service/{src/{controllers,services,repositories,models,middleware,routes,config},tests}

# Microservicio de Especies
mkdir -p backend/services/especie-service/{src/{controllers,services,repositories,models,middleware,routes,config},tests}

# Microservicio de Observaciones (MongoDB)
mkdir -p backend/services/observacion-service/{src/{controllers,services,repositories,models,middleware,routes,config},tests}

# API Gateway
mkdir -p backend/gateway/{src/{routes,middleware,config},tests}

# Shared libraries
mkdir -p backend/shared/{database,utils,types}

echo "✅ Estructura de carpetas creada exitosamente"
