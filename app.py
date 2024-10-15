from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)


API_KEY = '2baf16e7f4630f856ccb0e939dbf41ca'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_weather', methods=['POST'])
def get_weather():
    city = request.json.get('city')
    if not city:
        return jsonify({'error': 'Invalid city name'}), 400

    # Fetch weather data
    weather_url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
    weather_data = requests.get(weather_url).json()

    if weather_data.get('cod') != 200:
        return jsonify({'error': 'City not found'}), 404

    # Fetch UV index
    lat, lon = weather_data['coord']['lat'], weather_data['coord']['lon']
    uv_url = f'https://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API_KEY}'
    uv_data = requests.get(uv_url).json()

    # Prepare the response data
    response = {
        'city': weather_data['name'],
        'temperature': weather_data['main']['temp'],
        'description': weather_data['weather'][0]['description'],
        'humidity': weather_data['main']['humidity'],
        'wind_speed': weather_data['wind']['speed'],
        'pressure': weather_data['main']['pressure'],
        'visibility': weather_data.get('visibility', 0) / 1000,  # Convert to km
        'uv_index': uv_data.get('value', 'N/A'),
        'sunrise': weather_data['sys']['sunrise'],
        'sunset': weather_data['sys']['sunset']
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
