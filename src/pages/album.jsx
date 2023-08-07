import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AudioContext } from '../components/audioContext';
import { Ping } from '@uiball/loaders'

const Album = () => {
  const { id } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [releaseYear, setReleaseYear] = useState(null);
  const {  currentSong, playSongInContext} = useContext(AudioContext);

  useEffect(() => {
    fetch(`/.netlify/functions/proxy/album/${id}`)
      .then(response => response.json())
      .then(data => {
        setAlbumData(data);
        setSongs(data.tracks.data); 
        setReleaseYear(data.release_date.slice(0, 4));
      });

  }, [id]);

  if (!albumData || !songs.length) {
    return <Ping size={45} speed={2} color='f78278' className="spinner"/>
  }

  return (
    <div className='album'>
      <div className='album__info'>
        <div className='album__info-container'>
          <img className="album__cover" src={albumData.cover_xl} alt={albumData.title} />
          <div className='album__info-text-container'>
            <h1 className='album__name'>{albumData.title}</h1>
            <p className='album__artist'>
              <Link className='Link' to={`/artist/${albumData.artist.id}`}> 
                {albumData.artist.name} 
              </Link>  
              • {releaseYear} • {albumData.nb_tracks} songs • <span className='album__artist-record-type'>{albumData.record_type}</span>
            </p>
            <p className='album__nb_tracks'> </p>
          </div>
        </div>
      </div>
      
      <div className='album__tracks'>
        <h2 className='album__tracks-headline'>Tracks ({albumData.nb_tracks})</h2>
        {songs.map((track, index) => (
          <div
            key={track.id}
            onClick={() => playSongInContext(track, index, songs)}
            className={`track__item ${currentSong && currentSong.id === track.id ? 'playing' : ''}`}
          >
            <span className='track__number'>{index + 1}.</span>
            <span className={`track__name ${currentSong && currentSong.id === track.id ? 'playing' : ''}`}>{track.title}</span>
            <audio controls src={track.preview}></audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Album;
