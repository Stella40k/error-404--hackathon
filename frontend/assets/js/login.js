const login = async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const normalizeRole = (r = "") =>
    r
      .toString()
      .toLowerCase()
      .trim()
      .replace(/í/g, "i")
      .replace(/\s+/g, "");

  try {
    const req = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-type": "application/json" },
    });

    if (req.ok) {
      const data = await req.json(); // { token?, role? }
      let role = normalizeRole(data.role);

      // Si el usuario es vecino, lo tratamos como municipio para la vista
      if (role === "vecino") role = "municipio";

      localStorage.setItem("uv_token", data.token || "");
      localStorage.setItem("uv_role", role || "");
      window.location.href = "dashboard.html";
      return;
    }
  } catch (error) {
    // backend no disponible -> fallback a localStorage
  }

  // Fallback: comprobar usuarios en localStorage (solo para desarrollo)
  const users = JSON.parse(localStorage.getItem("uv_users") || "[]");
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    alert("Usuario o contraseña incorrectos");
    return;
  }

  let role = normalizeRole(user.role);
  if (role === "vecino") role = "municipio";

  localStorage.setItem("uv_role", role);
  window.location.href = "dashboard.html";
};

window.login = login;
