import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteSongs, setFavoriteSongs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favoriteSongs')) || [];
    } catch (err) {
      console.error('Error retrieving favoriteSongs:', err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongs));
    } catch (err) {
      console.error('Error saving favoriteSongs:', err);
    }
  }, [favoriteSongs]);

  const addFavorite = (song) => {
    setFavoriteSongs((prevFavorites) => [...prevFavorites, song]);
  };

  const removeFavorite = (id) => {
    setFavoriteSongs((prevFavorites) => prevFavorites.filter((song) => song.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favoriteSongs, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
