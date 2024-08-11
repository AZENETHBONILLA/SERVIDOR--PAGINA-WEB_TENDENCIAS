function enviarFormulario(event) {
    event.preventDefault();

    var usuario = document.getElementById("usuario").value;
    var password = document.getElementById("password").value;

    var url = "http://localhost/neon/login.php?Usuario=" + encodeURIComponent(usuario) + "&Password=" + encodeURIComponent(password);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error && data.error === "El usuario no existe") {
                alert("ERROR: Usuario Incorrecto");
            } else {
                alert("Bienvenido VENDEDOR");
                window.location.href ="prediccion.html";
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
        });
}
