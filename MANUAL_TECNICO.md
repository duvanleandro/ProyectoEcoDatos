# 🔧 Manual Técnico - EcoDatos

**Sistema de Gestión del Inventario Forestal Nacional**

**Documentación para Desarrolladores y Administradores de Sistemas**

---

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Instalación y Configuración](#instalación-y-configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [API REST Endpoints](#api-rest-endpoints)
- [Autenticación y Seguridad](#autenticación-y-seguridad)
- [Frontend - Arquitectura React](#frontend---arquitectura-react)
- [Backend - Microservicios](#backend---microservicios)
- [Deployment](#deployment)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Mantenimiento](#mantenimiento)
- [Desarrollo](#desarrollo)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Referencias](#referencias)

---

## 🌟 Introducción

### Descripción Técnica

EcoDatos es una aplicación web full-stack construida con:
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Node.js + Express (Arquitectura de Microservicios)
- **Base de Datos**: PostgreSQL 16
- **Autenticación**: JWT (JSON Web Tokens)
- **Comunicación**: REST APIs con Axios

### Características Técnicas

- Arquitectura de microservicios independientes
- Diseño responsive (mobile-first)
- Autenticación JWT con roles
- Sistema de auditoría completo
- Gestión de archivos (Multer)
- Validación de datos en backend
- Rate limiting para seguridad
- CORS configurado

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                   │
│                    Puerto 5173                              │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Components  │  │    Pages     │  │   Services   │    │
│  │  (Reutiliz.) │  │  (Vistas)    │  │  (API Calls) │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Context    │  │    Hooks     │  │    Config    │    │
│  │  (Estado)    │  │(Personalizad)│  │  (Axios/API) │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE MICROSERVICIOS                    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │auth-service  │  │conglomerado  │  │  brigada     │    │
│  │   :3001      │  │   :3002      │  │   :3003      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  especie     │  │ observacion  │                        │
│  │   :3004      │  │   :3005      │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                             │
│  Comunicación:                                              │
│  • HTTP REST con Axios                                      │
│  • Headers JWT para auth                                    │
│  • x-internal-service para llamadas internas               │
└─────────────────────────────────────────────────────────────┘
                              ↓ TCP/IP
┌─────────────────────────────────────────────────────────────┐
│               BASE DE DATOS PostgreSQL 16                   │
│                     Puerto 5432                             │
│                                                             │
│  Tablas: usuario, brigada, integrante, conglomerado,       │
│          subparcela, especie, observacion, logs_auditoria  │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario → React App → Axios → JWT Header → Microservicio
                                                ↓
                                           Middleware Auth
                                                ↓
                                            Controller
                                                ↓
                                             Service
                                                ↓
                                         Sequelize ORM
                                                ↓
                                           PostgreSQL
```

---

## 📦 Requisitos del Sistema

### Servidor de Desarrollo

**Hardware mínimo:**
- CPU: 2 cores
- RAM: 4 GB
- Disco: 10 GB libres

**Hardware recomendado:**
- CPU: 4 cores
- RAM: 8 GB
- Disco: 20 GB SSD

### Software Requerido

| Software | Versión Mínima | Versión Recomendada |
|----------|----------------|---------------------|
| Node.js | 18.0.0 | 20.x LTS |
| npm | 8.0.0 | 10.x |
| PostgreSQL | 13.0 | 16.x |
| Git | 2.30.0 | 2.40+ |

**Sistema Operativo:**
- Linux (Ubuntu 20.04+, CentOS 8+, Debian 11+)
- macOS 11+ (Big Sur)
- Windows 10+ (con WSL2 recomendado)

---

## 🚀 Instalación y Configuración

### 1. Instalación de Dependencias del Sistema

#### Ubuntu/Debian

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL 16
sudo apt install -y postgresql-16 postgresql-contrib-16

# Instalar Git
sudo apt install -y git

# Verificar instalaciones
node --version
npm --version
psql --version
git --version
```

#### macOS

```bash
# Instalar Homebrew si no está instalado
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar dependencias
brew install node@20
brew install postgresql@16
brew install git

# Iniciar PostgreSQL
brew services start postgresql@16
```

#### Windows (con WSL2)

```powershell
# Instalar WSL2 con Ubuntu
wsl --install

# Dentro de WSL, seguir instrucciones de Ubuntu
```

---

### 2. Configuración de PostgreSQL

#### Crear Usuario y Base de Datos

```bash
# Cambiar al usuario postgres
sudo -u postgres psql

# Dentro de psql:
CREATE DATABASE ecodatos;
CREATE USER ecodatos_user WITH ENCRYPTED PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE ecodatos TO ecodatos_user;
\q
```

#### Habilitar PostGIS (Opcional para funciones geoespaciales avanzadas)

```bash
sudo -u postgres psql -d ecodatos

CREATE EXTENSION postgis;
\q
```

#### Configurar acceso remoto (si es necesario)

Editar `/etc/postgresql/16/main/postgresql.conf`:

```conf
listen_addresses = '*'
```

Editar `/etc/postgresql/16/main/pg_hba.conf`:

```conf
# IPv4 local connections:
host    all             all             0.0.0.0/0               md5
```

Reiniciar PostgreSQL:

```bash
sudo systemctl restart postgresql
```

---

### 3. Clonar el Repositorio

```bash
# Clonar
git clone https://github.com/duvanleandro/ProyectoIntegrador.git

# Navegar al proyecto
cd ProyectoIntegrador/ecodatos-project
```

---

### 4. Ejecutar Migraciones de Base de Datos

```bash
# Conectar a PostgreSQL
sudo -u postgres psql -d ecodatos

# Ejecutar migraciones en orden
\i backend/migrations/001_create_usuario.sql
\i backend/migrations/002_create_brigada.sql
\i backend/migrations/003_create_conglomerado.sql
\i backend/migrations/004_create_especie.sql
\i backend/migrations/005_create_observacion.sql
\i backend/migrations/006_create_logs_auditoria.sql
\i backend/migrations/add_fecha_inicio_to_conglomerado.sql

# Salir
\q
```

**Script alternativo** (desde la raíz del proyecto):

```bash
./reset-database.sh
```

⚠️ **Advertencia**: Este script elimina y recrea toda la base de datos.

---

### 5. Configurar Variables de Entorno

#### Backend - Auth Service

Crear `backend/services/auth-service/.env`:

```env
# Puerto del servicio
PORT=3001

# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=ecodatos_user
DB_PASSWORD=tu_password_seguro

# JWT
JWT_SECRET=tu_jwt_secret_key_muy_seguro_y_aleatorio
JWT_EXPIRES_IN=7d

# Entorno
NODE_ENV=development
```

#### Backend - Conglomerado Service

Crear `backend/services/conglomerado-service/.env`:

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=ecodatos_user
DB_PASSWORD=tu_password_seguro
JWT_SECRET=tu_jwt_secret_key_muy_seguro_y_aleatorio
NODE_ENV=development
```

#### Backend - Brigada Service

Crear `backend/services/brigada-service/.env`:

```env
PORT=3003
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=ecodatos_user
DB_PASSWORD=tu_password_seguro
JWT_SECRET=tu_jwt_secret_key_muy_seguro_y_aleatorio
NODE_ENV=development

# URL de auth-service para comunicación interna
AUTH_SERVICE_URL=http://localhost:3001
```

#### Backend - Especie Service

Crear `backend/services/especie-service/.env`:

```env
PORT=3004
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=ecodatos_user
DB_PASSWORD=tu_password_seguro
JWT_SECRET=tu_jwt_secret_key_muy_seguro_y_aleatorio
NODE_ENV=development
```

#### Backend - Observacion Service

Crear `backend/services/observacion-service/.env`:

```env
PORT=3005
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=ecodatos_user
DB_PASSWORD=tu_password_seguro
JWT_SECRET=tu_jwt_secret_key_muy_seguro_y_aleatorio
NODE_ENV=development

# Configuración de uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
MAX_FILES=10
```

#### Frontend

Crear `frontend/.env`:

```env
# URLs de los microservicios
VITE_API_URL=http://localhost:3000
VITE_AUTH_SERVICE=http://localhost:3001
VITE_BRIGADA_SERVICE=http://localhost:3003
VITE_CONGLOMERADO_SERVICE=http://localhost:3002
VITE_ESPECIE_SERVICE=http://localhost:3004
VITE_OBSERVACION_SERVICE=http://localhost:3005
```

---

### 6. Instalar Dependencias de Node.js

```bash
# Auth Service
cd backend/services/auth-service
npm install

# Conglomerado Service
cd ../conglomerado-service
npm install

# Brigada Service
cd ../brigada-service
npm install

# Especie Service
cd ../especie-service
npm install

# Observacion Service
cd ../observacion-service
npm install

# Frontend
cd ../../../frontend
npm install
```

---

### 7. Iniciar los Servicios

#### Opción A: Script Automático (Recomendado)

```bash
# Desde el directorio ecodatos-project
./start-dev.sh
```

Este script inicia automáticamente:
- Todos los microservicios del backend
- El servidor de desarrollo del frontend

#### Opción B: Manual (Para desarrollo)

```bash
# Terminal 1 - Auth Service
cd backend/services/auth-service
npm run dev

# Terminal 2 - Conglomerado Service
cd backend/services/conglomerado-service
npm run dev

# Terminal 3 - Brigada Service
cd backend/services/brigada-service
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

---

### 8. Verificar Instalación

#### Comprobar Servicios Backend

```bash
# Auth Service
curl http://localhost:3001/health

# Conglomerado Service
curl http://localhost:3002/health

# Brigada Service
curl http://localhost:3003/health

# Especie Service
curl http://localhost:3004/health

# Observacion Service
curl http://localhost:3005/health
```

Cada servicio debe responder con estado 200 OK.

#### Comprobar Frontend

Abrir navegador: `http://localhost:5173`

Debe mostrar la pantalla de login.

#### Comprobar Base de Datos

```bash
# Script de verificación incluido
./check-database.sh
```

---

## 📁 Estructura del Proyecto

### Estructura Completa

```
ecodatos-project/
├── backend/
│   ├── services/
│   │   ├── auth-service/
│   │   │   ├── src/
│   │   │   │   ├── config/
│   │   │   │   │   └── database.js          # Configuración Sequelize
│   │   │   │   ├── models/
│   │   │   │   │   └── Usuario.js           # Modelo Usuario
│   │   │   │   ├── controllers/
│   │   │   │   │   └── authController.js    # Lógica de controlador
│   │   │   │   ├── services/
│   │   │   │   │   └── authService.js       # Lógica de negocio
│   │   │   │   ├── middleware/
│   │   │   │   │   ├── authMiddleware.js    # Validación JWT
│   │   │   │   │   ├── auditLogger.js       # Logs de auditoría
│   │   │   │   │   ├── rateLimiter.js       # Rate limiting
│   │   │   │   │   └── validationMiddleware.js # Validaciones
│   │   │   │   ├── routes/
│   │   │   │   │   └── authRoutes.js        # Definición de rutas
│   │   │   │   └── index.js                 # Punto de entrada
│   │   │   ├── .env                         # Variables de entorno
│   │   │   └── package.json
│   │   │
│   │   ├── conglomerado-service/
│   │   ├── brigada-service/
│   │   ├── especie-service/
│   │   └── observacion-service/
│   │
│   ├── migrations/                          # Migraciones SQL
│   │   ├── 001_create_usuario.sql
│   │   ├── 002_create_brigada.sql
│   │   ├── 003_create_conglomerado.sql
│   │   ├── 004_create_especie.sql
│   │   ├── 005_create_observacion.sql
│   │   ├── 006_create_logs_auditoria.sql
│   │   └── add_fecha_inicio_to_conglomerado.sql
│   │
│   └── shared/                              # Código compartido
│       ├── database/
│       ├── types/
│       └── utils/
│
├── frontend/
│   ├── src/
│   │   ├── components/                      # Componentes React
│   │   │   ├── common/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── BannerUsuarioInactivo.jsx
│   │   │   ├── dashboard/
│   │   │   │   └── ConglomeradoActivoCard.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/                           # Páginas/Vistas
│   │   │   ├── auth/
│   │   │   │   └── Login.jsx
│   │   │   ├── admin/
│   │   │   │   └── GestionUsuarios.jsx
│   │   │   ├── conglomerados/
│   │   │   ├── brigadas/
│   │   │   ├── observaciones/
│   │   │   └── ...
│   │   │
│   │   ├── config/                          # Configuración
│   │   │   ├── api.js                       # URLs de endpoints
│   │   │   └── axios.js                     # Instancia Axios
│   │   │
│   │   ├── context/                         # Context API
│   │   │   └── UsuarioContext.jsx
│   │   │
│   │   ├── hooks/                           # Hooks personalizados
│   │   │   ├── useAsync.js
│   │   │   ├── useFormValidation.js
│   │   │   ├── usePagination.js
│   │   │   └── useUsuarioActivo.js
│   │   │
│   │   ├── services/                        # Servicios API
│   │   │   └── observacionService.js
│   │   │
│   │   ├── utils/                           # Utilidades
│   │   ├── App.jsx                          # Componente raíz
│   │   ├── main.jsx                         # Punto de entrada
│   │   └── index.css                        # Estilos globales
│   │
│   ├── public/
│   ├── .env                                 # Variables de entorno
│   ├── package.json
│   ├── vite.config.js                       # Configuración Vite
│   └── tailwind.config.js                   # Configuración Tailwind
│
├── CHANGELOG.md
├── README.md
├── start-dev.sh
├── stop-dev.sh
├── check-database.sh
├── reset-database.sh
└── package.json
```

---

## 🗄️ Base de Datos

### Esquema de Tablas

#### Tabla: usuario

```sql
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,         -- Bcrypt hash
  rol VARCHAR(50) NOT NULL,               -- admin, coordinador, jefe_brigada, integrante_brigada
  nombre_completo VARCHAR(200),
  email VARCHAR(150),
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  CONSTRAINT rol_valido CHECK (rol IN ('admin', 'coordinador', 'jefe_brigada', 'integrante_brigada'))
);

CREATE INDEX idx_usuario_username ON usuario(username);
CREATE INDEX idx_usuario_rol ON usuario(rol);
CREATE INDEX idx_usuario_activo ON usuario(activo);
```

#### Tabla: brigada

```sql
CREATE TABLE brigada (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  zona_designada VARCHAR(200),
  activo BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_brigada_activo ON brigada(activo);
```

#### Tabla: integrante

```sql
CREATE TABLE integrante (
  id SERIAL PRIMARY KEY,
  nombre_apellidos VARCHAR(200) NOT NULL,
  rol VARCHAR(100) NOT NULL,              -- jefe_brigada, botanico, tecnico_auxiliar, coinvestigador
  telefono VARCHAR(50),
  email VARCHAR(150),
  especialidad VARCHAR(200)
);
```

#### Tabla: brigadaintegrante (Relación N:M)

```sql
CREATE TABLE brigadaintegrante (
  id_brigada INTEGER REFERENCES brigada(id) ON DELETE CASCADE,
  id_integrante INTEGER REFERENCES integrante(id) ON DELETE CASCADE,
  PRIMARY KEY (id_brigada, id_integrante)
);

CREATE INDEX idx_brigadaintegrante_brigada ON brigadaintegrante(id_brigada);
CREATE INDEX idx_brigadaintegrante_integrante ON brigadaintegrante(id_integrante);
```

#### Tabla: conglomerado

```sql
CREATE TABLE conglomerado (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  estado VARCHAR(50) DEFAULT 'Pendiente',  -- Pendiente, Aprobado, Asignado, En_Proceso, Completado, Rechazado
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_aprobacion TIMESTAMP,
  fecha_inicio TIMESTAMP,                   -- Se registra al iniciar (En_Proceso)
  brigada_id INTEGER,
  brigada_nombre VARCHAR(255),
  fecha_asignacion TIMESTAMP,
  ubicacion GEOGRAPHY(POINT, 4326),         -- PostGIS (opcional)
  CONSTRAINT estado_valido CHECK (estado IN ('Pendiente', 'Aprobado', 'Asignado', 'En_Proceso', 'Completado', 'Rechazado'))
);

CREATE INDEX idx_conglomerado_estado ON conglomerado(estado);
CREATE INDEX idx_conglomerado_brigada ON conglomerado(brigada_id);
CREATE INDEX idx_conglomerado_coords ON conglomerado(latitud, longitud);
```

#### Tabla: subparcela

```sql
CREATE TABLE subparcela (
  id SERIAL PRIMARY KEY,
  id_conglomerado INTEGER REFERENCES conglomerado(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  distancia_metros DECIMAL(10, 2),
  azimut_grados DECIMAL(5, 2),
  tipo VARCHAR(50),
  ubicacion GEOGRAPHY(POINT, 4326)
);

CREATE INDEX idx_subparcela_conglomerado ON subparcela(id_conglomerado);
```

#### Tabla: especie

```sql
CREATE TABLE especie (
  id SERIAL PRIMARY KEY,
  nombre_cientifico VARCHAR(255) NOT NULL,
  nombre_comun VARCHAR(255),
  familia VARCHAR(200),
  genero VARCHAR(200),
  tipo VARCHAR(100),                        -- flora, fauna
  descripcion TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  CONSTRAINT tipo_valido CHECK (tipo IN ('flora', 'fauna'))
);

CREATE INDEX idx_especie_cientifico ON especie(nombre_cientifico);
CREATE INDEX idx_especie_comun ON especie(nombre_comun);
CREATE INDEX idx_especie_tipo ON especie(tipo);
```

#### Tabla: observacion

```sql
CREATE TABLE observacion (
  id SERIAL PRIMARY KEY,
  id_conglomerado INTEGER REFERENCES conglomerado(id),
  id_brigada INTEGER REFERENCES brigada(id),
  id_usuario INTEGER REFERENCES usuario(id),

  -- Datos climáticos
  temperatura DECIMAL(5, 2),
  humedad DECIMAL(5, 2),
  precipitacion DECIMAL(8, 2),

  -- Datos de terreno
  pendiente DECIMAL(5, 2),
  tipo_suelo VARCHAR(100),
  cobertura_vegetal VARCHAR(100),

  -- Datos GPS
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  altitud DECIMAL(8, 2),
  precision_gps DECIMAL(6, 2),

  -- Observaciones
  observaciones_fauna TEXT,
  observaciones_flora TEXT,
  notas_adicionales TEXT,

  -- Evidencia
  evidencias_fotograficas TEXT[],           -- Array de rutas de archivos

  -- Control de tiempo
  hora_inicio TIMESTAMP,
  hora_fin TIMESTAMP,

  -- Validación
  validado_jefe BOOLEAN DEFAULT FALSE,
  validado_admin BOOLEAN DEFAULT FALSE,

  fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_observacion_conglomerado ON observacion(id_conglomerado);
CREATE INDEX idx_observacion_brigada ON observacion(id_brigada);
CREATE INDEX idx_observacion_usuario ON observacion(id_usuario);
CREATE INDEX idx_observacion_validaciones ON observacion(validado_jefe, validado_admin);
```

#### Tabla: logs_auditoria

```sql
CREATE TABLE logs_auditoria (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuario(id),
  accion VARCHAR(100) NOT NULL,             -- login, crear, editar, eliminar, etc.
  tabla VARCHAR(100),
  registro_id INTEGER,
  datos_antiguos JSONB,
  datos_nuevos JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  fecha TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_usuario ON logs_auditoria(id_usuario);
CREATE INDEX idx_logs_fecha ON logs_auditoria(fecha);
CREATE INDEX idx_logs_accion ON logs_auditoria(accion);
```

---

## 🔌 API REST Endpoints

### Auth Service (Puerto 3001)

#### POST `/api/auth/login`

Autenticación de usuario.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "username": "admin",
    "rol": "admin",
    "nombre_completo": "Administrador del Sistema",
    "email": "admin@ecodatos.com"
  }
}
```

#### GET `/api/auth/perfil`

Obtener perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "admin",
  "rol": "admin",
  "nombre_completo": "Administrador del Sistema",
  "email": "admin@ecodatos.com",
  "activo": true,
  "fecha_creacion": "2024-01-15T10:00:00.000Z"
}
```

#### POST `/api/auth/usuarios`

Crear nuevo usuario (solo admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "username": "jefe1",
  "password": "jefe123",
  "rol": "jefe_brigada",
  "nombre_completo": "Juan Pérez",
  "email": "juan@ecodatos.com"
}
```

**Response (201):**
```json
{
  "mensaje": "Usuario creado exitosamente",
  "usuario": {
    "id": 5,
    "username": "jefe1",
    "rol": "jefe_brigada",
    ...
  }
}
```

#### PUT `/api/auth/usuarios/:id`

Editar usuario (solo admin).

#### POST `/api/auth/cambiar-contrasena`

Cambiar contraseña propia.

**Request:**
```json
{
  "contrasenaActual": "admin123",
  "contrasenaNueva": "nuevaPassword456"
}
```

#### GET `/api/auth/logs`

Obtener logs de auditoría (solo admin).

**Query params:**
- `usuarioId` (opcional)
- `accion` (opcional)
- `limit` (opcional, default: 100)

---

### Conglomerado Service (Puerto 3002)

#### POST `/api/conglomerados/generar`

Generar conglomerados aleatorios.

**Request:**
```json
{
  "cantidad": 10
}
```

**Response (201):**
```json
{
  "mensaje": "10 conglomerados generados exitosamente",
  "conglomerados": [...]
}
```

#### GET `/api/conglomerados`

Listar todos los conglomerados.

**Query params:**
- `estado` (opcional): Filtrar por estado
- `brigada_id` (opcional): Filtrar por brigada

#### GET `/api/conglomerados/:id`

Obtener detalle de un conglomerado.

**Response (200):**
```json
{
  "id": 1,
  "nombre": "CONG-001",
  "latitud": 4.570868,
  "longitud": -74.297333,
  "estado": "Aprobado",
  "subparcelas": [
    {
      "id": 1,
      "nombre": "CONG-001-Central",
      "latitud": 4.570868,
      "longitud": -74.297333,
      ...
    },
    ...
  ]
}
```

#### PUT `/api/conglomerados/:id/aprobar`

Aprobar conglomerado (solo admin).

**Response (200):**
```json
{
  "mensaje": "Conglomerado aprobado y 5 subparcelas creadas",
  "conglomerado": {...},
  "subparcelas": [...]
}
```

#### PUT `/api/conglomerados/:id/iniciar`

Iniciar trabajo en conglomerado (jefe de brigada).

**Response (200):**
```json
{
  "mensaje": "Conglomerado iniciado exitosamente",
  "fecha_inicio": "2024-11-12T14:30:00.000Z"
}
```

#### PUT `/api/conglomerados/:id/completar`

Completar conglomerado (jefe de brigada).

---

### Brigada Service (Puerto 3003)

#### POST `/api/brigadas`

Crear brigada (solo admin).

**Request:**
```json
{
  "nombre": "Brigada Norte 1",
  "zona_designada": "Departamento de Cundinamarca"
}
```

#### GET `/api/brigadas`

Listar todas las brigadas.

#### GET `/api/brigadas/:id`

Obtener detalle de brigada con integrantes.

#### POST `/api/brigadas/:id/integrantes`

Agregar integrante a brigada.

**Request:**
```json
{
  "nombre_apellidos": "María García",
  "rol": "botanico",
  "telefono": "3001234567",
  "email": "maria@email.com",
  "especialidad": "Botánica Tropical"
}
```

#### DELETE `/api/brigadas/:brigadaId/integrantes/:integranteId`

Eliminar integrante de brigada.

#### POST `/api/brigadas/:id/asignar-conglomerado`

Asignar conglomerado a brigada (solo admin).

**Request:**
```json
{
  "conglomeradoId": 5
}
```

---

### Especie Service (Puerto 3004)

#### GET `/api/especies`

Listar especies.

**Query params:**
- `tipo` (opcional): flora, fauna
- `search` (opcional): Buscar por nombre

#### POST `/api/especies`

Crear especie (solo admin).

**Request:**
```json
{
  "nombre_cientifico": "Quercus humboldtii",
  "nombre_comun": "Roble",
  "familia": "Fagaceae",
  "genero": "Quercus",
  "tipo": "flora",
  "descripcion": "Árbol nativo de los bosques andinos"
}
```

---

### Observacion Service (Puerto 3005)

#### POST `/api/observaciones`

Registrar observación.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request (FormData):**
```
conglomeradoId: 1
temperatura: 18.5
humedad: 75
precipitacion: 0
pendiente: 25
tipo_suelo: "Franco arcilloso"
cobertura_vegetal: "80"
latitud: 4.570868
longitud: -74.297333
altitud: 2640
precision_gps: 3.5
observaciones_fauna: "Se observaron..."
observaciones_flora: "Especies identificadas..."
notas_adicionales: "..."
fotos: [File, File, ...]
```

**Response (201):**
```json
{
  "mensaje": "Observación registrada exitosamente",
  "observacion": {...}
}
```

#### GET `/api/observaciones`

Listar observaciones.

**Query params:**
- `conglomeradoId` (opcional)
- `brigadaId` (opcional)
- `validado_jefe` (opcional): true/false
- `validado_admin` (opcional): true/false

#### PUT `/api/observaciones/:id/validar-jefe`

Validar observación como jefe (jefe de brigada).

#### PUT `/api/observaciones/:id/validar-admin`

Validar observación como admin (admin/coordinador).

---

## 🔐 Autenticación y Seguridad

### JWT (JSON Web Tokens)

#### Generación de Token

```javascript
// authService.js
const jwt = require('jsonwebtoken');

const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};
```

#### Middleware de Verificación

```javascript
// authMiddleware.js
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
    req.usuario = usuario;
    next();
  });
};
```

#### Verificación de Roles

```javascript
const esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Requiere rol admin' });
  }
  next();
};

const esJefeBrigada = (req, res, next) => {
  if (req.usuario.rol !== 'jefe_brigada' && req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }
  next();
};
```

### Bcrypt - Encriptación de Contraseñas

```javascript
const bcrypt = require('bcryptjs');

// Encriptar contraseña
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Verificar contraseña
const verificarPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

### Rate Limiting

```javascript
// rateLimiter.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de login. Intente de nuevo en 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Uso en rutas
router.post('/login', loginLimiter, authController.login);
```

### CORS

```javascript
// index.js
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-internal-service']
}));
```

---

## ⚛️ Frontend - Arquitectura React

### Configuración de Axios

```javascript
// config/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 10000,
});

// Interceptor para agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### Context API - Usuario Global

```javascript
// context/UsuarioContext.jsx
import { createContext, useState, useEffect } from 'react';

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setLoading(false);
  }, []);

  const login = (usuarioData, token) => {
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
    localStorage.setItem('token', token);
    setUsuario(usuarioData);
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <UsuarioContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </UsuarioContext.Provider>
  );
};
```

### Hook Personalizado - useAsync

```javascript
// hooks/useAsync.js
import { useState, useCallback } from 'react';

export const useAsync = (asyncFunction) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    setStatus('loading');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction(...params);
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
    isIdle: status === 'idle',
  };
};
```

---

## 🚀 Deployment

### Producción con PM2

#### Instalar PM2

```bash
npm install -g pm2
```

#### Configurar ecosystem.config.js

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'auth-service',
      script: './backend/services/auth-service/src/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'conglomerado-service',
      script: './backend/services/conglomerado-service/src/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    },
    // ... otros servicios
  ]
};
```

#### Iniciar con PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Nginx como Reverse Proxy

#### Configuración de Nginx

```nginx
# /etc/nginx/sites-available/ecodatos

server {
    listen 80;
    server_name ecodatos.example.com;

    # Frontend
    location / {
        root /var/www/ecodatos/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Auth Service
    location /api/auth {
        proxy_pass http://localhost:3001/api/auth;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Conglomerado Service
    location /api/conglomerados {
        proxy_pass http://localhost:3002/api/conglomerados;
        # ... mismos headers
    }

    # ... otros servicios
}
```

#### Habilitar sitio

```bash
sudo ln -s /etc/nginx/sites-available/ecodatos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### HTTPS con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ecodatos.example.com
```

---

## 📊 Monitoreo y Logs

### PM2 Monitoring

```bash
# Ver logs
pm2 logs

# Monitorear procesos
pm2 monit

# Ver estado
pm2 status

# Reiniciar servicio
pm2 restart auth-service
```

### Logs de Aplicación

Los logs se guardan automáticamente en:
```
~/.pm2/logs/
├── auth-service-error.log
├── auth-service-out.log
├── conglomerado-service-error.log
└── ...
```

### Logs de Base de Datos

PostgreSQL logs:
```bash
sudo tail -f /var/log/postgresql/postgresql-16-main.log
```

---

## 🔧 Mantenimiento

### Backup de Base de Datos

```bash
# Backup completo
pg_dump -U ecodatos_user -d ecodatos -F c -f ecodatos_backup_$(date +%Y%m%d).dump

# Backup solo esquema
pg_dump -U ecodatos_user -d ecodatos -s -f ecodatos_schema_$(date +%Y%m%d).sql

# Backup solo datos
pg_dump -U ecodatos_user -d ecodatos -a -f ecodatos_data_$(date +%Y%m%d).sql
```

### Restaurar Backup

```bash
# Restaurar desde dump
pg_restore -U ecodatos_user -d ecodatos -c ecodatos_backup_20241112.dump

# Restaurar desde SQL
psql -U ecodatos_user -d ecodatos -f ecodatos_backup_20241112.sql
```

### Actualización del Sistema

```bash
# Backend
cd backend/services/auth-service
git pull
npm install
pm2 restart auth-service

# Frontend
cd frontend
git pull
npm install
npm run build
# Copiar dist/ a servidor web
```

---

## 💻 Desarrollo

### Convenciones de Código

#### JavaScript/Node.js

- Usar **camelCase** para variables y funciones
- Usar **PascalCase** para clases y componentes React
- Usar **UPPER_SNAKE_CASE** para constantes
- Usar `const` por defecto, `let` solo cuando sea necesario
- Evitar `var`
- Usar arrow functions cuando sea apropiado
- Comentar código complejo

#### Estructura de Archivos

- Un archivo por modelo, controlador, servicio
- Nombres descriptivos: `userController.js`, `authService.js`
- Index files para exportaciones centralizadas

### Git Workflow

```bash
# Crear rama feature
git checkout -b feature/nueva-funcionalidad

# Hacer commits descriptivos
git commit -m "feat: agregar validación de email en registro"
git commit -m "fix: corregir error en login"
git commit -m "docs: actualizar README"

# Push y Pull Request
git push origin feature/nueva-funcionalidad
```

### Tipos de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato, sin cambios de código
- `refactor:` Refactorización
- `test:` Agregar tests
- `chore:` Mantenimiento

---

## 🧪 Testing

### Configuración de Jest

```bash
npm install --save-dev jest supertest
```

#### jest.config.js

```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
};
```

### Ejemplo de Test

```javascript
// __tests__/auth.test.js
const request = require('supertest');
const app = require('../src/index');

describe('POST /api/auth/login', () => {
  it('debe retornar token con credenciales válidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('usuario');
  });

  it('debe retornar error con credenciales inválidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
  });
});
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Causas posibles:**
- PostgreSQL no está corriendo
- Credenciales incorrectas en `.env`
- Firewall bloqueando puerto 5432

**Solución:**
```bash
# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Iniciar PostgreSQL
sudo systemctl start postgresql

# Verificar puerto
sudo netstat -tlnp | grep 5432

# Probar conexión
psql -U ecodatos_user -d ecodatos -h localhost
```

### Error: "Port already in use"

**Causa:** El puerto ya está ocupado por otro proceso.

**Solución:**
```bash
# Encontrar proceso en puerto
sudo lsof -i :3001

# Matar proceso
sudo kill -9 <PID>

# O cambiar puerto en .env
```

### Error: "Module not found"

**Causa:** Dependencias no instaladas.

**Solución:**
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# O limpiar caché
npm cache clean --force
npm install
```

---

## 📚 Referencias

### Documentación Oficial

- **Node.js**: https://nodejs.org/docs/
- **Express**: https://expressjs.com/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Sequelize**: https://sequelize.org/docs/
- **JWT**: https://jwt.io/introduction

### Herramientas

- **Postman**: Para testing de APIs
- **pgAdmin**: GUI para PostgreSQL
- **VS Code**: Editor recomendado

---

**Versión del Manual**: 1.0
**Última actualización**: Noviembre 12, 2024
**Sistema**: EcoDatos v1.0

---

**Equipo de Desarrollo**
- Universidad de Investigación y Desarrollo
- Grupo 5A - Ingeniería de Sistemas
- Proyecto Integrador 2025-1
