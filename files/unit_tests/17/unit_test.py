import unittest
from customTestRunner import customTestRunner #this one is necessary to keep
from main import test_sum # the instructor can replace this with whatever

class testCases(unittest.TestCase):
    def test_test_sum(self):
        #we expect this to pass
        self.assertEqual(test_sum(1, 2), 3, "Answer should be 3")
    def test_test_sum_fail(self):
        #we expect this to fail
        self.assertEqual(test_sum(1, 3), 3, "Answer should be 3")

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(testCases)
    customTestRunner(verbosity=2).run(suite)