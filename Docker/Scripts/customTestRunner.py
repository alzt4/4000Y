import unittest
import json

#class testCases(unittest.TestCase):
#    def test_test_sum(self):
        #we expect this to pass
#        self.assertEqual(test_sum(1, 2), 3, "Answer should be 3")
#    def test_test_sum_fail(self):
        #we expect this to fail
#        self.assertEqual(test_sum(1, 3), 3, "Answer should be 3")

class customTestRunner(unittest.TextTestRunner):
    def run(self, test):
        result = super().run(test)
        resultDict = {
            "total":result.testsRun,
            "successes": result.testsRun - len(result.errors) - len(result.failures) - len(result.skipped) - len(result.unexpectedSuccesses),
            "failures": len(result.failures),
            "errors": len(result.errors),
            "skipped": len(result.skipped),
            "durations": result.collectedDurations
        }
        json_object = json.dumps(resultDict, indent=4)
        with open("result.json", "w+") as outfile:
            outfile.write(json_object)
        return result


