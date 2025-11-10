# 🌳 EcoDatos - Sistema de Inventario Forestal Nacional

Sistema web integral para la gestión del Inventario Forestal Nacional de Colombia (IDEAM), desarrollado con **arquitectura de microservicios**.

## 👥 Equipo de Desarrollo

**Integrantes:**
- Duvan Leandro Pedraza Gonzalez
- Stefany Dayana Medina Galvis
- Juan Daniel Quinchanegua
- Jonathan Arley Monsalve Salazar
- Duvan Ramirez Molina

**Grupo:** 5A
**Institución:** Universidad de Investigación y Desarrollo
**Período:** 2025-1
**Nivel:** Quinto Semestre - Ingeniería de Sistemas

---

## 📋 Descripción del Proyecto

EcoDatos es una plataforma completa para la gestión de conglomerados forestales, brigadas de campo, observaciones de especies y recolección de datos del Inventario Forestal Nacional (IFN) de Colombia. El sistema permite generar conglomerados georreferenciados, asignar brigadas de trabajo, registrar observaciones de campo con evidencia fotográfica, y realizar el seguimiento completo del proceso de muestreo forestal.

### Características Principales

- 🗺️ **Generación automática de conglomerados** con geolocalización en Colombia
- 👥 **Gestión de brigadas** con validación de composición (jefe, botánico, técnico, coinvestigador)
- 📊 **Sistema de aprobación** de conglomerados con flujo de estados
- 🎯 **Asignación inteligente** de brigadas a conglomerados
- 📱 **Panel de brigadas** para gestión de trabajo en campo
- 📝 **Registro de observaciones** con datos climáticos, GPS y evidencia fotográfica
- ✅ **Sistema de validación** por jefe de brigada y administrador
- 🔐 **Sistema de autenticación** JWT con roles (Admin, Coordinador, Jefe de Brigada, Integrante)
- 🛡️ **Sistema de auditoría** con logs detallados de acciones
- 🗃️ **Base de datos PostgreSQL** con datos geoespaciales
- 🎨 **Interfaz moderna** con React, TailwindCSS y componentes reutilizables

---

## 🏗️ Arquitectura del Sistema

### Arquitectura de Microservicios

El sistema está construido utilizando una **arquitectura de microservicios** que permite escalabilidad, mantenibilidad y despliegue independiente de cada componente.

```
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE PRESENTACIÓN                      │
│            React 18 + Vite + TailwindCSS + Axios            │
│                    (Puerto 5173)                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  CAPA DE MICROSERVICIOS                     │
│                                                             │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────┐│
│  │  Auth Service  │  │  Conglomerado    │  │   Brigada   ││
│  │  Puerto 3001   │  │  Service         │  │   Service   ││
│  │                │  │  Puerto 3002     │  │  Puerto 3003││
│  │ • Usuarios     │  │ • Conglomerados  │  │ • Brigadas  ││
│  │ • JWT          │  │ • Subparcelas    │  │ • Integrantes││
│  │ • Auditoría    │  │ • Estados        │  │ • Asignación││
│  └────────────────┘  └──────────────────┘  └─────────────┘│
│                                                             │
│  ┌────────────────┐  ┌──────────────────┐                  │
│  │ Especie Service│  │ Observacion      │                  │
│  │  Puerto 3004   │  │ Service          │                  │
│  │                │  │  Puerto 3005     │                  │
│  │ • Especies     │  │ • Observaciones  │                  │
│  │ • Taxonomía    │  │ • Validación     │                  │
│  │ • Catálogo     │  │ • Fotos (Multer) │                  │
│  └────────────────┘  └──────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE DATOS                          │
│              PostgreSQL 16 (Puerto 5432)                    │
│         Base de datos compartida entre servicios            │
└─────────────────────────────────────────────────────────────┘
```

### Microservicios Implementados

#### 1. **auth-service** (Puerto 3001)
**Responsabilidades:**
- Autenticación y autorización con JWT
- Gestión de usuarios (CRUD, activación/inactivación)
- Control de roles (Admin, Coordinador, Jefe Brigada, Integrante)
- Sistema de auditoría con logs detallados
- Middleware de autenticación compartido
- Rate limiting para prevención de ataques
- Validación de datos de entrada

**Middleware incluido:**
- `authMiddleware.js` - Validación de tokens JWT
- `auditLogger.js` - Registro de acciones de usuarios
- `rateLimiter.js` - Límite de peticiones por IP
- `validationMiddleware.js` - Validación de formularios

#### 2. **conglomerado-service** (Puerto 3002)
**Responsabilidades:**
- Generación aleatoria de conglomerados en territorio colombiano
- Cálculo automático de 5 subparcelas por conglomerado
- Gestión de estados: Pendiente → Aprobado → Asignado → En_Proceso → Completado
- Aprobación/rechazo por administrador
- Registro de fecha de inicio (cuando cambia a En_Proceso)
- Control de un solo conglomerado activo por brigada
- Estadísticas y reportes

**Archivos clave:**
- `models/Conglomerado.js` - Modelo con campo `fecha_inicio`
- `controllers/conglomeradoController.js` - Lógica de negocio

#### 3. **brigada-service** (Puerto 3003)
**Responsabilidades:**
- Gestión de brigadas (CRUD)
- Gestión de integrantes (asignación a brigadas)
- Validación de composición mínima (1 jefe, 1 botánico, 1 técnico, 1 coinvestigador)
- Asignación de conglomerados a brigadas
- Activación/desactivación de brigadas
- Consulta de brigada del usuario actual

**Comunicación interna:**
- Llama a `auth-service` para validar usuarios

#### 4. **especie-service** (Puerto 3004)
**Responsabilidades:**
- Catálogo de especies (flora y fauna)
- Clasificación taxonómica
- Búsqueda y filtrado
- Datos científicos y comunes

#### 5. **observacion-service** (Puerto 3005)
**Responsabilidades:**
- Registro de observaciones de campo
- Datos climáticos (temperatura, humedad, precipitación)
- Datos de terreno (pendiente, tipo de suelo, cobertura vegetal)
- Datos GPS (latitud, longitud, altitud, precisión)
- **Carga de evidencias fotográficas** (hasta 10 fotos con Multer)
- Registro automático de `hora_inicio` y `hora_fin`
- Validación por jefe de brigada
- Validación final por coordinador/admin
- Edición y eliminación de observaciones

**Archivos clave:**
- `middleware/upload.js` - Configuración de Multer para subida de fotos
- `controllers/observacionController.js` - Lógica de validación
- `uploads/` - Directorio de almacenamiento de fotos

### Comunicación entre Servicios

Los microservicios se comunican mediante:
- **HTTP REST APIs** usando Axios
- **Header especial** `x-internal-service: true` para llamadas internas
- **JWT compartido** para autenticación de usuarios
- **Base de datos compartida** (PostgreSQL)

**Ejemplo de comunicación:**
```javascript
// brigada-service llamando a auth-service
const response = await axios.get('http://localhost:3001/api/auth/perfil', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'x-internal-service': 'true'
  }
});
```

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **React** 18.3 - Biblioteca UI
- **Vite** 6.0 - Build tool y dev server
- **TailwindCSS** 3.4 - Framework CSS
- **React Router DOM** 7.1 - Enrutamiento SPA
- **Leaflet** 1.9 - Mapas interactivos (en desarrollo)
- **Axios** 1.7 - Cliente HTTP
- **Lucide React** - Iconos modernos
- **Context API** - Gestión de estado global

### Backend (Microservicios)
- **Node.js** 20.x - Runtime JavaScript
- **Express.js** 4.21 - Framework web
- **Sequelize** 6.37 - ORM para PostgreSQL
- **PostgreSQL** 16 - Base de datos relacional
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **Multer** 1.4 - Carga de archivos (fotos)
- **CORS** - Control de acceso cross-origin
- **dotenv** - Variables de entorno
- **express-rate-limit** - Rate limiting

### Middleware y Seguridad
- **authMiddleware** - Validación de tokens JWT
- **auditLogger** - Registro de auditoría
- **rateLimiter** - Prevención de ataques de fuerza bruta
- **validationMiddleware** - Validación de datos de entrada

### Base de Datos
- **PostgreSQL** 16 - Motor de base de datos
- **pg** - Cliente PostgreSQL para Node.js
- **Migraciones SQL** - Control de versiones de BD

### DevOps y Herramientas
- **Git** - Control de versiones
- **npm** - Gestión de paquetes
- **Nodemon** - Hot reload en desarrollo
- **ESLint** (configurado) - Linter de código

---

## 📦 Estructura del Proyecto

```
ProyectoIntegrador/
├── README.md                           # Este archivo
├── ecodatos-project/
│   ├── README.md                       # Documentación específica del proyecto
│   ├── CAMBIOS_IMPLEMENTADOS.md        # Registro detallado de cambios
│   ├── .gitignore                      # Archivos ignorados por git
│   │
│   ├── frontend/                       # Aplicación React (Puerto 5173)
│   │   ├── .env.example                # Plantilla de variables de entorno
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── api.js              # Configuración de endpoints API
│   │   │   │   └── axios.js            # Instancia configurada de Axios
│   │   │   │
│   │   │   ├── context/
│   │   │   │   └── UsuarioContext.jsx  # Context API para usuario global
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAsync.js         # Hook para operaciones asíncronas
│   │   │   │   ├── useFormValidation.js
│   │   │   │   ├── usePagination.js
│   │   │   │   └── useUsuarioActivo.js # Hook para usuario activo
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   ├── Layout.jsx
│   │   │   │   │   ├── PrivateRoute.jsx
│   │   │   │   │   ├── Navbar.jsx
│   │   │   │   │   └── BannerUsuarioInactivo.jsx  # Banner de notificación
│   │   │   │   └── dashboard/
│   │   │   │       └── ConglomeradoActivoCard.jsx # Card de conglomerado activo
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── auth/
│   │   │   │   │   └── Login.jsx
│   │   │   │   │
│   │   │   │   ├── admin/
│   │   │   │   │   └── GestionUsuarios.jsx
│   │   │   │   │
│   │   │   │   ├── perfil/
│   │   │   │   │   └── MiPerfil.jsx
│   │   │   │   │
│   │   │   │   ├── conglomerados/
│   │   │   │   │   ├── GenerarConglomerados.jsx
│   │   │   │   │   ├── ListaConglomerados.jsx
│   │   │   │   │   └── DetalleConglomerado.jsx
│   │   │   │   │
│   │   │   │   ├── brigadas/
│   │   │   │   │   ├── ListaBrigadas.jsx
│   │   │   │   │   ├── AsignarBrigada.jsx
│   │   │   │   │   └── MisConglomerados.jsx
│   │   │   │   │
│   │   │   │   ├── observaciones/
│   │   │   │   │   ├── RegistrarObservacion.jsx    # Formulario completo
│   │   │   │   │   ├── ListaObservaciones.jsx
│   │   │   │   │   ├── DetalleObservacion.jsx
│   │   │   │   │   └── EditarObservacionAdmin.jsx  # Edición por admin
│   │   │   │   │
│   │   │   │   ├── reportes/
│   │   │   │   │   ├── IndicadoresReportes.jsx
│   │   │   │   │   └── IndicadoresReportes.jsx.backup
│   │   │   │   │
│   │   │   │   └── dashboard/
│   │   │   │       └── Dashboard.jsx
│   │   │   │
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   │
│   │   └── package.json
│   │
│   ├── backend/
│   │   ├── migrations/                 # Scripts de migración de BD
│   │   │   ├── 001_create_usuario.sql
│   │   │   ├── 002_create_brigada.sql
│   │   │   ├── 003_create_conglomerado.sql
│   │   │   ├── 004_create_especie.sql
│   │   │   ├── 005_create_observacion.sql
│   │   │   ├── 006_create_logs_auditoria.sql      # ✨ NUEVO
│   │   │   └── add_fecha_inicio_to_conglomerado.sql  # ✨ NUEVO
│   │   │
│   │   └── services/
│   │       ├── auth-service/           # Puerto 3001
│   │       │   ├── src/
│   │       │   │   ├── config/
│   │       │   │   │   └── database.js
│   │       │   │   ├── models/
│   │       │   │   │   └── Usuario.js
│   │       │   │   ├── controllers/
│   │       │   │   │   └── authController.js
│   │       │   │   ├── services/
│   │       │   │   │   └── authService.js
│   │       │   │   ├── middleware/            # ✨ NUEVO
│   │       │   │   │   ├── authMiddleware.js
│   │       │   │   │   ├── auditLogger.js
│   │       │   │   │   ├── rateLimiter.js
│   │       │   │   │   └── validationMiddleware.js
│   │       │   │   ├── routes/
│   │       │   │   │   └── authRoutes.js
│   │       │   │   └── index.js
│   │       │   └── package.json
│   │       │
│   │       ├── conglomerado-service/   # Puerto 3002
│   │       │   ├── src/
│   │       │   │   ├── config/
│   │       │   │   │   └── database.js
│   │       │   │   ├── models/
│   │       │   │   │   ├── Conglomerado.js    # Con fecha_inicio
│   │       │   │   │   └── Subparcela.js
│   │       │   │   ├── controllers/
│   │       │   │   │   └── conglomeradoController.js
│   │       │   │   ├── services/
│   │       │   │   │   └── conglomeradoService.js
│   │       │   │   ├── middleware/            # ✨ NUEVO
│   │       │   │   │   └── authMiddleware.js
│   │       │   │   ├── routes/
│   │       │   │   │   └── conglomeradoRoutes.js
│   │       │   │   ├── utils/
│   │       │   │   │   └── geoUtils.js
│   │       │   │   └── index.js
│   │       │   └── package.json
│   │       │
│   │       ├── brigada-service/        # Puerto 3003
│   │       │   ├── src/
│   │       │   │   ├── config/
│   │       │   │   │   └── database.js
│   │       │   │   ├── models/
│   │       │   │   │   ├── Brigada.js
│   │       │   │   │   ├── Integrante.js
│   │       │   │   │   └── BrigadaConglomerado.js
│   │       │   │   ├── controllers/
│   │       │   │   │   └── brigadaController.js
│   │       │   │   ├── services/
│   │       │   │   │   └── brigadaService.js
│   │       │   │   ├── middleware/            # ✨ NUEVO
│   │       │   │   │   └── authMiddleware.js
│   │       │   │   ├── routes/
│   │       │   │   │   └── brigadaRoutes.js
│   │       │   │   └── index.js
│   │       │   └── package.json
│   │       │
│   │       ├── especie-service/        # Puerto 3004
│   │       │   ├── src/
│   │       │   │   ├── config/
│   │       │   │   │   └── database.js
│   │       │   │   ├── models/
│   │       │   │   │   └── Especie.js
│   │       │   │   ├── controllers/
│   │       │   │   │   └── especieController.js
│   │       │   │   ├── services/
│   │       │   │   │   └── especieService.js
│   │       │   │   ├── middleware/            # ✨ NUEVO
│   │       │   │   │   └── authMiddleware.js
│   │       │   │   ├── routes/
│   │       │   │   │   └── especieRoutes.js
│   │       │   │   └── index.js
│   │       │   └── package.json
│   │       │
│   │       └── observacion-service/    # Puerto 3005
│   │           ├── src/
│   │           │   ├── config/
│   │           │   │   └── database.js
│   │           │   ├── models/
│   │           │   │   └── Observacion.js
│   │           │   ├── controllers/
│   │           │   │   └── observacionController.js
│   │           │   ├── services/
│   │           │   │   └── observacionService.js
│   │           │   ├── middleware/            # ✨ NUEVO
│   │           │   │   ├── authMiddleware.js
│   │           │   │   └── upload.js          # Configuración Multer
│   │           │   ├── routes/
│   │           │   │   └── observacionRoutes.js
│   │           │   ├── uploads/               # Directorio de fotos
│   │           │   └── index.js
│   │           └── package.json
│   │
│   ├── check-database.sh               # Script de verificación de BD
│   └── reset-database.sh               # Script de reset de BD
```

### 📂 Archivos Nuevos Agregados

**Backend:**
- ✅ `migrations/006_create_logs_auditoria.sql` - Sistema de auditoría
- ✅ `migrations/add_fecha_inicio_to_conglomerado.sql` - Campo fecha_inicio
- ✅ `auth-service/src/middleware/authMiddleware.js` - Validación JWT
- ✅ `auth-service/src/middleware/auditLogger.js` - Logs de auditoría
- ✅ `auth-service/src/middleware/rateLimiter.js` - Rate limiting
- ✅ `auth-service/src/middleware/validationMiddleware.js` - Validación
- ✅ `*-service/src/middleware/authMiddleware.js` - Auth en cada servicio
- ✅ `observacion-service/src/middleware/upload.js` - Carga de archivos

**Frontend:**
- ✅ `config/api.js` - Endpoints centralizados
- ✅ `config/axios.js` - Configuración de Axios
- ✅ `context/UsuarioContext.jsx` - Context API
- ✅ `hooks/useAsync.js` - Hook para async
- ✅ `hooks/useFormValidation.js` - Validación de formularios
- ✅ `hooks/usePagination.js` - Paginación
- ✅ `hooks/useUsuarioActivo.js` - Usuario activo
- ✅ `components/common/BannerUsuarioInactivo.jsx` - Banner de notificación
- ✅ `components/dashboard/ConglomeradoActivoCard.jsx` - Card de conglomerado
- ✅ `pages/perfil/MiPerfil.jsx` - Perfil de usuario
- ✅ `pages/conglomerados/DetalleConglomerado.jsx` - Detalle de conglomerado
- ✅ `pages/observaciones/EditarObservacionAdmin.jsx` - Edición por admin
- ✅ `pages/reportes/IndicadoresReportes.jsx` - Indicadores y reportes
- ✅ `.env.example` - Plantilla de variables de entorno

**Documentación:**
- ✅ `CAMBIOS_IMPLEMENTADOS.md` - Registro detallado de todos los cambios
- ✅ `README.md` (proyecto) - Documentación específica
- ✅ `.gitignore` actualizado

---

## 🗄️ Modelo de Base de Datos

### Esquema Principal

```sql
-- TABLA: usuario
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  nombre_completo VARCHAR(200),
  email VARCHAR(150),
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- TABLA: conglomerado (✨ Con fecha_inicio agregada)
CREATE TABLE conglomerado (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  estado VARCHAR(50) DEFAULT 'Pendiente',
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_aprobacion TIMESTAMP,
  fecha_inicio TIMESTAMP,                -- ✨ NUEVO: Se registra al cambiar a En_Proceso
  brigada_id INTEGER,
  brigada_nombre VARCHAR(255),
  fecha_asignacion TIMESTAMP,
  ubicacion GEOGRAPHY(POINT, 4326)
);

-- TABLA: subparcela
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

-- TABLA: brigada
CREATE TABLE brigada (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  zona_designada VARCHAR(200),
  activo BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- TABLA: integrante
CREATE TABLE integrante (
  id SERIAL PRIMARY KEY,
  nombre_apellidos VARCHAR(200) NOT NULL,
  rol VARCHAR(100) NOT NULL,
  telefono VARCHAR(50),
  email VARCHAR(150),
  especialidad VARCHAR(200)
);

-- TABLA: especie
CREATE TABLE especie (
  id SERIAL PRIMARY KEY,
  nombre_cientifico VARCHAR(255) NOT NULL,
  nombre_comun VARCHAR(255),
  familia VARCHAR(200),
  genero VARCHAR(200),
  tipo VARCHAR(100),  -- 'flora' o 'fauna'
  descripcion TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- TABLA: observacion (✨ NUEVA - Sistema de registro de campo)
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
  evidencias_fotograficas TEXT[],  -- Array de rutas de fotos

  -- Control de tiempo
  hora_inicio TIMESTAMP,           -- ✨ Se registra al iniciar conglomerado
  hora_fin TIMESTAMP,              -- ✨ Se registra al completar

  -- Validación
  validado_jefe BOOLEAN DEFAULT FALSE,
  validado_admin BOOLEAN DEFAULT FALSE,

  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- TABLA: logs_auditoria (✨ NUEVA - Sistema de auditoría)
CREATE TABLE logs_auditoria (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuario(id),
  accion VARCHAR(100) NOT NULL,
  tabla VARCHAR(100),
  registro_id INTEGER,
  datos_antiguos JSONB,
  datos_nuevos JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  fecha TIMESTAMP DEFAULT NOW()
);

-- TABLA INTERMEDIA: brigadaintegrante
CREATE TABLE brigadaintegrante (
  id_brigada INTEGER REFERENCES brigada(id) ON DELETE CASCADE,
  id_integrante INTEGER REFERENCES integrante(id) ON DELETE CASCADE,
  PRIMARY KEY (id_brigada, id_integrante)
);

-- TABLA INTERMEDIA: brigadaconglomerado
CREATE TABLE brigadaconglomerado (
  id_brigada INTEGER REFERENCES brigada(id) ON DELETE CASCADE,
  id_conglomerado INTEGER REFERENCES conglomerado(id) ON DELETE CASCADE,
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50) DEFAULT 'Pendiente',
  PRIMARY KEY (id_brigada, id_conglomerado)
);
```

### Estados del Sistema

**Estados de Conglomerado:**
- `Pendiente` - Recién generado, esperando aprobación
- `Aprobado` - Aprobado por admin, disponible para asignación
- `Asignado` - Asignado a una brigada
- `En_Proceso` - Brigada ha iniciado el trabajo de campo (✨ registra fecha_inicio)
- `Completado` - Trabajo de campo finalizado
- `Rechazado` - Conglomerado rechazado

**Roles de Usuario:**
- `admin` - Administrador del sistema (acceso total)
- `coordinador` - Coordinador de proyecto (validación final)
- `jefe_brigada` - Jefe de brigada de campo (gestión de equipo)
- `integrante_brigada` - Integrante de brigada (registro de datos)

**Roles de Integrante de Brigada:**
- `jefe_brigada` - Líder de la brigada (1 requerido)
- `botanico` - Especialista botánico (mínimo 1 requerido)
- `tecnico_auxiliar` - Técnico auxiliar (mínimo 1 requerido)
- `coinvestigador` - Coinvestigador (mínimo 1 requerido)

**Estados de Validación de Observaciones:**
- Sin validar: `validado_jefe=false`, `validado_admin=false`
- Validado por jefe: `validado_jefe=true`, `validado_admin=false`
- Validado completamente: `validado_jefe=true`, `validado_admin=true`

---

## ⚙️ Instalación y Configuración

### Prerequisitos

- Node.js 20.x o superior
- PostgreSQL 16 con PostGIS 3.5
- npm o yarn
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/duvanleandro/ProyectoIntegrador.git
cd ProyectoIntegrador/ecodatos-project
```

### 2. Configurar la Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE ecodatos;

# Conectar a la base de datos
\c ecodatos

# Habilitar PostGIS
CREATE EXTENSION postgis;

# Ejecutar el script de creación de tablas
\i backend/database/schema.sql
```

### 3. Configurar Variables de Entorno

Crear archivos `.env` en cada microservicio:

**backend/services/auth-service/.env:**
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secret_key_super_segura
JWT_EXPIRES_IN=7d
```

**backend/services/conglomerado-service/.env:**
```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secret_key_super_segura
```

**backend/services/brigada-service/.env:**
```env
PORT=3003
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secret_key_super_segura
```

**backend/services/especie-service/.env:**
```env
PORT=3004
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secret_key_super_segura
```

**backend/services/observacion-service/.env:**
```env
PORT=3005
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_secret_key_super_segura
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**frontend/.env:** (ver `.env.example`)
```env
VITE_AUTH_SERVICE_URL=http://localhost:3001
VITE_BRIGADA_SERVICE_URL=http://localhost:3003
VITE_CONGLOMERADO_SERVICE_URL=http://localhost:3002
VITE_ESPECIE_SERVICE_URL=http://localhost:3004
VITE_OBSERVACION_SERVICE_URL=http://localhost:3005
```

### 4. Instalar Dependencias

```bash
# Frontend
cd ecodatos-project/frontend
npm install

# Servicios Backend
cd ../backend/services

# Auth Service
cd auth-service
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
```

### 5. Ejecutar Migraciones

```bash
# Conectar a PostgreSQL
sudo -u postgres psql

# Ejecutar migraciones
\c ecodatos

-- Ejecutar en orden:
\i backend/migrations/001_create_usuario.sql
\i backend/migrations/002_create_brigada.sql
\i backend/migrations/003_create_conglomerado.sql
\i backend/migrations/004_create_especie.sql
\i backend/migrations/005_create_observacion.sql
\i backend/migrations/006_create_logs_auditoria.sql
\i backend/migrations/add_fecha_inicio_to_conglomerado.sql
```

### 6. Iniciar los Servicios

**Opción 1: Manualmente (recomendado para desarrollo)**

```bash
# Terminal 1 - Auth Service
cd backend/services/auth-service
npm start

# Terminal 2 - Conglomerado Service
cd backend/services/conglomerado-service
npm start

# Terminal 3 - Brigada Service
cd backend/services/brigada-service
npm start

# Terminal 4 - Especie Service
cd backend/services/especie-service
npm start

# Terminal 5 - Observacion Service
cd backend/services/observacion-service
npm start

# Terminal 6 - Frontend
cd frontend
npm run dev
```

**Opción 2: Script de inicio automático**

```bash
# Crear un script start-all.sh en la raíz del proyecto
#!/bin/bash

echo "🚀 Iniciando todos los servicios..."

# Iniciar servicios en background
cd backend/services/auth-service && npm start &
cd backend/services/conglomerado-service && npm start &
cd backend/services/brigada-service && npm start &
cd backend/services/especie-service && npm start &
cd backend/services/observacion-service && npm start &
cd frontend && npm run dev &

echo "✅ Todos los servicios iniciados"
echo "📊 Frontend: http://localhost:5173"
echo "🔐 Auth: http://localhost:3001"
echo "📍 Conglomerados: http://localhost:3002"
echo "👥 Brigadas: http://localhost:3003"
echo "🌿 Especies: http://localhost:3004"
echo "📝 Observaciones: http://localhost:3005"
```

### 7. Acceder al Sistema

- **Frontend:** http://localhost:5173
- **Auth Service:** http://localhost:3001
- **Conglomerado Service:** http://localhost:3002
- **Brigada Service:** http://localhost:3003
- **Especie Service:** http://localhost:3004
- **Observacion Service:** http://localhost:3005

---

## 👤 Usuarios por Defecto

El sistema incluye usuarios de prueba:

```sql
-- Admin
username: admin
password: admin123

-- Jefe de Brigada
username: jefe1
password: jefe123
```

Para crear nuevos usuarios, ejecutar:

```sql
INSERT INTO usuario (username, password, rol, nombre_completo, email)
VALUES ('nuevo_usuario', '$2a$10$...', 'admin', 'Nombre Completo', 'email@example.com');
```

---

## 📖 Guía de Uso

### Como Administrador

1. **Generar Conglomerados**
   - Ir a "Generar Conglomerados"
   - Especificar cantidad (1-100)
   - Clic en "Generar"
   - Los conglomerados aparecen con estado "Pendiente"

2. **Aprobar Conglomerados**
   - Ir a "Lista de Conglomerados"
   - Revisar conglomerados pendientes
   - Clic en "Aprobar" o "Rechazar"
   - Al aprobar, se crean 5 subparcelas automáticamente

3. **Gestionar Brigadas**
   - Ir a "Gestionar Brigadas"
   - Crear nueva brigada
   - Agregar integrantes (mínimo: 1 jefe, 1 botánico, 1 técnico, 1 coinvestigador)
   - La brigada se activa automáticamente al cumplir requisitos

4. **Asignar Conglomerados a Brigadas**
   - Ir a "Asignar Brigadas"
   - Seleccionar brigada activa
   - Seleccionar conglomerado aprobado
   - Clic en "Asignar Brigada"
   - El conglomerado cambia a estado "Asignado"

5. **Gestionar Usuarios**
   - Ir a "Gestión de Usuarios"
   - Crear, editar o desactivar usuarios
   - Asignar roles: Admin, Coordinador, Jefe Brigada, Integrante
   - Resetear contraseñas

6. **Validar Observaciones**
   - Ir a "Observaciones"
   - Revisar observaciones validadas por jefe de brigada
   - Validar o rechazar con comentarios
   - Verificar evidencias fotográficas

### Como Jefe de Brigada

1. **Dashboard**
   - Ver conglomerado activo de tu brigada
   - Ver resumen de progreso
   - Acceder rápidamente a registro de observaciones

2. **Ver Conglomerados Asignados**
   - Ir a "Mis Conglomerados Asignados"
   - Ver lista de conglomerados asignados a tu brigada
   - Ver estado de cada conglomerado

3. **Iniciar Trabajo de Campo**
   - **IMPORTANTE:** Solo se puede tener un conglomerado activo a la vez
   - Clic en "Iniciar" en un conglomerado asignado
   - El sistema registra automáticamente la `fecha_inicio`
   - El estado cambia a "En_Proceso"
   - La brigada no podrá iniciar otro conglomerado hasta completar este

4. **Registrar Observaciones**
   - Ir a "Registrar Observación"
   - Completar formulario con:
     - Datos climáticos (temperatura, humedad, precipitación)
     - Datos de terreno (pendiente, tipo de suelo, cobertura vegetal)
     - Datos GPS (latitud, longitud, altitud, precisión)
     - Observaciones de fauna y flora
     - Notas adicionales
   - Subir hasta 10 evidencias fotográficas
   - El sistema registra automáticamente `hora_inicio` al empezar

5. **Completar Conglomerado**
   - Clic en "Completar" cuando termines el trabajo de campo
   - El sistema registra automáticamente `hora_fin`
   - El estado cambia a "Completado"
   - La brigada queda libre para iniciar otro conglomerado

6. **Validar Observaciones del Equipo**
   - Revisar observaciones registradas por integrantes
   - Validar antes de enviar al coordinador
   - Marcar como `validado_jefe`

### Como Integrante de Brigada

1. **Ver Conglomerado Activo**
   - Dashboard muestra el conglomerado en el que está trabajando tu brigada
   - Ver información básica del conglomerado

2. **Colaborar en Observaciones**
   - Registrar datos de campo cuando el jefe de brigada lo autorice
   - Subir evidencias fotográficas
   - Añadir notas y observaciones

3. **Ver Historial**
   - Ver observaciones completadas
   - Ver conglomerados finalizados por la brigada

---

## 🗺️ Características del Mapa

### Colores de Marcadores

- 🟡 **Amarillo** - Pendiente
- 🟢 **Verde** - Aprobado
- 🔵 **Azul** - Asignado
- 🟠 **Naranja** - En Proceso
- 🟣 **Morado** - Completado
- 🔴 **Rojo** - Rechazado

### Funcionalidades

- Zoom y pan interactivo
- Clic en marcador para ver detalles
- Popup con acciones (aprobar, rechazar, eliminar)
- Búsqueda en lista lateral
- Filtros por estado
- Navegación automática al conglomerado seleccionado

---

## 🔒 Seguridad

### Implementaciones de Seguridad

- ✅ **Autenticación JWT** con tokens de expiración configurable
- ✅ **Rutas protegidas por rol** con middleware en todos los servicios
- ✅ **Contraseñas encriptadas** con bcrypt (10 rounds)
- ✅ **Sistema de auditoría completo**
  - Registro de todas las acciones de usuarios
  - Almacenamiento de datos antiguos y nuevos (JSONB)
  - IP y user agent tracking
  - Tabla `logs_auditoria` dedicada
- ✅ **Rate Limiting**
  - Prevención de ataques de fuerza bruta
  - Límite de peticiones por IP
  - Configuración por endpoint
- ✅ **Validación de datos**
  - Middleware de validación en formularios
  - Sanitización de inputs
  - Validación de tipos y formatos
- ✅ **CORS configurado** para todos los servicios
- ✅ **Comunicación segura entre microservicios**
  - Header especial `x-internal-service` para llamadas internas
  - Validación de origen de peticiones
- ✅ **Gestión de archivos segura**
  - Validación de tipos de archivo (solo imágenes)
  - Límite de tamaño de archivo (5MB)
  - Sanitización de nombres de archivo
  - Almacenamiento fuera de webroot
- ✅ **Control de acceso basado en roles (RBAC)**
  - Admin: Acceso total
  - Coordinador: Validación final
  - Jefe Brigada: Gestión de equipo
  - Integrante: Registro de datos
- ✅ **Activación/desactivación de usuarios**
  - Banner de notificación para usuarios inactivos
  - No se permite login de usuarios inactivos

---

## 🧪 Testing

```bash
# Instalar dependencias de testing
npm install --save-dev jest supertest

# Ejecutar tests
npm test
```

---

## ✨ Características Nuevas Implementadas

### Sistema de Observaciones Completo
- ✅ Formulario completo con datos climáticos, terreno y GPS
- ✅ Carga de hasta 10 evidencias fotográficas
- ✅ Registro automático de `hora_inicio` y `hora_fin`
- ✅ Sistema de validación en dos niveles (jefe + admin)
- ✅ Permitir observaciones de conglomerados sin registro previo
- ✅ Edición de observaciones por administrador

### Sistema de Usuarios Mejorado
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Activación/desactivación de usuarios
- ✅ Banner de notificación para usuarios inactivos
- ✅ Corrección de endpoint `/api/auth/perfil` (error 500)
- ✅ Página de perfil de usuario (`MiPerfil.jsx`)
- ✅ Sistema de cambio de contraseña

### Mejoras en Conglomerados
- ✅ Campo `fecha_inicio` agregado (migración incluida)
- ✅ Registro automático de fecha al cambiar a `En_Proceso`
- ✅ Control de un solo conglomerado activo por brigada
- ✅ Card de conglomerado activo en Dashboard
- ✅ Corrección en detección de brigada del usuario
- ✅ Página de detalle de conglomerado

### Sistema de Auditoría
- ✅ Tabla `logs_auditoria` con campos JSONB
- ✅ Middleware de auditoría en auth-service
- ✅ Registro de IP y user agent
- ✅ Almacenamiento de datos antiguos y nuevos

### Arquitectura y Código
- ✅ Middleware de autenticación en todos los servicios
- ✅ Configuración centralizada de Axios (`config/axios.js`)
- ✅ Context API para usuario global (`UsuarioContext.jsx`)
- ✅ Hooks personalizados (useAsync, useFormValidation, etc.)
- ✅ Comunicación segura entre servicios con header `x-internal-service`
- ✅ Variables de entorno centralizadas (`.env.example`)

### Documentación
- ✅ README completo del proyecto
- ✅ CAMBIOS_IMPLEMENTADOS.md con registro detallado
- ✅ Scripts de verificación de BD (`check-database.sh`)
- ✅ `.gitignore` actualizado

---

## 🚀 Roadmap Futuro

### En Progreso
- [ ] Integración de mapas Leaflet con visualización de conglomerados
- [ ] Sistema de reportes PDF con datos de observaciones
- [ ] Dashboard con gráficas interactivas

### Planificado
- [ ] Sistema de registro de especies arbóreas individual
- [ ] Módulo de análisis estadístico de datos
- [ ] Exportación de datos a Excel/CSV
- [ ] Sistema de notificaciones en tiempo real
- [ ] Aplicación móvil para registro en campo (React Native)
- [ ] API REST documentation con Swagger/OpenAPI
- [ ] Tests unitarios y de integración
- [ ] CI/CD con GitHub Actions
- [ ] Dockerización completa de la aplicación
- [ ] Sistema de backups automáticos
- [ ] Monitoreo y alertas con Prometheus/Grafana

### Mejoras Futuras
- [ ] Implementar WebSockets para actualizaciones en tiempo real
- [ ] Sistema de chat para brigadas
- [ ] Módulo de planificación de rutas optimizadas
- [ ] Integración con drones para captura de imágenes aéreas
- [ ] Machine Learning para identificación automática de especies

---

## 🎯 Casos de Uso Principales

### Flujo Completo del Sistema

1. **Admin genera conglomerados** → 2. **Admin aprueba** → 3. **Admin crea brigada** → 4. **Admin asigna conglomerado a brigada** → 5. **Jefe de brigada inicia trabajo** → 6. **Brigada registra observaciones** → 7. **Jefe valida observaciones** → 8. **Brigada completa conglomerado** → 9. **Admin/Coordinador valida final**

### Reglas de Negocio Importantes

- Una brigada solo puede tener **un conglomerado activo** a la vez
- Los conglomerados generan **5 subparcelas** automáticamente al ser aprobados
- Las observaciones requieren **validación en dos niveles** (jefe + admin)
- Se pueden subir hasta **10 fotos** por observación
- Los usuarios inactivos **no pueden iniciar sesión**
- El sistema registra automáticamente **fecha_inicio** al iniciar conglomerado
- El sistema registra automáticamente **hora_inicio** y **hora_fin** en observaciones

---

## 📊 Estadísticas del Proyecto

- **Microservicios:** 5 (Auth, Conglomerado, Brigada, Especie, Observacion)
- **Tablas de Base de Datos:** 10+
- **Roles de Usuario:** 4 (Admin, Coordinador, Jefe Brigada, Integrante)
- **Páginas Frontend:** 15+
- **Componentes React:** 20+
- **Middleware de Seguridad:** 4
- **Migraciones SQL:** 7

---

## 👥 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abrir Pull Request

---

## 👨‍💻 Equipo de Desarrollo

### Desarrolladores
- **Duvan Leandro Pedraza Gonzalez** - Full Stack Developer
- **Stefany Dayana Medina Galvis** - Full Stack Developer
- **Juan Daniel Quinchanegua** - Backend Developer
- **Jonathan Arley Monsalve Salazar** - Frontend Developer
- **Duvan Ramirez Molina** - Database & Backend Developer

### Información del Proyecto
- **Grupo:** 5A
- **Institución:** Universidad de Investigación y Desarrollo
- **Programa:** Ingeniería de Sistemas
- **Semestre:** Quinto Semestre
- **Período:** 2025-1
- **Tipo:** Proyecto Integrador

**Repositorio:** [@duvanleandro/ProyectoIntegrador](https://github.com/duvanleandro/ProyectoIntegrador)

---

## 📞 Soporte y Contacto

### Reportar Issues
Para reportar bugs, solicitar features o hacer preguntas:
- **GitHub Issues:** https://github.com/duvanleandro/ProyectoIntegrador/issues

### Documentación Adicional
- **Manual de Usuario:** Ver `docs/manual_usuario.md` (próximamente)
- **Documentación Técnica:** Ver `docs/documentacion_tecnica.md` (próximamente)
- **Cambios Implementados:** Ver `ecodatos-project/CAMBIOS_IMPLEMENTADOS.md`

---

## 🙏 Agradecimientos

- **IDEAM** - Instituto de Hidrología, Meteorología y Estudios Ambientales
- **Manual IFN Colombia v4** - Protocolo Nacional de Inventario Forestal
- **Universidad de Investigación y Desarrollo** - Apoyo académico
- **OpenStreetMap contributors** - Datos geográficos
- **Leaflet community** - Librería de mapas
- **React community** - Framework frontend
- **Node.js community** - Runtime backend
- **PostgreSQL community** - Sistema de base de datos

---

## 📄 Licencia

Este proyecto es software educativo desarrollado como **Proyecto Integrador de Quinto Semestre** en la Universidad de Investigación y Desarrollo para el **Inventario Forestal Nacional de Colombia (IDEAM)**.

**Año:** 2025
**Propósito:** Educativo y de investigación

---

## 📝 Notas Finales

### Recomendaciones de Despliegue
- Usar variables de entorno diferentes para producción
- Configurar HTTPS en producción
- Implementar backups automáticos de la base de datos
- Configurar monitoreo y alertas
- Usar PM2 o similar para gestión de procesos en producción

### Créditos de Herramientas
- **Backend Framework:** Express.js
- **Frontend Framework:** React + Vite
- **ORM:** Sequelize
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer
- **Password Hashing:** bcryptjs

---

**Última actualización:** Noviembre 10, 2025
**Versión:** 2.0.0
**Estado:** En desarrollo activo
