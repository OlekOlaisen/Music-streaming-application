import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AudioContext } from '../components/audioContext';
import { Link } from 'react-router-dom';

const Artist = () => {
  const [artistData, setArtistData] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const { id } = useParams();
  const {  currentSong, playSongInContext } = useContext(AudioContext);

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

 

  if (!artistData || !topTracks.length || !albums.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className='artists'>
      <div className='artists__info'>
        <img className="artists__cover" src={artistData.picture_xl} alt={artistData.name} />
        <div className='artists__text'>
          <h1 className='artists__name'>{artistData.name}</h1>
          <p className='artists__fans'>Number of fans: {artistData.nb_fan}</p>
          <p className='artists__albums'>Number of albums: {artistData.nb_album}</p>


        </div>
      </div>
      <h2 className='artists__top-tracks-headline'>Top Tracks</h2>
      <div className='artists__top-tracks'>
        {topTracks.map((track, index) => (
        <div
          key={track.id}
          onClick={() => playSongInContext(track, index, topTracks)}
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

      <h2 className='artists__album-headline'>Albums</h2>
      <div className='artists__album'>
        {albums.map(album => (
  <div key={album.id} className='artists__album-item'>
    <Link to={`/album/${album.id}`}>
      <img className="artists__album-cover" src={album.cover} alt={album.title} />
      <p className='artists__album-title'>{album.title}</p>
    </Link>
  </div>
))}

      </div>
    </div>
  );
};

export default Artist;
