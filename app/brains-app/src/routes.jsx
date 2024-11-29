import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Demo from './pages/Demo/Demo';
import ExperimentsList from './pages/ExperimentsList/ExperimentsList';
import ExperimentResults from './pages/ExperimentResults/ExperimentResults';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/experiments" element={<ExperimentsList />} />
      <Route path="/experiments/:experimentName" element={<ExperimentResults />} />


      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;