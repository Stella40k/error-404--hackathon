
const register = async (event) => {
    event.preventDefault()

    const name = document.getElementById('name').value
    const lastname = document.getElementById('lastname').value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value


    const req = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        body: JSON.stringify({
            name, lastname, username, email, password
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    const res = await req.json();
    
    if(req.ok) {
        alert(res.message);
        window.location.replace('index.html');
    } else {
        alert(res.message)
    }
};