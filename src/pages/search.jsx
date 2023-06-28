import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import Player from '../components/player.jsx';

const FetchAPI = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [currentSong, setCurrentSong] = useState(null); // Added state to keep track of the current song
    
    useEffect(() => {
        const timerId = setTimeout(() => {
            if (query) {
                searchSongs(query);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timerId);
    }, [query]);
    
    const searchSongs = (query) => {
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
                console.error('No search results found');
                return;
            }
            setResults(response.data);
        })
        .catch((err) => console.error(err));
    };
    
    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const playSong = (song) => {
        setCurrentSong(song.preview); // Assuming that the song object has a 'preview' property with the audio file URL
    };

    return (
        <main className="search">
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
                {results.map((song, index) => (
                    <div className='search__results-item' key={index} onClick={() => playSong(song)}> {/* Added click handler */}
                        <div className='search__results-item-cover'>
                            {song.album && <img className='search__results-item-image' src={song.album.cover} alt={`${song.title} cover`} />}
                        </div>
                        <div className='search__results-info'>
                            <p className='search__results-title'>{song.title}</p>
                            <p className='search__results-artist'>{song.artist.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Added audio element */}
            {currentSong && <audio controls autoPlay src={currentSong} />}
        </main>
    );
};

export default FetchAPI;
