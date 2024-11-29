// src/pages/BrainLogs/BrainLogs.jsx
import { useState, useEffect, useCallback } from 'react';
import DynamicPanelLayout from '../../components/layout/DynamicPanelLayout/DynamicPanelLayout';
import { ELEMENT_TYPES, SPLIT_TYPES } from '../../components/layout/DynamicPanelLayout/types';
import { fetchBrainData } from '../../services/api';

import FileTree from '../../components/features/FileTree/FileTree';
import GridView from '../../components/features/Graphs/GridView/GridView';
import StateView from '../../components/features/LogsView/StateView/StateView';
import { processSpikesData } from '../../utils/spikeDataUtils';

import TimeControl from '../../components/features/LogsView/TimeControl/TimeControl';
import LoadingErrorCard from '../../components/base/LoadingErrorCard/LoadingErrorCard';
import './BrainLogs.css';


const BrainLogs = ({ experimentName, experimentData }) => {
  // File selection state
  const [selectedFile, setSelectedFile] = useState(null);
  const [brainData, setBrainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Time control state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(100);

  // Auto-play effect with looping
  useEffect(() => {
    let intervalId;
    
    if (isPlaying && brainData) {
      intervalId = setInterval(() => {
        setCurrentTime(time => {
          if (time >= brainData.T - 1) {
            setIsPlaying(false);
            return 0;
          }
          return time + 1;
        });
      }, playSpeed);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, brainData, playSpeed]);

  const loadBrainData = async (filePath) => {
    try {
      setLoading(true);
      setError(null);

      const parts = filePath.split('\\');
      const brainName = parts.pop();
      const relativeParts = parts;

      const data = await fetchBrainData(
        experimentName,
        relativeParts,
        brainName
      );

      setBrainData(data);
      setCurrentTime(0);
      setIsPlaying(false);
    } catch (err) {
      console.error('Error loading brain data:', err);
      setError('Failed to load brain data. Please try again.');
      setBrainData(null);
    } finally {
      setLoading(false);
    }
  };

  const processData = (brainData) => {
    if (!brainData || !brainData.logs.spikes) return null;

    const processed = {};
    Object.entries(brainData.logs.spikes).forEach(([area, spikes]) => {
      processed[area] = processSpikesData(spikes, brainData.logs.T, brainData.sizes[area]);
    });
    return processed;
  };


  const handleFileSelect = async (filePath) => {
    setSelectedFile(filePath);
    await loadBrainData(filePath);
  };

  // Time control handlers
  const handleTimeChange = useCallback((time) => {
    setCurrentTime(time);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(time => Math.min(brainData?.logs.T - 1 || 0, time + 1));
  }, [brainData]);

  const handleStepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(time => Math.max(0, time - 1));
  }, []);

  const handleSpeedChange = useCallback((speed) => {
    setPlaySpeed(speed);
  }, []);

  const renderSpikesContent = () => {
    if (!selectedFile) {
      return (
        <div className="no-selection-message">
          Select a file from the tree to view spikes data
        </div>
      );
    }

    if (!brainData) {
      return (
        <div className="no-data-message">
          No spikes data available
        </div>
      );
    }

    const processedSpikes = processData(brainData);

    return (
      <div className="spikes-content">
      <div className="time-control-container">
        <TimeControl
          currentTime={currentTime}
          maxTime={brainData.logs.T - 1}
          isPlaying={isPlaying}
          playSpeed={playSpeed}
          onTimeChange={handleTimeChange}
          onPlayPause={handlePlayPause}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onSpeedChange={handleSpeedChange}
          schedule={brainData.logs.schedule}
        />
      </div>
      <StateView
        currentTime={currentTime}
        schedule={brainData.logs.schedule}
        resting_ind={brainData.logs.resting_ind}
      />
      <div className="areas-grid">
        {processedSpikes && Object.entries(processedSpikes).map(([area, areaSpikes]) => (
          <div key={area} className="area-container">
            <h5>{area}</h5>
            <GridView
              data={areaSpikes[currentTime]}
              areaSize={brainData.sizes[area]}
            />
          </div>
        ))}
      </div>
    </div>
    );
  };

  const layoutConfig = {
    type: ELEMENT_TYPES.SPLIT,
    id: 'root',
    splitType: SPLIT_TYPES.VERTICAL,
    defaultSizes: [25, 75],
    children: [
      {
        type: ELEMENT_TYPES.PANEL,
        id: 'file-tree',
        title: 'Files',
        content: (
          <FileTree 
            files={experimentData.brain_logs}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />
        )
      },
      {
        type: ELEMENT_TYPES.PANEL,
        id: 'spikes',
        title: 'Spikes Data',
        content: (
          <LoadingErrorCard
            isLoading={loading}
            error={error}
            onRetry={() => selectedFile && loadBrainData(selectedFile)}
            loadingMessage="Loading spikes data..."
            errorMessage={error}
          >
            {renderSpikesContent()}
          </LoadingErrorCard>
        )
      }
    ]
  };

  return (
    <div className="brain-logs-page">
      <DynamicPanelLayout config={layoutConfig} />
    </div>
  );
};

export default BrainLogs;