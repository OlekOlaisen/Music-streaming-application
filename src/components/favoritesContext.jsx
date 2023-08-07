import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = (props) => {
  const [favoriteSongs, setFavoriteSongs] = useState(() => {
    // Try to get favorites from localStorage when the component is first rendered
    const savedFavorites = localStorage.getItem('favoriteSongs');
    if (savedFavorites) {
      return JSON.parse(savedFavorites);
    } else {
      return [];
    }
  });

  // Whenever favoriteSongs changes, update localStorage
  useEffect(() => {
    localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongs));
  }, [favoriteSongs]);

  const addFavorite = (song) => {
    setFavoriteSongs((prevFavorites) => [...prevFavorites, song]);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteSongs, addFavorite }}>
      {props.children}
    </FavoritesContext.Provider>
  );
};
