import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
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

  const playNext = useCallback(() => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Go back to the start of the playlist
    }
  }, [currentIndex, playlist]);

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (repeatMode === 1) {
      setCurrentIndex(playlist.length - 1); // Go to the end of the playlist if repeatMode is 1
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
      audio.loop = repeatMode === 2; // Repeat the current song if repeatMode is 2
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Error playing audio:", error);
      });
      setCurrentSong(playlist[currentIndex]); 
    }
  }, [currentIndex, playlist, repeatMode]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleSongEnd = () => {
      if (repeatMode === 1) {
        playNext();
      }
    };

    audio.addEventListener('ended', handleSongEnd);

    return () => {
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, [repeatMode, playNext]);

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
        audioRef,
        searchResults, 
        setSearchResults 
      }}
    >
      {children}
      <audio ref={audioRef} controls autoPlay={isPlaying} />
    </AudioContext.Provider>
  );
};
