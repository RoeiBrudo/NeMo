import numpy as np


def generate_classes_probs(c, n, k, p) -> np.ndarray['(c, n)', np.dtype[np.float16]]:
    classes_probabilities = np.zeros((c, n), dtype=np.float16)
    assert c*k <= n

    shift = np.random.randint(n-c*k)
    for i in range(c):
        start, end = shift+i*k, shift+(i+1)*k
        classes_probabilities[i, start:end] = p
        classes_probabilities[i, :start] = 1-p
        classes_probabilities[i, end:] = 1-p

    return classes_probabilities
