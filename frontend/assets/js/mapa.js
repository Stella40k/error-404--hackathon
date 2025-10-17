document.addEventListener("DOMContentLoaded", () => {
  // Coordenadas de Formosa para centrar el mapa
  const formosaCoords = [-26.1775, -58.1756];

  // Inicializar el mapa
  const map = L.map("main-map").setView(formosaCoords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Función para obtener todos los reportes y añadir marcadores
  const fetchAndDisplayReports = async () => {
    try {
      const token = localStorage.getItem("token");
      // La ruta /api/reports ya es pública según tu router, pero enviamos el token por si acaso
      const response = await fetch("/api/reports", {
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

          const marker = L.marker([lat, lng]).addTo(map);

          // Crear el contenido del popup del marcador
          const popupContent = `
                        <div class="p-1">
                            <h4 class="font-bold text-md">${report.subcategoria}</h4>
                            <p class="text-sm text-gray-600">${report.descripcion}</p>
                            <span class="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full mt-2 inline-block">${report.categoria_principal}</span>
                        </div>
                    `;

          marker.bindPopup(popupContent);
        }
      });
    } catch (error) {
      console.error("Error al cargar los reportes en el mapa:", error);
      alert(
        "Hubo un problema al cargar los reportes. Intenta de nuevo más tarde."
      );
    }
  };

  // Llamar a la función para poblar el mapa
  fetchAndDisplayReports();
});
