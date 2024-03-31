import unittest
import numpy as np
from customTestRunner import customTestRunner   #this one is necessary to keep
from main import combineRows, translate         # this is whatever the student submits - the name of the file and the name 
                                                # of the function can be customized by the instructor

class testCases(unittest.TestCase):
    def test_combineRows(self):
        #we expect this to pass
        #expected answer:
        #[[1, 2], [3, 4]]
        np.testing.assert_array_equal(combineRows(np.array([1, 2]), np.array([3, 4])), np.array([[1, 2], [3, 4]]), "Answer wrong")
    def test_translate(self):
        #we expect this to fail
        np.testing.assert_array_equal(translate(np.array([
            [0, 0, 0, 0], 
            [0, 0, 0, 0], 
            [0, 0, 0, 0],
            [0, 0, 0, 1]
        ]), [1, 2, 3]), 
        np.array([
            [0, 0, 0, 0],
            [0, 0, 0, 0], 
            [0, 0, 0, 0],
            [1, 2, 3, 1]
        ]), "Answer wrong")

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(testCases)
    customTestRunner(verbosity=2).run(suite)