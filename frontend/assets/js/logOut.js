document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");

  // Si el botón de logout existe, le añade el evento de clic.
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      // Elimina el token del almacenamiento local.
      localStorage.removeItem("token");
      // Redirige al usuario a la página de inicio de sesión.
      window.location.replace("/index.html");
    });
  }
});
