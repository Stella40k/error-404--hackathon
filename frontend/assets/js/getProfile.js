document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("/index.html");
    return;
  }

  // --- Elementos del DOM ---
  const userProfileButton = document.getElementById("user-profile-button");
  const profileDropdown = document.getElementById("profile-dropdown");

  // --- Lógica para el menú desplegable ---
  if (userProfileButton && profileDropdown) {
    userProfileButton.addEventListener("click", (event) => {
      event.stopPropagation();
      profileDropdown.classList.toggle("hidden");
    });
  }

  window.addEventListener("click", (event) => {
    if (
      profileDropdown &&
      !profileDropdown.classList.contains("hidden") &&
      !userProfileButton.contains(event.target)
    ) {
      profileDropdown.classList.add("hidden");
    }
  });

  // --- Obtener y poblar los datos del usuario ---
  try {
    const request = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!request.ok) {
      localStorage.removeItem("token");
      window.location.replace("/index.html");
      return;
    }

    const response = await request.json();
    const dropdownUsername = document.getElementById("dropdown-username");
    const dropdownEmail = document.getElementById("dropdown-email");
    const sidebarUsername = document.getElementById(
      "sidebar-user-profile-name"
    );
    const headerAvatar = document.getElementById("header-avatar");
    const sidebarAvatar = document.getElementById("sidebar-avatar");

    if (response.user) {
      if (dropdownUsername) dropdownUsername.innerText = response.user.username;
      if (dropdownEmail) dropdownEmail.innerText = response.user.email;
      if (sidebarUsername) sidebarUsername.innerText = response.user.username;

      // Pintar avatar en header y sidebar si existe avatarUrl
      if (response.user.avatarUrl) {
        const url = response.user.avatarUrl;
        if (headerAvatar) {
          headerAvatar.style.backgroundImage = `url(${url})`;
          headerAvatar.style.backgroundSize = 'cover';
          headerAvatar.style.backgroundPosition = 'center';
          headerAvatar.innerHTML = '';
        }
        if (sidebarAvatar) {
          sidebarAvatar.style.backgroundImage = `url(${url})`;
          sidebarAvatar.style.backgroundSize = 'cover';
          sidebarAvatar.style.backgroundPosition = 'center';
          sidebarAvatar.innerHTML = '';
        }
      }
    }
  } catch (error) {
    console.error("Error al obtener el perfil:", error.message);
  }
});
