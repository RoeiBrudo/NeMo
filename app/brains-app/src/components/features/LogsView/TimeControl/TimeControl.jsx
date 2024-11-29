// src/components/features/TimeControl/TimeControl.jsx
import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import './TimeControl.css';

const TimeControl = ({
  currentTime,
  maxTime,
  isPlaying,
  playSpeed,
  onTimeChange,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  schedule
}) => {
  const getDisplayTime = (time) => time + 1;

  // Generate timeline segments based on schedule
  const getTimelineSegments = () => {
    if (!schedule) return [];
    
    const segments = [];
    let currentTime = 0;
    
    schedule.forEach((phaseDict, index) => {
      const startPercent = (currentTime / maxTime) * 100;
      const endTime = currentTime + phaseDict.T;
      const endPercent = (endTime / maxTime) * 100;
      
      segments.push({
        id: `segment-${index}`,
        startTime: currentTime,
        endTime,
        startPercent,
        endPercent,
        action: phaseDict.action,
        label: phaseDict.action === 'learning' ? 'L' : 'R'
      });
      
      currentTime = endTime;
    });
    
    return segments;
  };

  const segments = getTimelineSegments();

  return (
    <div className="time-control">
      <div className="control-buttons">
        <button 
          className="control-button"
          onClick={onStepBackward}
          disabled={isPlaying}
          title="Previous"
        >
          <SkipBack size={20} />
        </button>
        
        <button 
          className="control-button play-button"
          onClick={onPlayPause}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button 
          className="control-button"
          onClick={onStepForward}
          disabled={isPlaying}
          title="Next"
        >
          <SkipForward size={20} />
        </button>
      </div>
      
      <div className="slider-container">
        <div className="timeline-wrapper">
          {/* State segments */}
          <div className="timeline-segments">
            {segments.map((segment) => (
              <div
                key={segment.id}
                className={`timeline-segment ${segment.action}`}
                style={{
                  left: `${segment.startPercent}%`,
                  width: `${segment.endPercent - segment.startPercent}%`
                }}
                title={`${segment.action} (${segment.startTime} - ${segment.endTime})`}
              >
                <span className="segment-label">{segment.label}</span>
              </div>
            ))}
          </div>

          {/* Timeline markers */}
          <div className="timeline-markers">
            {segments.map((segment) => (
              <div
                key={`marker-${segment.id}`}
                className="marker-tick"
                style={{ left: `${segment.startPercent}%` }}
              />
            ))}
            <div 
              className="marker-tick"
              style={{ left: '100%' }}
            />
          </div>

          {/* Time slider */}
          <input
            type="range"
            min={0}
            max={maxTime}
            value={currentTime}
            onChange={(e) => onTimeChange(Number(e.target.value))}
            className="time-slider"
          />
        </div>

        <div className="time-info">
          <span className="time-display">
            Time: {getDisplayTime(currentTime)} / {getDisplayTime(maxTime)}
          </span>
          <div className="speed-control">
            <label>Speed:</label>
            <select 
              value={playSpeed} 
              onChange={(e) => onSpeedChange(Number(e.target.value))}
            >
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
              <option value={250}>4x</option>
              <option value={100}>10x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeControl;