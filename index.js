const API_KEY = "eb1e7dbe5dfb30929f0b28657147e70a"
const API_URL = "https://api.openweathermap.org/data/2.5/weather"

// Mapeamento de condições climáticas para ícones personalizados
const weatherIcons = {
  Clear: "/images/clear.png",
  Clouds: "/images/cloud.png",
  Rain: "/images/rain.png",
  Drizzle: "/images/rain.png",
  Snow: "/images/snow.png",
  Thunderstorm: "/images/snow.png",
  Mist: "/images/mist.png",
  Fog: "/images/mist.png",
  Haze: "/images/mist.png",
}

const elements = {
  cityInput: document.getElementById("cityInput"),
  searchBtn: document.getElementById("searchBtn"),
  weatherResult: document.getElementById("weatherResult"),
  errorMessage: document.getElementById("errorMessage"),
  weatherIcon: document.getElementById("weatherIcon"),
  temperature: document.getElementById("temperature"),
  cityName: document.getElementById("cityName"),
  description: document.getElementById("description"),
  feelsLike: document.getElementById("feelsLike"),
  humidity: document.getElementById("humidity"),
  wind: document.getElementById("wind"),
}

// Buscar dados do clima
async function getWeather(city) {
  if (!city) {
    showError("Por favor, digite o nome de uma cidade.")
    return
  }

  try {
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`)

    if (!response.ok) {
      throw new Error(
        response.status === 404 ? "Cidade não encontrada. Tente novamente." : "Erro ao buscar dados. Tente novamente.",
      )
    }

    const data = await response.json()
    displayWeather(data)
  } catch (error) {
    showError(error.message)
    hideWeather()
  }
}

// Exibir dados do clima
function displayWeather(data) {
  const { name, main, weather, wind } = data
  const condition = weather[0].main

  // Atualizar elementos
  elements.cityName.textContent = name
  elements.temperature.textContent = `${Math.round(main.temp)}°C`
  elements.description.textContent = weather[0].description
  elements.feelsLike.textContent = `${Math.round(main.feels_like)}°C`
  elements.humidity.textContent = `${main.humidity}%`
  elements.wind.textContent = `${Math.round(wind.speed * 3.6)} km/h`

  // Ícone personalizado baseado na condição
  elements.weatherIcon.src = weatherIcons[condition] || weatherIcons.Clear
  elements.weatherIcon.alt = weather[0].description

  // Mudar background baseado na condição
  document.body.className = condition.toLowerCase()

  elements.weatherResult.classList.remove("hidden")
  hideError()
}

// Mostrar erro
function showError(message) {
  elements.errorMessage.textContent = message
  elements.errorMessage.classList.remove("hidden")
  setTimeout(hideError, 4000)
}

// Esconder mensagens
function hideError() {
  elements.errorMessage.classList.add("hidden")
}

function hideWeather() {
  elements.weatherResult.classList.add("hidden")
}

// Event Listeners
elements.searchBtn.addEventListener("click", () => {
  getWeather(elements.cityInput.value.trim())
})

elements.cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeather(elements.cityInput.value.trim())
  }
})

elements.cityInput.addEventListener("focus", hideError)
