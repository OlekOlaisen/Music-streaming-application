import React, { useState } from 'react';

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [songToAdd, setSongToAdd] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handleNewPlaylistNameChange = (e) => {
    setNewPlaylistName(e.target.value);
  }

  const handleNewPlaylistSubmit = (e) => {
    e.preventDefault();
    setPlaylists([...playlists, { name: newPlaylistName, songs: [] }]);
    setNewPlaylistName("");
  }

  const handleSongToAddChange = (e) => {
    setSongToAdd(e.target.value);
  }

  const handleAddSong = (e) => {
    e.preventDefault();
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.name === selectedPlaylist) {
        return { ...playlist, songs: [...playlist.songs, songToAdd] };
      }
      return playlist;
    });
    setPlaylists(updatedPlaylists);
    setSongToAdd("");
  }

  return (
    <div className='playlists'>
      <h1>Playlists</h1>
      <form onSubmit={handleNewPlaylistSubmit}>
        <input
          type="text"
          value={newPlaylistName}
          onChange={handleNewPlaylistNameChange}
          placeholder="New playlist name"
          required
        />
        <button type="submit">Create Playlist</button>
      </form>

      <form onSubmit={handleAddSong}>
        <select onChange={e => setSelectedPlaylist(e.target.value)}>
          <option>Select playlist...</option>
          {playlists.map((playlist, index) => (
            <option key={index} value={playlist.name}>
              {playlist.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={songToAdd}
          onChange={handleSongToAddChange}
          placeholder="Song name"
          required
        />
        <button type="submit">Add Song</button>
      </form>

      <ul>
        {playlists.map((playlist, index) => (
          <li key={index}>
            <h2>{playlist.name}</h2>
            <ul>
              {playlist.songs.map((song, index) => (
                <li key={index}>{song}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
