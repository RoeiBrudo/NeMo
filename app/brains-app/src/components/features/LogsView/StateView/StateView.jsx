// src/components/features/StateView/StateView.jsx
import './StateView.css';

const StateView = ({ 
  currentTime,
  schedule,
  resting_ind
}) => {
  // Calculate current state and timing information
  const getCurrentState = () => {
    let accumulatedTime = 0;
    
    for (const phase of schedule) {
      if (currentTime < accumulatedTime + phase.T) {
        return {
          action: phase.action,
          timeInState: currentTime - accumulatedTime,
          totalStateTime: phase.T,
          dataClass: phase.data_class
        };
      }
      accumulatedTime += phase.T;
    }
    
    // Default return if somehow we're past all states
    return {
      action: schedule[schedule.length - 1].action,
      timeInState: 0,
      totalStateTime: schedule[schedule.length - 1].T,
      dataClass: schedule[schedule.length - 1].data_class
    };
  };

  const isResting = (time) => resting_ind.includes(time + 1);
  const currentlyResting = isResting(currentTime);
  const { action, timeInState, totalStateTime, dataClass } = getCurrentState();

  return (
    <div className="brain-state-info">
      <div className="states-row">
        <div className={`state-indicator ${action}`}>
          <span>
            {action.toUpperCase()} (Class {dataClass})
          </span>
          <span className="state-time">
            {timeInState + 1} / {totalStateTime}
          </span>
        </div>
        <div className={`rest-indicator ${currentlyResting ? 'resting' : 'not-resting'}`}>
          <span>RESTING</span>
        </div>
      </div>
    </div>
  );
};

export default StateView;