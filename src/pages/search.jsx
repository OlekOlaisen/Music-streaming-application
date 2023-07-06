import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import { AudioContext } from '../components/audioContext.jsx';

const FetchAPI = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { playSong, setPlaylist, currentIndex, setCurrentIndex } = useContext(AudioContext);
  const [error, setError] = useState(null);

  const searchSongs = useCallback((query) => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '80f7e85633msh33f1fc9d67c7fc0p1378acjsne3b24971e450',
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
          setResults([]);
          setError('No search results found');
          return;
        }
        setResults(response.data);
        setPlaylist(response.data);
        setError(null);
        sessionStorage.setItem('searchResults', JSON.stringify(response.data));
      })
      .catch((err) => {
        console.error(err);
        setError('Error occurred while searching');
      });
  }, [setPlaylist]);

   useEffect(() => {

    if (currentIndex >= 0 && results[currentIndex]) {
      const currentSong = results[currentIndex];
      const { title, artist } = currentSong;
      const artistName = artist && artist.name ? artist.name : 'Unknown Artist';
      document.title = `${title} - ${artistName}`;
    } else {
      document.title = 'Deezer Preview App';
    }
  }, [currentIndex, results]);

  useEffect(() => {
    const savedResults = sessionStorage.getItem('searchResults');

    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setResults(parsedResults);
      } catch (e) {
        console.error("Error parsing results from session storage:", e);
      }
    }
  }, []);

  const handleInputChange = useCallback((event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    setCurrentIndex(-1);
    setError(null);
    searchSongs(inputValue);
  }, [searchSongs, setCurrentIndex]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    sessionStorage.removeItem('searchResults');
  };

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
          results.map((song, index) => (
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
