const logOut = () => {
    localStorage.removeItem('token');
    window.location.replace('index.html')
}

document.getElementById('logout').addEventListener('click', logOut);