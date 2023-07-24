import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import {
  Shuffle,
  SkipStartFill,
  PlayFill,
  PauseFill,
  SkipEndFill,
  Repeat,
  Repeat1,
  Heart,
  ChevronDown,
  VolumeMuteFill,
  VolumeUpFill,
} from 'react-bootstrap-icons';
import { AudioContext } from './audioContext.jsx';

function Player() {
  const { isPlaying, togglePlay, playNext, playPrevious, currentSong, audioRef, repeatMode, toggleRepeat, shuffle, toggleShuffle } = useContext(
    AudioContext
    );
    const titleRef = useRef(null);
    const [hasPlayedSong, setHasPlayedSong] = useState(false);
    const [controlsExpanded, setControlsExpanded] = useState(false);
    const [volumeMuted, setVolumeMuted] = useState(false);
    const [prevVolume, setPrevVolume] = useState(1);
    const [currentVolume, setCurrentVolume] = useState(1);
    const [songProgress, setSongProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    
    const handleError = (error) => {
      if (
        error.message ===
        "The fetching process for the media resource was aborted by the user agent at the user's request."
        ) {
          return;
        }
        
        console.error('Error playing audio:', error);
      };
      
      const changeVolume = (e) => {
        const volumeValue = parseFloat(e.target.value);
        audioRef.current.volume = volumeValue;
        
        if (volumeValue === 0) {
          setVolumeMuted(true);
        } else {
          setVolumeMuted(false);
        }
        
        setCurrentVolume(volumeValue);
        setPrevVolume(volumeValue);
      };
      
      const toggleVolume = () => {
        if (volumeMuted) {
          audioRef.current.volume = prevVolume;
          setCurrentVolume(prevVolume);
          setVolumeMuted(false);
        } else {
          audioRef.current.volume = 0;
          setCurrentVolume(0);
          setVolumeMuted(true);
        }
      };
      
      const updateProgress = useCallback(() => {
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setCurrentTime(audioRef.current.currentTime);
    setSongProgress(progress);
    
    if (isPlaying) {
        requestAnimationFrame(updateProgress);
    }
}, [audioRef, isPlaying]);


      
      useEffect(() => {
        if (isPlaying) {
          requestAnimationFrame(updateProgress);
        }
      }, [isPlaying, updateProgress]);
      
      // Handle change in song progress
      const handleProgressChange = (e) => {
        const newValue = e.target.value;
        setSongProgress(newValue);
        audioRef.current.currentTime = (newValue / 100) * audioRef.current.duration;
      };


      const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
      useEffect(() => {
    const audio = audioRef.current;
    const setAudioData = () => {
        setDuration(audio.duration);
    };

    audio.addEventListener('loadedmetadata', setAudioData);

    return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
    };
}, [audioRef]);
      
      
      useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener('timeupdate', updateProgress);
        
        return () => {
          audio.removeEventListener('timeupdate', updateProgress);
        };
      }, [audioRef, updateProgress]);
      
      useEffect(() => {
        const audio = audioRef.current;
        
        audio.addEventListener('error', handleError);
        
        return () => {
          if (audio) {
            audio.pause();
            audio.removeEventListener('error', handleError);
          }
        };
      }, [audioRef]);
      
      useEffect(() => {
        if (isPlaying) {
          audioRef.current.play().catch(handleError);
          setDuration(audioRef.current.duration);
          setHasPlayedSong(true);
        } else {
          audioRef.current.pause();
        }
      }, [isPlaying, audioRef]);

      useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadedmetadata', setAudioData);

    return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
    };
}, [audioRef]);

      
      useEffect(() => {
        const titleElement = titleRef.current;
        
        const observer = new ResizeObserver(() => {
          setTimeout(() => {
            if (titleElement) {
              const textWidth = titleElement.scrollWidth;
              const containerWidth = titleElement.clientWidth;
              if (textWidth > containerWidth) {
                titleElement.classList.add('scrolling');
              } else {
                titleElement.classList.remove('scrolling');
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
      
      const albumImage = currentSong && currentSong.album ? currentSong.album.cover_xl : '';
      const artistName = currentSong && currentSong.artist ? currentSong.artist.name : '';
      
      const songTitle = currentSong ? currentSong.title : '';
      
      useEffect(() => {
        if (controlsExpanded) {
          document.body.classList.add('no-scroll');
        } else {
          document.body.classList.remove('no-scroll');
        }
      }, [controlsExpanded]);
      
      const handleRepeat = () => {
        toggleRepeat();
        const audio = audioRef.current;
        
        if (repeatMode === 0) {
          audio.loop = false;
        } else if (repeatMode === 1) {
          audio.loop = true;
        } else if (repeatMode === 2) {
          audio.loop = false;
          audio.addEventListener('ended', playNext);
        }
      };
      
      return (
        <section className='player'>
        <div className={`player ${hasPlayedSong ? 'show' : ''} `}>
        <div
        className={`player__container ${albumImage ? 'hasBackground' : ''}`}
        style={albumImage ? { '--bg-image': `url(${albumImage})` } : {}}
        >
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
                    
                    <div className="player__controls-buttons-desktop">
                    <button
                    className={`player__controls-shuffle button ${shuffle ? 'shuffle-active' : ''}`}
                    onClick={toggleShuffle}
                    >
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
                        <button className="player__controls-loop button" onClick={handleRepeat}>
                        {repeatMode === 0 && <Repeat className="player__controls-loop-off" />}
                        {repeatMode === 1 && <Repeat className="player__controls-loop-on" />}
                        {repeatMode === 2 && <Repeat1 className="player__controls-loop-1" />}
                        </button>
                        </div>
                        
                        <div className="player__audio">
                        {volumeMuted ? (
                          <button onClick={toggleVolume}>
                          <VolumeMuteFill className="player__audio-mute button" />
                          </button>
                          ) : (
                            <button onClick={toggleVolume}>
                            <VolumeUpFill className="player__audio-up button" />
                            </button>
                            )}
                            <input
                            type="range"
                            id="volume"
                            className='player__audio-slider'
                            name="vol"
                            min="0"
                            max="1"
                            step="0.01"
                            value={currentVolume}
                            onChange={changeVolume}
                            />
                            </div>
                            
                            </div>
                            
                            <div className="player__progress" style={{'--progress': `${songProgress}%`}}>
                               
                            <input
                            type="range"
                            id="progress"
                            name="progress"
                            min="0"
                            max="100"
                            step="1"
                            value={songProgress}
                            onChange={handleProgressChange}
                            />
                           
                            </div>
                            
                            <audio ref={audioRef} />
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
                              
                              
                              <div className='player__controls-container-extended'>
                              
                              <div className='player__controls-options'>
                                
                              </div>

                              <div className="player__controls-song-details">
                              <img src={albumImage} alt="Album" className="player__controls-album-image" />
                              <div className="player__controls-song-info">
                              <p className="player__controls-song-title">{songTitle}</p>
                              <p className="player__controls-artist-name">{artistName}</p>
                              </div>
                              </div>
                              <div className="player__progress-extended" style={{'--progress': `${songProgress}%`}}>
                                
                            <input
                            type="range"
                            id="progress"
                            name="progress"
                            min="0"
                            max="100"
                            step="1"
                            value={songProgress}
                            onChange={handleProgressChange}
                            />
                            <div className='player__duration'>
                            <span className="player__progress-currentTime">{formatTime(currentTime)}</span>
                            <span className="player__progress-duration">{formatTime(duration - currentTime)}</span>
                            </div>
                            </div>
                              <div className="player__controls-buttons">
                              <button
                              className={`player__controls-shuffle button ${shuffle ? 'shuffle-active' : ''}`}
                              onClick={toggleShuffle}
                              >
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
                                  <button className="player__controls-loop button" onClick={handleRepeat}>
                                  {repeatMode === 0 && <Repeat className="player__controls-loop-off" />}
                                  {repeatMode === 1 && <Repeat className="player__controls-loop-on" />}
                                  {repeatMode === 2 && <Repeat1 className="player__controls-loop-1" />}
                                  </button>
                              </div>

                              </div>

                              
                                  </section>
                                  )}
                                  
                                  </section>
                                  );
                                }
                                
                                export default Player;
                                