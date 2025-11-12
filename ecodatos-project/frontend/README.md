# 🌐 EcoDatos Frontend

Interfaz web del Sistema de Gestión de Datos Ecológicos, construida con React y Vite.

## 📋 Descripción

Este es el frontend del proyecto EcoDatos, una aplicación web moderna para la gestión de datos ecológicos en campo. Proporciona una interfaz intuitiva para brigadas de campo, coordinadores y administradores.

## 🛠️ Tecnologías

- **React** 18 - Framework UI
- **Vite** - Build tool y dev server
- **React Router** 6 - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Librería de iconos
- **Context API** - Gestión de estado global

## 📁 Estructura del Proyecto

```
frontend/
├── public/               # Archivos estáticos
├── src/
│   ├── assets/          # Recursos (imágenes, CSS)
│   ├── components/      # Componentes reutilizables
│   │   ├── admin/      # Componentes de administración
│   │   ├── auth/       # Componentes de autenticación
│   │   ├── brigadas/   # Componentes de brigadas
│   │   ├── common/     # Componentes comunes (Layout, etc.)
│   │   ├── conglomerados/
│   │   ├── dashboard/
│   │   └── maps/       # Componentes de mapas
│   ├── config/         # Configuraciones
│   │   ├── api.js      # Endpoints de la API
│   │   └── axios.js    # Configuración de Axios
│   ├── context/        # Contextos de React
│   ├── hooks/          # Hooks personalizados
│   │   ├── useAsync.js
│   │   ├── useFormValidation.js
│   │   ├── usePagination.js
│   │   └── useUsuarioActivo.js
│   ├── pages/          # Páginas principales
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── brigadas/
│   │   ├── conglomerados/
│   │   ├── dashboard/
│   │   ├── especies/
│   │   ├── observaciones/
│   │   ├── perfil/
│   │   └── reportes/
│   ├── services/       # Servicios API
│   ├── utils/          # Utilidades
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Punto de entrada
├── .env                # Variables de entorno (no incluido en git)
├── .env.example        # Ejemplo de variables de entorno
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🚀 Inicio Rápido

### Instalación

```bash
# Instalar dependencias
npm install
```

### Configuración

Crear un archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3000
VITE_AUTH_SERVICE=http://localhost:3001
VITE_BRIGADA_SERVICE=http://localhost:3003
VITE_CONGLOMERADO_SERVICE=http://localhost:3002
VITE_ESPECIE_SERVICE=http://localhost:3004
VITE_OBSERVACION_SERVICE=http://localhost:3005
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🎨 Características Principales

### Autenticación y Autorización
- Login con JWT
- Control de acceso basado en roles
- Protección de rutas
- Sesión persistente
- Cierre de sesión automático en expiración

### Dashboard Interactivo
- Resumen de estadísticas por rol
- Cards informativos
- Indicadores de progreso
- Visualización de conglomerados activos

### Gestión de Usuarios (Admin)
- CRUD completo de usuarios
- Asignación de roles
- Gestión de perfiles
- Activación/desactivación

### Gestión de Brigadas
- Creación y edición de brigadas
- Asignación de integrantes
- Control de zonas designadas
- Visualización de conglomerados asignados

### Gestión de Conglomerados
- Generación aleatoria de conglomerados
- Visualización en mapa
- Aprobación/rechazo (Admin)
- Asignación a brigadas
- Seguimiento de estados
- Registro de fechas de inicio/fin

### Registro de Observaciones
- Formularios completos de campo
- Datos climáticos y de terreno
- Captura de coordenadas GPS
- Carga de fotografías (hasta 10)
- Validación por niveles (Jefe → Admin)
- Historial de observaciones

### Gestión de Especies
- Catálogo de especies
- Clasificación taxonómica
- Búsqueda y filtrado
- Consulta pública

## 🔧 Hooks Personalizados

### useAsync
Manejo de estados asíncronos (loading, error, success):

```javascript
import { useAsync } from '../hooks/useAsync';

const { execute, isLoading, isError, error, data } = useAsync(fetchData);
```

### useFormValidation
Validación de formularios en tiempo real:

```javascript
import { useFormValidation } from '../hooks/useFormValidation';

const validation = useFormValidation(initialValues, rules);
```

### usePagination
Paginación del lado del cliente:

```javascript
import { usePagination } from '../hooks/usePagination';

const pagination = usePagination(data, itemsPerPage);
```

### useUsuarioActivo
Acceso al usuario autenticado:

```javascript
import { useUsuarioActivo } from '../hooks/useUsuarioActivo';

const { usuario, loading, error } = useUsuarioActivo();
```

## 🔐 Seguridad

- Tokens JWT almacenados en localStorage
- Interceptores de Axios para agregar tokens automáticamente
- Redirección automática en sesión expirada
- Validación de permisos por ruta
- Sanitización de inputs
- Protección contra XSS

## 🎯 Rutas Principales

```
/                          → Dashboard (requiere auth)
/login                     → Página de login
/perfil                    → Perfil del usuario

# Admin
/admin/usuarios            → Gestión de usuarios
/admin/generar-conglomerados → Generación de conglomerados

# Brigadas
/brigadas                  → Gestión de brigadas
/brigadas/asignar          → Asignación de brigadas
/brigadas/mis-conglomerados → Conglomerados de la brigada

# Conglomerados
/conglomerados             → Lista de conglomerados
/conglomerados/:id         → Detalle de conglomerado

# Observaciones
/observaciones             → Lista de observaciones
/observaciones/registrar   → Registrar observación
/observaciones/:id         → Detalle de observación
/observaciones/editar/:id  → Editar observación (Admin)

# Especies
/especies                  → Consulta de especies
/admin/especies            → Gestión de especies (Admin)

# Reportes
/reportes                  → Indicadores y reportes
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia el servidor de desarrollo

# Producción
npm run build            # Construye la aplicación para producción
npm run preview          # Previsualiza el build de producción

# Linting
npm run lint             # Ejecuta ESLint
```

## 🌍 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del API Gateway | `http://localhost:3000` |
| `VITE_AUTH_SERVICE` | URL del servicio de autenticación | `http://localhost:3001` |
| `VITE_BRIGADA_SERVICE` | URL del servicio de brigadas | `http://localhost:3003` |
| `VITE_CONGLOMERADO_SERVICE` | URL del servicio de conglomerados | `http://localhost:3002` |
| `VITE_ESPECIE_SERVICE` | URL del servicio de especies | `http://localhost:3004` |
| `VITE_OBSERVACION_SERVICE` | URL del servicio de observaciones | `http://localhost:3005` |

## 🤝 Contribución

Este es un proyecto académico. Para contribuciones:

1. Seguir la estructura de carpetas existente
2. Usar componentes funcionales con hooks
3. Mantener consistencia en el estilo (Tailwind CSS)
4. Documentar funciones complejas
5. Probar antes de hacer commit

## 📝 Notas de Desarrollo

- El proyecto usa Vite como build tool para mejor rendimiento
- Se utiliza Context API para estado global (usuario autenticado)
- Todos los llamados a API usan la configuración centralizada de Axios
- Los endpoints están centralizados en `config/api.js`
- Se recomienda usar los hooks personalizados para mantener consistencia

## 🐛 Debugging

### Problemas comunes

**Error de CORS:**
```bash
# Verificar que el backend esté corriendo
# Verificar las URLs en .env
```

**Token expirado:**
```bash
# El sistema redirige automáticamente a /login
# Verificar JWT_EXPIRES_IN en el backend
```

**Módulo no encontrado:**
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licencia

Parte del proyecto académico EcoDatos.

---

**Desarrollado con ❤️ para la gestión de datos ecológicos**
