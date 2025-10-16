const register = async (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const lastname = document.getElementById("lastname").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const response = await fetch("/api/register", {
      // RUTA ACTUALIZADA
      method: "POST",
      body: JSON.stringify({ name, lastname, username, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (!response.ok) {
      alert(`Error: ${result.message}`);
      return;
    }
    alert(result.message);
    window.location.replace("/index.html"); // URL relativa
  } catch (error) {
    console.error("Error en la petición de registro:", error);
    alert("Ocurrió un error de red. Revisa la consola del navegador.");
  }
};
