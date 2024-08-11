document.getElementById('predictionForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;

    // Convertir el nombre del día en un número
    const dayMapping = {
        lunes: 0,
        martes: 1,
        miércoles: 2,
        jueves: 3,
        viernes: 4,
        sábado: 5,
        domingo: 6
    };
    const dayNumber = dayMapping[day.toLowerCase()];

    // Convertir la hora al formato de 24 horas en minutos
    const [hours, minutes] = time.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);

    // Mostrar el mensaje de carga
    document.getElementById('loadingImage').style.display = 'block';
    document.getElementById('predictionText').textContent = '';

    // Realizar la solicitud POST a la API
    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ day_of_week: dayNumber, hour: totalMinutes }),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();

        // Mostrar el resultado
        document.getElementById('predictionText').textContent = 'Productos recomendados: ' + data.productos.join(', ');
    } catch (error) {
        document.getElementById('predictionText').textContent = 'Hubo un error al realizar la predicción.';
    } finally {
        // Ocultar el mensaje de carga
        document.getElementById('loadingImage').style.display = 'none';
    }
});
