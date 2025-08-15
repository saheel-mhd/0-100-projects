async function selectInput() {
    const city = document.getElementById("city").value.trim();
    const weatherDataDiv = document.getElementById("weather-data");
    const title = document.getElementById("title");

    if (!city) {
        weatherDataDiv.innerHTML = "Please enter a city name.";
        return;
    }

    const apiKey = '85b8c781e4759847f69cf4945ae98ff9'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod === "404") {
            title.textContent = "City not found";
            weatherDataDiv.innerHTML = "";
        } else {
            title.textContent = `${data.name}, ${data.sys.country}`;
            weatherDataDiv.innerHTML = `
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].main}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            `;
        }
    } catch (err) {
        title.textContent = "Error fetching data";
        weatherDataDiv.innerHTML = "";
    }
}
