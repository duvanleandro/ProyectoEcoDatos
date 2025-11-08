# 🌳 EcoDatos - Sistema de Inventario Forestal Nacional

Sistema web integral para la gestión del Inventario Forestal Nacional de Colombia (IDEAM), desarrollado con arquitectura de microservicios.

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

EcoDatos es una plataforma completa para la gestión de conglomerados forestales, brigadas de campo, y recolección de datos del Inventario Forestal Nacional (IFN) de Colombia. El sistema permite generar conglomerados georreferenciados, asignar brigadas de trabajo, y realizar el seguimiento completo del proceso de muestreo forestal.

### Características Principales

- 🗺️ **Generación automática de conglomerados** con geolocalización en Colombia
- 👥 **Gestión de brigadas** con validación de composición (jefe, botánico, técnico, coinvestigador)
- 📊 **Sistema de aprobación** de conglomerados con flujo de estados
- 🎯 **Asignación inteligente** de brigadas a conglomerados
- 📱 **Panel de brigadas** para gestión de trabajo en campo
- 🔐 **Sistema de autenticación** por roles (Admin, Jefe de Brigada)
- 🗃️ **Base de datos PostgreSQL** con PostGIS para datos geoespaciales
- 🎨 **Interfaz moderna** con React, TailwindCSS y Leaflet Maps

---

## 🏗️ Arquitectura del Sistema

### Arquitectura en Capas

```
┌─────────────────────────────────────────┐
│           CAPA DE PRESENTACIÓN          │
│        (React + Vite + TailwindCSS)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         CAPA DE MICROSERVICIOS          │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ Auth Service │  │ Conglomerado    │ │
│  │  (Port 3001) │  │ Service         │ │
│  └──────────────┘  │ (Port 3002)     │ │
│                    └─────────────────┘ │
│  ┌─────────────────────────────────┐   │
│  │ Brigada Service (Port 3003)     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          CAPA DE DATOS                  │
│   PostgreSQL + PostGIS (Port 5432)      │
└─────────────────────────────────────────┘
```

### Microservicios

1. **auth-service** (Puerto 3001)
   - Autenticación y autorización
   - Gestión de usuarios
   - JWT tokens

2. **conglomerado-service** (Puerto 3002)
   - Generación de conglomerados
   - Gestión de subparcelas
   - Aprobación/Rechazo
   - Estadísticas

3. **brigada-service** (Puerto 3003)
   - Gestión de brigadas
   - Gestión de integrantes
   - Asignación de conglomerados
   - Validación de composición

---

## 🚀 Tecnologías Utilizadas

### Frontend
- React 18.3
- Vite 6.0
- TailwindCSS 3.4
- React Router DOM 7.1
- Leaflet 1.9 (Mapas interactivos)
- Axios 1.7
- Lucide React (Iconos)

### Backend
- Node.js 20.x
- Express 4.21
- Sequelize 6.37 (ORM)
- PostgreSQL 16
- PostGIS 3.5 (Extensión geoespacial)
- bcryptjs (Encriptación)
- jsonwebtoken (Autenticación)
- CORS

### Base de Datos
- PostgreSQL 16
- PostGIS 3.5
- pg (Node PostgreSQL client)

---

## 📦 Estructura del Proyecto

```
ecodatos-project/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Componentes reutilizables
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── PrivateRoute.jsx
│   │   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── auth/           # Páginas de autenticación
│   │   │   │   └── Login.jsx
│   │   │   ├── conglomerados/  # Gestión de conglomerados
│   │   │   │   ├── GenerarConglomerados.jsx
│   │   │   │   └── ListaConglomerados.jsx
│   │   │   ├── brigadas/       # Gestión de brigadas
│   │   │   │   ├── ListaBrigadas.jsx
│   │   │   │   ├── AsignarBrigada.jsx
│   │   │   │   └── MisConglomerados.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── backend/
    └── services/
        ├── auth-service/       # Microservicio de autenticación
        │   ├── src/
        │   │   ├── config/
        │   │   │   └── database.js
        │   │   ├── models/
        │   │   │   └── Usuario.js
        │   │   ├── controllers/
        │   │   │   └── authController.js
        │   │   ├── services/
        │   │   │   └── authService.js
        │   │   ├── routes/
        │   │   │   └── authRoutes.js
        │   │   └── index.js
        │   └── package.json
        │
        ├── conglomerado-service/  # Microservicio de conglomerados
        │   ├── src/
        │   │   ├── config/
        │   │   │   └── database.js
        │   │   ├── models/
        │   │   │   ├── Conglomerado.js
        │   │   │   └── Subparcela.js
        │   │   ├── controllers/
        │   │   │   └── conglomeradoController.js
        │   │   ├── services/
        │   │   │   └── conglomeradoService.js
        │   │   ├── routes/
        │   │   │   └── conglomeradoRoutes.js
        │   │   ├── utils/
        │   │   │   └── geoUtils.js
        │   │   └── index.js
        │   └── package.json
        │
        └── brigada-service/       # Microservicio de brigadas
            ├── src/
            │   ├── config/
            │   │   └── database.js
            │   ├── models/
            │   │   ├── Brigada.js
            │   │   ├── Integrante.js
            │   │   └── BrigadaConglomerado.js
            │   ├── controllers/
            │   │   └── brigadaController.js
            │   ├── services/
            │   │   └── brigadaService.js
            │   ├── routes/
            │   │   └── brigadaRoutes.js
            │   └── index.js
            └── package.json
```

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
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- TABLA: conglomerado
CREATE TABLE conglomerado (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  estado VARCHAR(50) DEFAULT 'Pendiente',
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_aprobacion TIMESTAMP,
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
- `En_Proceso` - Brigada ha iniciado el trabajo de campo
- `Completado` - Trabajo de campo finalizado
- `Rechazado` - Conglomerado rechazado

**Roles de Usuario:**
- `admin` - Administrador del sistema
- `jefe_brigada` - Jefe de brigada de campo

**Roles de Integrante de Brigada:**
- `jefe_brigada` - Líder de la brigada (1 requerido)
- `botanico` - Especialista botánico (mínimo 1 requerido)
- `tecnico_auxiliar` - Técnico auxiliar (mínimo 1 requerido)
- `coinvestigador` - Coinvestigador (mínimo 1 requerido)

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
```

**backend/services/conglomerado-service/.env:**
```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=postgres
DB_PASSWORD=tu_password
```

**backend/services/brigada-service/.env:**
```env
PORT=3003
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecodatos
DB_USER=postgres
DB_PASSWORD=tu_password
```

### 4. Instalar Dependencias

```bash
# Frontend
cd frontend
npm install

# Auth Service
cd ../backend/services/auth-service
npm install

# Conglomerado Service
cd ../conglomerado-service
npm install

# Brigada Service
cd ../brigada-service
npm install
```

### 5. Iniciar los Servicios

**Opción 1: Terminal única (con tmux o múltiples tabs)**

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

# Terminal 4 - Frontend
cd frontend
npm run dev
```

**Opción 2: Script de inicio automático**

```bash
# Crear un script start-all.sh
#!/bin/bash

# Iniciar servicios en background
cd backend/services/auth-service && npm run dev &
cd backend/services/conglomerado-service && npm run dev &
cd backend/services/brigada-service && npm run dev &
cd frontend && npm run dev &

echo "✅ Todos los servicios iniciados"
```

### 6. Acceder al Sistema

- **Frontend:** http://localhost:5173
- **Auth Service:** http://localhost:3001
- **Conglomerado Service:** http://localhost:3002
- **Brigada Service:** http://localhost:3003

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
   - Los conglomerados aparecen con estado "Pendiente" (amarillo)

2. **Aprobar Conglomerados**
   - Revisar conglomerados en el mapa
   - Clic en marcador → "Aprobar" (verde) o "Rechazar" (amarillo)
   - Al aprobar, se crean 4 subparcelas automáticamente

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
   - El conglomerado cambia a estado "Asignado" (azul)

### Como Jefe de Brigada

1. **Iniciar Sesión**
   - Username: jefe1
   - Password: jefe123

2. **Ver Conglomerados Asignados**
   - Ir a "Mis Conglomerados Asignados"
   - Ver lista de conglomerados asignados a tu brigada

3. **Iniciar Trabajo de Campo**
   - Clic en "Iniciar" en un conglomerado
   - El estado cambia a "En_Proceso" (naranja)

4. **Completar Trabajo**
   - Clic en "Completar" cuando termines
   - El estado cambia a "Completado" (morado)

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

- ✅ Autenticación JWT
- ✅ Rutas protegidas por rol
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Validación de datos en backend
- ✅ CORS configurado
- ✅ Sanitización de inputs

---

## 🧪 Testing

```bash
# Instalar dependencias de testing
npm install --save-dev jest supertest

# Ejecutar tests
npm test
```

---

## 🐛 Problemas Conocidos

### Error Pendiente: Estadísticas de "En_Proceso"

**Descripción:** El endpoint `/api/conglomerados/estadisticas` devuelve `completados` pero no `en_proceso`.

**Respuesta actual:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "pendientes": 42,
    "aprobados": 3,
    "rechazados": 2,
    "asignados": 1,
    "completados": 1
    // Falta: "en_proceso": X
  }
}
```

**Fix temporal en el frontend:**
```javascript
<option value="En_Proceso">
  En Proceso ({conglomerados.filter(c => c.estado === 'En_Proceso').length})
</option>
```

**Solución definitiva:** Actualizar el servicio de estadísticas en el backend para incluir el conteo de conglomerados con estado `En_Proceso`.

---

## 🚀 Roadmap

- [ ] Fix: Incluir `en_proceso` en estadísticas del backend
- [ ] Agregar sistema de registro de árboles
- [ ] Implementar módulo de reportes PDF
- [ ] Agregar gráficas de estadísticas
- [ ] Implementar sistema de notificaciones
- [ ] Agregar exportación de datos a Excel/CSV
- [ ] Implementar API REST documentation con Swagger
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar CI/CD con GitHub Actions
- [ ] Dockerizar la aplicación

---

## 👥 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto es software educativo desarrollado como proyecto integrador de quinto semestre en la Universidad de Investigación y Desarrollo para el Inventario Forestal Nacional de Colombia - 2025.

---

## 👨‍💻 Equipo de Desarrollo

**Equipo:**
- Duvan Leandro Pedraza Gonzalez
- Stefany Dayana Medina Galvis
- Juan Daniel Quinchanegua
- Jonathan Arley Monsalve Salazar
- Duvan Ramirez Molina

**Repositorio:** [@duvanleandro](https://github.com/duvanleandro)  
**Proyecto:** Integrador Quinto Semestre - Ingeniería de Sistemas  
**Universidad:** Universidad de Investigación y Desarrollo

---

## 📞 Soporte

Para reportar bugs o solicitar features, crear un issue en:
https://github.com/duvanleandro/ProyectoIntegrador/issues

---

## 🙏 Agradecimientos

- Manual IFN Colombia v4
- OpenStreetMap contributors
- Leaflet community
- React community

---

**Última actualización:** Octubre 30, 2025