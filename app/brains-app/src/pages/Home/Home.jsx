// src/pages/Home/Home.jsx
import Card from '../../components/base/Card/Card';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to NeMo Brain Model</h1>
        <p className="hero-description">
          Explore and analyze experimental results from our advanced neural modeling system.
        </p>
      </section>

      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <Card hoverable className="feature-card">
            <h3>Real-time Visualization</h3>
            <p>View neural activity and patterns as they unfold in your experiments.</p>
          </Card>

          <Card hoverable className="feature-card">
            <h3>Data Analysis</h3>
            <p>Comprehensive tools for analyzing experimental results and neural patterns.</p>
          </Card>

          <Card hoverable className="feature-card">
            <h3>Experiment Management</h3>
            <p>Organize and track multiple experiments with our intuitive interface.</p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;