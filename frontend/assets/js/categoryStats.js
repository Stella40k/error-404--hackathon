document.addEventListener("DOMContentLoaded", () => {
  const fetchCategoryCounts = async () => {
    try {
      // Esta ruta es pública y no necesita token.
      const response = await fetch("/api/reports/stats");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "No se pudieron cargar las estadísticas."
        );
      }

      const stats = await response.json();

      if (stats && stats.categorias) {
        const categoryCounts = stats.categorias;

        const categoryIdMap = {
          "Delito / Robo": "count-delito-robo",
          "Violencia / Acoso": "count-violencia-acoso",
          "Tránsito / Vía Pública": "count-transito",
          "Infraestructura de Riesgo": "count-infraestructura",
        };

        for (const categoryName in categoryIdMap) {
          const elementId = categoryIdMap[categoryName];
          const countElement = document.getElementById(elementId);
          if (countElement) {
            const count = categoryCounts[categoryName] || 0;
            countElement.textContent = count;
          }
        }
      } else {
        console.log(
          "No se recibieron estadísticas o el formato es incorrecto."
        );
      }
    } catch (error) {
      console.error("Error al obtener las estadísticas de categorías:", error);
      // Opcional: Ocultar los contadores si hay un error
      const countSpans = document.querySelectorAll('[id^="count-"]');
      countSpans.forEach((span) => (span.style.display = "none"));
    }
  };

  fetchCategoryCounts();
});
