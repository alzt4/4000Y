#include "gtest/gtest.h"
#include "Source.h"


TEST(testTestSum, simpleAdditionTest)
{
	EXPECT_EQ(test_sum(1, 2), 3);
}

TEST(testTestSum, expectedFailTest) {
	EXPECT_EQ(test_sum(1, 3), 3);
}
