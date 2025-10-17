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
      "Robo con Violencia",
      "Hurto",
      "Vandalismo y Daño",
      "Venta / Tráfico Ilegal",
    ],
    "Violencia / Acoso": [
      "Acoso / Hostigamiento",
      "Pelea o Agresión",
      "Situación de Violencia de Género",
    ],
    "Tránsito / Vía Pública": [
      "Accidente Vial",
      "Conducción Peligrosa",
      "Obstrucción / Peligro Vial",
    ],
    "Infraestructura de Riesgo": [
      "Mala Iluminación",
      "Vía Pública en Mal Estado",
      "Abandono Urbano",
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
      options.forEach((optionText) => {
        const opt = document.createElement("option");
        opt.value = optionText;
        opt.textContent = optionText;
        subcategorySelect.appendChild(opt);
      });
      subcategoryContainer.classList.remove("hidden");
    });
  }

  if (reportForm) {
    reportForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const reportData = {
        categoria_principal: document.getElementById("category-select").value,
        subcategoria: document.getElementById("subcategory-select").value,
        descripcion: document.getElementById("report-description").value,
        anonimo: document.getElementById("anonimo-checkbox").checked,
        // **DATO SIMULADO:** Tu nuevo backend requiere una ubicación.
        // La añadimos aquí temporalmente hasta que se implemente el mapa.
        location: {
          lat: -26.1775,
          lng: -58.1756,
        },
      };

      if (
        !reportData.categoria_principal ||
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

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Error al crear el reporte");
        }

        alert(result.message);
        closeReportModal();
        addReportToDOM(result.reporte);
      } catch (error) {
        console.error("Error:", error);
        alert(error.message);
      }
    });
  }
});
