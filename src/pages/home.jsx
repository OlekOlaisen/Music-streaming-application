import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AudioContext } from '../components/audioContext';
import { Link } from 'react-router-dom';

function Home() {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [trendingAlbums, setTrendingAlbums] = useState([]);
  const { playSong, setPlaylist } = useContext(AudioContext);
  const { currentSong } = useContext(AudioContext);
  const [error, setError] = useState(null);

  const fetchTrends = useCallback((endpoint, setData) => {
    fetch(`/.netlify/functions/proxy/${endpoint}`)
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
    fetchTrends('chart/0/tracks', setTrendingTracks);
    fetchTrends('chart/0/artists', setTrendingArtists);
    fetchTrends('chart/0/albums', setTrendingAlbums);
  }, [fetchTrends]);

  const findTrackById = useCallback((id) => {
    return trendingTracks.findIndex((track) => track.id === id);
  }, [trendingTracks]);

  const handleTrackClick = useCallback(
    (track) => {
      const trackIndex = findTrackById(track.id);
      playSong(track.preview, trackIndex);
      setPlaylist(trendingTracks);
    },
    [playSong, setPlaylist, findTrackById, trendingTracks]
  );

  return (
    <main className="home">
      

      {error && <div>Error: {error}</div>}

      <h2 className="home__trending-artists-title">Top 10 Artists</h2>
      <div className="home__trending-artists">
        {trendingArtists.map((artist) => (
          <div key={artist.id}>
            <Link to={`/artist/${artist.id}`} className='Link'>
              <div className='home__trending-artist-item'>
                <img
                  className="home__trending-artists-cover"
                  src={artist.picture_xl}
                  alt={artist.name}
                />
                <p className='artist__name'>{artist.name}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <h2 className="home__trending-tracks-title">Top 10 tracks</h2>
      <div className="home__trending-tracks">
        {trendingTracks.map((track) => (
          <div key={track.id}>
            <div
              className='home__trending-tracks-item'
              onClick={() => handleTrackClick(track)}
            >
              <img
                className='home__trending-tracks-cover'
                src={track.album.cover_xl}
                alt={track.title}
              />
              <h3
                className={`track__title ${
                  currentSong && currentSong.id === track.id ? 'playing' : ''
                }`}
              >
                {track.title}
              </h3>
              <Link
                to={`/artist/${track.artist.id}`}
                className='artist__name'
                onClick={(event) => event.stopPropagation()}
              >
                {' '}
                {track.artist.name}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h2 className="home__trending-albums-title">Top 10 Albums</h2>
      <div className="home__trending-albums">
        {trendingAlbums.map((album) => (
          <div key={album.id}>
            <Link to={`/album/${album.id}`} className='Link'>
              <div className='home__trending-albums-item'>
                <img
                  className='home__trending-albums-cover'
                  src={album.cover_xl}
                  alt={album.title}
                />
                <h3 className='album__title'>{album.title}</h3>
                <Link
                  to={`/artist/${album.artist.id}`}
                  className='artist__name'
                >
                  {' '}
                  {album.artist.name}
                </Link>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Home;
