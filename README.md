Plan Maestro de Desarrollo - UrbiVox MVP Final

Este documento describe el plan de trabajo detallado para la implementación del Producto Mínimo Viable (MVP) de UrbiVox durante la Hackathon.

📅 Objetivo Principal (MVP)Implementar el reporte anónimo, la asignación automática de gravedad, el Mapa de Calor estratégico y la autenticación para el Dashboard de análisis.🧠

Estrategia ClaveEl Backend asigna la Gravedad Objetiva

(1-5) basada en la subcategoría de reporte, eliminando la necesidad de input de gravedad por parte del usuario.

✅ 1. Fase de Configuración y Modelado (Backend Base)

Objetivo: Establecer la arquitectura del servidor y la base de datos para la seguridad.TareaRol PrincipalDetalle Técnico Clave A1. Configuración CoreBackendCrear package.json con "type": "module". Instalar express, mongoose, dotenv, bcrypt, jsonwebtoken.

A2. Modelos EsencialesBackendCrear Incidente.js (con gravedad_objetiva y GeoJSON Point) y User.js (para Auth del Dashboard).

A3. Base de DatosBackendConfigurar la conexión a MongoDB (db.js). Crear una función de seeding para cargar datos mockeados iniciales para pruebas.

A4. Frontend BaseFrontendCrear public/index.html (con el div del mapa) y login.html. Enlazar Bootstrap y Leaflet (CSS/JS).

🚀 2. Fase Core: API de Reporte y Gravedad Automática (Foco Principal)Objetivo: Implementar la lógica de negocio que traduce la categoría del usuario a un valor de riesgo numérico objetivo.

TareaRol PrincipalMódulo Clave / Detalle B1. Matriz de GravedadBackendCodificar la Matriz de Ponderación Fija (Tabla de Subcategorías vs. Valor 1-5) en el controlador (reporteController.js).

B2. API de Lectura (Mapa)BackendImplementar GET /api/incidents (Ruta pública). El controlador debe aceptar filtros (type, minRisk, etc.) para devolver los incidentes.

B3. API de Escritura (POST)BackendImplementar POST /api/reports. El controlador debe: 1) Asignar el valor de gravedad_objetiva basándose en la subcategoría recibida, y 2) Aplicar la Lógica Anti-Spam antes de guardar en MongoDB.

B4. API de Alerta SilenciosaBackendImplementar POST /api/alerts/acoso (Guarda ubicación/hora). Esto alimenta la funcionalidad de Reacción Rápida.

🗺️ 3. Fase Mapa, Visualización y Reacción (Coordinación)Objetivo: Lograr la visualización de los datos ponderados y las herramientas de intervención directa.

TareaRol PrincipalMódulo Clave / Detalle

C1. Inicialización y ConexiónFrontendjs/map.js y js/main.js (Módulos ES). Inicializar Leaflet y la función loadIncidents() que llama a GET /api/incidents.

C2. Visualización de RiesgoFrontendjs/map.js: La función loadIncidents debe leer el valor gravedad_objetiva y usarlo para definir el color o tamaño del marcador o punto en el Mapa de Calor.

C3. Filtros en UIFrontendImplementar los controles de filtro (Bootstrap) y la lógica en js/main.js para enviar los filtros como query parameters a la API.

C4. Reporte en UIFrontendFormulario de reporte simple. La selección de Categoría/Subcategoría es la única entrada de clasificación. Implementar el click en el mapa para obtener coordenadas.

C5. Reacción InmediataFrontendImplementar los botones de llamada directa (tel:911, tel:107) y el botón para el POST silencioso a la ruta /api/alerts/acoso.

🔑 4. Fase de Seguridad y Dashboard (Inteligencia Estratégica)Objetivo: Proteger el acceso y exponer la inteligencia urbana para las autoridades. TareaRol PrincipalMódulo Clave / Detalle

D1. Autenticación y SeguridadBackendImplementar el authMiddleware.js (verificación JWT) y las rutas de registro/login (POST /api/auth/*).

D2. API de CorrelaciónBackendImplementar GET /api/dashboard/stats (Protegida). Lógica de Mongoose Aggregation para calcular la Matriz de Intervención (tendencias horarias y por subcategoría).

D3. API de ExportaciónBackendImplementar GET /api/dashboard/export (Protegida). Lógica para generar CSV aplicando el redondeo de coordenadas para la anonimización de datos.

D4. Interfaz DashboardFrontendCrear dashboard.html. js/dashboard.js consume las rutas protegidas y usa Chart.js para visualizar los gráficos de Matriz de Intervención y tendencias.

D5. Flujo de LoginFrontendlogin.html / js/auth.js: Manejo de envío de credenciales, almacenamiento del token y redirección al Dashboard.

🏆 Criterios de Éxito del MVP (Foco en Ponderación)

El éxito de UrbiVox se medirá por la capacidad de demostrar que:La Gravedad es Automática: El sistema puede recibir un POST con la subcategoría (ej. "Robo con Violencia") y guardarlo con gravedad_objetiva: 5 sin intervención del usuario.Visualización Estratégica: El mapa utiliza esa gravedad_objetiva para crear un Mapa de Calor visible y significativo.Inteligencia Accionable: El Dashboard protegido muestra la Matriz de Intervención (tendencias) alimentada por la data ponderada.
