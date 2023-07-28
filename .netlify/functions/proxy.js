exports.handler = async function(event, context) {
  try {
    if (!fetch) {
      fetch = (await import('node-fetch')).default;
    }

    console.log('Incoming request:', event.path);

    const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '');
    let target = 'https://api.deezer.com' + path;

    const queryString = Object.keys(event.queryStringParameters)
      .map(key => key + '=' + encodeURIComponent(event.queryStringParameters[key]))
      .join('&');

    if (queryString) {
      target = target + '?' + queryString;
    }

    console.log('Proxied request:', target);

    const response = await fetch(target);
    console.log('Response:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
}
