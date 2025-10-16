const getProfile = async () => {
    try {
      const request = await fetch("http://localhost:4000/api/profile", {
        headers: {
          //si tenemos el token en el LocalStorage lo incluimos en la peticion
          /* token: localStorage.getItem("token") */
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await request.json();

      if(!request.ok) {
        alert('Error al obtener el profile')
      }
      document.getElementById('user-profile').innerText = `${response.user.name} ${response.user.lastname}`

    } catch (error) {
      console.log(error);
    }
  };


  document.addEventListener('DOMContentLoaded', getProfile)