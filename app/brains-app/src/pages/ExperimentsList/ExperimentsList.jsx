import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExperiments } from '../../services/api';
import Card from '../../components/base/Card/Card';
import Container from '../../components/base/Container/Container';
import Button from '../../components/base/Button/Button';
import LoadingErrorCard from '../../components/base/LoadingErrorCard/LoadingErrorCard';
import { ChevronRight } from 'lucide-react';
import './ExperimentsList.css';

const ExperimentsList = () => {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExperiments();
      setExperiments(data);
    } catch (err) {
      setError('Failed to load experiments. Please try again.');
      console.error('Error loading experiments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExperimentClick = (experimentName) => {
    navigate(`/experiments/${experimentName}`);
  };

  return (
    <div className="experiments-page">
      <Container size="lg">
        <div className="experiments-content">
          <div className="experiments-header">
            <h1>Brain Model Experiments</h1>
            <p>View and analyze your neural network experiments. Select an experiment to explore detailed results and insights.</p>
          </div>

          <LoadingErrorCard
            isLoading={loading}
            error={error}
            onRetry={loadExperiments}
            loadingMessage="Loading experiments..."
            errorMessage="Failed to load experiments"
          >
            <div className="experiments-grid">
              {experiments.map((experiment) => (
                <Card
                  key={experiment}
                  hoverable
                  className="experiment-card"
                  onClick={() => handleExperimentClick(experiment)}
                >
                  <div className="experiment-card-content">
                    <div className="experiment-header">
                      <h3 className="experiment-title">{experiment}</h3>
                      <ChevronRight className="chevron-icon" />
                    </div>
                    
                    <p className="experiment-description">
                      View detailed analysis and results
                    </p>

                    <Button
                      variant="ghost"
                      className="experiment-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExperimentClick(experiment);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </LoadingErrorCard>
        </div>
      </Container>
    </div>
  );
};

export default ExperimentsList;