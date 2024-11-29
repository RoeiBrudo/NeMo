// src/pages/ExperimentResults/ExperimentResults.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExperimentData } from '../../services/api';
import { Brain, BarChart2 } from 'lucide-react';
import LoadingErrorCard from '../../components/base/LoadingErrorCard/LoadingErrorCard';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import BrainLogs from '../../pages/BrainLogs/BrainLogs';
import Analysis from '../../pages/Analysis/Analysis';
import './ExperimentResults.css';

const ExperimentResults = () => {
  const { experimentName } = useParams();
  const [experimentData, setExperimentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('brainlogs');

  const getSidebarItems = (experimentData) => {
    const items = [
      {
        id: 'brainlogs',
        label: 'Brain Logs',
        icon: <Brain size={20} />,
        description: 'View neural activity and logs'
      }
    ];

    // Only add the Analysis link if there are analyses available
    if (experimentData?.analysis?.length > 0) {
      items.push({
        id: 'analysis',
        label: 'Analysis',
        icon: <BarChart2 size={20} />,
        description: 'View analysis results and graphs'
      });
    }

    return items;
  };

  useEffect(() => {
    loadExperimentData();
  }, [experimentName]);

  const loadExperimentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExperimentData(experimentName);
      setExperimentData(data);
      
      // If we're on the analysis view but there are no analyses,
      // switch to brainlogs view
      if (activeView === 'analysis' && (!data.analysis || data.analysis.length === 0)) {
        setActiveView('brainlogs');
      }
    } catch (err) {
      setError('Failed to load experiment data.');
      console.error('Error loading experiment:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    console.log(experimentData)
    switch (activeView) {
      case 'brainlogs':
        return (
          <BrainLogs 
            experimentName={experimentName}
            experimentData={experimentData}
          />
        );
      case 'analysis':
        return (
          <Analysis
            experimentName={experimentName}
            analysisNames={experimentData.analysis}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="experiment-results-page">
      <div className="experiment-results-layout">
        <Sidebar
          title="Views"
          items={getSidebarItems(experimentData)}
          activeItem={activeView}
          onItemSelect={setActiveView}
        />
        <main className="experiment-content">
          <LoadingErrorCard
            isLoading={loading}
            error={error}
            onRetry={loadExperimentData}
            loadingMessage="Loading experiment data..."
            errorMessage="Failed to load experiment data"
          >
            <div className="content-header">
              <h1>{experimentName}</h1>
            </div>
            {renderContent()}
          </LoadingErrorCard>
        </main>
      </div>
    </div>
  );
};

export default ExperimentResults;