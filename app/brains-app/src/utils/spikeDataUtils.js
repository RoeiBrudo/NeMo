// src/utils/spikeDataUtils.js
export function processSpikesData(spikesArray, T, areaSize) {
    // Create a T x areaSize array filled with zeros
    const fullSpikesArray = Array(T).fill(0).map(() => Array(areaSize).fill(0));
    
    // Fill in the 1s from the spikes data
    spikesArray.forEach(([t, ind]) => {
      if (t < T) {
        fullSpikesArray[t][ind] = 1;
      }
    });
  
    return fullSpikesArray;
  }
  
  export function getGridDimensions(areaSize) {
    const gridSize = Math.ceil(Math.sqrt(areaSize));
    return {
      gridSize,
      totalCells: gridSize * gridSize,
      validCells: areaSize
    };
  }


  