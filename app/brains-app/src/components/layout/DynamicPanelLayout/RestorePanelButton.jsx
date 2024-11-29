import React from 'react';
import { ArrowLeftCircle } from 'lucide-react';

const RestorePanelButton = ({ panelTitle, onRestore }) => {
  return (
    <button 
      className="restore-panel-btn" 
      onClick={onRestore}
      title={`Restore ${panelTitle}`}
    >
      <ArrowLeftCircle size={16} />
      <span>{panelTitle}</span>
    </button>
  );
};

export default RestorePanelButton;