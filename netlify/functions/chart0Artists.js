import fetch from 'node-fetch';

export async function handler() {
  const response = await fetch('https://api.deezer.com/chart/0/artists');
  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
