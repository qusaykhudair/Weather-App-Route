var searchInput = document.getElementById("searchInput");
var forecastContainer = document.getElementById("forecastContainer");

var daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

async function fetchWeatherData(location) {
  try {
    var response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=7d77b96c972b4d119a3151101212704&q=${location}&days=3`
    );

    if (response.ok) {
      var data = await response.json();
      renderTodayWeather(data.location, data.current);
      renderForecast(data.forecast.forecastday);
    } else {
      forecastContainer.innerHTML = `<p class="text-danger">City not found. Please try again.</p>`;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    forecastContainer.innerHTML = `<p class="text-danger">An error occurred. Please try again later.</p>`;
  }
}

function renderTodayWeather(locationData, currentData) {
  if (!currentData) return;

  var lastUpdated = new Date(currentData.last_updated.replace(" ", "T"));
  var todayHtml = `
        <div class="today forecast card p-3 mb-3 shadow">
            <div class="forecast-header d-flex justify-content-between">
                <div class="day">${daysOfWeek[lastUpdated.getDay()]}</div>
                <div class="date">${lastUpdated.getDate()} ${
    monthNames[lastUpdated.getMonth()]
  }</div>
            </div>
            <div class="forecast-content text-center">
                <h3 class="location mb-3">${locationData.name}</h3>
                <div class="degree d-flex justify-content-center align-items-center mb-3">
                    <div class="num display-4">${
                      currentData.temp_c
                    }<sup>°C</sup></div>
                    <img src="https:${
                      currentData.condition.icon
                    }" alt="Weather Icon" width="90" class="ms-3">
                </div>
                <div class="custom mb-2">${currentData.condition.text}</div>
                <div class="d-flex justify-content-center gap-3">
                    <span><img src="images/imgi_3_icon-umberella.png" alt=""> 20%</span>
                    <span><img src="images/imgi_4_icon-wind.png" alt=""> 18km/h</span>
                    <span><img src="images/imgi_5_icon-compass.png" alt=""> East</span>
                </div>
            </div>
        </div>
    `;

  forecastContainer.innerHTML = todayHtml;
}

function renderForecast(forecastDays) {
  let forecastHtml = "";

  for (let i = 1; i < forecastDays.length; i++) {
    var forecastDate = new Date(forecastDays[i].date.replace(" ", "T"));
    forecastHtml += `
            <div class="forecast card text-center p-3 mb-3 shadow">
                <div class="forecast-header">
                    <div class="day">${daysOfWeek[forecastDate.getDay()]}</div>
                </div>
                <div class="forecast-content">
                    <img src="https:${
                      forecastDays[i].day.condition.icon
                    }" alt="Weather Icon" width="48" class="mb-2">
                    <div class="degree">${
                      forecastDays[i].day.maxtemp_c
                    }<sup>°C</sup></div>
                    <small class="text-muted">${
                      forecastDays[i].day.mintemp_c
                    }<sup>°C</sup></small>
                    <div class="custom mt-2">${
                      forecastDays[i].day.condition.text
                    }</div>
                </div>
            </div>
        `;
  }

  forecastContainer.innerHTML += forecastHtml;
}

document.getElementById("searchBtn").addEventListener("click", () => {
  var location = searchInput.value.trim();
  if (location) {
    fetchWeatherData(location);
  }
});

fetchWeatherData("Cairo");
