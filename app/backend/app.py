import os
import re
import glob
from typing import List
import json
from dataclasses import asdict

import numpy as np

import uvicorn
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from NeMo.core.logger import BrainLogger

EXPERIMENTS_PATH = "C:\\Users\\brudo\\Desktop\\projects\\Brain\\results"

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow only specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
def hello():
    return {'res': 'Hello'}


@app.get("/experiments")
def read_experiments():
    sub_folders = [f.name for f in os.scandir(EXPERIMENTS_PATH) if f.is_dir()]
    return sub_folders


@app.get("/experiment/{experiment_name}")
def read_experiment(experiment_name: str):
    regex = r'^(.*)(\\logs)$'
    paths_list = glob.glob(f'{EXPERIMENTS_PATH}\\{experiment_name}\\brains\\**', recursive=True)
    paths_list = [p for p in paths_list if os.path.isdir(p)]
    brains_paths = []
    for p in paths_list:
        res = re.match(regex, p)
        if res:
            path = res.group(1)
            brains_paths.append(path)

    paths = [os.path.relpath(p, f'{EXPERIMENTS_PATH}\\{experiment_name}\\brains') for p in brains_paths]

    if os.path.isdir(os.path.join(EXPERIMENTS_PATH, experiment_name, 'analysis')):
        graphs = [f.name for f in os.scandir(os.path.join(EXPERIMENTS_PATH, experiment_name, 'analysis')) if f.is_dir()]
    else:
        graphs = []
    return {'brain_logs': paths, 'analysis': graphs}


def get_barin_path(experiment_name, relative_parts, brain_name):
    experiment_path = os.path.join(EXPERIMENTS_PATH, experiment_name, 'brains')
    if relative_parts is not None:
        for part in relative_parts:
            experiment_path = os.path.join(experiment_path, part)
    brain_path = os.path.join(experiment_path, brain_name)
    return brain_path


@app.get("/brain-logs/")
async def read_brain_data(experiment_name: str = Query(default=None),
                          relative_parts: List[str] = Query(default=None),
                          brain_name: str = Query(default=None)):

    brain_path = get_barin_path(experiment_name, relative_parts, brain_name)
    logs_path = os.path.join(brain_path, 'logs')
    logger = BrainLogger()
    logger.load(logs_path)
    spikes = {area_name: np.argwhere(area_spikes == 1).tolist()
              for area_name, area_spikes in logger.areas_spikes_dict.items()}

    res = {'sizes': logger.sizes,
           'logs': {'T': logger.T, 'schedule': [asdict(p) for p in logger.schedule],
                    'resting_ind': logger.resting_ind, 'spikes': spikes},
           'analysis': read_analysis_graphs(experiment_name, relative_parts, brain_name)}

    return res


def read_analysis_graphs(experiment_name, relative_parts, brain_name):

    analysis_dict = {}

    # assemblies
    brain_path = get_barin_path(experiment_name, relative_parts, brain_name)
    logs_analysis_path = os.path.join(brain_path, 'logs-analysis')

    assemblies_path = os.path.join(logs_analysis_path, 'assemblies.json')
    if os.path.isfile(assemblies_path):
        assemblies_data = json.load(open(assemblies_path, 'r'))
        for area_name in assemblies_data['data'].keys():
            for c in assemblies_data['data'][area_name].keys():
                for k in assemblies_data['data'][area_name][c].keys():
                    assemblies_data['data'][area_name][c][k] = np.argwhere(np.array(assemblies_data['data'][area_name][c][k]) == 1).tolist()

        analysis_dict['assemblies'] = assemblies_data

    return analysis_dict


@app.get("/analysis/{experiment_name}/{analysis_name}")
def read_experiment_graphs(experiment_name: str, analysis_name: str):
    path = os.listdir(os.path.join(EXPERIMENTS_PATH, experiment_name, 'analysis', analysis_name))
    return [f[:-5] for f in path if f.endswith('json')]


@app.get("/graphs/{experiment_name}/{analysis_name}/{graph_name}")
def read_experiment_graphs(experiment_name: str, analysis_name: str, graph_name:str):
    path = os.path.join(os.path.join(EXPERIMENTS_PATH, experiment_name, 'analysis', analysis_name, f'{graph_name}.json'))
    return json.load(open(path, 'r'))


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)




