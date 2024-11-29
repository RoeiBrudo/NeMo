// src/components/layout/Navbar/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link-active' : '';
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link 
          to="/" 
          className={`nav-brand ${isActive('/')}`}
        >
          <span className="brand-text">NeMo Brain</span>
        </Link>
        
        <nav className="nav-links">
        <Link 
            to="/experiments" 
            className={`nav-link ${isActive('/experiments')}`}
          >
            Experiments
          </Link>

          <Link 
            to="/demo" 
            className={`nav-link ${isActive('/demo')}`}
          >
            Demo
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;