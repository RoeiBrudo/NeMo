// src/components/base/LoadingErrorCard/LoadingErrorCard.jsx
import Card from '../Card/Card';
import Loader from '../Loader/Loader';
import './LoadingErrorCard.css';

const LoadingErrorCard = ({ 
  isLoading, 
  error, 
  onRetry,
  loadingMessage = 'Loading...',
  errorMessage = 'An error occurred.',
  children 
}) => {
  if (isLoading) {
    return (
      <Card className="loading-error-card loading-state">
        <Loader size="medium" />
        <p className="loading-message">{loadingMessage}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="loading-error-card error-state">
        <span className="error-icon">⚠️</span>
        <h3>Error</h3>
        <p className="error-message">{error || errorMessage}</p>
        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            Try Again
          </button>
        )}
      </Card>
    );
  }

  return children;
};

export default LoadingErrorCard;
