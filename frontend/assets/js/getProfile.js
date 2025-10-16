document.addEventListener("DOMContentLoaded", async () => {
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
      if (request.status === 401) {
        localStorage.removeItem("token");
        window.location.replace("/index.html");
      }
      throw new Error("Error al obtener el perfil");
    }

    const response = await request.json();
    const userNameElement = document.getElementById("user-profile-name");

    if (userNameElement && response.user) {
      userNameElement.innerText = response.user.username;
    }
  } catch (error) {
    console.error(error.message);
  }
});
