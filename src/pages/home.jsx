import React, { useState, useEffect, useCallback } from 'react';

function Home() {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [trendingAlbums, setTrendingAlbums] = useState([]);
  const [error, setError] = useState(null);
  
  const fetchTrends = useCallback((endpoint, setData) => {
    fetch(endpoint)
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
    fetchTrends('/api/chart/0/tracks', setTrendingTracks);
    fetchTrends('/api/chart/0/artists', setTrendingArtists);
    fetchTrends('/api/chart/0/albums', setTrendingAlbums);
  }, [fetchTrends]);
  
  
  return (
    <main className="home">
    <h1 className="home__title">Discover</h1>
    
    {error && <div>Error: {error}</div>}
    
    <h2 className="home__trending-tracks-title">Top 10 tracks</h2>
    <div className="home__trending-tracks">
    
    {trendingTracks.map((track) => (
      <div key={track.id}>
      <div className='home__trending-tracks-item'>
      <img className='home__trending-tracks-cover' src={track.album.cover} alt={track.title} />
      <h3 className='track__title'>{track.title}</h3>
      <p className='artist__name'> {track.artist.name}</p>
      </div>
      </div>
      ))}
      </div>
      
      <h2 className="home__trending-artists-title">Top 10 Artists</h2>
      <div className="home__trending-artists">
      
      {trendingArtists.map((artist) => (
        <div key={artist.id}> 
        <div className='home__trending-artist-item'>
        <img className="home__trending-artists-cover" src={artist.picture} alt={artist.name} />
        <h3 className='artist__name'>{artist.name}</h3>       
        </div>
        </div>
        ))}
        </div>
        
        <h2 className="home__trending-albums-title">Top 10 Albums</h2>
        <div className="home__trending-albums">
        
        {trendingAlbums.map((album) => (
          <div key={album.id}>
          <div className='home__trending-albums-item'>
          <img className='home__trending-albums-cover' src={album.cover} alt={album.title} />
          <h3 className='album__title'>{album.title}</h3>
          <p className='artist__name'> {album.artist.name}</p>
          </div>
          </div>
          ))}
          </div>
          </main>
          );
        }
        
        export default Home;
        