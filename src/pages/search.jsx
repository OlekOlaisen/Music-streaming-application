import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import { AudioContext } from '../components/audioContext.jsx';

const FetchAPI = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { playSong, setPlaylist, currentIndex, setCurrentIndex, searchResults, setSearchResults } = useContext(AudioContext);
  const [error, setError] = useState(null);

  const searchSongs = useCallback((query) => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': `${process.env.REACT_APP_RAPIDAPI_KEY}`,
        'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
      },
    };

    fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        if (!response.data || response.data.length === 0) {
          setSearchResults([]);
          setError('No search results found');
          return;
        }
        setSearchResults(response.data);
        setPlaylist(response.data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('Error occurred while searching');
      });
  }, [setPlaylist, setSearchResults]);

  useEffect(() => {
    if (currentIndex >= 0 && searchResults[currentIndex]) {
      const currentSong = searchResults[currentIndex];
      const { title, artist } = currentSong;
      const artistName = artist && artist.name ? artist.name : 'Unknown Artist';
      document.title = `${title} - ${artistName}`;
    } else {
      document.title = 'Deezer Preview App';
    }
  }, [currentIndex, searchResults]);

  const handleInputChange = useCallback((event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    setCurrentIndex(-1);
    setError(null);
  }, [setCurrentIndex]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  useEffect(() => {
  if (debouncedQuery) {
    searchSongs(debouncedQuery);
  }
}, [debouncedQuery, searchSongs]);

  return (
    <section className="search">
      <label className="search__label" htmlFor="search"></label>
      <section className="search__input-container">
        <input
          className="search__input"
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="What do you want to listen to?"
        />
        <div className="search__input-icon">
          <SearchIcon />
        </div>
      </section>

      <div className="search__results">
        {error ? (
          <p>{error}</p>
        ) : (
          searchResults.map((song, index) => (
            <div
              className="search__results-item"
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                playSong(song.preview, index);
              }}
            >
              <div className="search__results-item-cover">
                {song.album && song.album.cover && (
                  <img
                    className="search__results-item-image"
                    src={song.album.cover}
                    alt={`${song.title} cover`}
                  />
                )}
              </div>
              <div className="search__results-info">
                <p className={`search__results-title ${currentIndex === index ? 'playing' : ''}`}>
                  {song.title}
                </p>
                <p className="search__results-artist">{song.artist && song.artist.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default FetchAPI;
