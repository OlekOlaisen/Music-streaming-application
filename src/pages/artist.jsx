import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AudioContext } from '../components/audioContext';

const Artist = () => {
  const [artistData, setArtistData] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const { id } = useParams();
  const { playSong, currentSong, setPlaylist } = useContext(AudioContext);

  useEffect(() => {
    fetch(`/.netlify/functions/proxy/artist/${id}`)
      .then(response => response.json())
      .then(data => setArtistData(data));

    fetch(`/.netlify/functions/proxy/artist/${id}/top`)
      .then(response => response.json())
      .then(data => setTopTracks(data.data.slice(0, 5)));  

    fetch(`/.netlify/functions/proxy/artist/${id}/albums`)  
      .then(response => response.json())
      .then(data => setAlbums(data.data)); 

  }, [id]);

  useEffect(() => {
    setPlaylist(topTracks);
  }, [topTracks, setPlaylist]);

  if (!artistData || !topTracks.length || !albums.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className='artists'>
      <div className='artists__info'>
        <img className="artists__cover" src={artistData.picture} alt={artistData.name} />
        <div className='artists__text'>
          <h1 className='artists__name'>{artistData.name}</h1>
          <p className='artists__fans'>Number of fans: {artistData.nb_fan}</p>
          <p className='artists__albums'>Number of albums: {artistData.nb_album}</p>
        </div>
      </div>
      <h2>Top Tracks</h2>
      <div className='artists__top-tracks'>
        {topTracks.map((track, index) => (
          <div
            key={track.id}
            onClick={() => playSong(track, index)}
            className={`artists__track-item ${currentSong && currentSong.id === track.id ? 'playing' : ''}`}
          >
            <span className='track__number'>{index + 1}.</span>
            <img className="track__album-cover" src={track.album.cover} alt={track.title} />
            <span className={`track__album-number ${currentSong && currentSong.id === track.id ? 'playing' : ''}`}>
              {track.title}
            </span>
            <audio controls src={track.preview}></audio>
          </div>
        ))}
      </div>

      <h2>Albums</h2>
      <div className='artists__album'>
        {albums.map(album => (
          <div key={album.id} className='album__item'>
            <img className="album__cover" src={album.cover} alt={album.title} />
            <span>{album.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artist;
