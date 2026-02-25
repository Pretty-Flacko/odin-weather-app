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

		console.log(data);
		return data;
	} catch (error) {
		console.error("Failed to fetch weather data:", error);
	}
}

fetchWeatherData("London");
