import "./style.css";

async function fetchWeatherData(location, unitGroup = "metric") {
	const apiKey = "PAASE59UM8JGVJWS2Y9JSEUVT";
	const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=${unitGroup}&contentType=json&key=${apiKey}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();

		return data;
	} catch (error) {
		console.error("Failed to fetch weather data:", error);
	}
}

function extractRequiredData(data, unitGroup) {
	const {
		resolvedAddress,
		currentConditions: {
			temp,
			feelslike,
			conditions,
			humidity,
			windspeed,
			icon,
			datetime,
		},
	} = data;

	return {
		address: resolvedAddress,
		temp,
		feelsLike: feelslike,
		conditions,
		humidity,
		windSpeed: windspeed,
		icon,
		time: datetime,
		unitGroup,
	};
}

async function loadWeatherIcon(iconName) {
	try {
		const module = await import(`./icons/${iconName}.svg`);
		return module.default;
	} catch (error) {
		console.error("Icon not found:", iconName);
		return null;
	}
}

async function renderWeather(data) {
	const output = document.getElementById("weather-output");

	if (!data) {
		output.textContent = "No weather data available.";
		return;
	}

	const iconSrc = await loadWeatherIcon(data.icon);

	output.innerHTML = `
		${iconSrc ? `<img src="${iconSrc}" alt"${data.conditions}">` : ""}
		<p>Location: ${data.address}</p>
		<p>Temperature: ${data.temp} ${data.unitGroup === "metric" ? "°C" : "°F"}</p>
		<p>Feels like: ${data.feelsLike} ${data.unitGroup === "metric" ? "°C" : "°F"}</p>
		<p>Conditions: ${data.conditions}</p>
		<p>Humidity: ${data.humidity}%</p>
		<p>Wind speed: ${data.windSpeed}</p>
		<p>Time: ${data.time}</p>
	`;
}

const loadingElement = document.getElementById("loading");

function showLoading() {
	loadingElement.classList.remove("hidden");
	document.getElementById("weather-output").innerHTML = "";
}

function hideLoading() {
	loadingElement.classList.add("hidden");
}

async function getWeather(location, unitGroup = "metric") {
	try {
		showLoading();

		const rawData = await fetchWeatherData(location, unitGroup);
		if (!rawData) return;

		const extractedData = extractRequiredData(rawData, unitGroup);
		await renderWeather(extractedData);
	} catch (error) {
		console.error(error);
	} finally {
		hideLoading();
	}
}

const form = document.getElementById("weather-form");
const locationInput = document.getElementById("location-input");
const toggleButtons = document.querySelectorAll("#unit-toggle button");
let currentUnit = "metric";
let currentLocation = undefined;

toggleButtons.forEach((button) => {
	button.addEventListener("click", async () => {
		const selectedUnit = button.dataset.unit;
		if (selectedUnit === currentUnit) return;

		currentUnit = selectedUnit;

		toggleButtons.forEach((btn) => btn.classList.remove("active"));
		button.classList.add("active");
	});
});

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	currentLocation = locationInput.value.trim();
	if (!currentLocation) return;

	await getWeather(currentLocation, currentUnit);
});
