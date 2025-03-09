const AWS = require('aws-sdk');
const weatherSDK = require('/opt/weather-sdk'); // Import from Lambda Layer

exports.handler = async (event) => {
    try {
        console.log("Incoming request:", JSON.stringify(event, null, 2)); // Log the event

        const path = event.rawPath || "/";
        const method = event.requestContext?.http?.method || "UNKNOWN";

        if (path === "/weather" && method === "GET") {
            // Fetch weather data using the SDK
            const weatherData = await weatherSDK.getWeather();
            console.log("Weather data response:", JSON.stringify(weatherData, null, 2)); // Log response

            // Ensure response contains the 'hourly' data
            if (!weatherData || !weatherData.hourly) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        statusCode: 500,
                        message: "Error fetching weather data: Missing 'hourly' object."
                    }),
                    headers: { "Content-Type": "application/json" },
                    isBase64Encoded: false
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify(weatherData),
                headers: { "Content-Type": "application/json" },
                isBase64Encoded: false
            };
        } else {
            // Handle incorrect paths
            return {
                statusCode: 400,
                body: JSON.stringify({
                    statusCode: 400,
                    message: `Bad request syntax or unsupported method. Request path: '${path}'. HTTP method: '${method}'`
                }),
                headers: { "Content-Type": "application/json" },
                isBase64Encoded: false
            };
        }
    } catch (error) {
        console.error("Lambda execution error:", error); // Log error details

        return {
            statusCode: 500,
            body: JSON.stringify({
                statusCode: 500,
                message: "Internal Server Error",
                error: error.message
            }),
            headers: { "Content-Type": "application/json" },
            isBase64Encoded: false
        };
    }
};
