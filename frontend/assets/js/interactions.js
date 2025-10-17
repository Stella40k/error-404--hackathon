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
  const reportDescription = document.getElementById("report-description");
  const reportForm = reportModal ? reportModal.querySelector("form") : null;

  const subcategories = {
    delito: [
      {
        value: "robo_violencia",
        text: "Robo con Violencia",
        description: "Atraco, a mano armada",
      },
      {
        value: "hurto",
        text: "Hurto",
        description: "Robo sin violencia, de vehículo/pertenencias",
      },
      {
        value: "vandalismo",
        text: "Vandalismo y Daño",
        description: "Rotura de propiedad, Graffiti",
      },
      {
        value: "trafico",
        text: "Venta / Tráfico Ilegal",
        description: "Venta de estupefacientes o contrabando",
      },
    ],
    violencia: [
      {
        value: "acoso",
        text: "Acoso / Hostigamiento",
        description: "Verbal, Seguimiento, Conducta sospechosa",
      },
      {
        value: "pelea",
        text: "Pelea o Agresión",
        description: "Disturbios en la vía pública, Conflicto vecinal",
      },
      {
        value: "violencia_genero",
        text: "Situación de Violencia de Género",
        description: "Requiere máxima prioridad",
      },
    ],
    transito: [
      {
        value: "accidente",
        text: "Accidente Vial",
        description: "Colisión, Choque con lesiones",
      },
      {
        value: "conduccion_peligrosa",
        text: "Conducción Peligrosa",
        description: "Picadas, Exceso de velocidad",
      },
      {
        value: "obstruccion",
        text: "Obstrucción / Peligro Vial",
        description: "Vehículo abandonado, Objeto en la calle",
      },
    ],
    infraestructura: [
      {
        value: "iluminacion",
        text: "Mala Iluminación",
        description: "Foco roto, Calles oscuras",
      },
      {
        value: "via_publica",
        text: "Vía Pública en Mal Estado",
        description: "Baches, Zanjas abiertas, Acera destrozada",
      },
      {
        value: "abandono_urbano",
        text: "Abandono Urbano",
        description: "Lotes baldíos, Basurales a cielo abierto",
      },
    ],
  };

  const resetReportModal = () => {
    if (reportForm) {
      reportForm.reset(); // Resetea todos los campos del formulario
    }
    if (subcategoryContainer) {
      subcategoryContainer.classList.add("hidden"); // Oculta el campo de subcategoría
    }
    if (subcategorySelect) {
      subcategorySelect.innerHTML = ""; // Limpia las opciones de subcategoría
    }
  };

  const closeReportModal = () => {
    if (reportModal) {
      reportModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
      resetReportModal(); // Llama a la función para limpiar el modal
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
        opt.textContent = `${option.text} - ${option.description}`;
        subcategorySelect.appendChild(opt);
      });

      subcategoryContainer.classList.remove("hidden");
    });
  }
});
