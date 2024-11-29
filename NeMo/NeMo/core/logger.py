import os
import json
from dataclasses import asdict

import numpy as np

from NeMo.core.utils import PhaseConfig


class BrainLogger:
    def __init__(self, brain=None):
        self.T = -1
        self.sizes = {}
        self.areas_spikes_dict = {}
        self.schedule = []
        self.resting_ind = []

        if brain:
            self.init_from_brain(brain)

    def init_from_brain(self, brain):
        for sensory_area_name, sensory_area in brain.sensory_areas.items():
            self.sizes[sensory_area_name] = sensory_area.n

        for compute_area_name, compute_area in brain.compute_areas.items():
            self.sizes[compute_area_name] = compute_area.n

    def log_area_spikes(self, area_name, spikes):
        if area_name in self.areas_spikes_dict.keys():
            self.areas_spikes_dict[area_name] = np.concatenate([self.areas_spikes_dict[area_name], spikes.T], axis=0)
            self.T = self.areas_spikes_dict[area_name].shape[0]
        else:
            self.areas_spikes_dict[area_name] = spikes.T
            self.T = 1

    def log_schedule(self, phase: PhaseConfig):
        self.schedule.append(phase)

    def log_resting(self):
        cur = 0
        for phase in self.schedule:
            cur += phase.T
        self.resting_ind.append(cur)

    def save(self, path):
        npy_path = os.path.join(path, 'spikes.npz')
        np.savez_compressed(npy_path, **self.areas_spikes_dict)

        meta = {'T': self.T,
                'sizes': self.sizes,
                'schedule': [asdict(s) for s in self.schedule],
                'resting': self.resting_ind}

        json_path = os.path.join(path, 'meta.json')
        json.dump(meta, open(json_path, 'w'))

    def load(self, path):
        npz_path = os.path.join(path, 'spikes.npz')
        self.areas_spikes_dict = np.load(npz_path)

        json_path = os.path.join(path, 'meta.json')
        meta = json.load(open(json_path, 'r'))

        self.schedule = [PhaseConfig(**s) for s in meta['schedule']]
        self.resting_ind = meta['resting']
        self.T = meta['T']
        self.sizes = meta['sizes']

