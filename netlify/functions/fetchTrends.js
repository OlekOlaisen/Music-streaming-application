import fetch from 'node-fetch';

export async function handler(event) {
  const endpoint = event.path.replace(/.netlify\/functions\/[^/]+/, '');
  const API_URL = `https://api.deezer.com${endpoint}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      // Not a 200 response! Reject the promise with a new error object.
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    const { message } = error;
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: message }),
    };
  }
}
