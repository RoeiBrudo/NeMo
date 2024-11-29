import { useState, useEffect } from 'react';


import { fetchAnalysisGraphs } from '../../../services/api';
import DynamicPanelLayout from '../../../components/layout/DynamicPanelLayout/DynamicPanelLayout';
import { ELEMENT_TYPES, SPLIT_TYPES } from '../../../components/layout/DynamicPanelLayout/types';
import LoadingErrorCard from '../../../components/base/LoadingErrorCard/LoadingErrorCard';
import Graph from '../Graphs/Graph/Graph';
import './AnalysisGroup.css';




const GraphList = ({ graphs, activeGraph, onGraphSelect }) => (
    <div className="graph-list">
      {graphs.map((graph) => (
        <button
          key={graph}
          className={`graph-item ${activeGraph === graph ? 'active' : ''}`}
          onClick={() => onGraphSelect(graph)}
        >
          {graph}
        </button>
      ))}
    </div>
  );
  
const AnalysisGroup = ({ experimentName, analysisName }) => {
const [graphs, setGraphs] = useState([]);
const [selectedGraph, setSelectedGraph] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const loadGraphs = async () => {
    try {
        setLoading(true);
        setError(null);
        const graphsList = await fetchAnalysisGraphs(experimentName, analysisName);
        setGraphs(graphsList);
    } catch (err) {
        setError('Failed to load graphs');
        console.error('Error loading graphs:', err);
    } finally {
        setLoading(false);
    }
    };

    loadGraphs();
}, [experimentName, analysisName]);

const layoutConfig = {
    type: ELEMENT_TYPES.SPLIT,
    id: 'analysis-split',
    splitType: SPLIT_TYPES.VERTICAL,
    defaultSizes: [25, 75],
    children: [
    {
        type: ELEMENT_TYPES.PANEL,
        id: 'graphs-list',
        title: 'Graphs',
        content: (
        <LoadingErrorCard
            isLoading={loading}
            error={error}
            loadingMessage="Loading graphs..."
            errorMessage="Failed to load graphs"
        >
        <GraphList
            graphs={graphs}
            activeGraph={selectedGraph}
            onGraphSelect={setSelectedGraph}
            />
        </LoadingErrorCard>
        )
    },
    {
        type: ELEMENT_TYPES.PANEL,
        id: 'graph-view',
        title: 'Graph View',
        content: (
        <Graph
            experimentName={experimentName}
            analysisName={analysisName}
            graphName={selectedGraph}
        />
        )
    }
    ]
};

return (
    <div className="analysis-graphs">
    <DynamicPanelLayout config={layoutConfig} />
    </div>
);
};



export default AnalysisGroup;