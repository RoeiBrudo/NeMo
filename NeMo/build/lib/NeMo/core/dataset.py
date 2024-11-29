from typing import List
import numpy as np


class SpikesDataset:
    def __init__(self, classes, probabilities):
        n = probabilities.shape[1]
        c = len(classes)
        self.n: int = n

        assert isinstance(classes, list)
        self.classes: List = classes
        self.probabilities: np.ndarray[(c, n)] = probabilities

    def sample(self, labels_list, T):
        sample_probabilities = np.zeros((len(labels_list), T, self.n))

        for i, ci in enumerate(labels_list):
            ci = int(ci)
            sample_probabilities[i, :, :] = np.vstack([self.probabilities[ci, :]]*T)
        samples = np.random.binomial(1, sample_probabilities).astype(np.float16)

        return [samples]

    def no_spikes(self, T):
        return np.zeros((T, self.n))

