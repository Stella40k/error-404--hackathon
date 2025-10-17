// Función para calcular el tiempo transcurrido desde una fecha
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

// Función para crear el HTML de una tarjeta de reporte individual
const createReportCard = (report) => {
  const authorName = report.author ? report.author.username : "Anónimo";

  return `
    <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 transition-all hover:shadow-md" style="border-left: 4px solid var(--color-primary);">
        <div class="flex justify-between items-center">
            <span class="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">${
              report.tipoProblema
            }</span>
            <span class="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full">Nuevo</span>
        </div>
        <div>
            <h3 class="font-bold text-md text-gray-800">${report.titulo}</h3>
            <p class="text-sm text-gray-500 truncate">${report.descripcion}</p>
        </div>
        <span class="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded-full self-start">${
          report.subcategoria
        }</span>
        <div class="border-t pt-3 mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>por <strong>${authorName}</strong></span>
            <span>${timeAgo(report.createdAt)}</span>
        </div>
        <button class="w-full text-center mt-2 bg-gray-100 hover:bg-gray-200 font-semibold py-2 rounded-lg text-sm transition-colors">
            Ver Detalles
        </button>
    </div>
    `;
};

// Función para añadir un nuevo reporte al DOM (al principio de la lista)
const addReportToDOM = (report) => {
  const reportsContainer = document.getElementById("reports-container");
  if (reportsContainer) {
    const reportCardHTML = createReportCard(report);
    reportsContainer.insertAdjacentHTML("afterbegin", reportCardHTML);
  }
};

// Función principal para obtener todos los reportes y renderizarlos en la página
const getAndRenderReports = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/reports", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener los reportes.");
    }

    const reports = await response.json();
    const reportsContainer = document.getElementById("reports-container");
    if (reportsContainer) {
      reportsContainer.innerHTML = ""; // Limpiar antes de renderizar

      reports.forEach((report) => {
        const reportCardHTML = createReportCard(report);
        reportsContainer.innerHTML += reportCardHTML;
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Llama a la función para cargar los reportes cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", getAndRenderReports);
