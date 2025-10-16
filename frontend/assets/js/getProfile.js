document.addEventListener("DOMContentLoaded", async () => {
  // Si no hay token, no hacemos nada.
  if (!localStorage.getItem("token")) {
    return;
  }

  try {
    const request = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!request.ok) {
      // Si el token es inválido o expiró, redirigimos al login
      if (request.status === 401) {
        localStorage.removeItem("token");
        window.location.replace("/index.html");
      }
      throw new Error("Error al obtener el perfil");
    }

    const response = await request.json();
    const userNameElement = document.getElementById("user-profile-name");

    if (userNameElement && response.user) {
      // Mostramos el nombre y apellido del usuario
      userNameElement.innerText = `${response.user.name} ${response.user.lastname}`;
    }
  } catch (error) {
    console.error(error.message);
  }
});
