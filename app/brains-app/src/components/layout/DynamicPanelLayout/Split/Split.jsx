import React, { useState, useRef } from 'react';
import { SPLIT_TYPES, ELEMENT_TYPES } from '../types';
import Panel from '../Panel/Panel';
import RestorePanelButton from '../RestorePanelButton';
import './Split.css';

const Split = ({ config, onResize }) => {

  const [sizes, setSizes] = useState(
    config.defaultSizes || config.children.map(() => 100 / config.children.length)  );
  const [closedPanels, setClosedPanels] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [activeDivider, setActiveDivider] = useState(null);
  const splitRef = useRef(null);
  const initialPos = useRef(null);
  const initialSizes = useRef(null);

  const handlePanelClose = (panelId) => {
    setClosedPanels(prev => new Set([...prev, panelId]));
    
    // Get indices of open panels
    const openPanelIndices = config.children
      .map((child, index) => (!closedPanels.has(child.id) && child.id !== panelId ? index : -1))
      .filter(index => index !== -1);

    // Redistribute sizes: set closed panels to 0 and divide remaining space
    const newSizes = sizes.map((_, index) => {
      if (openPanelIndices.includes(index)) {
        return 100 / openPanelIndices.length;
      }
      return 0;
    });
    
    setSizes(newSizes);
    onResize?.(newSizes);
  };

  const handlePanelRestore = (panelId) => {
    setClosedPanels(prev => {
      const next = new Set(prev);
      next.delete(panelId);
      return next;
    });
   
    // Use config's defaultSizes if available, otherwise distribute evenly
    const newSizes = config.defaultSizes || 
      config.children.map((child) => {
        const openCount = config.children.length - (closedPanels.size - 1); 
        return closedPanels.has(child.id) && child.id !== panelId ? 0 : 100 / openCount;
      });
    
    setSizes(newSizes);
    onResize?.(newSizes);
   };
   
  const handleDividerMouseDown = (e, index) => {
    e.preventDefault();
    setIsDragging(true);
    setActiveDivider(index);
    initialPos.current = config.splitType === SPLIT_TYPES.VERTICAL ? 
      e.clientX : e.clientY;
    initialSizes.current = [...sizes];
  };

  const handleMouseMove = (e) => {
    if (!isDragging || activeDivider === null) return;

    const splitRect = splitRef.current.getBoundingClientRect();
    const currentPos = config.splitType === SPLIT_TYPES.VERTICAL ? 
      e.clientX : e.clientY;
    const totalSize = config.splitType === SPLIT_TYPES.VERTICAL ? 
      splitRect.width : splitRect.height;
    
    const pixelDelta = currentPos - initialPos.current;
    const percentDelta = (pixelDelta / totalSize) * 100;

    const newSizes = [...initialSizes.current];
    newSizes[activeDivider] = Math.max(15, 
      initialSizes.current[activeDivider] + percentDelta);
    newSizes[activeDivider + 1] = Math.max(15, 
      initialSizes.current[activeDivider + 1] - percentDelta);

    setSizes(newSizes);
    onResize?.(newSizes);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveDivider(null);
    initialPos.current = null;
    initialSizes.current = null;
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Calculate actual visible children
  const visibleChildren = config.children.filter(child => !closedPanels.has(child.id));

  return (
    <div 
      ref={splitRef}
      className={`split ${config.splitType} ${isDragging ? 'dragging' : ''}`}
    >
      {config.children.map((child, index) => (
        <React.Fragment key={child.id}>
          {closedPanels.has(child.id) ? (
            <RestorePanelButton
              panelTitle={child.title}
              onRestore={() => handlePanelRestore(child.id)}
            />
          ) : (
            <div
              className="split-child"
              style={{
                [config.splitType === SPLIT_TYPES.VERTICAL ? 'width' : 'height']: 
                  `${sizes[index]}%`,
                flex: visibleChildren.length === 1 ? '1 1 auto' : 'none'
              }}
            >
              {child.type === ELEMENT_TYPES.PANEL ? (
                <Panel 
                  config={child} 
                  onClose={handlePanelClose}
                />
              ) : (
                <Split config={child} onResize={onResize} />
              )}
            </div>
          )}
          {index < config.children.length - 1 && !closedPanels.has(child.id) && (
            <div
              className={`divider ${config.splitType}`}
              onMouseDown={(e) => handleDividerMouseDown(e, index)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Split;