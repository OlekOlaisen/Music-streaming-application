import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AudioContext } from '../components/audioContext';
import { Link } from 'react-router-dom';
import { Ping } from '@uiball/loaders'

const Artist = () => {
  const [artistData, setArtistData] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const { id } = useParams();
  const {  currentSong, playSongInContext } = useContext(AudioContext);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch(`/.netlify/functions/proxy/artist/${id}`)
      .then(response => response.json())
      .then(data => setArtistData(data));

    fetch(`/.netlify/functions/proxy/artist/${id}/top`)
      .then(response => response.json())
      .then(data => setTopTracks(data.data.slice(0, 5)));  

    fetch(`/.netlify/functions/proxy/artist/${id}/albums`)
    .then(response => response.json())
    .then(data => {
      setAlbums(data.data);

      // Then fetch the genres for each album.
      // Promise.all ensures we wait for all requests to complete.
      Promise.all(data.data.map(album => fetch(`/.netlify/functions/proxy/album/${album.id}`)))
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(albumData => {
          // For each album, add its genres to the genres state, if genres exist.
          const allGenres = albumData.flatMap(album => album.genres ? album.genres.data : []);
          
          // Count frequency of each genre.
          const genreCount = allGenres.reduce((acc, genre) => {
            acc[genre.id] = (acc[genre.id] || { count: 0, genre });
            acc[genre.id].count++;
            return acc;
          }, {});
          
          // Sort by frequency and pick top 3.
          const topGenres = Object.values(genreCount)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map(g => g.genre);

          setGenres(topGenres);
        });
    });
}, [id]);

 

  if (!artistData || !topTracks.length || !albums.length) {
    return  <Ping size={45} speed={2} color='f78278' className="spinner"/>;
  }

  return (
    <div className='artists'>
      <div className='artists__info'>
        <img className="artists__cover" src={artistData.picture_xl} alt={artistData.name} />
        <div className='artists__text'>
          <h1 className='artists__name'>{artistData.name}</h1>
          <p className='artists__fans'>Followers: <p className='nb_fan'> {artistData.nb_fan} </p></p>
          <div className='artists__albums'>Albums: <p className='nb_album'>{artistData.nb_album}</p></div>
           <div className='artists__genres'>
      Top Genres:
      {genres.map((genre, index) => (
        <div key={genre.id}>
          <p className={`genre-name genre-${index}`}>• {genre.name}</p>
        </div>
      ))}
    </div>


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
