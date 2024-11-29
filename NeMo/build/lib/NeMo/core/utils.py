from dataclasses import dataclass
from typing import Any

import numpy as np


@dataclass
class PhaseConfig:
    action: str
    T: int
    data_class: Any = None
    params: dict = None


def get_samples_generator(samples_dict):
    T = samples_dict[list(samples_dict.keys())[0]].shape[0]

    def generator():
        for t in range(T):
            t_input_dict = {}
            for sensory_area_name, sensory_sample in samples_dict.items():
                t_input_dict[sensory_area_name] = sensory_sample[t, :][..., np.newaxis]
            yield t_input_dict

    return generator(), T


