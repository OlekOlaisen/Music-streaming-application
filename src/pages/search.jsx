import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'react-bootstrap-icons';

const FetchAPI = () => {
   const [query, setQuery] = useState('');
   const [results, setResults] = useState([]);
   
   
   useEffect(() => {
      if (query) {
         searchSongs(query);
      }
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
            <div className='search__results-item' key={index}>
            <p className='search__results-title'>{song.title}</p>
            <p className='search__results-artist'>{song.artist.name}</p>
            </div>
            ))}
            
            </div>
            
      </main>
         );
      };
      
      export default FetchAPI;
      