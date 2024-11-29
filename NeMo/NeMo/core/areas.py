from dataclasses import dataclass
import logging
from abc import abstractmethod
from copy import deepcopy
from typing import List

import numpy as np


@dataclass
class AreaConfig:
    name: str
    n: int
    k: int or None


class BrainArea:
    def __init__(self, config):
        self.name = config.name
        self.n = config.n
        self.output_areas = []

    def connect_output(self, other_area):
        self.output_areas.append(other_area)

    @abstractmethod
    def __str__(self):
        pass

    @abstractmethod
    def fire(self, **kwargs):
        pass


class SensoryArea(BrainArea):
    def __init__(self, config):
        super().__init__(config)

    def __str__(self):
        s = f'Sensory Area {self.name}: '
        s += f', Output Areas {self.output_areas} \n'
        return s

    def fire(self, stimulus):
        for output_compute_area in self.output_areas:
            output_compute_area.stimulate(stimulus=stimulus, area_name=self.name)
            logging.debug(f'{self.name} fired to {output_compute_area.name}, shape: {stimulus.shape}, spikes: {np.count_nonzero(stimulus)}')
        return stimulus


class ComputeArea(BrainArea):
    def __init__(self, config):
        super().__init__(config)
        self.input_weights: dict[str: np.ndarray] = {}
        self.input_queue: List[tuple[str, np.ndarray]] = []
        self.k = config.k

    def __str__(self):
        s = f'Compute Area {self.name}: '
        s += f', Input Areas {list(self.input_weights.keys())}'
        s += f', Output Areas {self.output_areas} \n'
        return s

    def connect_input(self, other_area: BrainArea, p):
        p_shape = [self.n, other_area.n]
        Pa1a2 = np.zeros(p_shape) + p

        if self is other_area:
            for i in range(self.n):
                Pa1a2[i, i] = 0

        weights = np.random.binomial(1, Pa1a2).astype(np.float32)
        self.input_weights[other_area.name] = normalize_matrix(weights)

    def stimulate(self, stimulus, area_name):
        self.input_queue.append((area_name, stimulus))

    def _aggregate_all_stimulus(self):
        stimulated_state = np.zeros((self.n, 1))
        while len(self.input_queue) != 0:
            area_name, stimulus = self.input_queue.pop()
            stimulated_state += self.input_weights[area_name] @ stimulus

        logging.debug(f'agg: {self.name} state: non zeros: {np.count_nonzero(stimulated_state)}')
        stimulated_state = stimulated_state
        return stimulated_state

    def _cap_k(self, stimulated_state):
        spikes = np.zeros_like(stimulated_state)
        logging.debug(f'cap start: {self.name} state: non zeros: {np.count_nonzero(stimulated_state)}')

        nonzero_count = np.count_nonzero(stimulated_state)
        if nonzero_count <= self.k:
            maxes = np.nonzero(stimulated_state)
        else:
            maxes = np.argpartition(stimulated_state[:, 0], -self.k)[-self.k:]

        spikes[maxes, 0] = 1

        logging.debug(f'spikes: {self.name} spikes: non zeros: {np.count_nonzero(spikes)}')
        return spikes

    def _apply_hebbian(self, self_spikes, input_spikes, beta):
        for (area_name, area_spikes) in input_spikes:
            input_weights = self.input_weights[area_name]
            spikes_binary_mat = self_spikes @ area_spikes.T
            updated_weights = (1 + beta * spikes_binary_mat) * input_weights
            self.input_weights[area_name] = updated_weights

            logging.debug(f'hebbian update: {self.name} {area_name}: max weight: {self.input_weights[area_name].max().max()}')

    def fire(self, beta):
        input_queue_copy = deepcopy(self.input_queue)
        stimulated_state = self._aggregate_all_stimulus()
        spikes = self._cap_k(stimulated_state) if np.count_nonzero(stimulated_state) != 0 else np.zeros((self.n, 1))

        if beta != 0:
            self._apply_hebbian(spikes, input_queue_copy, beta)

        for output_compute_area in self.output_areas:
            output_compute_area.stimulate(stimulus=spikes, area_name=self.name)
            logging.debug(f'{self.name} fired to {output_compute_area.name}, shape: {spikes.shape}, spikes: {np.count_nonzero(spikes)}')

        return spikes

    def normalize_weights(self):
        for area_name in self.input_weights.keys():
            self.input_weights[area_name] = normalize_matrix(self.input_weights[area_name])
            logging.debug(f'{self.name} <- {area_name} homeostasis')

    def rest(self):
        self.input_queue = []


def normalize_matrix(matrix):
    row_sums = matrix.sum(axis=1, keepdims=True)
    return matrix / row_sums
