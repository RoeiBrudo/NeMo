import os
import numpy as np


# data
N_CLASSES = 3
CLASSES = np.arange(N_CLASSES).tolist()
N = 300
K = 50
DATA_P = 0.9

# brain
C_SIZE = 1000
K_SIZE = 100
DENSITY_P = 0.1

# learning
T_learning = 50
T_reading = 10
BETA = 0.1
HOMEOSTASIS_ITR = 10

OUT = f"C:\\Users\\brudo\\Desktop\\projects\\Brain\\results\\simplest"
