const apiKey = "28be7f8a9737bb7b95be798f37e0b7b0";
const weatherButton = document.getElementById("getWeather");
const resultDiv = document.getElementById("result");

// Obsługa kliknięcia przycisku do sprawdzenia pogody
weatherButton.addEventListener("click", () => {
    const city = document.getElementById("city").value.trim();
    if (!city) {
        resultDiv.innerHTML = "<p>Proszę wpisać nazwę miasta!</p>";
        return;
    }

    // XMLHttpRequest
    getCurrentWeather(city);

    // Fetch API
    getForecast(city);
});

// Funkcja pobierająca bieżącą pogodę z current (XMLHttpRequest)
function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    const xhr = new XMLHttpRequest();  // utworzenie obiektu XMLHttpRequest
    xhr.open("GET", url, true);  // otwarcie połączenia z serwerem
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText); // parsowanie odpowiedzi do formatu JSON
            console.log("Dane z XMLHttpRequest:", data);
            displayCurrentWeather(data);
        } else {
            resultDiv.innerHTML = "<p>Nie znaleziono miasta lub wystąpił błąd!</p>";
        }
    };
    xhr.send();  // wysłanie zapytania do serwera aby pobrać dane
}

// Funkcja pobierająca prognozę z forecast (Fetch API)
function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    fetch(url)
        .then(response => response.json()) // parsowanie odpowiedzi do formatu JSON (dla ładniejszego wyświetlenia)
        .then(data => {
            console.log("Dane z Fetch API:", data);
            displayForecast(data);
        })
        .catch(error => {
            console.error("Błąd:", error);
            resultDiv.innerHTML += "<p>Wystąpił problem z pobraniem prognozy.</p>";
        });
}

// Wyświetlanie bieżącej pogody
function displayCurrentWeather(data) {
    const { name, main, weather } = data;
    resultDiv.innerHTML = `
        <div class="weather-card">
            <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
            <div class="weather-info">
                <h3>Bieżąca pogoda w ${name}</h3>
                <p class="temperature">${main.temp}°C</p>
                <p>Odczuwalna: ${main.feels_like}°C</p>
                <p>${weather[0].description}</p>
            </div>
        </div>
    `;
}

// Wyświetlanie prognozy na 5 dni
function displayForecast(data) {
    const forecastHTML = data.list
        .filter((_, index) => index % 8 === 0) // Co 24 godziny (co 8 pozycji)
        .map(item => {
            const { dt_txt, main, weather } = item;
            return `
                <div class="weather-card">
                    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
                    <div class="weather-info">
                        <h3>${dt_txt}</h3>
                        <p class="temperature">${main.temp}°C</p>
                        <p>Odczuwalna: ${main.feels_like}°C</p>
                        <p>${weather[0].description}</p>
                    </div>
                </div>
            `;
        })
        .join("");
    resultDiv.innerHTML += `<h2>Prognoza na 5 dni:</h2>${forecastHTML}`;
}
