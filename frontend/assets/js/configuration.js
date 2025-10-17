document.addEventListener("DOMContentLoaded", async () => {
  // --- Referencias a los Elementos del DOM ---
  const profileContent = document.getElementById("profile-section-content");
  const accountContent = document.getElementById("account-section-content");
  const profileTab = document.getElementById("profile-tab");
  const accountTab = document.getElementById("account-tab");
  const deleteAccountBtn = document.getElementById("delete-account-btn");
  const profileDisplaySection = document.getElementById(
    "profile-display-section"
  );
  const profileEditSection = document.getElementById("profile-edit-section");
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const cancelEditBtnFooter = document.getElementById("cancel-edit-btn-footer");

  const accountDisplaySection = document.getElementById(
    "account-display-section"
  );
  const accountEditSection = document.getElementById("account-edit-section");
  const editAccountBtn = document.getElementById("edit-account-btn");
  const cancelAccountEditBtn = document.getElementById(
    "cancel-account-edit-btn"
  );
  const cancelAccountEditBtnFooter = document.getElementById(
    "cancel-account-edit-btn-footer"
  );

  let currentUser = {};

  // --- Lógica de Pestañas ---
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

  const showView = (viewToShow, viewToHide) => {
    viewToShow.classList.remove("hidden");
    viewToHide.classList.add("hidden");
  };

  // --- Carga Inicial de Datos ---
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

      document.getElementById("profile-username").textContent =
        currentUser.username ? `@${currentUser.username}` : "N/A";
      document.getElementById("profile-bio").textContent =
        currentUser.bio || "Añade una biografía.";
      document.getElementById("account-email").textContent =
        currentUser.email || "N/A";

      setActiveTab(profileTab);
    } catch (error) {
      console.error("Error al cargar la página:", error);
      localStorage.removeItem("token");
      window.location.replace("/index.html");
    }
  }

  // --- Event Listeners ---
  profileTab.addEventListener("click", () => setActiveTab(profileTab));
  accountTab.addEventListener("click", () => setActiveTab(accountTab));

  editProfileBtn.addEventListener("click", () => {
    document.getElementById("edit-username").value = currentUser.username || "";
    document.getElementById("edit-bio").value = currentUser.bio || "";
    showView(profileEditSection, profileDisplaySection);
  });
  cancelEditBtn.addEventListener("click", () =>
    showView(profileDisplaySection, profileEditSection)
  );
  cancelEditBtnFooter.addEventListener("click", () =>
    showView(profileDisplaySection, profileEditSection)
  );

  editAccountBtn.addEventListener("click", () => {
    document.getElementById("edit-email").value = currentUser.email || "";
    showView(accountEditSection, accountDisplaySection);
  });
  cancelAccountEditBtn.addEventListener("click", () =>
    showView(accountDisplaySection, accountEditSection)
  );
  cancelAccountEditBtnFooter.addEventListener("click", () =>
    showView(accountDisplaySection, accountEditSection)
  );

  profileEditSection.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updatedData = {
      username: document.getElementById("edit-username").value,
      bio: document.getElementById("edit-bio").value,
    };
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      alert("¡Perfil actualizado exitosamente!");
      currentUser = result.user; // Actualiza los datos locales con la respuesta del servidor
      await initializePage(); // Recarga y muestra todos los datos actualizados
      showView(profileDisplaySection, profileEditSection); // Vuelve a la vista de información
    } catch (error) {
      alert(`Error al guardar: ${error.message}`);
    }
  });

  accountEditSection.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      currentPassword: document.getElementById("edit-current-password").value,
      newPassword: document.getElementById("edit-new-password").value,
      confirmPassword: document.getElementById("edit-confirm-password").value,
      email: document.getElementById("edit-email").value,
    };
    if (!body.currentPassword) {
      alert("Por favor, ingresa tu contraseña actual.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/account/credentials", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      alert(result.message);
      currentUser.email = body.email;
      document.getElementById("account-email").textContent = body.email;
      showView(accountDisplaySection, accountEditSection);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  deleteAccountBtn.addEventListener("click", async () => {
    const confirmation = prompt(
      "Esta acción es irreversible. Para confirmar, por favor, ingresa tu contraseña:"
    );

    if (confirmation === null) {
      // El usuario canceló la operación
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: confirmation }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      alert(result.message);
      // Limpiar sesión y redirigir al login
      localStorage.removeItem("token");
      window.location.replace("/index.html");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  initializePage();
});
