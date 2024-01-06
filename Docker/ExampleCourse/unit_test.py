import unittest
import time
from main import test_sum

class baseUnitTest(unittest.TestCase):
    def setUp(self):
        self._startTime = time.time()
    def tearDown(self):
        t = time.time() - self._startTime
        print('%s: %.3f' % (self.id(), t))
        if hasattr(self,'_outcome'):
            result = self.defaultTestResult()
            self._feedErrorsToResult(result,self._outcome.errors)
            print(result)


class testSum(baseUnitTest):
    def test_test_sum(self):
        #we expect this to pass
        self.assertEqual(test_sum(1, 2), 3, "Answer should be 3")
    def test_test_sum_fail(self):
        #we expect this to fail
        self.assertEqual(test_sum(1, 3), 3, "Answer should be 3")
    

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(testSum)
    unittest.TextTestRunner(verbosity=2).run(suite)
