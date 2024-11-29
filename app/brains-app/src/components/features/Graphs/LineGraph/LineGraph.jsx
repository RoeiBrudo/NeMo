import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './LineGraph.css';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#ea580c']
  
const formatLegend = (label, beta) => {
  if (label == 'beta'){
    return `β = ${beta}`
  }

  else {
    return `${label}: ${beta}`
  }
    
  return 
};

const LineGraph = ({ data }) => {
  const [visibleLines, setVisibleLines] = useState(
    Object.keys(data.data).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  const [hoveredLine, setHoveredLine] = useState(null);

  // Transform data for Recharts
  const chartData = useMemo(() => {
    return data.data[Object.keys(data.data)[0]].map((_, index) => {
      const point = { timestep: index };
      Object.keys(data.data).forEach(key => {
        point[key] = data.data[key][index];
      });
      return point;
    });
  }, [data]);

  const handleLegendClick = (entry) => {
    setVisibleLines(prev => ({
      ...prev,
      [entry.dataKey]: !prev[entry.dataKey]
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="custom-tooltip">
        <p className="tooltip-title">Timestep: {label}</p>
        <div className="tooltip-content">
          {payload
            .filter(item => visibleLines[item.dataKey])
            .map((item, index) => (
              <div 
                key={item.dataKey} 
                className="tooltip-item"
                style={{ borderLeftColor: COLORS[index] }}
              >
                <span className="tooltip-label">{formatLegend(data.label, item.dataKey)}:</span>
                <span className="tooltip-value">{item.value.toFixed(2)}</span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const CustomLegend = ({ payload }) => (
    <div className="custom-legend">
      {payload.map(entry => (
        <button
          key={entry.dataKey}
          className={`legend-item ${!visibleLines[entry.dataKey] ? 'inactive' : ''} ${hoveredLine === entry.dataKey ? 'hovered' : ''}`}
          onClick={() => handleLegendClick(entry)}
          onMouseEnter={() => setHoveredLine(entry.dataKey)}
          onMouseLeave={() => setHoveredLine(null)}
        >
          <span 
            className="legend-color" 
            style={{ backgroundColor: COLORS[entry.dataKey] }}
          />
          <span className="legend-label">{formatLegend(data.label, entry.dataKey)}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="line-graph-container">
      <h3 className="graph-title">{data.y} splitted by {data.label}</h3>
      <div className="graph-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="timestep"
              label={{ 
                value: data.x,
                position: 'insideBottom',
                offset: -10
              }}
            />
            <YAxis
              label={{
                value: data.y,
                angle: -90,
                position: 'insideLeft',
                offset: -10
              }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {Object.keys(data.data).map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index]}
                strokeWidth={hoveredLine === key ? 3 : 2}
                dot={false}
                opacity={hoveredLine && hoveredLine !== key ? 0.2 : 1}
                hide={!visibleLines[key]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineGraph;