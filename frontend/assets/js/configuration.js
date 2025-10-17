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

  // --- Referencias para la carga del avatar ---
  // NOTA: 'selectAvatarBtn' ya no se usa para enviar, solo como disparador si fuera necesario.
  const avatarFileInput = document.getElementById('avatar-file-input');
  const avatarFileName = document.getElementById('avatar-file-name');
  const currentAvatarDiv = document.getElementById('current-avatar'); // Avatar en vista DISPLAY
  const avatarIcon = document.getElementById('avatar-icon'); // Icono de placeholder

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

  // --- Función Helper para Actualizar Avatar Visual ---
  function updateAvatarDisplay(url) {
    if (currentAvatarDiv) {
      if (url) {
        // Muestra la imagen usando la URL del Backend (ej: /assets/uploads/avatars/...)
        currentAvatarDiv.style.backgroundImage = `url(${url})`;
        currentAvatarDiv.style.backgroundSize = 'cover';
        currentAvatarDiv.style.backgroundPosition = 'center';
        currentAvatarDiv.classList.remove('bg-gray-200', 'flex', 'items-center', 'justify-center');
        if (avatarIcon) avatarIcon.style.display = 'none';
      } else {
        // Muestra el placeholder por defecto
        currentAvatarDiv.style.backgroundImage = 'none';
        currentAvatarDiv.style.backgroundSize = '';
        currentAvatarDiv.style.backgroundPosition = '';
        currentAvatarDiv.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center');
        if (avatarIcon) avatarIcon.style.display = 'block';
      }
    }
    
    // Lógica para actualizar el avatar en la vista de edición también, si existe
    const currentAvatarEditDiv = document.getElementById('current-avatar-edit');
    if (currentAvatarEditDiv) {
        if (url) {
            const style = `border: 2px solid var(--color-accent); background-image: url(${url}); background-size: cover; background-position: center;`;
            currentAvatarEditDiv.setAttribute('style', style);
        } else {
            currentAvatarEditDiv.setAttribute('style', `border: 2px solid var(--color-accent); background-image: none;`);
        }
    }
  }


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

      // LLAMADA CLAVE: Actualizar el avatar al cargar la página
      updateAvatarDisplay(currentUser.avatarUrl);

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

  // --- LÓGICA CORREGIDA: EDITAR PERFIL MUESTRA EL FORMULARIO DE EDICIÓN COMPLETO ---
  editProfileBtn.addEventListener("click", () => {
    // 1. Cargar los valores actuales del usuario
    document.getElementById("edit-username").value = currentUser.username || "";
    document.getElementById("edit-bio").value = currentUser.bio || "";
    
    // 2. Asegurar que la vista de edición tenga el avatar actual
    // Nota: El DOM debe tener el elemento con id="current-avatar-edit" para que funcione
    const editAvatarContainer = document.getElementById("current-avatar-edit");
    if (editAvatarContainer) {
        updateAvatarDisplay(currentUser.avatarUrl); // Reusa la función para la vista de edición
    }
    
    // 3. Mostrar la sección de edición (con foto y texto)
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

  // --- Lógica de Subida de Avatar y Edición de Perfil (Unificada en el Submit) ---
  
  if (profileEditSection) {
    // Mostrar nombre del archivo seleccionado y previsualizar en el círculo
    if (avatarFileInput) {
      avatarFileInput.addEventListener('change', () => {
        if (avatarFileName) {
          avatarFileName.textContent = avatarFileInput.files?.[0]?.name || '';
        }
        // Previsualización rápida
        const currentAvatarEditDiv = document.getElementById('current-avatar-edit');
        if (currentAvatarEditDiv && avatarFileInput.files && avatarFileInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            currentAvatarEditDiv.style.backgroundImage = `url(${e.target.result})`;
            currentAvatarEditDiv.style.backgroundSize = 'cover';
            currentAvatarEditDiv.style.backgroundPosition = 'center';
            const icon = document.getElementById('avatar-icon-edit');
            if (icon) icon.style.display = 'none';
          };
          reader.readAsDataURL(avatarFileInput.files[0]);
        }
      });
    }

    profileEditSection.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      
      // Crear FormData para manejar archivos y texto
      const formData = new FormData();
      formData.append('username', document.getElementById("edit-username").value);
      formData.append('bio', document.getElementById("edit-bio").value);
      
      // Adjuntar el archivo si fue seleccionado
      if (avatarFileInput && avatarFileInput.files.length > 0) {
          // 'avatar' debe coincidir con uploadMiddleware.single("avatar")
          formData.append('avatar', avatarFileInput.files[0]); 
      }

      try {
          // Usamos la ruta /api/profile/avatar porque es la única que acepta MULTIPART/FORM-DATA
          const response = await fetch("/api/profile/avatar", { 
              method: "PATCH",
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              body: formData,
          });

          const result = await response.json();
          
          if (!response.ok) {
              throw new Error(result.message || "Error al actualizar el perfil.");
          }

          alert("¡Perfil actualizado exitosamente!");
          
          // Resetear el input file para evitar reenvío y recargar los datos
          if (avatarFileInput) avatarFileInput.value = ''; 
          
          await initializePage(); 
          showView(profileDisplaySection, profileEditSection);
          
      } catch (error) {
          alert(`Error al guardar: ${error.message}`);
      }
    });
  }

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