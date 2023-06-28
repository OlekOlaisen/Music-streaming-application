import React, { useState } from "react";
import { Shuffle, SkipStartFill, PlayFill, PauseFill, SkipEndFill, Repeat, Repeat1 } from 'react-bootstrap-icons';


function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0 - off, 1 - repeat, 2 - repeat1

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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
          <button className="player__controls-shuffle button"><Shuffle/></button>
          <button className="player__controls-rewind button"><SkipStartFill/></button>
          <button className="player__controls-toggle button" onClick={togglePlay}>
            {isPlaying ? <PauseFill className="player__controls-toggle-pause"/> : <PlayFill className="player__controls-toggle-play"/>}
          </button>
          <button className="player__controls-forward button"><SkipEndFill/></button>

          <button className="player__controls-loop button" onClick={toggleRepeat}>
            {/* Use different colors to indicate repeatMode */}
            {repeatMode === 0 && <Repeat className="player__controls-loop-off"/>}
            {repeatMode === 1 && <Repeat className="player__controls-loop-on" />}
            {repeatMode === 2 && <Repeat1 className="player__controls-loop-1" />}
          </button>
        </div>
      </div>
      <div className="player__progress">
        <p>bar</p>
      </div>
    </section>
  );
}

export default Player;
