from flask import Flask, request, jsonify, render_template
import numpy as np
import joblib
from tensorflow.keras.models import load_model
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Cargar el modelo y el codificador
model = load_model('modelo_recomendacion.h5')
mlb = joblib.load('mlb.pkl')

def predict_food(day_of_week, hour):
    print(f"Recibido para predicción: día {day_of_week}, hora {hour}")  # Verificar entradas
    entrada = np.array([[day_of_week, hour]])
    prediccion = model.predict(entrada)
    print(f"Predicción bruta: {prediccion}")  # Verificar salida del modelo
    productos_relevantes = mlb.inverse_transform(prediccion > 0.5)
    print(f"Productos predichos: {productos_relevantes}")  # Verificar productos predichos
    return productos_relevantes[0]

@app.route('/')
def index():
    return render_template('prediccion.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if data is None:
            return "Content-Type was not 'application/json'", 415
        
        # Obtener los datos del JSON
        day_of_week = data.get('day_of_week')  # Cambiado de 'day' a 'day_of_week'
        hour = data.get('hour')

        # Validación de los datos recibidos
        if day_of_week is None or hour is None:
            return "Missing 'day_of_week' or 'hour' in request data", 400

        # Convertir a números si es necesario (por ejemplo, en caso de que se envíen como cadenas)
        day_of_week = int(day_of_week)
        hour = int(hour)

        # Realizar la predicción con los datos recibidos
        productos = predict_food(day_of_week, hour)
        return jsonify({'productos': productos})
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True)
