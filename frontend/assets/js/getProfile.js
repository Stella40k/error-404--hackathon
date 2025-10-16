const getProfile = async () => {
  try {
    const request = await fetch("/api/profile", {
      // RUTA ACTUALIZADA
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const response = await request.json();
    if (!request.ok) {
      alert("Error al obtener el profile");
      // Si el token no es válido, redirigir al login
      if (request.status === 401) {
        window.location.replace("/index.html");
      }
      return;
    }
    document.getElementById(
      "user-profile"
    ).innerText = `${response.user.name} ${response.user.lastname}`;
  } catch (error) {
    console.log(error);
  }
};
document.addEventListener("DOMContentLoaded", getProfile);
