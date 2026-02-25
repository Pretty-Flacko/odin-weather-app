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

async function getWeather(location, unitGroup = "metric") {
	try {
		const rawData = await fetchWeatherData(location, unitGroup);
		if (!rawData) return;

		const extractedData = extractRequiredData(rawData, unitGroup);
		console.log(extractedData);
		return extractedData;
	} catch (error) {
		console.error(error);
	}
}

getWeather("London");
