import React from 'react';
import Split from './Split/Split';
import { ELEMENT_TYPES } from './types';
import Panel from './Panel/Panel';
import './DynamicPanelLayout.css'
import './styles/divider.css'
import './styles/RestorePanel.css'


const DynamicPanelLayout = ({ config, className, style, onPanelClose }) => {
  return (
    <div className={`dynamic-panel-layout ${className || ''}`} style={style}>
      {config.type === ELEMENT_TYPES.PANEL ? (
        <Panel config={config} onClose={onPanelClose} />
      ) : (
        <Split config={config} onPanelClose={onPanelClose} />
      )}
    </div>
  );
};

export default DynamicPanelLayout;