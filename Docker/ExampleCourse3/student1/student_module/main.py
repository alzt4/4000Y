import numpy as np

def combineRows(array1, array2):
    a = np.concatenate((array1, array2))
    return a.reshape(2, 2)

def translate(array1, vector):
    
    array3 = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [vector[0], vector[1], vector[2], 1]])
    return np.matmul(array1, array3)
