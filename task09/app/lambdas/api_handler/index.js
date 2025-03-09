const AWS = require('aws-sdk');
const weatherSDK = require('/opt/weather-sdk'); // Import from Lambda Layer

exports.handler = async (event) => {
    const path = event.rawPath; // Get request path
    const method = event.requestContext.http.method; // Get HTTP method

    if (path === "/weather" && method === "GET") {
        // Fetch weather data using the SDK
        const weatherData = await weatherSDK.getWeather(); // Assuming SDK has `getWeather` function

        return {
            statusCode: 200,
            body: JSON.stringify(weatherData),
            headers: {
                "content-type": "application/json"
            },
            isBase64Encoded: false
        };
    } else {
        // Return a 400 response for unsupported paths
        return {
            statusCode: 400,
            body: JSON.stringify({
                statusCode: 400,
                message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`
            }),
            headers: {
                "content-type": "application/json"
            },
            isBase64Encoded: false
        };
    }
};
