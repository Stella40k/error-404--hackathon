const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `Hace ${Math.floor(interval)} años`;
  interval = seconds / 2592000;
  if (interval > 1) return `Hace ${Math.floor(interval)} meses`;
  interval = seconds / 86400;
  if (interval > 1) return `Hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `Hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `Hace ${Math.floor(interval)} minutos`;
  return "Hace unos momentos";
};

// Función para crear el HTML de una tarjeta de reporte
const createReportCard = (report) => {
  const authorName =
    report.anonimo || !report.usuario ? "Anónimo" : report.usuario.username;
  const maxLength = 50;
  let descriptionHTML = "";
  const sanitizedDescription = report.descripcion.replace(/"/g, "&quot;");

  if (report.descripcion.length > maxLength) {
    const truncatedText = sanitizedDescription.substring(0, maxLength) + "...";
    descriptionHTML = `<p class="text-sm text-gray-500 report-description break-words">${truncatedText}</p><button class="text-xs font-semibold text-blue-600 hover:underline toggle-description mt-1 self-start" data-full-text="${sanitizedDescription}" data-truncated-text="${truncatedText}">Ver más</button>`;
  } else {
    descriptionHTML = `<p class="text-sm text-gray-500 report-description break-words">${report.descripcion}</p>`;
  }

  return `
    <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 transition-all hover:shadow-md" style="border-left: 4px solid var(--color-primary);">
        <div class="flex justify-between items-center">
            <span class="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">${
              report.categoria_principal
            }</span>
            <span class="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full">${
              report.estado
            }</span>
        </div>
        
        <div class="flex-grow min-w-0">
            <h3 class="font-bold text-md text-gray-800 break-words">${
              report.subcategoria
            }</h3>
            ${descriptionHTML}
        </div>

        <div id="map-${report._id}" class="report-card-map" data-lat="${
    report.location.coordinates[1]
  }" data-lng="${report.location.coordinates[0]}"></div>

        <span class="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded-full self-start mt-2">${
          report.subcategoria
        }</span>
        
        <div class="border-t pt-3 mt-auto flex justify-between items-center text-xs text-gray-500">
            <span>por <strong>${authorName}</strong></span>
            <span>${timeAgo(report.createdAt)}</span>
        </div>
        
        <button class="w-full text-center mt-2 bg-gray-100 hover:bg-gray-200 font-semibold py-2 rounded-lg text-sm transition-colors">
            Ver Detalles
        </button>
    </div>
    `;
};

// Función para inicializar los mapas en las tarjetas de reporte
const initializeCardMaps = () => {
  const mapDivs = document.querySelectorAll(".report-card-map");
  mapDivs.forEach((div) => {
    // Evitar reinicializar un mapa
    if (div._leaflet_id) return;

    const lat = div.dataset.lat;
    const lng = div.dataset.lng;

    const map = L.map(div.id, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );
    L.marker([lat, lng]).addTo(map);
  });
};

// Función para añadir un nuevo reporte al DOM e inicializar su mapa
const addReportToDOM = (report) => {
  const reportsContainer = document.getElementById("reports-container");
  if (reportsContainer) {
    const reportCardHTML = createReportCard(report);
    reportsContainer.insertAdjacentHTML("afterbegin", reportCardHTML);
    // Esperar un momento para que el DOM se actualice antes de inicializar el mapa
    setTimeout(initializeCardMaps, 50);
  }
};

// Función principal para obtener y mostrar todos los reportes
const getAndRenderReports = async (containerId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/reports", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "No se pudieron obtener los reportes.");
    }

    const data = await response.json();
    const reportsContainer = document.getElementById(containerId);

    if (reportsContainer) {
      reportsContainer.innerHTML = "";
      data.reports.forEach((report) => {
        reportsContainer.innerHTML += createReportCard(report);
      });
      // Inicializar todos los mapas después de renderizar las tarjetas
      initializeCardMaps();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Listeners
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("reports-container")) {
    getAndRenderReports("reports-container");
  }

  const mainContainer = document.querySelector(".flex-1");
  if (mainContainer) {
    mainContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("toggle-description")) {
        const button = event.target;
        const descriptionP = button.previousElementSibling;
        const isTruncated = button.textContent.trim() === "Ver más";

        if (isTruncated) {
          descriptionP.textContent = button.dataset.fullText;
          button.textContent = "Ver menos";
        } else {
          descriptionP.textContent = button.dataset.truncatedText;
          button.textContent = "Ver más";
        }
      }
    });
  }
});
