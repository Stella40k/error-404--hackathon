// frontend/assets/js/register.js

const register = async (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

  // Recolectar los datos del formulario
  const name = document.getElementById("name").value;
  const lastname = document.getElementById("lastname").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:4000/api/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        lastname,
        username,
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json", // Es estándar usar 'Content-Type'
      },
    });

    const result = await response.json();

    // Si la respuesta del servidor no fue exitosa (ej: status 400, 500)
    if (!response.ok) {
      // Muestra el mensaje de error que enviamos desde el backend (ej: "El email ya existe")
      alert(`Error: ${result.message}`);
      return;
    }

    // Si la respuesta fue exitosa (status 201)
    alert(result.message);
    window.location.replace("index.html"); // Redirige al login
  } catch (error) {
    // Este bloque se ejecuta si hay un problema de red (servidor caído) o un error de CORS.
    console.error("Error en la petición de registro:", error);
    alert(
      "Ocurrió un error de red. Revisa la consola del navegador para más detalles y asegúrate de que el servidor esté corriendo."
    );
  }
};
