import React, { useContext, useState, useEffect } from 'react';
import { FavoritesContext } from '../components/favoritesContext';
import { AudioContext } from '../components/audioContext';

function Playlists() {
  const { favoriteSongs } = useContext(FavoritesContext);
  const { playSongInContext, setPlaylist, currentSong } = useContext(AudioContext);

  const [playingSong, setPlayingSong] = useState(null);

  const handleFavoriteSongClick = async (song) => {
    try {
      if (!song || !song.preview) {
        throw new Error('Invalid song or preview URL');
      }

      // Use await to ensure that playSongInContext completes before starting playback
      await playSongInContext(
        {
          id: song.id,
          title: song.title,
          artist: { name: song.artistName }, // Pass artist name in the expected format
          album: { cover_xl: song.albumImage }, // Pass album image URL in the expected format
          preview: song.preview,
        },
        favoriteSongs.indexOf(song),
        favoriteSongs
      );

      // After playSongInContext is completed, you can set the playlist and the currently playing song
      setPlaylist(favoriteSongs);
      setPlayingSong(song);
    } catch (error) {
      console.error('Error playing favorite song:', error);
    }
  };

  // Use useEffect to reset the playing song when the currentSong changes
  useEffect(() => {
    if (!currentSong) {
      setPlayingSong(null);
    }
  }, [currentSong]);

  return (
    <div className='playlists'>
      <h2 className='playlists__playlist-title'>Favorited Songs</h2>
      {favoriteSongs.map((song) => (
        <div
          key={song.id}
          className={`playlists__favorited-item `}
          onClick={() => handleFavoriteSongClick(song)}
        >
          <div className="playlists__album-image">
            <img className='playlists__album-cover' src={song.albumImage} alt={`Album Cover for ${song.title}`} />
          </div>
          <div className='playlists__song-details'>
            <p className={`playlists__favorited-title ${playingSong && playingSong.id === song.id ? 'playing' : ''}`}>{song.title}</p>
            <p className='playlists__favorited-artist'>{song.artistName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Playlists;
