import React, { useState, useEffect, useContext, useCallback } from 'react';
import { CgSearch, CgSearchLoading } from 'react-icons/cg';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { AudioContext } from '../components/audioContext.jsx';
import Search from '../assets/images/search.svg';


const FetchAPI = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { playSong, setPlaylist, currentIndex, setCurrentIndex, searchResults, setSearchResults } = useContext(AudioContext);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

   const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuClass = `slide-up-menu ${isMenuOpen ? 'slide-up-menu-visible' : 'slide-up-menu-hidden'}`;

  const searchSongs = useCallback((query) => {
    console.log('Query:', query);
    fetch(`/.netlify/functions/proxy/search?q=${query}`)


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

useEffect(() => {
  return () => {
    setSearchResults([]); 
  };
}, [setSearchResults]);


 return (
    <section className="search">
      <label className="search__label" htmlFor="search"></label>
      <section className="search__input-container">
        <input
          className="search__input"
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What do you want to listen to?"
        />
        <div className="search__input-icon">
          {isFocused ? <CgSearchLoading /> : <CgSearch />}
        </div>
      </section>

      <div className="search__results">
  {error ? (
    <p>{error}</p>
  ) : searchResults.length === 0 ? (
    <div className='search__results-empty'>
      <p className='search__results-empty-text'>Search among 30 million songs</p>
      <img className='search__results-empty-image' src={Search} alt="a woman searching the web" />
    </div>
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
              <div className="search__results-item-container-song">
                
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
                    <p
                      className={`search__results-title ${
                        currentIndex === index ? 'playing' : ''
                      }`}
                    >
                      {song.title}
                    </p>
                    
                    <p className="search__results-artist"><Link className='Link' to={`/artist/${song.artist.id}`}>
                      {song.artist && song.artist.name}</Link>
                    </p>
                    
                  </div>
                
              </div>
              <div className="search__results-item-container-options">
                <div className="search__results-options">
                  <BiDotsVerticalRounded onClick={toggleMenu} className="option" />
                  <div className={menuClass}>
                    <button className="menuClass_add-to-favorites">Add to playlist</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default FetchAPI;