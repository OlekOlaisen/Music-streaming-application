import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [shuffle, setShuffle] = useState(false);
  const [history, setHistory] = useState([]);
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

  const toggleShuffle = () => {
    setShuffle((prevShuffle) => !prevShuffle);
  };

  const playNext = useCallback(() => {
    let nextIndex;
    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentIndex);
    } else {
      nextIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
    }
    // before moving to the next song, push the current index to history
    setHistory(prev => [...prev, currentIndex]); 
    setCurrentIndex(nextIndex);
  }, [currentIndex, playlist, shuffle]);

  const playPrevious = () => {
    if (history.length > 0) {
      // if there is a history, go to the previous song
      const prevIndex = history.pop();
      setHistory(history);
      setCurrentIndex(prevIndex);
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

  // Handle song change
  useEffect(() => {
    if (playlist[currentIndex]) {
      const audio = audioRef.current;
      audio.src = playlist[currentIndex].preview;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Error playing audio:", error);
      });
      setCurrentSong(playlist[currentIndex]); 
    }
  }, [currentIndex, playlist]);

  // Handle loop mode change
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = repeatMode === 2; // Repeat the current song if repeatMode is 2
  }, [repeatMode]);

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
        setSearchResults,
        shuffle,
        toggleShuffle,
      }}
    >
      {children}
      <audio ref={audioRef} controls autoPlay={isPlaying} />
    </AudioContext.Provider>
  );
};
