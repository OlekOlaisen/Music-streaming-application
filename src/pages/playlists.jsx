import { React, useContext } from 'react';
import { FavoritesContext } from '../components/favoritesContext';

function Playlists() {
  const { favoriteSongs } = useContext(FavoritesContext);


  return (
    <div className='playlists'>
      <h1 className='playlists__headline'>Playlists</h1>
      <h2 className='playlists__playlist-title'>Favorited Songs</h2>
      {favoriteSongs.map(song => {

  return (
    <div key={song.id} className='playlists__favorited-item'>
      <p className='playlists__favorited-title'>{song.title}</p>  
      <p className='playlists__favorited-artist'>{song.artistName} </p>
    </div>
  );
})}

    </div>
  );
}

export default Playlists;
