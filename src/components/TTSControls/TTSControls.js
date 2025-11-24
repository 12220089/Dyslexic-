import React, { useState, useEffect } from 'react';
import './TTSControls.css';

const TTSControls = ({ text, settings }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speech, setSpeech] = useState(null);

  useEffect(() => {
    // Cleanup speech on unmount
    return () => {
      if (speech) {
        speech.cancel();
      }
    };
  }, [speech]);

  const handlePlayPause = () => {
    if (!text) return;

    if (isPlaying) {
      speech.pause();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech settings
      utterance.rate = 0.8; // Slower speed for better comprehension
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setSpeech(null);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setSpeech(null);
      };

      speechSynthesis.speak(utterance);
      setSpeech(utterance);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (speech) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setSpeech(null);
    }
  };

  if (!settings.ttsEnabled) return null;

  return (
    <div className="tts-controls">
      <h4>Text-to-Speech</h4>
      <div className="tts-buttons">
        <button 
          className={`tts-btn ${isPlaying ? 'pause' : 'play'}`}
          onClick={handlePlayPause}
          disabled={!text}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button 
          className="tts-btn stop"
          onClick={handleStop}
          disabled={!isPlaying}
        >
          ⏹️ Stop
        </button>
      </div>
      <div className="tts-info">
        <p>Listen to the simplified text for better comprehension.</p>
      </div>
    </div>
  );
};

export default TTSControls;