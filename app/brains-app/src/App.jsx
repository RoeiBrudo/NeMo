import { BrowserRouter as Router } from 'react-router-dom';
// import { ExperimentProvider } from './contexts/ExperimentContext';
import AppRoutes from './routes';
import Navbar from './components/layout/Navbar/Navbar';
import './styles/variables.css';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
};

export default App;