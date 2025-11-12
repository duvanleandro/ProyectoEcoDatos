# 📘 Manual de Usuario - EcoDatos

**Sistema de Gestión del Inventario Forestal Nacional**

---

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Acceso al Sistema](#acceso-al-sistema)
- [Roles y Permisos](#roles-y-permisos)
- [Manual para Administradores](#manual-para-administradores)
- [Manual para Coordinadores](#manual-para-coordinadores)
- [Manual para Jefes de Brigada](#manual-para-jefes-de-brigada)
- [Manual para Integrantes de Brigada](#manual-para-integrantes-de-brigada)
- [Preguntas Frecuentes](#preguntas-frecuentes)
- [Solución de Problemas](#solución-de-problemas)

---

## 🌟 Introducción

### ¿Qué es EcoDatos?

EcoDatos es un sistema web diseñado para facilitar la gestión del Inventario Forestal Nacional de Colombia (IFN). Permite:

- Generar conglomerados forestales georreferenciados
- Gestionar brigadas de campo
- Asignar trabajo a brigadas
- Registrar observaciones de campo
- Validar y analizar datos recolectados
- Gestionar especies observadas

### Navegadores Compatibles

- Google Chrome (recomendado)
- Mozilla Firefox
- Microsoft Edge
- Safari

### Requisitos

- Conexión a internet estable
- Navegador web actualizado
- Credenciales de acceso proporcionadas por el administrador

---

## 🔐 Acceso al Sistema

### Inicio de Sesión

1. Abra su navegador web
2. Ingrese a la URL: `http://localhost:5173` (o la URL proporcionada)
3. Verá la pantalla de inicio de sesión
4. Ingrese su **nombre de usuario**
5. Ingrese su **contraseña**
6. Haga clic en el botón **"Iniciar Sesión"**

### Primer Acceso

Si es su primer acceso:
1. Use las credenciales proporcionadas por el administrador
2. Se recomienda cambiar su contraseña inmediatamente
3. Vaya a **"Mi Perfil"** → **"Cambiar Contraseña"**

### Cerrar Sesión

Para cerrar sesión de forma segura:
1. Haga clic en su nombre en la esquina superior derecha
2. Seleccione **"Cerrar Sesión"**
3. Será redirigido a la pantalla de inicio de sesión

### Recuperar Contraseña

Si olvidó su contraseña:
1. Contacte al administrador del sistema
2. El administrador puede restablecer su contraseña desde **"Gestión de Usuarios"**

---

## 👥 Roles y Permisos

### Administrador
**Permisos:**
- Acceso total al sistema
- Gestionar usuarios
- Generar y aprobar conglomerados
- Gestionar brigadas
- Asignar conglomerados a brigadas
- Validación final de observaciones
- Ver todos los reportes

### Coordinador
**Permisos:**
- Ver todos los conglomerados
- Validar observaciones (validación final)
- Ver reportes generales
- Consultar especies

### Jefe de Brigada
**Permisos:**
- Ver conglomerados asignados a su brigada
- Iniciar trabajo en conglomerados
- Registrar observaciones
- Completar conglomerados
- Validar observaciones de su equipo
- Ver perfil de su brigada

### Integrante de Brigada
**Permisos:**
- Ver conglomerado activo de su brigada
- Colaborar en registro de observaciones
- Ver historial de observaciones validadas
- Consultar especies

---

## 👨‍💼 Manual para Administradores

### Panel de Control

Al iniciar sesión como administrador, verá el **Dashboard** con:
- Resumen de estadísticas generales
- Conglomerados por estado
- Brigadas activas
- Observaciones pendientes de validación
- Accesos rápidos a funciones principales

---

### 1. Gestión de Usuarios

#### Crear Nuevo Usuario

1. Vaya al menú **"Administración"** → **"Gestión de Usuarios"**
2. Haga clic en **"Crear Nuevo Usuario"**
3. Complete el formulario:
   - **Nombre de usuario**: Único, sin espacios
   - **Contraseña**: Mínimo 6 caracteres
   - **Confirmar contraseña**: Debe coincidir
   - **Nombre completo**: Nombre real del usuario
   - **Email**: Correo electrónico válido
   - **Rol**: Seleccione el rol apropiado
   - **Estado**: Activo o Inactivo
4. Haga clic en **"Crear Usuario"**
5. Anote las credenciales para enviarlas al usuario

#### Editar Usuario Existente

1. En la lista de usuarios, haga clic en el botón **"Editar"** (ícono de lápiz)
2. Modifique los campos necesarios
3. Haga clic en **"Guardar Cambios"**

#### Desactivar Usuario

1. En la lista de usuarios, localice al usuario
2. Haga clic en el botón **"Desactivar"**
3. El usuario no podrá iniciar sesión, pero sus datos se conservan

#### Reactivar Usuario

1. Localice al usuario inactivo en la lista
2. Haga clic en **"Activar"**
3. El usuario podrá iniciar sesión nuevamente

#### Restablecer Contraseña

1. Edite el usuario
2. En el campo de contraseña, ingrese una nueva
3. Confirme la contraseña
4. Guarde los cambios
5. Comunique la nueva contraseña al usuario

---

### 2. Generación de Conglomerados

#### ¿Qué es un Conglomerado?

Un conglomerado es un área georreferenciada donde se realizan mediciones y observaciones forestales. Cada conglomerado contiene 5 subparcelas distribuidas geométricamente.

#### Generar Conglomerados

1. Vaya a **"Conglomerados"** → **"Generar Conglomerados"**
2. Especifique la **cantidad** de conglomerados (1-100)
3. Haga clic en **"Generar Conglomerados"**
4. El sistema generará:
   - Coordenadas aleatorias dentro de Colombia
   - Nombre único para cada conglomerado
   - Estado inicial: **Pendiente**
5. Los conglomerados aparecerán en la lista para su revisión

⚠️ **Nota**: Los conglomerados se generan de forma aleatoria. Revise las ubicaciones antes de aprobar.

---

### 3. Aprobación de Conglomerados

#### Revisar Conglomerados Pendientes

1. Vaya a **"Conglomerados"** → **"Lista de Conglomerados"**
2. Filtre por estado: **"Pendiente"**
3. Revise cada conglomerado:
   - Nombre
   - Coordenadas (latitud, longitud)
   - Ubicación en el mapa
   - Fecha de creación

#### Aprobar Conglomerado

1. Haga clic en un conglomerado pendiente
2. Revise la ubicación en el mapa
3. Haga clic en **"Aprobar"**
4. El sistema automáticamente:
   - Cambia el estado a **"Aprobado"**
   - Genera 5 subparcelas distribuidas geométricamente
   - Registra la fecha de aprobación
   - Hace el conglomerado disponible para asignación

✅ **Subparcelas creadas automáticamente:**
- Subparcela Central (en el centro del conglomerado)
- Subparcelas Norte, Sur, Este, Oeste (a distancias y azimuts específicos)

#### Rechazar Conglomerado

1. Haga clic en un conglomerado pendiente
2. Haga clic en **"Rechazar"**
3. El conglomerado cambia a estado **"Rechazado"**
4. No estará disponible para asignación

---

### 4. Gestión de Brigadas

#### Crear Nueva Brigada

1. Vaya a **"Brigadas"** → **"Gestión de Brigadas"**
2. Haga clic en **"Crear Nueva Brigada"**
3. Complete el formulario:
   - **Nombre de la brigada**: Ej: "Brigada Norte 1"
   - **Zona designada**: Área geográfica asignada
4. Haga clic en **"Crear Brigada"**

#### Agregar Integrantes a la Brigada

Para que una brigada sea **válida y pueda activarse**, debe tener:
- ✅ 1 Jefe de Brigada
- ✅ 1 Botánico (mínimo)
- ✅ 1 Técnico Auxiliar (mínimo)
- ✅ 1 Coinvestigador (mínimo)

**Pasos:**
1. En la lista de brigadas, haga clic en **"Ver Detalles"**
2. Vaya a la sección **"Integrantes"**
3. Haga clic en **"Agregar Integrante"**
4. Complete los datos:
   - Nombre y apellidos
   - **Rol**: Seleccione el rol correcto
   - Teléfono
   - Email
   - Especialidad (opcional)
5. Haga clic en **"Agregar"**
6. Repita hasta cumplir los requisitos mínimos

#### Activar Brigada

1. Una vez cumplidos los requisitos mínimos
2. La brigada se activará **automáticamente**
3. Estará disponible para asignación de conglomerados

✅ **Indicador visual**: Las brigadas activas aparecen con un badge verde que dice "Activa"

#### Editar Brigada

1. Haga clic en el botón **"Editar"** de la brigada
2. Modifique los campos necesarios
3. Guarde los cambios

#### Eliminar Integrante

1. En la vista de detalles de la brigada
2. Localice al integrante en la lista
3. Haga clic en **"Eliminar"** (ícono de basura)
4. Confirme la acción

⚠️ **Advertencia**: Si elimina un integrante clave, la brigada puede desactivarse automáticamente.

---

### 5. Asignación de Conglomerados a Brigadas

#### Requisitos para Asignar

- ✅ Brigada **activa** (cumple requisitos de composición)
- ✅ Conglomerado en estado **"Aprobado"**
- ✅ Brigada sin otro conglomerado activo

#### Realizar Asignación

1. Vaya a **"Brigadas"** → **"Asignar Brigadas"**
2. **Seleccione la brigada** en el menú desplegable
   - Solo aparecen brigadas activas sin conglomerado activo
3. **Seleccione el conglomerado** en el menú desplegable
   - Solo aparecen conglomerados aprobados y sin asignar
4. Haga clic en **"Asignar Brigada"**
5. Confirmación:
   - El conglomerado cambia a estado **"Asignado"**
   - Se registra la fecha de asignación
   - La brigada queda vinculada al conglomerado

#### Ver Asignaciones

1. Vaya a **"Brigadas"** → **"Gestión de Brigadas"**
2. Haga clic en una brigada
3. Verá la sección **"Conglomerados Asignados"** con:
   - Nombre del conglomerado
   - Estado actual
   - Fecha de asignación
   - Ubicación

---

### 6. Validación de Observaciones

Las observaciones requieren **validación en dos niveles**:
1. **Validación del Jefe de Brigada** (primer nivel)
2. **Validación del Administrador/Coordinador** (nivel final)

#### Ver Observaciones Pendientes

1. Vaya a **"Observaciones"** → **"Lista de Observaciones"**
2. Filtre por: **"Validadas por Jefe"** o **"Pendientes de Validación Final"**
3. Verá todas las observaciones que requieren su revisión

#### Revisar Observación

1. Haga clic en una observación de la lista
2. Revise todos los datos:
   - **Datos climáticos**: Temperatura, humedad, precipitación
   - **Datos de terreno**: Pendiente, tipo de suelo, cobertura vegetal
   - **Datos GPS**: Coordenadas, altitud, precisión
   - **Observaciones**: Fauna, flora, notas adicionales
   - **Evidencias fotográficas**: Hasta 10 fotos
   - **Tiempos**: Hora de inicio y fin del trabajo

#### Validar Observación

1. Si los datos son correctos y completos
2. Haga clic en **"Validar Observación"**
3. La observación queda con **validación completa**
4. Los datos quedan disponibles para reportes

#### Rechazar Observación

1. Si encuentra errores o datos incompletos
2. Haga clic en **"Rechazar"**
3. Puede agregar **comentarios** explicando el motivo
4. La brigada deberá corregir y reenviar

#### Editar Observación (Solo Admin)

1. Los administradores pueden editar observaciones
2. Haga clic en **"Editar Observación"**
3. Modifique los campos necesarios
4. Guarde los cambios
5. Se registra en el log de auditoría

---

### 7. Consulta de Especies

1. Vaya a **"Especies"** → **"Gestión de Especies"**
2. Puede:
   - Ver catálogo completo
   - Buscar por nombre científico o común
   - Filtrar por tipo (Flora/Fauna)
   - Ver clasificación taxonómica
3. **Agregar nueva especie**:
   - Clic en **"Agregar Especie"**
   - Complete: nombre científico, común, familia, género, tipo
   - Guarde

---

### 8. Reportes e Indicadores

1. Vaya a **"Reportes"** → **"Indicadores y Reportes"**
2. Verá estadísticas como:
   - Total de conglomerados por estado
   - Brigadas activas vs inactivas
   - Observaciones validadas
   - Especies registradas
   - Gráficas de progreso

---

## 👨‍🏫 Manual para Coordinadores

Los coordinadores tienen acceso similar a los administradores, pero enfocado en:

### Funciones Principales

1. **Validación Final de Observaciones**
   - Revisar observaciones validadas por jefes de brigada
   - Aprobar o rechazar con comentarios
   - Asegurar calidad de datos

2. **Consulta de Conglomerados**
   - Ver todos los conglomerados
   - Ver estado de avance
   - Consultar ubicaciones

3. **Reportes**
   - Generar reportes de progreso
   - Ver estadísticas generales
   - Analizar datos recolectados

4. **Consulta de Especies**
   - Ver catálogo completo
   - Buscar especies

### Flujo de Validación

```
Brigada registra observación
         ↓
Jefe de Brigada valida
         ↓
Coordinador valida (validación final)
         ↓
Datos disponibles para análisis
```

---

## 🎯 Manual para Jefes de Brigada

### Panel de Control

Al iniciar sesión, verá:
- **Conglomerado activo** de su brigada (si tiene uno)
- Información rápida del conglomerado
- Acceso rápido a registro de observaciones
- Integrantes de su brigada

---

### 1. Ver Conglomerados Asignados

1. Vaya a **"Brigadas"** → **"Mis Conglomerados Asignados"**
2. Verá la lista de conglomerados asignados a su brigada
3. Para cada conglomerado verá:
   - Nombre
   - Estado actual
   - Ubicación (coordenadas)
   - Fecha de asignación
   - Acciones disponibles

---

### 2. Iniciar Trabajo en un Conglomerado

⚠️ **IMPORTANTE**: Solo puede tener **UN conglomerado activo** a la vez.

#### Pasos para Iniciar

1. En la lista de **"Mis Conglomerados Asignados"**
2. Localice el conglomerado en estado **"Asignado"**
3. Haga clic en el botón **"Iniciar"**
4. El sistema automáticamente:
   - Cambia el estado a **"En_Proceso"**
   - Registra la **fecha y hora de inicio**
   - Bloquea la posibilidad de iniciar otros conglomerados
5. El conglomerado aparece ahora en el **Dashboard** como "Conglomerado Activo"

✅ **Indicadores visuales**:
- Badge naranja que dice "En Proceso"
- Card destacado en el dashboard

---

### 3. Registrar Observaciones

#### Acceder al Formulario

1. Desde el **Dashboard**, haga clic en **"Registrar Observación"** en el card del conglomerado activo

   **O**

2. Vaya a **"Observaciones"** → **"Registrar Observación"**

#### Completar el Formulario

El formulario tiene varias secciones:

**A. Datos Climáticos**
- **Temperatura** (°C): Ej: 24.5
- **Humedad** (%): Ej: 75
- **Precipitación** (mm): Ej: 2.5

**B. Datos de Terreno**
- **Pendiente** (grados): Ej: 15
- **Tipo de suelo**: Seleccione de la lista
- **Cobertura vegetal** (%): Ej: 80

**C. Datos GPS**
- **Latitud**: Ej: 4.570868
- **Longitud**: Ej: -74.297333
- **Altitud** (metros): Ej: 2640
- **Precisión GPS** (metros): Ej: 3.5

**D. Observaciones**
- **Observaciones de Fauna**: Descripción detallada de animales observados
- **Observaciones de Flora**: Descripción de especies vegetales observadas
- **Notas Adicionales**: Cualquier información relevante

**E. Evidencias Fotográficas**
- Haga clic en **"Seleccionar Archivos"**
- Seleccione hasta **10 fotografías**
- Formatos aceptados: JPG, PNG, JPEG
- Tamaño máximo: 5 MB por foto

#### Guardar Observación

1. Revise que todos los campos obligatorios estén completos
2. Haga clic en **"Guardar Observación"**
3. El sistema automáticamente registra:
   - **Hora de inicio** (si es la primera observación)
   - Usuario que registró
   - Conglomerado asociado
   - Brigada asociada

✅ **Confirmación**: Verá un mensaje de éxito y la observación aparecerá en la lista

---

### 4. Validar Observaciones del Equipo

Como jefe de brigada, debe validar las observaciones registradas por su equipo antes de que vayan al coordinador.

#### Ver Observaciones de su Brigada

1. Vaya a **"Observaciones"** → **"Lista de Observaciones"**
2. Verá las observaciones de su brigada
3. Identifique las que están **sin validar** (sin check de validación)

#### Revisar y Validar

1. Haga clic en una observación
2. Revise todos los datos y fotos
3. Si está correcto:
   - Haga clic en **"Validar como Jefe de Brigada"**
   - La observación queda lista para validación del coordinador
4. Si necesita correcciones:
   - Comuníquese con el integrante que la registró
   - Pida que la edite o elimine y vuelva a registrar

---

### 5. Completar Conglomerado

Cuando haya terminado todo el trabajo de campo en el conglomerado:

1. Asegúrese de que:
   - ✅ Todas las observaciones están registradas
   - ✅ Todas las fotos están subidas
   - ✅ Todos los datos están validados por usted
2. Vaya a **"Mis Conglomerados Asignados"**
3. Localice el conglomerado activo
4. Haga clic en **"Completar"**
5. El sistema automáticamente:
   - Cambia el estado a **"Completado"**
   - Registra la **fecha y hora de finalización**
   - Libera a su brigada para iniciar otro conglomerado

✅ **Su brigada ya puede recibir nuevas asignaciones**

---

### 6. Ver Historial

1. Vaya a **"Observaciones"** → **"Lista de Observaciones"**
2. Filtre por:
   - Su brigada
   - Estado de validación
   - Fecha
3. Puede ver todas las observaciones históricas

---

## 👷 Manual para Integrantes de Brigada

### Panel de Control

Al iniciar sesión verá:
- **Conglomerado activo** de su brigada (si hay uno)
- Información básica del trabajo actual
- Acceso rápido a funciones

---

### 1. Ver Conglomerado Activo

1. En el **Dashboard**, verá el card del **"Conglomerado Activo"**
2. Información mostrada:
   - Nombre del conglomerado
   - Ubicación
   - Estado
   - Fecha de inicio

⚠️ **Nota**: Solo puede trabajar en el conglomerado que su jefe de brigada ha iniciado.

---

### 2. Colaborar en Observaciones

Dependiendo de la organización de su brigada, puede:

#### Opción A: Registrar Observaciones

1. Vaya a **"Observaciones"** → **"Registrar Observación"**
2. Complete el formulario (ver sección de Jefe de Brigada)
3. Suba evidencias fotográficas
4. Guarde la observación
5. Su jefe de brigada la validará

#### Opción B: Apoyar al Jefe

- Tome fotografías con su dispositivo
- Anote datos en campo
- Entregue la información al jefe de brigada
- El jefe registra en el sistema

---

### 3. Consultar Especies

1. Vaya a **"Especies"** → **"Consulta de Especies"**
2. Busque especies por:
   - Nombre científico
   - Nombre común
   - Familia
3. Vea información detallada:
   - Clasificación taxonómica
   - Descripción
   - Tipo (Flora/Fauna)

✅ **Útil en campo** para identificar especies

---

### 4. Ver Historial de Trabajo

1. Vaya a **"Observaciones"** → **"Lista de Observaciones"**
2. Filtre por su brigada
3. Vea observaciones completadas y validadas

---

## ❓ Preguntas Frecuentes

### General

**P: ¿Puedo acceder desde mi celular?**
R: Sí, el sistema es responsive y se adapta a dispositivos móviles. Se recomienda usar Chrome o Safari.

**P: ¿Qué hago si olvidé mi contraseña?**
R: Contacte al administrador del sistema para que la restablezca.

**P: ¿Cómo cambio mi contraseña?**
R: Vaya a "Mi Perfil" → "Cambiar Contraseña"

**P: ¿Puedo ver los datos de otras brigadas?**
R: No, solo los administradores y coordinadores pueden ver datos de todas las brigadas.

### Para Administradores

**P: ¿Cuántos conglomerados puedo generar a la vez?**
R: Entre 1 y 100 conglomerados por operación.

**P: ¿Puedo eliminar un conglomerado?**
R: Sí, pero solo si no tiene observaciones asociadas. Se recomienda usar el estado "Rechazado" en su lugar.

**P: ¿Puedo desasignar un conglomerado de una brigada?**
R: No directamente. Debe marcar el conglomerado como completado o rechazado.

**P: ¿Qué pasa si desactivo a un usuario?**
R: El usuario no puede iniciar sesión, pero todos sus datos se conservan.

### Para Jefes de Brigada

**P: ¿Puedo trabajar en dos conglomerados al mismo tiempo?**
R: No, solo puede tener un conglomerado activo a la vez.

**P: ¿Qué pasa si inicio un conglomerado por error?**
R: Contacte al administrador para que lo reasigne o cambie el estado.

**P: ¿Puedo eliminar una observación?**
R: Solo si aún no ha sido validada. Después de validación, solo el administrador puede modificarla.

**P: ¿Cuántas observaciones debo registrar por conglomerado?**
R: Depende del protocolo. Generalmente se registran observaciones para cada subparcela (5 en total).

**P: ¿Qué hago si no tengo conexión en campo?**
R: Anote los datos en papel y regístrelos en el sistema cuando tenga conexión.

### Observaciones

**P: ¿Puedo editar una observación después de guardarla?**
R: Sí, mientras no haya sido validada por el jefe de brigada.

**P: ¿Qué formatos de foto puedo subir?**
R: JPG, JPEG y PNG. Máximo 5 MB por foto, hasta 10 fotos por observación.

**P: ¿Qué pasa si la foto es muy grande?**
R: El sistema rechazará la foto. Reduzca el tamaño antes de subirla.

---

## 🔧 Solución de Problemas

### No puedo iniciar sesión

**Síntomas**: Mensaje de "Usuario o contraseña incorrectos"

**Soluciones**:
1. Verifique que está escribiendo correctamente el usuario y contraseña
2. Verifique que las mayúsculas están correctas
3. Asegúrese de que su cuenta está activa
4. Si olvidó su contraseña, contacte al administrador

---

### No veo el conglomerado de mi brigada

**Síntomas**: El dashboard no muestra conglomerado activo

**Soluciones**:
1. Verifique que su jefe de brigada haya iniciado un conglomerado
2. Verifique que pertenece a una brigada
3. Actualice la página (F5)
4. Cierre sesión y vuelva a iniciar

---

### No puedo subir fotos

**Síntomas**: Error al subir evidencias fotográficas

**Soluciones**:
1. Verifique que las fotos son JPG, JPEG o PNG
2. Verifique que cada foto pesa menos de 5 MB
3. Verifique su conexión a internet
4. Intente con menos fotos a la vez
5. Reduzca el tamaño de las imágenes antes de subir

---

### La página se ve descuadrada

**Síntomas**: Los elementos no se ven correctamente

**Soluciones**:
1. Actualice la página (Ctrl + F5)
2. Limpie el caché del navegador
3. Actualice su navegador a la última versión
4. Intente con otro navegador (Chrome recomendado)

---

### El mapa no carga

**Síntomas**: El mapa aparece en blanco

**Soluciones**:
1. Verifique su conexión a internet
2. Actualice la página
3. Intente con otro navegador
4. Verifique que no tiene bloqueadores de contenido activos

---

### Mensaje "Sesión expirada"

**Síntomas**: El sistema pide iniciar sesión nuevamente

**Soluciones**:
1. Inicie sesión nuevamente
2. Las sesiones expiran después de 7 días por seguridad
3. Si ocurre frecuentemente, contacte al administrador

---

## 📞 Soporte Técnico

Si los problemas persisten:

1. **Anote**:
   - Qué estaba haciendo cuando ocurrió el problema
   - Mensaje de error exacto (si hay)
   - Navegador y versión que usa
   - Capturas de pantalla (si es posible)

2. **Contacte**:
   - **Soporte técnico**: [Correo o teléfono del soporte]
   - **Administrador del sistema**: [Nombre y contacto]
   - **Repositorio de issues**: https://github.com/duvanleandro/ProyectoIntegrador/issues

---

## 📚 Recursos Adicionales

- **Manual Técnico**: Para información sobre instalación y configuración
- **Documentación del Proyecto**: `ecodatos-project/README.md`
- **Manual IFN Colombia**: Protocolo oficial del Inventario Forestal Nacional

---

**Versión del Manual**: 1.0
**Última actualización**: Noviembre 12, 2024
**Sistema**: EcoDatos v1.0

---

**Desarrollado por el equipo de EcoDatos**
Universidad de Investigación y Desarrollo
