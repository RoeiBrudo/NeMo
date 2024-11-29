// src/components/base/CardContent/CardContent.jsx
import { useState, useRef, useEffect } from 'react';
import './CardContent.css';

export const CardContent = ({ 
  title,
  children,
  defaultExpanded = false,
  className = '',
  icon,
  badge,
  disabled = false,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const handleToggle = () => {
    if (!disabled) {
      const newExpandedState = !isExpanded;
      setIsExpanded(newExpandedState);
      if (onToggle) onToggle(newExpandedState);
    }
  };

  return (
    <div className={`card-content ${disabled ? 'disabled' : ''} ${className}`}>
      <button
        className={`content-header ${isExpanded ? 'expanded' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        type="button"
      >
        <div className="header-content">
          {icon && <span className="content-icon">{icon}</span>}
          <h4 className="content-title">{title}</h4>
          {badge && <span className="content-badge">{badge}</span>}
        </div>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
          {isExpanded ? '−' : '+'}
        </span>
      </button>
      
      <div 
        ref={contentRef}
        className={`content-body ${isExpanded ? 'expanded' : ''}`}
        style={{
          '--content-height': `${contentHeight}px`
        }}
      >
        <div className="content-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export const CardContentList = ({ 
  items = [],
  allowMultiple = true,
  onChange,
}) => {
  const [expandedItems, setExpandedItems] = useState(
    items.reduce((acc, item, index) => {
      if (item.defaultExpanded) acc.add(index);
      return acc;
    }, new Set())
  );

  const handleItemToggle = (index, isExpanded) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (isExpanded) {
        if (!allowMultiple) next.clear();
        next.add(index);
      } else {
        next.delete(index);
      }
      if (onChange) onChange(Array.from(next));
      return next;
    });
  };

  return (
    <div className="card-content-list">
      {items.map((item, index) => (
        <CardContent
          key={item.id || index}
          title={item.title}
          icon={item.icon}
          badge={item.badge}
          disabled={item.disabled}
          defaultExpanded={expandedItems.has(index)}
          className={item.className}
          onToggle={(isExpanded) => handleItemToggle(index, isExpanded)}
        >
          {item.content}
        </CardContent>
      ))}
    </div>
  );
};