document.addEventListener("DOMContentLoaded", () => {
  // --- Lógica para las subcategorías en el Home ---
  for (let i = 1; i <= 4; i++) {
    const toggleButton = document.getElementById(`toggle-button-${i}`);
    const subcategoryPanel = document.getElementById(`subcategory-panel-${i}`);

    if (toggleButton && subcategoryPanel) {
      toggleButton.addEventListener("click", () => {
        const isHidden = subcategoryPanel.classList.contains("hidden");
        subcategoryPanel.classList.toggle("hidden");

        const buttonText = toggleButton.querySelector("span");
        const buttonIcon = toggleButton.querySelector("i");

        if (isHidden) {
          buttonText.textContent = "Ocultar Subcategorías";
          buttonIcon.style.transform = "rotate(180deg)";
        } else {
          buttonText.textContent = "Ver Subcategorías";
          buttonIcon.style.transform = "rotate(0deg)";
        }
      });
    }
  }

  // --- Lógica para el modal de Reporte ---
  const openReportModalBtn = document.getElementById("open-report-modal");
  const reportModal = document.getElementById("report-modal");
  const closeReportModalBtn = document.getElementById("close-report-modal");
  const cancelReportBtn = document.getElementById("cancel-report-button");
  const categorySelect = document.getElementById("category-select");
  const subcategoryContainer = document.getElementById("subcategory-container");
  const subcategorySelect = document.getElementById("subcategory-select");
  const reportForm = document.getElementById("report-form");

  const subcategories = {
    "Delito / Robo": [
      { value: "Robo con Violencia", text: "Robo con Violencia" },
      { value: "Hurto", text: "Hurto" },
      { value: "Vandalismo y Daño", text: "Vandalismo y Daño" },
      { value: "Venta / Tráfico Ilegal", text: "Venta / Tráfico Ilegal" },
    ],
    "Violencia / Acoso": [
      { value: "Acoso / Hostigamiento", text: "Acoso / Hostigamiento" },
      { value: "Pelea o Agresión", text: "Pelea o Agresión" },
      {
        value: "Situación de Violencia de Género",
        text: "Situación de Violencia de Género",
      },
    ],
    "Tránsito / Vía Pública": [
      { value: "Accidente Vial", text: "Accidente Vial" },
      { value: "Conducción Peligrosa", text: "Conducción Peligrosa" },
      {
        value: "Obstrucción / Peligro Vial",
        text: "Obstrucción / Peligro Vial",
      },
    ],
    "Infraestructura de Riesgo": [
      { value: "Mala Iluminación", text: "Mala Iluminación" },
      { value: "Vía Pública en Mal Estado", text: "Vía Pública en Mal Estado" },
      { value: "Abandono Urbano", text: "Abandono Urbano" },
    ],
  };

  const resetReportModal = () => {
    if (reportForm) reportForm.reset();
    if (subcategoryContainer) subcategoryContainer.classList.add("hidden");
    if (subcategorySelect) subcategorySelect.innerHTML = "";
  };

  const closeReportModal = () => {
    if (reportModal) {
      reportModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
      resetReportModal();
    }
  };

  if (openReportModalBtn) {
    openReportModalBtn.addEventListener("click", () => {
      if (reportModal) {
        reportModal.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
      }
    });
  }

  if (closeReportModalBtn)
    closeReportModalBtn.addEventListener("click", closeReportModal);
  if (cancelReportBtn)
    cancelReportBtn.addEventListener("click", closeReportModal);
  if (reportModal) {
    reportModal.addEventListener("click", (event) => {
      if (event.target === reportModal) closeReportModal();
    });
  }
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      reportModal &&
      !reportModal.classList.contains("hidden")
    ) {
      closeReportModal();
    }
  });

  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      const selectedCategory = e.target.value;
      if (!selectedCategory) {
        subcategoryContainer.classList.add("hidden");
        subcategorySelect.innerHTML = "";
        return;
      }
      const options = subcategories[selectedCategory];
      subcategorySelect.innerHTML =
        '<option value="">Selecciona una subcategoría</option>';
      options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.text;
        subcategorySelect.appendChild(opt);
      });
      subcategoryContainer.classList.remove("hidden");
    });
  }

  // --- MANEJO DEL ENVÍO DEL FORMULARIO ---
  if (reportForm) {
    reportForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const reportData = {
        titulo: document.getElementById("report-title").value,
        tipoProblema: document.getElementById("category-select").value,
        subcategoria: document.getElementById("subcategory-select").value,
        descripcion: document.getElementById("report-description").value,
      };

      if (
        !reportData.titulo ||
        !reportData.tipoProblema ||
        !reportData.subcategoria ||
        !reportData.descripcion
      ) {
        alert("Por favor completa todos los campos.");
        return;
      }

      try {
        const response = await fetch("/api/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reportData),
        });

        const newReport = await response.json();

        if (!response.ok) {
          throw new Error(newReport.message || "Error al crear el reporte");
        }

        alert("¡Reporte creado exitosamente!");
        closeReportModal();

        addReportToDOM(newReport);
      } catch (error) {
        console.error("Error:", error);
        alert(error.message);
      }
    });
  }
});
