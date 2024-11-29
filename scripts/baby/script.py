import os
import logging
import json

from NeMo.core.dataset import SpikesDataset
from NeMo.core.areas import AreaConfig
from NeMo.core.brain import BrainConfig, Brain

from NeMo.experiments.function import DatasetLearningConfig, learn_dataset, read_dataset
from NeMo.datasets.linear import generate_classes_probs
from NeMo.analysis.assemblies import get_assemblies, create_unique_n_fired
from baby.config import (N_CLASSES, N, K, DATA_P, CLASSES,
                         C_SIZE, K_SIZE, DENSITY_P,
                         T_learning, T_reading, BETA, HOMEOSTASIS_ITR,
                         OUT)

logging.basicConfig(level=logging.INFO)


BRAIN_OUT = os.path.join(OUT, 'brains', 'baby-brain')
os.makedirs(BRAIN_OUT, exist_ok=True)

ANALYSIS_OUT = os.path.join(OUT, 'analysis', 'assemblies_sizes')
os.makedirs(ANALYSIS_OUT, exist_ok=True)


CLASSES_PROBABILITIES = generate_classes_probs(N_CLASSES, N, K, DATA_P)
DATASET = SpikesDataset(CLASSES, CLASSES_PROBABILITIES)


config = BrainConfig(
    sensory_areas_configs=[AreaConfig('S1', N, None)],
    compute_areas_configs=[AreaConfig('C1', C_SIZE, K_SIZE)],
    areas_connections={('C1', 'C1'): DENSITY_P, ('S1', 'C1'): DENSITY_P}
)

LEARNING_CONFIG = DatasetLearningConfig(T_learning, T_reading, BETA, HOMEOSTASIS_ITR)


brain = Brain(config)


def run_brain():
    logging.info(f'Running.... , p: {DATA_P}, beta: {BETA}')
    learn_dataset(brain, DATASET, LEARNING_CONFIG)
    read_dataset(brain, DATASET, T_reading)
    brain.save(BRAIN_OUT)


def run_analysis():
    brain.load(BRAIN_OUT)
    assemblies_dict = get_assemblies(brain.logger, ['C1'])
    graphs_path = os.path.join(BRAIN_OUT, 'logs_analysis')
    os.makedirs(graphs_path, exist_ok=True)
    graph_json = {'graph_type': "assemblies",
                  'areas': ['C1'],
                  'classes': DATASET.classes,
                  'data': assemblies_dict}

    json.dump(graph_json, open(os.path.join(graphs_path, 'assemblies.json'), 'w'))
    print(assemblies_dict)

    graph_data = {}
    cur_t = 0
    for phase in brain.logger.schedule:
        if phase.action == 'learning':
            graph_data[phase.data_class] = create_unique_n_fired(brain.logger.areas_spikes_dict['C1'][cur_t:cur_t+phase.T])
            cur_t += phase.T

    graph_json = {'graph_type': "lines",
                  'label': 'Class',
                  'x': 'LearningTime', 'y': '# Neurons Fired',
                  'data': graph_data}

    json.dump(graph_json, open(os.path.join(ANALYSIS_OUT, 'assemblies_sizes.json'), 'w'))


if __name__ == '__main__':
    run_brain()
    run_analysis()
