const axios = require("axios");

exports.handler = async (event) => {
    try {
        // Open-Meteo API Endpoint
        const lat = 37.7749; // Example: San Francisco latitude
        const lon = -122.4194; // Example: San Francisco longitude
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`;

        // Fetch Weather Data
        const response = await axios.get(url);
        const weatherData = response.data;

        // Return Weather Data
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Weather data fetched successfully",
                weather: weatherData
            }),
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch weather data" }),
        };
    }
};
