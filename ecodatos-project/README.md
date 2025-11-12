# 🌳 EcoDatos - Sistema de Gestión de Datos Ecológicos

Sistema integral para la recolección, gestión y análisis de datos ecológicos en campo, con funcionalidades de geolocalización, gestión de brigadas y control de observaciones.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Seguridad](#seguridad)
- [Scripts Disponibles](#scripts-disponibles)
- [Documentación Adicional](#documentación-adicional)

## ✨ Características

### Gestión de Usuario y Autenticación
- Sistema de autenticación con JWT
- Roles de usuario: Admin, Coordinador, Jefe de Brigada, Integrante de Brigada
- Control de acceso basado en roles
- Gestión de perfiles y cambio de contraseña
- Sistema de auditoría de acciones

### Gestión de Brigadas
- Creación y asignación de brigadas de campo
- Gestión de integrantes por brigada
- Control de zonas designadas
- Activación/desactivación de brigadas

### Gestión de Conglomerados
- Generación aleatoria de conglomerados geográficos
- Aprobación/rechazo de conglomerados por administrador
- Asignación de conglomerados a brigadas
- Estados: Pendiente → Aprobado → Asignado → En_Proceso → Completado
- Control de un solo conglomerado activo por brigada
- Cálculo automático de 5 subparcelas por conglomerado
- Registro de fechas de inicio y finalización

### Registro de Observaciones
- Formulario completo de observaciones de campo
- Datos climáticos (temperatura, humedad, precipitación)
- Información de terreno (pendiente, tipo de suelo, cobertura vegetal)
- Datos GPS (latitud, longitud, altitud, precisión)
- Observaciones de fauna y flora
- Registro automático de horas de inicio y fin
- Carga de evidencias fotográficas (hasta 10 fotos)
- Validación por jefe de brigada
- Validación final por coordinador/admin

### Dashboard Interactivo
- Resumen de estadísticas generales
- Visualización de conglomerados activos
- Cards informativos por rol de usuario
- Indicadores de progreso

### Gestión de Especies
- Catálogo de especies observadas
- Clasificación taxonómica
- Búsqueda y filtrado de especies

## 🏗️ Arquitectura

El proyecto sigue una arquitectura de microservicios:

```
ecodatos-project/
├── backend/
│   ├── gateway/                    # API Gateway (Puerto 3000) - Opcional
│   ├── services/                   # Microservicios
│   │   ├── auth-service/           # Autenticación (Puerto 3001)
│   │   ├── brigada-service/        # Brigadas (Puerto 3003)
│   │   ├── conglomerado-service/   # Conglomerados (Puerto 3002)
│   │   ├── especie-service/        # Especies (Puerto 3004)
│   │   └── observacion-service/    # Observaciones (Puerto 3005)
│   ├── migrations/                 # Scripts SQL de migración
│   └── shared/                     # Código compartido entre servicios
│       ├── database/               # Configuración de BD compartida
│       ├── types/                  # Tipos TypeScript/JS compartidos
│       └── utils/                  # Utilidades compartidas
├── frontend/                       # Aplicación React + Vite (Puerto 5173)
│   ├── src/                        # Código fuente
│   │   ├── components/             # Componentes React
│   │   ├── pages/                  # Páginas/Vistas
│   │   ├── config/                 # Configuración (API, Axios)
│   │   ├── context/                # Context API
│   │   ├── hooks/                  # Hooks personalizados
│   │   ├── services/               # Servicios API
│   │   └── utils/                  # Utilidades
│   ├── public/                     # Archivos estáticos
│   └── package.json                # Dependencias frontend
├── docker/                         # Configuración Docker (opcional)
├── CHANGELOG.md                    # Registro de cambios
├── README.md                       # Este archivo
├── package.json                    # Scripts npm del proyecto
├── start-dev.sh                    # Script para iniciar servicios
├── stop-dev.sh                     # Script para detener servicios
├── check-database.sh               # Script para verificar BD
├── reset-database.sh               # Script para resetear BD
└── create_structure.sh             # Script para generar estructura

Base de Datos: PostgreSQL (Puerto 5432) - Instalado localmente
```

### Servicios Backend

- **Gateway (3000)**: Punto de entrada único, enrutamiento y balanceo de carga
- **Auth Service (3001)**: Gestión de usuarios, autenticación JWT, auditoría
- **Conglomerado Service (3002)**: Gestión de conglomerados y subparcelas
- **Brigada Service (3003)**: Gestión de brigadas e integrantes
- **Especie Service (3004)**: Catálogo y clasificación de especies
- **Observacion Service (3005)**: Registro y validación de observaciones

### Comunicación entre Servicios
- Llamadas HTTP internas con header `x-internal-service: true`
- Autenticación JWT para llamadas externas
- Sistema de permisos por rol

## 🛠️ Tecnologías

### Backend
- **Node.js** v18+
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **Sequelize** - ORM
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Multer** - Carga de archivos
- **Axios** - Comunicación entre servicios

### Frontend
- **React** 18
- **Vite** - Build tool
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Tailwind CSS** - Estilos

### DevOps
- **Git** - Control de versiones
- **npm** - Gestión de paquetes
- **Nodemon** - Hot reload en desarrollo

## 📦 Requisitos Previos

- Node.js v18 o superior
- PostgreSQL v13 o superior
- npm v8 o superior
- Git

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd ecodatos-project
```

### 2. Configurar la Base de Datos

```bash
# Crear base de datos
sudo -u postgres psql << EOF
CREATE DATABASE ecodatos;
CREATE USER ecodatos_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE ecodatos TO ecodatos_user;
EOF

# Ejecutar migraciones
sudo -u postgres psql ecodatos -f backend/migrations/schema.sql
sudo -u postgres psql ecodatos -f backend/migrations/add_fecha_inicio_to_conglomerado.sql
```

### 3. Instalar Dependencias Backend

```bash
# Gateway
cd backend/gateway
npm install

# Servicios
cd ../services/auth-service && npm install
cd ../brigada-service && npm install
cd ../conglomerado-service && npm install
cd ../especie-service && npm install
cd ../observacion-service && npm install
```

### 4. Instalar Dependencias Frontend

```bash
cd ../../frontend
npm install
```

## ⚙️ Configuración

### Variables de Entorno Backend

Crear archivo `.env` en cada servicio:

**auth-service/.env**
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=ecodatos_user
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_key_muy_seguro
JWT_EXPIRES_IN=7d
```

**conglomerado-service/.env**
```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=ecodatos_user
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_key_muy_seguro
```

**brigada-service/.env**
```env
PORT=3003
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=ecodatos_user
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_key_muy_seguro
```

**especie-service/.env**
```env
PORT=3004
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=ecodatos_user
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_key_muy_seguro
```

**observacion-service/.env**
```env
PORT=3005
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=ecodatos_user
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_key_muy_seguro
UPLOAD_DIR=./uploads
```

**gateway/.env**
```env
PORT=3000
AUTH_SERVICE=http://localhost:3001
BRIGADA_SERVICE=http://localhost:3003
CONGLOMERADO_SERVICE=http://localhost:3002
ESPECIE_SERVICE=http://localhost:3004
OBSERVACION_SERVICE=http://localhost:3005
```

### Variables de Entorno Frontend

**frontend/.env**
```env
VITE_API_URL=http://localhost:3000
VITE_AUTH_SERVICE=http://localhost:3001
VITE_BRIGADA_SERVICE=http://localhost:3003
VITE_CONGLOMERADO_SERVICE=http://localhost:3002
VITE_ESPECIE_SERVICE=http://localhost:3004
VITE_OBSERVACION_SERVICE=http://localhost:3005
```

## 🎯 Uso

### Opción 1: Iniciar todos los servicios con un comando (Recomendado)

```bash
# Desde el directorio raíz del proyecto
./start-dev.sh
```

Este script iniciará automáticamente:
- Todos los microservicios del backend
- El frontend de React

La aplicación estará disponible en `http://localhost:5173`

Para detener todos los servicios:
```bash
./stop-dev.sh
```

### Opción 2: Iniciar servicios manualmente

Si prefieres iniciar los servicios uno por uno:

```bash
# Terminal 1 - Auth Service
cd backend/services/auth-service
npm run dev

# Terminal 2 - Brigada Service
cd backend/services/brigada-service
npm run dev

# Terminal 3 - Conglomerado Service
cd backend/services/conglomerado-service
npm run dev

# Terminal 4 - Especie Service
cd backend/services/especie-service
npm run dev

# Terminal 5 - Observacion Service
cd backend/services/observacion-service
npm run dev

# Terminal 6 - Frontend
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Usuario por Defecto

```
Usuario: admin
Contraseña: admin123
```

## 📊 Flujo de Trabajo

### Para Administradores

1. Generar conglomerados aleatorios
2. Aprobar/rechazar conglomerados
3. Crear y gestionar brigadas
4. Asignar conglomerados a brigadas
5. Crear usuarios y gestionar permisos
6. Validar observaciones finales

### Para Jefes de Brigada

1. Ver conglomerados asignados a su brigada
2. Iniciar trabajo en un conglomerado (cambia a En_Proceso)
3. Registrar observaciones en campo
4. Completar conglomerado cuando terminen
5. Validar y enviar observaciones para revisión final

### Para Integrantes de Brigada

1. Ver conglomerado activo de su brigada
2. Colaborar en el registro de observaciones
3. Subir evidencias fotográficas
4. Ver historial de observaciones validadas

## 🔒 Seguridad

- Autenticación JWT con tokens que expiran
- Contraseñas encriptadas con bcrypt
- Control de acceso basado en roles
- Validación de entrada en backend
- Sistema de auditoría de acciones
- Comunicación segura entre microservicios
- Validación de llamadas internas con headers especiales

## 📜 Scripts Disponibles

El proyecto incluye varios scripts útiles para el desarrollo y mantenimiento:

### Scripts de Desarrollo

**start-dev.sh** - Inicia todos los servicios
```bash
./start-dev.sh
```
Inicia automáticamente todos los microservicios del backend y el frontend.

**stop-dev.sh** - Detiene todos los servicios
```bash
./stop-dev.sh
```
Detiene todos los procesos de Node.js y Vite iniciados.

### Scripts de Base de Datos

**check-database.sh** - Verifica el estado de la base de datos
```bash
./check-database.sh
```
Muestra información sobre tablas, registros y el estado general de la BD.

**reset-database.sh** - Resetea la base de datos
```bash
./reset-database.sh
```
⚠️ **CUIDADO**: Elimina todos los datos y reinicia la base de datos desde cero.

### Scripts de Estructura

**create_structure.sh** - Genera la estructura del proyecto
```bash
./create_structure.sh
```
Crea un archivo de texto con la estructura completa del proyecto.

---

## 📚 Documentación Adicional

- **[CHANGELOG.md](CHANGELOG.md)** - Registro de cambios y nuevas características
- **[frontend/README.md](frontend/README.md)** - Documentación específica del frontend

---

## 📄 Licencia

Este proyecto es parte de un proyecto integrador académico.

## 🤝 Contribuciones

Este es un proyecto académico. Para contribuciones o sugerencias, contactar al equipo de desarrollo.

## 📞 Soporte

Para reportar problemas o solicitar ayuda, crear un issue en el repositorio del proyecto.

---

**Desarrollado con ❤️ por el equipo de EcoDatos**
