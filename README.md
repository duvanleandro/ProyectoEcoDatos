# EcoDatos - Proyecto Integrador 5to Semestre

Sistema web para el Inventario Forestal Nacional del IDEAM (Colombia).

## Integrantes del Equipo
- Duvan Leandro Pedraza Gonzalez
- Stefany Dayana Medina Galvis

**Grupo:** 5A  
**Período:** 2025-2

---

## ¿Qué hace este proyecto?

Es un sistema web que ayuda al IDEAM a manejar el Inventario Forestal Nacional. Permite:
- Registrar conglomerados forestales (zonas de muestreo)
- Asignar brigadas de campo a cada conglomerado
- Llevar registro de especies de plantas encontradas
- Ver mapas con la ubicación de los conglomerados
- Guardar observaciones de campo (clima, fotos, notas)

---

## Tecnologías que usamos

**Frontend (lo que se ve):**
- React + Vite
- Tailwind CSS (para los estilos)
- React Router (para navegar entre páginas)

**Backend (el servidor):**
- Node.js + Express
- Microservicios (varios servidores pequeños en lugar de uno grande)

**Bases de Datos:**
- PostgreSQL (para datos estructurados: usuarios, brigadas, conglomerados)
- MongoDB (para observaciones flexibles de campo)

---

## Requisitos para ejecutar el proyecto

Necesitas tener instalado:
- Node.js (versión 20 o superior)
- PostgreSQL (versión 16)
- MongoDB (versión 8)
- Git
- Un editor de código (nosotros usamos VSCode)

---

## Cómo instalar y ejecutar el proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/duvanleandro/ProyectoIntegrador.git
cd ProyectoIntegrador/ecodatos-project
```

### 2. Configurar PostgreSQL

Primero, abre PostgreSQL:
```bash
sudo -u postgres psql
```

Dentro de PostgreSQL ejecuta:
```sql
-- Crear la base de datos
CREATE DATABASE ecodatos;

-- Crear el usuario
CREATE USER ecodatos WITH PASSWORD 'ecodatos';

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE ecodatos TO ecodatos;

-- Salir
\q
```

**Conectar a la base de datos para verificar:**
```bash
sudo -u postgres psql -d ecodatos
```

**Ver las tablas que hay:**
```sql
\dt
```

**Ver estructura de la tabla usuarios:**
```sql
\d usuarios
```

**Ver todos los usuarios registrados:**
```sql
SELECT * FROM usuarios;
```

**Salir:**
```sql
\q
```

### 3. Instalar dependencias del Backend

**Auth Service (Autenticación):**
```bash
cd backend/services/auth-service
npm install
```

### 4. Instalar dependencias del Frontend
```bash
cd ../../..  # Volver a la raíz
cd frontend
npm install
```

### 5. Ejecutar el proyecto

**Necesitas abrir 2 terminales:**

**Terminal 1 - Backend (Auth Service):**
```bash
cd backend/services/auth-service
npm run dev
```

Deberías ver:
```
✅ Conexión a PostgreSQL establecida correctamente
🚀 Auth Service corriendo en http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Deberías ver:
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 6. Abrir en el navegador

Ve a: **http://localhost:5173**

**Usuario de prueba:**
- Usuario: `admin`
- Contraseña: `1234`

---

## Estructura del proyecto
```
ecodatos-project/
├── backend/
│   ├── gateway/              # API Gateway (todavía no implementado)
│   ├── services/
│   │   ├── auth-service/     # Autenticación (funcionando)
│   │   ├── brigada-service/  # Gestión de brigadas (pendiente)
│   │   ├── conglomerado-service/  # (pendiente)
│   │   ├── especie-service/  # (pendiente)
│   │   └── observacion-service/   # (pendiente)
│   └── shared/               # Código compartido
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── auth/
│   │   │       └── Login.jsx  # Página de login (funcionando)
│   │   ├── components/       # Componentes reutilizables
│   │   └── services/         # Llamadas a la API
│   └── public/
└── README.md
```

---

## Problemas comunes y soluciones

### ❌ Error: "column contraseña does not exist"

**Solución:** La base de datos usa `contraseña` (con ñ). Asegúrate que el modelo en `backend/services/auth-service/src/models/Usuario.js` tenga:
```javascript
contraseña: {
  type: DataTypes.STRING(255),
  allowNull: false,
  field: 'contraseña'
}
```

### ❌ Error: "column activo does not exist"

**Solución:** Agrega la columna a PostgreSQL:
```bash
sudo -u postgres psql -d ecodatos
```
```sql
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;
\q
```

### ❌ Error: "ECONNREFUSED" al hacer login

**Problema:** El backend no está corriendo.

**Solución:** Abre una terminal y ejecuta:
```bash
cd backend/services/auth-service
npm run dev
```

### ❌ Error: Tailwind CSS no funciona

**Solución:** Reinstala las dependencias:
```bash
cd frontend
npm uninstall tailwindcss
npm install -D tailwindcss@3.4.1 postcss autoprefixer
```

### ❌ MongoDB no está corriendo

**Verificar estado:**
```bash
sudo systemctl status mongod
```

**Iniciar MongoDB:**
```bash
sudo systemctl start mongod
```

---

## Cómo agregar un nuevo usuario manualmente

**Opción 1: Desde el login** (recomendado)
- Todavía no tenemos página de registro, pero puedes usar Postman o curl

**Opción 2: Con curl**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "brigadista1",
    "contrasena": "1234",
    "tipo_usuario": "brigadista"
  }'
```

**Opción 3: Directamente en PostgreSQL**
```bash
sudo -u postgres psql -d ecodatos
```
```sql
-- Ver usuarios actuales
SELECT id, usuario, tipo_usuario, activo FROM usuarios;

-- Agregar usuario manualmente (la contraseña debe estar encriptada, esto es solo para pruebas)
-- NO USAR EN PRODUCCIÓN
```

---

## Endpoints disponibles (hasta ahora)

### Auth Service (http://localhost:3001)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/verify` | Verificar token JWT |
| GET | `/health` | Verificar que el servicio está corriendo |

**Ejemplo de login con curl:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "contrasena": "1234"
  }'
```

---

## Estado actual del proyecto

### ✅ Completado
- [x] Estructura de microservicios
- [x] Auth Service funcionando
- [x] Base de datos PostgreSQL configurada
- [x] Login del frontend funcionando
- [x] Autenticación con JWT
- [x] Proyecto en GitHub

### ⏳ En desarrollo
- [ ] Dashboard principal
- [ ] Gestión de conglomerados
- [ ] Gestión de brigadas
- [ ] Mapas interactivos
- [ ] API Gateway
- [ ] Resto de microservicios

### 📅 Por hacer
- [ ] Clasificación de especies
- [ ] Observaciones de campo (MongoDB)
- [ ] Reportes y estadísticas
- [ ] Despliegue en servidor
- [ ] Documentación técnica completa

---

## Comandos útiles

### Ver logs del backend
```bash
cd backend/services/auth-service
npm run dev
# Verás todos los logs en la terminal
```

### Reiniciar el frontend
```bash
# Ctrl+C para detener
npm run dev
```

### Ver qué puertos están en uso
```bash
sudo lsof -i :3001  # Ver qué usa el puerto 3001
sudo lsof -i :5173  # Ver qué usa el puerto 5173
```

### Limpiar caché de npm
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Notas importantes

1. **NO SUBIR ARCHIVOS .env A GITHUB** - Ya está en el .gitignore
2. Los archivos `.env` tienen las contraseñas de las bases de datos
3. El usuario `admin` con contraseña `1234` es solo para desarrollo
4. MongoDB se usa para observaciones de campo (todavía no implementado)
5. Cada microservicio corre en un puerto diferente

---

## Contacto y ayuda

Si tienes problemas, contacta a cualquier miembro del equipo o abre un issue en GitHub.

**Repositorio:** https://github.com/duvanleandro/ProyectoIntegrador

---

## Licencia

Este proyecto es académico para la Universidad de Investigacion y Desarrollo - 2025
