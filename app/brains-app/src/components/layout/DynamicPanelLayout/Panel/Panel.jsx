import React from 'react';
import { X } from 'lucide-react';
import './Panel.css'

const Panel = ({ config, onClose }) => {
  return (
    <div className="panel">
      <div className="panel-header">
        <button 
          className="panel-close-btn" 
          onClick={() => onClose?.(config.id)}
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
        <h3>{config.title}</h3>
      </div>
      <div className="panel-content">
        {config.content}
      </div>
    </div>
  );
};

export default Panel;