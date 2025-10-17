document.addEventListener("DOMContentLoaded", () => {
  // Itera sobre las 4 tarjetas de categorías
  for (let i = 1; i <= 4; i++) {
    const toggleButton = document.getElementById(`toggle-button-${i}`);
    const subcategoryPanel = document.getElementById(`subcategory-panel-${i}`);

    if (toggleButton && subcategoryPanel) {
      toggleButton.addEventListener("click", () => {
        // Comprueba si el panel está oculto
        const isHidden = subcategoryPanel.classList.contains("hidden");

        // Muestra u oculta el panel
        subcategoryPanel.classList.toggle("hidden");

        // Cambia el texto del botón y el ícono
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
});
