const AWS = require('aws-sdk');
const weatherSDK = require('/opt/weather-sdk'); // Import from Lambda Layer

exports.handler = async (event) => {
    try {
        const path = event.rawPath || "/";
        const method = event.requestContext?.http?.method || "UNKNOWN";

        if (path === "/weather" && method === "GET") {
            // Fetch weather data using the SDK
            const weatherData = await weatherSDK.getWeather();

            // Ensure response contains the 'hourly' data
            if (!weatherData || !weatherData.hourly) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        statusCode: 500,
                        message: "Error fetching weather data: Missing 'hourly' object."
                    }),
                    headers: { "content-type": "application/json" },
                    isBase64Encoded: false
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify(weatherData),
                headers: { "content-type": "application/json" },
                isBase64Encoded: false
            };
        } else {
            // Handle incorrect paths
            return {
                statusCode: 400,
                body: JSON.stringify({
                    statusCode: 400,
                    message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`
                }),
                headers: { "content-type": "application/json" },
                isBase64Encoded: false
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                statusCode: 500,
                message: "Internal Server Error",
                error: error.message
            }),
            headers: { "content-type": "application/json" },
            isBase64Encoded: false
        };
    }
};
