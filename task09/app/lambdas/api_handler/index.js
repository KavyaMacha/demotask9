const axios = require('axios');

exports.handler = async (event) => {
    if (event?.path !== "/weather" || event?.httpMethod !== "GET") {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Bad Request" }),
        };
    }

    try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true');
        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch weather data" }),
        };
    }
};
