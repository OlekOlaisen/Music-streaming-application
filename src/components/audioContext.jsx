import React, { createContext, useState, useRef, useEffect } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [currentSong, setCurrentSong] = useState(null); // Add currentSong state
  const audioRef = useRef(null);

  const playSong = (songUrl, index) => {
    setCurrentIndex(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleRepeat = () => {
    setRepeatMode((prevMode) => (prevMode + 1) % 3);
  };

  const playNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const playPrevious = () => {
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
      audio.src = playlist[currentIndex].preview;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Error playing audio:", error);
      });
      setCurrentSong(playlist[currentIndex]); // Set the currentSong state
    }
  }, [currentIndex, playlist]);

  return (
    <AudioContext.Provider
      value={{
        playSong,
        isPlaying,
        togglePlay,
        repeatMode,
        toggleRepeat,
        playNext,
        playPrevious,
        setPlaylist,
        setCurrentIndex,
        currentIndex,
        currentSong, 
      }}
    >
      {children}
      <audio ref={audioRef} controls autoPlay={isPlaying} loop={repeatMode === 1} />
    </AudioContext.Provider>
  );
};
