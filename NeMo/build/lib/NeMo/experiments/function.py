import logging
from dataclasses import dataclass

from NeMo.core.brain import PhaseConfig


@dataclass
class DatasetLearningConfig:
    T_learning: int
    T_reading: int
    beta: float
    homeostasis_itr: int


def get_learning_actions_samples(dataset, lc_config, sensory_areas_names):
    actions, data_samples, classes_list = [], [], []
    for c in dataset.classes:
        data_sample = dataset.sample([c], lc_config.T_learning + lc_config.T_reading)
        learning_params = {'beta': lc_config.beta, 'homeostasis_itr': lc_config.homeostasis_itr}

        actions.append(PhaseConfig('learning', lc_config.T_learning, params=learning_params))
        data_samples.append({sensory_area: data_sample[i][0, :lc_config.T_learning, :] for i, sensory_area in enumerate(sensory_areas_names)})
        classes_list.append(c)

        actions.append(PhaseConfig('reading', lc_config.T_reading))
        data_samples.append({sensory_area: data_sample[i][0, lc_config.T_learning:lc_config.T_learning+lc_config.T_reading, :] for i, sensory_area in enumerate(sensory_areas_names)})
        classes_list.append(c)

    return actions, data_samples, classes_list


def learn_dataset(brain, dataset, lc_config):
    logging.info('learning dataset...')
    actions, data_samples, classes_list = get_learning_actions_samples(dataset, lc_config, list(brain.sensory_areas.keys()))
    for action, data_sample, data_class in zip(actions, data_samples, classes_list):
        brain.run_phase(data_sample, action)
        brain.rest()

        brain.logger.log_resting()
        brain.logger.schedule[-1].data_class = data_class

#######
#######


def get_reading_actions_samples(dataset, T_reading, sensory_areas_names):
    actions, data_samples, classes_list = [], [], []
    for c in dataset.classes:
        data_sample = dataset.sample([c], T_reading)

        actions.append(PhaseConfig('reading', T_reading))
        data_samples.append({sensory_area: data_sample[i][0, :, :] for i, sensory_area in enumerate(sensory_areas_names)})
        classes_list.append(c)

    return actions, data_samples, classes_list


def read_dataset(brain, dataset, T_reading):
    logging.info('learning dataset...')
    actions, data_samples, classes_list = get_reading_actions_samples(dataset, T_reading, list(brain.sensory_areas.keys()))
    for action, data_sample, data_class in zip(actions, data_samples, classes_list):
        brain.run_phase(data_sample, action)
        brain.rest()

        brain.logger.log_resting()
        brain.logger.schedule[-1].data_class = classes_list[data_class]
