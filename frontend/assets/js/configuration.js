document.addEventListener("DOMContentLoaded", async () => {
  // --- Referencias a los Elementos del DOM ---
  const profileContent = document.getElementById("profile-section-content");
  const accountContent = document.getElementById("account-section-content");
  const profileTab = document.getElementById("profile-tab");
  const accountTab = document.getElementById("account-tab");

  // (Referencias para la edición de perfil)
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const profileDisplaySection = document.getElementById(
    "profile-display-section"
  );
  const profileEditSection = document.getElementById("profile-edit-section");

  let currentUser = {};

  // --- Lógica para cambiar de Pestaña ---
  function setActiveTab(tabToShow) {
    const isProfile = tabToShow === profileTab;
    profileContent.classList.toggle("hidden", !isProfile);
    accountContent.classList.toggle("hidden", isProfile);
    tabToShow.classList.add("bg-white", "text-gray-800");
    tabToShow.classList.remove("text-gray-500");
    const tabToHide = isProfile ? accountTab : profileTab;
    tabToHide.classList.remove("bg-white", "text-gray-800");
    tabToHide.classList.add("text-gray-500");
  }

  // --- Carga y muestra de datos ---
  async function initializePage() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/index.html");
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Token inválido");
      const data = await response.json();
      currentUser = data.user;

      // ===== INICIO DE LA CORRECCIÓN =====
      // Poblar datos en la sección "Perfil"
      document.getElementById("profile-name").textContent =
        currentUser.name || "No especificado";
      document.getElementById("profile-lastname").textContent =
        currentUser.lastname || "No especificado";
      document.getElementById("profile-username").textContent =
        currentUser.username ? `@${currentUser.username}` : "No especificado";
      document.getElementById("profile-bio").textContent =
        currentUser.bio || "Añade una biografía para presentarte.";

      // Poblar datos en la sección "Cuenta"
      document.getElementById("account-email").textContent =
        currentUser.email || "No disponible";
      // ===== FIN DE LA CORRECCIÓN =====

      // Activar la pestaña de "Perfil" por defecto
      setActiveTab(profileTab);
    } catch (error) {
      console.error("Error al cargar la página:", error);
      localStorage.removeItem("token");
      window.location.replace("/index.html");
    }
  }

  // --- Event Listeners para Pestañas ---
  profileTab.addEventListener("click", () => setActiveTab(profileTab));
  accountTab.addEventListener("click", () => setActiveTab(accountTab));

  // --- Event Listener para el botón de Editar Perfil ---
  // (Asegurarse que esté aquí)
  editProfileBtn.addEventListener("click", () => {
    // Lógica para mostrar el formulario de edición
    profileDisplaySection.classList.add("hidden");
    profileEditSection.classList.remove("hidden");

    // Poblar el formulario con datos actuales
    document.getElementById("edit-name").value = currentUser.name || "";
    document.getElementById("edit-lastname").value = currentUser.lastname || "";
    document.getElementById("edit-username").value = currentUser.username || "";
    document.getElementById("edit-bio").value = currentUser.bio || "";
  });

  initializePage();
});
