# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionamiento Semántico](https://semver.org/lang/es/).

## [Sin versionar] - En Desarrollo

### Agregado
- Sistema completo de autenticación con JWT
- Gestión de usuarios con roles (Admin, Coordinador, Jefe de Brigada, Integrante)
- Gestión de brigadas e integrantes
- Sistema de generación de conglomerados geográficos aleatorios
- Cálculo automático de 5 subparcelas por conglomerado
- Sistema de estados de conglomerados (Pendiente → Aprobado → Asignado → En_Proceso → Completado)
- Registro completo de observaciones de campo
- Carga de evidencias fotográficas (hasta 10 fotos)
- Sistema de validación por niveles (Jefe de Brigada → Admin)
- Catálogo de especies con clasificación taxonómica
- Dashboard interactivo con estadísticas por rol
- Sistema de auditoría y logs
- Rate limiting para prevención de ataques
- Middleware de autenticación en todos los servicios
- Comunicación segura entre microservicios
- Scripts de automatización (start-dev.sh, stop-dev.sh)
- Scripts de gestión de base de datos (check-database.sh, reset-database.sh)
- Hooks personalizados para React (useAsync, useFormValidation, usePagination)
- Context API para gestión de estado global
- Configuración centralizada de Axios y API endpoints
- Banner de notificación para usuarios inactivos
- Campo fecha_inicio en conglomerados para tracking de trabajo
- Registro automático de hora_inicio y hora_fin en observaciones

### Cambiado
- Arquitectura migrada a microservicios
- Frontend modernizado con React 18 y Vite
- Estilos migrados a Tailwind CSS
- Sistema de rutas con React Router 6
- Mejora en validación de formularios
- Optimización de comunicación entre servicios

### Seguridad
- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración configurable
- Validación de inputs en backend
- Sistema de auditoría de acciones
- Control de acceso basado en roles
- Headers de seguridad con helmet
- Protección CORS configurada
- Rate limiting en endpoints críticos

### Documentación
- README principal completo
- README específico para frontend
- Documentación de arquitectura
- Guías de instalación y configuración
- Historial detallado de cambios (docs/HISTORIAL_CAMBIOS.md)
- Ejemplos de variables de entorno
- Documentación de hooks personalizados
- Documentación de flujos de trabajo por rol

