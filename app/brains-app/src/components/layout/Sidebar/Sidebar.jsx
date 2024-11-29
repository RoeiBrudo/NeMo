// src/components/layout/Sidebar/Sidebar.jsx
import { ChevronRight } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ 
  title = 'Navigation',
  items = [],
  activeItem,
  onItemSelect  // Changed from onItemClick
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>{title}</h2>
      </div>
      <nav className="sidebar-nav">
        {items.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onItemSelect(item.id)}  // Changed from onItemClick
          >
            <div className="sidebar-item-icon">{item.icon}</div>
            <div className="sidebar-item-content">
              <span className="sidebar-item-label">{item.label}</span>
              {item.description && (
                <span className="sidebar-item-description">{item.description}</span>
              )}
            </div>
            <ChevronRight size={16} className="sidebar-item-arrow" />
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;