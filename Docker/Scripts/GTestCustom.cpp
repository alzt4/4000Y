// GTestCustom.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include "gtest/gtest.h"

int main(int argc, char** argv) {

	::testing::GTEST_FLAG(output) = "json:result.json";
	testing::InitGoogleTest(&argc, argv);

	return RUN_ALL_TESTS();
}
