const API_BASE_URL = 'http://localhost:8000';


const fetchURL = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.log(error)
    throw error;
  }

}



export const fetchExperiments = async () => {
    return await fetchURL(`${API_BASE_URL}/experiments`);
};

export const fetchExperimentData = async (experimentName) => {
    return await fetchURL(`${API_BASE_URL}/experiment/${experimentName}`);
};

export const fetchBrainData = async (experimentName, relativeParts, brainName) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('experiment_name', experimentName);
    relativeParts.forEach(part => {
      queryParams.append('relative_parts', part);
    });
    queryParams.append('brain_name', brainName);
    return await fetchURL(`${API_BASE_URL}/brain-logs/?${queryParams}`);
  } catch (error) {
    throw error;
  }

};

export const fetchAnalysisGraphs = async (experimentName, analysisName) => {
  return await fetchURL(`${API_BASE_URL}/analysis/${experimentName}/${analysisName}`);
};

export const fetchGraphData = async (experimentName, analysisName, graphName) => {
    return await fetchURL(`${API_BASE_URL}/graphs/${experimentName}/${analysisName}/${graphName}`);
};
