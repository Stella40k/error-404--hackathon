const login = async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const req = await fetch("/api/login", {
      // RUTA ACTUALIZADA
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-type": "application/json" },
    });
    const res = await req.json();
    if (req.ok) {
      alert(res.message);
      localStorage.setItem("token", res.token);
      window.location.replace("/home.html"); // URL relativa
    } else {
      alert(res.message);
    }
  } catch (error) {
    console.log(error);
    alert("Ocurrio un error al iniciar sesion");
  }
};
