document.getElementById('fetchWeatherBtn').addEventListener('click', function () {
  const cityInput = document.getElementById('cityInput').value;

  fetch('/get_weather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city: cityInput }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        console.error(data.error);
        return; // Handle error appropriately in the UI
      }

      // Update the DOM elements with weather data
      document.getElementById('cityName').innerText = data.city;
      document.getElementById('temperature').innerText = ` ${data.temperature} °C`;
      document.getElementById('description').innerText = ` ${data.description}`;
      document.getElementById('humidity').innerText = `${data.humidity}%`;
      document.getElementById('windSpeed').innerText = `${data.wind_speed} m/s`;
      document.getElementById('pressure').innerText = `${data.pressure} hPa`;
      document.getElementById('visibility').innerText = `${data.visibility} km`;
      document.getElementById('uvIndex').innerText = `${data.uv_index}`;
      document.getElementById('sunrise').innerText = `${new Date(data.sunrise * 1000).toLocaleTimeString()}`;
      document.getElementById('sunset').innerText = `${new Date(data.sunset * 1000).toLocaleTimeString()}`;

      // Show the weather result section
      document.getElementById('weatherResult').classList.remove('hidden');
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      document.getElementById('errorMessage').innerText = error.message;
      document.getElementById('errorMessage').classList.remove('hidden');
    });
});

// Download report button event listener
document.getElementById('downloadReportBtn').addEventListener('click', function () {
  const cityInput = document.getElementById('cityInput').value;

  fetch('/get_weather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city: cityInput }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Convert the weather data to CSV format
      const csvContent = `data:text/csv;charset=utf-8,City Name,Temperature,Description,Humidity,Wind Speed,Pressure,Visibility,UV Index,Sunrise,Sunset\n`
          + `${data.city},${data.temperature},${data.description},${data.humidity},${data.wind_speed},${data.pressure},${data.visibility},${data.uv_index},${new Date(data.sunrise * 1000).toLocaleTimeString()},${new Date(data.sunset * 1000).toLocaleTimeString()}`;
      
      // Create a link element and trigger download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${data.city}_WeatherReportNow.csv`); // Updated filename format
      document.body.appendChild(link); // Required for FF

      link.click(); // This will download the file
      document.body.removeChild(link); // Clean up
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
});
