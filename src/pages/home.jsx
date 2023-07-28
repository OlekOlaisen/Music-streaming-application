import React, { useState, useEffect, useCallback } from 'react';

function Home() {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [trendingAlbums, setTrendingAlbums] = useState([]);
  const [error, setError] = useState(null);

  const fetchTrends = useCallback((endpoint, setData) => {
  fetch(`/${endpoint}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (data.error) {
      console.error('API returned an error:', data.error);
      setError(`Error occurred while fetching ${endpoint}`);
    } else {
      setData(data.data);
    }
  })
  .catch((err) => {
    console.error(err);
  });


}, []);


  useEffect(() => {
    fetchTrends('/chart/0/tracks', setTrendingTracks);
    fetchTrends('/chart/0/artists', setTrendingArtists);
    fetchTrends('/chart/0/albums', setTrendingAlbums);
  }, [fetchTrends]);

  return (
    <main className="home">
      <h1 className="home__title">Discover</h1>

      {error && <div>Error: {error}</div>}

<h2 className="home__trending-tracks-title">Trending Tracks</h2>
      <div className="home__trending-tracks">
        
        {trendingTracks.map((track) => (
          <div key={track.id}>
            
            <img src={track.album.cover} alt={track.title} />
            <h3>{track.title}</h3>
            <p>Artist: {track.artist.name}</p>
            <p>Album: {track.album.title}</p>
          </div>
        ))}
      </div>

      <h2 className="home__trending-artists-title">Trending Artists</h2>
      <div className="home__trending-artists">
        
        {trendingArtists.map((artist) => (
          <div key={artist.id}>
            
            <img className="home__trending-artists-cover" src={artist.picture} alt={artist.name} />
            <h3>{artist.name}</h3>
            <p>Albums: {artist.nb_album}</p>
            <p>Fans: {artist.nb_fan}</p>
          </div>
        ))}
      </div>

      <h2 className="home__trending-albums-title">Trending Albums</h2>
      <div className="home__trending-albums">
        
        {trendingAlbums.map((album) => (
          <div key={album.id}>
            
            <img className='home__trending-albums-cover' src={album.cover} alt={album.title} />
            <h3>{album.title}</h3>
            <p>Artist: {album.artist.name}</p>
            <p>Tracks: {album.nb_tracks}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Home;
