import unittest
import time
from main import test_sum

class baseUnitTest(unittest.TestCase):
    _testTimes = {}
    def setUp(self):
        self._startTime = time.time()
    def tearDown(self):
        t = time.time() - self._startTime
        self._testTimes[self.id()] = t
        print('%s: %.3f\n' % (self.id(), t))



class testCases(baseUnitTest):
    def test_test_sum(self):
        #we expect this to pass
        self.assertEqual(test_sum(1, 2), 3, "Answer should be 3")
    def test_test_sum_fail(self):
        #we expect this to fail
        self.assertEqual(test_sum(1, 3), 3, "Answer should be 3")

class customTestRunner(unittest.TextTestRunner):
    def _makeResult(self):
        result = super()._makeResult()
        super().stream.write(result.collectedDurations)
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(testCases)
    customTestRunner(verbosity=2).run(suite)
