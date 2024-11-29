import os
from dataclasses import dataclass
from typing import List
import logging
import pickle

import numpy as np

from NeMo.core.areas import AreaConfig, SensoryArea, ComputeArea
from NeMo.core.logger import BrainLogger
from NeMo.core.utils import get_samples_generator, PhaseConfig


np.seterr(all='raise')


@dataclass
class BrainConfig:
    sensory_areas_configs: List[AreaConfig]
    compute_areas_configs: List[AreaConfig]
    areas_connections: dict[tuple[str, str]: float]


class Brain:
    def __init__(self, config: BrainConfig):

        self.sensory_areas: dict[str:SensoryArea] = {sensory_areas_config.name: SensoryArea(sensory_areas_config)
                                                     for sensory_areas_config in config.sensory_areas_configs}
        self.compute_areas: dict[str:ComputeArea] = {compute_areas_config.name: ComputeArea(compute_areas_config)
                                                     for compute_areas_config in config.compute_areas_configs}

        self.logger = BrainLogger(self)

        for (a1_name, a2_name), p in config.areas_connections.items():
            a1 = self.sensory_areas[a1_name] if a1_name.startswith('S') else self.compute_areas[a1_name]
            a2 = self.compute_areas[a2_name]

            a2.connect_input(a1, p)
            a1.connect_output(a2)

    def rest(self):
        for compute_area_name, compute_area in self.compute_areas.items():
            compute_area.rest()

    def learn(self, input_dict, beta, is_homeostasis):
        spikes_dict = {}
        for compute_area_name, compute_area in self.compute_areas.items():
            area_spikes = compute_area.fire(beta)
            spikes_dict[compute_area_name] = area_spikes
            self.logger.log_area_spikes(compute_area_name, area_spikes)

            if is_homeostasis:
                compute_area.normalize_weights()

        for sensory_area_name, stimulus in input_dict.items():
            area_spikes = self.sensory_areas[sensory_area_name].fire(stimulus)
            spikes_dict[sensory_area_name] = area_spikes
            self.logger.log_area_spikes(sensory_area_name, area_spikes)

    def learn_phase(self, samples_dict, beta, homeostasis_itr):
        samples, T = get_samples_generator(samples_dict)
        for t in range(T):
            t_input_dict = next(samples)
            is_homeostasis = True if homeostasis_itr != -1 and t % homeostasis_itr == 0 else False
            self.learn(t_input_dict, beta, is_homeostasis)

    def read(self, input_dict):
        self.learn(input_dict, 0, -1)

    def read_phase(self, samples_dict):
        samples, T = get_samples_generator(samples_dict)
        for t in range(T):
            t_input_dict = next(samples)
            self.learn(t_input_dict, 0, -1)

    def run_phase(self, inputs_dict, phase: PhaseConfig):
        logging.info(f'{phase.action} phase..., {phase}')
        self.logger.log_schedule(phase)
        if phase.action == 'learning':
            self.learn_phase(inputs_dict, **phase.params)
        elif phase.action == 'reading':
            self.read_phase(inputs_dict)
        else:
            raise NotImplementedError

    def save(self, path):
        areas = {'sensory': self.sensory_areas, 'compute': self.compute_areas}
        pkl_path = os.path.join(path, 'brain.pkl')
        pickle.dump(areas, open(pkl_path, 'wb'))
        logs_path = os.path.join(path, 'logs')
        os.makedirs(logs_path, exist_ok=True)
        self.logger.save(logs_path)

    def load(self, path):
        pkl_path = os.path.join(path, 'brain.pkl')
        areas = pickle.load(open(pkl_path, 'rb'))

        self.compute_areas = areas['sensory']
        self.sensory_areas = areas['compute']
        self.logger.load(os.path.join(path, 'logs'))
