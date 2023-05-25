def leveler_z_index(array):
    sorted_dict = dict(sorted(array, key=lambda item: item[1]))
    new_dict = dict()
    for i, item in enumerate(sorted_dict):
        new_dict[item] = i
    return new_dict
