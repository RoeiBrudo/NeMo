import numpy as np


def create_unique_n_fired(spikes_matrix):
    brain_areas_fired_data = []
    unique_fired_ind_set = set()
    for t in range(spikes_matrix.shape[0]):
        unique_fired_ind_set.update(np.where(spikes_matrix[t, :] == 1)[0].tolist())
        brain_areas_fired_data.append(len(unique_fired_ind_set))
    return brain_areas_fired_data


def get_area_assemblies(schedule, area_spikes):
    assemblies = {}
    cur_t = -1

    for phase in schedule:
        cur_t += phase.T

        if phase.data_class not in assemblies.keys():
            assemblies[phase.data_class] = {}

        existing_keys = list(assemblies[phase.data_class].keys())
        existing_relevant_keys = [k for k in existing_keys if k.split('_')[0] == phase.action]
        max_ind = 1 if not existing_relevant_keys else max([int(k.split('_')[1]) for k in existing_relevant_keys])+1
        assemblies[phase.data_class][f'{phase.action}_{max_ind}'] = area_spikes[cur_t, :].tolist()

    return assemblies


def get_assemblies(brain_log, areas):
    areas_assemblies = {}
    for area in areas:
        areas_assemblies[area] = get_area_assemblies(brain_log.schedule, brain_log.areas_spikes_dict[area])
    return areas_assemblies

