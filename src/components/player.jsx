import React, { useState, useContext, useRef, useEffect } from "react";
import { Shuffle, SkipStartFill, PlayFill, PauseFill, SkipEndFill, Repeat, Repeat1 } from 'react-bootstrap-icons';
import { AudioContext } from './audioContext.jsx'; 

function Player() {
    const { isPlaying, togglePlay, playNext, playPrevious } = useContext(AudioContext); // Using the AudioContext
    const [repeatMode, setRepeatMode] = useState(0); // 0 - off, 1 - repeat, 2 - repeat1
    const audioRef = useRef(null);

    useEffect(() => {
        const handleError = (error) => {
            if (error.message === 'The fetching process for the media resource was aborted by the user agent at the user\'s request.') {
                // Ignore this specific error caused by user action
                return;
            }

            console.error("Error playing audio:", error);
            // Handle other errors appropriately
            // For example, you can show an error message to the user or perform any other action.
        };

        audioRef.current.addEventListener('error', handleError);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current.removeEventListener('error', handleError);
        };
    }, []);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(handleError); // Catch any play() errors
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const handleError = (error) => {
        if (error.message === 'The fetching process for the media resource was aborted by the user agent at the user\'s request.') {
            // Ignore this specific error caused by user action
            return;
        }

        console.error("Error playing audio:", error);
        // Handle other errors appropriately
        // For example, you can show an error message to the user or perform any other action.
    };

    const toggleRepeat = () => {
        setRepeatMode((prevMode) => (prevMode + 1) % 3);
    };

    return (
        <section className='player'>
            <div className="player__info">
                <p>info</p>
            </div>
            <div className="player__controls">
                <div className="player__controls-buttons">
                    <button className="player__controls-shuffle button"><Shuffle /></button>
                    <button className="player__controls-rewind button" onClick={playPrevious}><SkipStartFill /></button>
                    <button className="player__controls-toggle button" onClick={togglePlay}>
                        {isPlaying ? <PauseFill className="player__controls-toggle-pause" /> : <PlayFill className="player__controls-toggle-play" />}
                    </button>
                    <button className="player__controls-forward button" onClick={playNext}><SkipEndFill /></button>
                    <button className="player__controls-loop button" onClick={toggleRepeat}>
                        {repeatMode === 0 && <Repeat className="player__controls-loop-off" />}
                        {repeatMode === 1 && <Repeat className="player__controls-loop-on" />}
                        {repeatMode === 2 && <Repeat1 className="player__controls-loop-1" />}
                    </button>
                </div>
            </div>
            <div className="player__progress">
                <p>bar</p>
            </div>
            <audio ref={audioRef} onError={handleError} /> 
        </section>
    );
}

export default Player;
