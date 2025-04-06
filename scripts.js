// Your OpenWeatherMap API key
const apiKey = 'bf4c08c140f0381290f466126dd14ce9';

// Function to show error message
function showError(message) {
  const elements = {
    "city-name": "City Not Found",
    "temperature": "N/A",
    "condition": message,
    "humidity": "N/A",
    "wind-speed": "N/A"
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    element.textContent = value;
    if (id === "condition") {
      element.style.color = "#e74c3c";
      element.style.fontWeight = "500";
    } else {
      element.style.color = "#95a5a6";
    }
  });
}

// Function to reset error styling
function resetErrorStyling() {
  const elements = document.querySelectorAll('.weather-info p, #city-name');
  elements.forEach(element => {
    element.style.color = "";
    element.style.fontWeight = "";
  });
}

// Function to fetch weather data from OpenWeatherMap API
function getWeather(city) {
  resetErrorStyling();
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the spelling and try again.");
        } else {
          throw new Error("Unable to fetch weather data. Please try again later.");
        }
      }
      return response.json();
    })
    .then(data => {
      // Get the data from the response
      const cityName = data.name;
      const temperature = Math.round(data.main.temp);
      const condition = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = Math.round(data.wind.speed);

      // Update the UI with dynamic data
      document.getElementById("city-name").textContent = cityName;
      document.getElementById("date").textContent = `Date: ${new Date().toLocaleDateString()}`;
      document.getElementById("temperature").textContent = `${temperature}°C`;
      document.getElementById("condition").textContent = condition.charAt(0).toUpperCase() + condition.slice(1);
      document.getElementById("humidity").textContent = `${humidity}%`;
      document.getElementById("wind-speed").textContent = `${windSpeed} km/h`;
    })
    .catch(error => {
      console.error('Error fetching the weather data:', error);
      showError(error.message);
    });
}

// Call the function to load default city weather on page load
window.onload = function() {
  getWeather('New York');  // Default city is New York, change to your preferred city
};

// Button to update weather data dynamically
document.getElementById("update-button").addEventListener("click", function() {
  const city = prompt("Enter a city name:");
  if (city) {
    getWeather(city);  // Fetch and update weather data for the entered city
  }
});