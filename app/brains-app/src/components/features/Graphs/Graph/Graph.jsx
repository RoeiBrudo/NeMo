import { useState, useEffect } from 'react';

import { fetchGraphData } from '../../../../services/api';
import LoadingErrorCard from '../../../../components/base/LoadingErrorCard/LoadingErrorCard';
import LineGraph from '../../../../components/features/Graphs/LineGraph/LineGraph';

import './Graph.css';



const Graph = ({ experimentName, analysisName, graphName }) => {
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const loadGraphData = async () => {
        if (!graphName) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await fetchGraphData(experimentName, analysisName, graphName);
            setGraphData(data);
        } catch (err) {
            setError('Failed to load graph data');
            console.error('Error loading graph:', err);
        } finally {
            setLoading(false);
        }
        };
    
        loadGraphData();
    }, [experimentName, analysisName, graphName]);
    
    if (!graphName) {
        return <div className="no-graph-selected">Select a graph to view</div>;
    }
    
    return (
        <LoadingErrorCard
        isLoading={loading}
        error={error}
        loadingMessage="Loading graph data..."
        errorMessage="Failed to load graph data"
        >
        <div className="graph-container">
            <div className="graph-placeholder">
            <h3>{graphName}</h3>
            {graphData && graphData.graph_type === 'lines' ? (
                <LineGraph data={graphData} />
                ) : (
                <div className="graph-placeholder">
                    <h3>{graphName}</h3>
                    <pre>{JSON.stringify(graphData, null, 2)}</pre>
                </div>
                )}
            </div>
        </div>
        </LoadingErrorCard>
    );
    };

    export default Graph;