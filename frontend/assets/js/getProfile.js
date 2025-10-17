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

    if (response.user) {
      // Poblar el menú desplegable
      if (dropdownUsername && dropdownEmail) {
        dropdownUsername.innerText = response.user.username;
        dropdownEmail.innerText = response.user.email;
      }
      // Poblar la barra lateral
      if (sidebarUsername) {
        sidebarUsername.innerText = response.user.username;
      }
    }
  } catch (error) {
    console.error("Error al obtener el perfil:", error.message);
  }
});
