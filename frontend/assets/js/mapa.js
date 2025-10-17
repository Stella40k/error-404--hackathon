document.addEventListener("DOMContentLoaded", () => {
  // Coordenadas de Formosa para centrar el mapa
  const formosaCoords = [-26.1775, -58.1756];

  // Inicializar el mapa
  const map = L.map("main-map").setView(formosaCoords, 13);

  // Array para mantener un registro de los marcadores actuales
  let currentMarkers = [];

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // --- Lógica de Iconos Personalizados ---

  // Función para crear un DivIcon de Leaflet con estilo personalizado
  const createCustomIcon = (iconClass, bgColor) => {
    return L.divIcon({
      html: `<div style="background-color: ${bgColor};" class="marker-pin"><i class="ph ${iconClass} text-white text-xl"></i></div>`,
      iconSize: [32, 32],
      className: "custom-div-icon",
    });
  };

  // Mapeo de nombres de categorías a clases de íconos y colores
  const categoryIcons = {
    "Delito / Robo": createCustomIcon("ph-shield-warning", "#EF4444"), // red-500
    "Violencia / Acoso": createCustomIcon("ph-warning-octagon", "#8B5CF6"), // purple-500
    "Tránsito / Vía Pública": createCustomIcon("ph-car", "#F97316"), // orange-500
    "Infraestructura de Riesgo": createCustomIcon("ph-warning", "#EAB308"), // yellow-500
    default: createCustomIcon("ph-map-pin", "#6B7280"), // gray-500
  };

  // Función para obtener el ícono correcto para una categoría
  const getIconForCategory = (category) => {
    return categoryIcons[category] || categoryIcons["default"];
  };

  // Función para limpiar todos los marcadores del mapa
  const clearMarkers = () => {
    currentMarkers.forEach((marker) => map.removeLayer(marker));
    currentMarkers = [];
  };

  // --- Lógica de Obtención y Visualización de Reportes ---

  // Función para obtener y mostrar reportes, con filtro opcional por categoría
  const fetchAndDisplayReports = async (category = "Todos") => {
    clearMarkers(); // Limpiar marcadores antiguos antes de agregar nuevos
    let url = "/api/reports";

    // Si la categoría no es "Todos", añadirla como parámetro a la URL
    if (category && category !== "Todos") {
      url += `?categoria_principal=${encodeURIComponent(category)}`;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar los reportes en el mapa.");
      }

      const data = await response.json();

      // Añadir un marcador por cada reporte
      data.reports.forEach((report) => {
        if (report.location && report.location.coordinates) {
          const [lng, lat] = report.location.coordinates;
          const customIcon = getIconForCategory(report.categoria_principal);

          const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

          // Crear el contenido del popup del marcador
          const popupContent = `
            <div class="p-1 max-w-xs">
                <h4 class="font-bold text-md">${report.subcategoria}</h4>
                <p class="text-sm text-gray-600">${report.descripcion}</p>
                <span class="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full mt-2 inline-block">${report.categoria_principal}</span>
            </div>
          `;

          marker.bindPopup(popupContent);
          currentMarkers.push(marker); // Guardar el marcador para poder eliminarlo después
        }
      });
    } catch (error) {
      console.error("Error al cargar los reportes en el mapa:", error);
      alert(
        "Hubo un problema al cargar los reportes. Intenta de nuevo más tarde."
      );
    }
  };

  // --- Event Listeners para la Barra de Filtros ---

  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      // Manejar el estado visual "activo"
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Obtener la categoría del botón y volver a cargar los reportes
      const category = button.dataset.category;
      fetchAndDisplayReports(category);
    });
  });

  // Carga inicial de todos los reportes al cargar la página
  fetchAndDisplayReports();
});
