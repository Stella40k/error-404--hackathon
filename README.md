# 🧭 Plan de Desarrollo – Termómetro Vecinal (Versión MVP Mockeada)

📅 *Objetivo:* Desarrollar una versión funcional y navegable del MVP de Termómetro Vecinal usando *HTML, CSS, Bootstrap, JavaScript, Leaflet (sin React), Node.js, Express y MongoDB*, con datos simulados

🧠 *Estrategia general:*  
Construir una aplicación web usable que simule la lógica principal (reporte anónimo, visualización en mapa, alertas y dashboard para autoridades).  
Todas las vistas deben ser 100% navegables, con flujos de interacción realistas y visualmente consistentes.

---

## ✅ 1. Configuración del Proyecto

- [ ] Crear repositorio termometro-vecinal
- [ ] Estructura base: 
  - [ ] Frontend (public/ y src/)
  - [ ] Backend (server/)
- [ ] Configurar Node.js + Express + MongoDB
- [ ] Instalar dependencias principales:
  - [ ] express, mongoose, express-validator
  - [ ] dotenv, cors, nodemon
  - [ ] bcrypt, jsonwebtoken (si se incluye autenticación)
  - [ ] faker o datos mockeados para pruebas
- [ ] Boilerplate frontend: HTML, CSS, Bootstrap, JS, Leaflet
- [ ] Setup de README y documentación inicial

---

## 🧩 2. Estructura de Carpetas


project-root/
│
├── public/               # Archivos estáticos (HTML, CSS, JS, imágenes)
│   ├── index.html
│   ├── map.html
│   ├── dashboard.html
│   └── assets/
│
├── src/                  # JS frontend modular
│   ├── js/
│   ├── css/
│   └── components/
│
├── server/               # Backend Node.js + Express
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
├── mock/                 # Datos simulados para demo
│   └── reports.json
│
├── .env
├── package.json
├── README.md
└── ...


---

## 🧱 3. Fases de Desarrollo (Roadmap Técnico)

### 🚀 Fase 1 – Setup Inicial

- [ ] Crear estructura de carpetas base
- [ ] Configurar servidor Express básico
- [ ] Conectar a MongoDB (o usar datos mockeados en mock/reports.json)
- [ ] Servir archivos estáticos
- [ ] Crear modelo básico de reporte de problema urbano

---

### 🗺 Fase 2 – Mapa Interactivo (Leaflet JS)

- [ ] Página principal con mapa Leaflet
- [ ] Mostrar markers por tipo de problema (iluminación, calles, abandono, tránsito)
- [ ] Filtros y leyenda visual
- [ ] Actualización en tiempo real (mock/fetch)

---

### 📝 Fase 3 – Reporte Anónimo de Problemas

- [ ] Formulario Bootstrap para reportar problema
  - Tipo de problema
  - Comentario
  - Ubicación (geolocalización/selección en mapa)
- [ ] Validación de datos (frontend y backend)
- [ ] POST a /api/reports (mock o real)
- [ ] Mensaje de éxito/error

---

### 🔔 Fase 4 – Alertas Visuales

- [ ] Indicador de zonas con acumulación de reportes
- [ ] Notificaciones en la app (banners, toasts)
- [ ] Visualización de nuevos reportes cerca del usuario

---

### 📊 Fase 5 – Dashboard para Municipio

- [ ] Página dashboard con:
  - Gráficos (Chart.js): reportes por tipo, zona, fecha
  - Tabla de reportes
  - Exportación de datos (CSV/JSON)
- [ ] Acceso solo para usuarios autenticados (mock o real)

---

### 🔑 Fase 6 – Autenticación Opcional

- [ ] Login/registro básico
- [ ] Hash de contraseñas (bcrypt)
- [ ] JWT para sesiones (si se implementa)
- [ ] Modo anónimo disponible para reporte

---

### 🎨 Fase 7 – UI / UX Polishing

- [ ] Tema claro/oscuro (toggle)
- [ ] Animaciones sutiles (spinners, mensajes)
- [ ] Logo/tagline
- [ ] Accesibilidad básica (contraste, ARIA)
- [ ] Navbar/sidebar navegable

---

### 🧪 Fase 8 – Mock Data y Simulación

- [ ] Crear archivos .json simulados para:
  - Reportes
  - Usuarios
  - Estadísticas
- [ ] Funciones de carga simulada
- [ ] Endpoints mockeados para demo

---

## 🧠 Ejemplo de Datos Mockeados

json
{
  "ubicacion": { "lat": -26.182, "lng": -58.175 },
  "tipo_problema": "Mala iluminación",
  "comentario": "Muchos focos rotos y poca gente.",
  "fecha": "2025-10-15T12:34:00Z"
}


---

## 🧭 Entregables de la Versión MVP

| Entregable             | Estado | Prioridad |
|------------------------|--------|-----------|
| Estructura de proyecto |   ☐    |   Alta    |
| Home + Mapa (Leaflet)  |   ☐    |   Alta    |
| Reporte anónimo        |   ☐    |   Alta    |
| Alertas visuales       |   ☐    |   Alta    |
| Dashboard municipio    |   ☐    |   Media   |
| Auth básica            |   ☐    |   Media   |
| UI animada             |   ☐    |   Media   |
| Documentación README   |   ☐    |   Alta    |

---

## 🧩 Extras Recomendados para la Demo

- Splash animado con logo
- Mapa Leaflet destacado
- Indicadores visuales de zonas problemáticas
- Botón flotante “Reportar problema”
- Simulación de push (“Nuevo reporte en tu zona”)
- Branding y tagline (“Tu percepción, nuestra ciudad”)

---


