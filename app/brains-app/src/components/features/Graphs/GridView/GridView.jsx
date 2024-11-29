// src/components/features/GridView/GridView.jsx
import { processSpikesData, getGridDimensions } from '../../../../utils/spikeDataUtils';
import './GridView.css';

const GridView = ({ data, areaSize }) => {
  const { gridSize, validCells } = getGridDimensions(areaSize);

  return (
    <div className="grid-view-container">
      <div 
        className="grid-view"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`
        }}
      >
        {Array(gridSize * gridSize).fill(0).map((_, index) => (
          <div
            key={index}
            className={`grid-cell ${index < validCells ? 'valid' : 'invalid'} ${
              index < validCells && data?.[index] ? 'active' : ''
            }`}
          />
        ))}
      </div>
      {areaSize && (
        <div className="grid-info">
          <span className="grid-size">Size: {areaSize}</span>
        </div>
      )}
    </div>
  );
};

export default GridView;