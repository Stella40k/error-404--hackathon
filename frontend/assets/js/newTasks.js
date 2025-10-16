const createTask = async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const is_completed = document.getElementById('is_completed').value;

    try {
      const request = await fetch("http://localhost:4000/api/tasks", {
        method: "POST",
        body: JSON.stringify({title, description, is_completed}),
        headers: {
          "Content-type": "application/json",
          //si tenemos el token en el LocalStorage lo incluimos en la peticion
          /* token: localStorage.getItem("token"), */
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await request.json();

      if (request.ok) {
        alert("Tarea creada exitosamente");
        window.location.replace("home.html");
      } else {
        alert(response.msg);
      }
    } catch (error) {
      alert("Error al crear la tarea");
      console.log(error);
    }
  };