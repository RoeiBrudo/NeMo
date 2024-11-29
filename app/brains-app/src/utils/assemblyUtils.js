export const processAssemblyData = (analysisData) => {
    const assemblies = [];
    const stats = {
      averageSize: 0,
      totalAssemblies: 0,
      classSizes: {},
      phaseCounts: {},
    };
  
    // Process raw assembly data into a flat structure
    Object.entries(analysisData.assemblies.data).forEach(([area, areaData]) => {
      Object.entries(areaData).forEach(([classId, classData]) => {
        Object.entries(classData).forEach(([phase, neuronGroups]) => {
          neuronGroups.forEach(neurons => {
            assemblies.push({
              neurons,
              size: neurons.length,
              phase,
              class: parseInt(classId),
              area
            });
  
            // Update statistics
            stats.totalAssemblies++;
            stats.averageSize += neurons.length;
            stats.classSizes[classId] = (stats.classSizes[classId] || 0) + 1;
            stats.phaseCounts[phase] = (stats.phaseCounts[phase] || 0) + 1;
          });
        });
      });
    });
  
    stats.averageSize = stats.averageSize / stats.totalAssemblies;
  
    return { assemblies, stats };
  };
  
  export const getAssemblyOverlap = (assembly1, assembly2) => {
    const set1 = new Set(assembly1.neurons);
    const overlap = assembly2.neurons.filter(n => set1.has(n));
    return {
      count: overlap.length,
      percentage: (overlap.length / Math.min(assembly1.neurons.length, assembly2.neurons.length)) * 100,
      neurons: overlap
    };
  };