// src/pages/Analysis/Analysis.jsx
import { useState, useEffect } from 'react';
import { CardContentList } from '../../components/base/CardContent/CardContent';
import Card from '../../components/base/Card/Card';
import AnalysisGroup from '../../components/features/AnalysisGroup/AnalysisGroup';
import './Analysis.css';


const Analysis = ({ experimentName, analysisNames }) => {
  const [expandedAnalysis, setExpandedAnalysis] = useState(null);

  useEffect(() => {
    if (analysisNames?.length === 1) {
      setExpandedAnalysis(analysisNames[0]);
    }
  }, [analysisNames]);

  return (
    <div className="analysis-page">
      <Card className="analysis-card">
        <CardContentList
          items={analysisNames.map(analysis => ({
            id: analysis,
            title: analysis.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            content: (
              <AnalysisGroup
                experimentName={experimentName}
                analysisName={analysis}
              />
            ),
            defaultExpanded: analysis === expandedAnalysis,
            onToggle: (isExpanded) => {
              setExpandedAnalysis(isExpanded ? analysis : null);
            }
          }))}
          allowMultiple={false}
        />
      </Card>
    </div>
  );
};

export default Analysis;