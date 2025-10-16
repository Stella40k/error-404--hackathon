document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");

  // Si el botón de logout existe, le añadimos el evento
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      // Borramos el token del almacenamiento local
      localStorage.removeItem("token");
      // Redirigimos a la página de inicio de sesión
      window.location.replace("/index.html");
    });
  }
});
