import "./style.css";

async function fetchWeatherData(location) {
	const apiKey = "PAASE59UM8JGVJWS2Y9JSEUVT";
	const unitGroup = "metric";
	const contentType = "json";
	const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=${unitGroup}&contentType=${contentType}&key=${apiKey}`;

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

function extractRequiredData(data) {
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
	};
}

async function getWeather(location) {
	try {
		const rawData = await fetchWeatherData(location);
		if (!rawData) return;

		const extractedData = extractRequiredData(rawData);
		console.log(extractedData);
		return extractedData;
	} catch (error) {
		console.error(error);
	}
}

getWeather("London");
