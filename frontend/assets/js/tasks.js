const getTasks = async () => {
  try {
    const request = await fetch("/api/tasks", {
      // RUTA ACTUALIZADA
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const response = await request.json();
    if (!request.ok) {
      console.error("Error:", response.message);
      return;
    }
    renderTasks(response);
  } catch (error) {
    console.error("Error al obtener las tareas", error);
  }
};
// El resto del archivo tasks.js permanece igual...
const renderTasks = (tasks) => {
  let tasksContainer = "";
  tasks.forEach((task) => {
    tasksContainer += `<div
              class="bg-slate-950 border shadow p-4 m-2 rounded-lg w-[250px] flex flex-col gap-2"
            >
              <h2 class="font-bold text-white text-xl">${task.title}</h2>
              <p class="text-gray-300 text-md">Autor: ${
                task.author.username
              }</p>
              <p class="text-gray-300 text-lg">${task.description}</p>
              <p
                class="flex justify-center items-center text-sm h-8 w-25 text-slate-50 rounded-lg ${
                  task.is_completed ? "bg-green-600" : "bg-yellow-600"
                }"
              >
                ${task.is_completed ? "Completada" : "Pendiente"}
              </p>
            </div>`;
  });
  document.getElementById("tasks-container").innerHTML = tasksContainer;
};
document.addEventListener("DOMContentLoaded", getTasks);
