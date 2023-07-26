const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const { API_KEY } = process.env; 
  const endpoint = `https://api.deezer.com/chart/0/${event.queryStringParameters.resource}?apikey=${API_KEY}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed fetching data' }) 
    };
  }
};
