import React, { useState, useEffect, useContext } from 'react';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import { AudioContext } from '../components/audioContext.jsx'; // Update this import path

const FetchAPI = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    
    const { playSong, setPlaylist } = useContext(AudioContext); // Using the AudioContext
    
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
            setPlaylist(response.data); 
        })
        .catch((err) => console.error(err));
    };
    
    const handleInputChange = (event) => {
        setQuery(event.target.value);
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
                    <div className='search__results-item' key={index} onClick={() => playSong(song.preview, index)}>
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
        </main>
    );
};

export default FetchAPI;
