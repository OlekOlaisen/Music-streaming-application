import React, { useState, createContext, useRef, useEffect } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [playlist, setPlaylist] = useState([]); // New state for playlist
    const [currentIndex, setCurrentIndex] = useState(-1); // New state for current index
    const [isPlaying, setIsPlaying] = useState(false);
    const [repeatMode, setRepeatMode] = useState(0); // 0 - off, 1 - repeat, 2 - repeat1
  
    const audioRef = useRef(null);
  
    const playSong = (songUrl, index) => {
      setCurrentIndex(index); // set current index

    };
  
    const togglePlay = () => {
      setIsPlaying(!isPlaying);
    };
  
    const toggleRepeat = () => {
      setRepeatMode((prevMode) => (prevMode + 1) % 3);
    };
  
    const playNext = () => { // New function
      if (currentIndex < playlist.length - 1) {
        setCurrentIndex(currentIndex + 1);   
      }
    };
  
    const playPrevious = () => { // New function
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
       
      }
    };
  
    useEffect(() => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
    }, [isPlaying]);
  
    useEffect(() => { 
      if (playlist[currentIndex]) {
        const audio = audioRef.current;
        audio.src = playlist[currentIndex].preview; // set the src to the new song
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    }, [currentIndex, playlist]);
  
    return (
      <AudioContext.Provider value={{ playSong, isPlaying, togglePlay, repeatMode, toggleRepeat, playNext, playPrevious, setPlaylist }}>
        {children}
        <audio ref={audioRef} controls autoPlay={isPlaying} loop={repeatMode === 1} />
      </AudioContext.Provider>
    );
  };
