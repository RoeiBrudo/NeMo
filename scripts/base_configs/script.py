import os
import logging
import json
from copy import deepcopy

from NeMo.core.dataset import SpikesDataset
from NeMo.core.areas import AreaConfig
from NeMo.core.brain import BrainConfig, Brain

from NeMo.experiments.function import DatasetLearningConfig, learn_dataset, read_dataset
from NeMo.datasets.linear import generate_classes_probs
from NeMo.analysis.assemblies import create_unique_n_fired
from base_configs.config import (N_CLASSES, N, K, CLASSES,
                                 C_SIZE, K_SIZE, DENSITY_P,
                                 T_learning, T_reading, HOMEOSTASIS_ITR,
                                 OUT)

BETAS = [0.1, 0.05, 0.01, 0.005, 0.001]

logging.basicConfig(level=logging.INFO)

recurrent_config = BrainConfig(
    sensory_areas_configs=[AreaConfig('S1', N, None)],
    compute_areas_configs=[AreaConfig('C1', C_SIZE, K_SIZE)],
    areas_connections={('C1', 'C1'): DENSITY_P, ('S1', 'C1'): DENSITY_P}
)

forward_config = BrainConfig(
    sensory_areas_configs=[AreaConfig('S1', N, None)],
    compute_areas_configs=[AreaConfig('C1', C_SIZE, K_SIZE)],
    areas_connections={('S1', 'C1'): DENSITY_P}
)

brains = {'recurrent': Brain(recurrent_config),
          'forward': Brain(forward_config)}

stimulus_probabilities = generate_classes_probs(N_CLASSES, N, K, 1)
distribution_probabilities = generate_classes_probs(N_CLASSES, N, K, 0.9)

datasets = {'single-stimulus': SpikesDataset(CLASSES, stimulus_probabilities),
            'distribution': SpikesDataset(CLASSES, distribution_probabilities)}


def run_brains():
    for brain_name, brain in brains.items():
        for dataset_name, dataset in datasets.items():
            for beta in BETAS:
                learning_config = DatasetLearningConfig(T_learning, T_reading, beta, HOMEOSTASIS_ITR)
                new_brain = deepcopy(brain)
                logging.info(f'Running.... , {brain_name} {dataset_name} beta: {beta}')
                learn_dataset(new_brain, dataset, learning_config)
                brain_path = os.path.join(OUT, 'brains', brain_name, dataset_name, f'beta-{beta}')
                os.makedirs(brain_path)
                new_brain.save(brain_path)

                graph_data = {beta: create_unique_n_fired(new_brain.logger.areas_spikes_dict['C1'])}
                graph_json = {'graph_type': "lines", 'label': 'beta',
                              'x': 'LearningTime', 'y': '# Neurons Fired',
                              'data': graph_data}

                graph_path = os.path.join(OUT, 'analysis', 'assemblies_sizes')
                os.makedirs(graph_path, exist_ok=True)
                json.dump(graph_json, open(os.path.join(graph_path, f'{brain_name}_{dataset_name}.json'), 'w'))


def run_analysis():
    for brain_name, brain in brains.items():
        for dataset_name, dataset in datasets.items():

            graph_data = {}
            for beta in BETAS:
                brain_path = os.path.join(OUT, 'brains', brain_name, dataset_name, f'beta-{beta}')
                brain.load(brain_path)
                graph_data[beta] = create_unique_n_fired(brain.logger.areas_spikes_dict['C1'])

            graph_json = {'graph_type': "lines", 'label': 'beta',
                          'x': 'LearningTime', 'y': '# Neurons Fired',
                          'data': graph_data}
            graph_path = os.path.join(OUT, 'analysis', 'assemblies_sizes')
            os.makedirs(graph_path, exist_ok=True)
            json.dump(graph_json, open(os.path.join(graph_path, f'{brain_name}_{dataset_name}.json'), 'w'))


if __name__ == '__main__':
    run_brains()
    run_analysis()
    