const register = async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
//const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.querySelector('input[name="role"]:checked').value;

  const payload = { username, password, role };

  try {
    const response = await fetch("http://localhost:4000/api/register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    if (!response.ok) {
      alert(`Error: ${result.message}`);
      return;
    }
    alert(result.message);
    window.location.replace("/index.html");
  } catch (error) {
    console.error("Error en la petición de registro:", error);
    alert("Ocurrió un error de red. Revisa la consola del navegador.");
  }

  // Fallback localStorage (solo desarrollo)
  const key = "uv_users";
  const users = JSON.parse(localStorage.getItem(key) || "[]");
  if (users.some((u) => u.username === username)) {
    alert("El usuario ya existe");
    return;
  }
  users.push(payload);
  localStorage.setItem(key, JSON.stringify(users));
  alert("Registrado localmente. Inicia sesión.");
  window.location.href = "index.html";
};

window.register = register;
