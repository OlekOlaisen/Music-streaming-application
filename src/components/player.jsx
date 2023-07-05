import React, { useState, useContext, useRef, useEffect } from 'react';
import { Shuffle, SkipStartFill, PlayFill, PauseFill, SkipEndFill, Repeat, Repeat1, Heart, ChevronDown } from 'react-bootstrap-icons';
import { AudioContext } from './audioContext.jsx';

function Player() {
  const { isPlaying, togglePlay, playNext, playPrevious, currentSong } = useContext(AudioContext);
  const [repeatMode, setRepeatMode] = useState(0);
  const audioRef = useRef(null);
  const titleRef = useRef(null);
  const [hasPlayedSong, setHasPlayedSong] = useState(false);
  const [controlsExpanded, setControlsExpanded] = useState(false);
  
  const handleError = (error) => {
    if (
      error.message ===
      "The fetching process for the media resource was aborted by the user agent at the user's request."
      ) {
        return;
      }
      
      console.error('Error playing audio:', error);

    };
    
    useEffect(() => {
      const audio = audioRef.current; 
      
      audio.addEventListener('error', handleError);
      
      return () => {
        if (audio) {
          audio.pause();
          audio.removeEventListener('error', handleError);
        }
      };
    }, []);
    
    useEffect(() => {
      if (isPlaying) {
        audioRef.current.play().catch(handleError);
        setHasPlayedSong(true);
      } else {
        audioRef.current.pause();
      }
    }, [isPlaying]);

     useEffect(() => {
    const titleElement = titleRef.current;

    const observer = new ResizeObserver(() => {
        
        setTimeout(() => {
            if (titleElement) {
                const textWidth = titleElement.scrollWidth;
                const containerWidth = titleElement.clientWidth;
                if (textWidth > containerWidth) {
                    titleElement.classList.add("scrolling");
                } else {
                    titleElement.classList.remove("scrolling");
                }
            }
        }, 0);
    });

    if (titleElement) {
        observer.observe(titleElement);
    }

    return () => {
        if (titleElement) {
            observer.unobserve(titleElement);
        }
    };
}, [currentSong]);


    
    const toggleControlsExpanded = () => {
      setControlsExpanded((prevExpanded) => !prevExpanded);
    };
    
    const toggleRepeat = () => {
      setRepeatMode((prevMode) => (prevMode + 1) % 3);
    };
    
    const albumImage = currentSong && currentSong.album ? currentSong.album.cover : '';
    const artistName = currentSong && currentSong.artist ? currentSong.artist.name : '';
    
    
    const songTitle = currentSong ? currentSong.title : '';
    
    return (
      <section className={`player ${hasPlayedSong ? 'show' : ''}`}>
      <div className='player__container' >
      <div className="player__info" onClick={toggleControlsExpanded}>
        <div className='player__info-cover'>
                {albumImage && (
                    <img src={albumImage} alt="Album" className="player__info-album-image" />
                )}
                </div>
                <div className='player__info-details'>
                {songTitle && (
                    <p className="player__info-song-title" ref={titleRef}>{songTitle}</p>
                )}
                {artistName && (
                    <p className="player__info-artist-name">{artistName}</p>
                )}
                </div>
            </div>
      <div className="player__controls">
    {hasPlayedSong && (
        <div className="player__buttons">
            <button className="player__controls-toggle button" onClick={togglePlay}>
                {isPlaying ? (
                    <PauseFill className="player__controls-toggle-pause" />
                ) : (
                    <PlayFill className="player__controls-toggle-play" />
                )}
            </button>
            <button className="player__button">
                <Heart className="player__button-icon" />
            </button>
        </div>
    )}
</div>


          </div>
          
          {controlsExpanded && (
            <section
    className={`player__controls-expanded ${controlsExpanded ? 'open' : ''} ${
        albumImage ? 'hasBackground' : ''
    }`}
    style={albumImage ? { '--bg-image': `url(${albumImage})` } : {}}
>
            <button className="player__controls-close button" onClick={toggleControlsExpanded}>
            <ChevronDown className="player__controls-close-icon" />
            </button>

            <div className='player__controls-container'>
            <div className="player__controls-song-details">
            <img src={albumImage} alt="Album" className="player__controls-album-image" />
            <div className="player__controls-song-info">
            <p className="player__controls-song-title">{songTitle}</p>
            <p className="player__controls-artist-name">{artistName}</p>
            </div>
            </div>
            
            <div className="player__controls-buttons">
            <button className="player__controls-shuffle button">
            <Shuffle />
            </button>
            <button className="player__controls-rewind button" onClick={playPrevious}>
            <SkipStartFill />
            </button>
            <button className="player__controls-toggle button" onClick={togglePlay}>
            {isPlaying ? (
              <PauseFill className="player__controls-toggle-pause" />
              ) : (
                <PlayFill className="player__controls-toggle-play" />
                )}
                </button>
                <button className="player__controls-forward button" onClick={playNext}>
                <SkipEndFill />
                </button>
                <button className="player__controls-loop button" onClick={toggleRepeat}>
                {repeatMode === 0 && <Repeat className="player__controls-loop-off" />}
                {repeatMode === 1 && <Repeat className="player__controls-loop-on" />}
                {repeatMode === 2 && <Repeat1 className="player__controls-loop-1" />}
                </button>
                </div>

</div>
                </section>
                )}
                
                <div className="player__progress">
                </div>



                <audio ref={audioRef} />
                </section>
                );
              }
              
              export default Player;
              