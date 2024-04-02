#!/usr/bin/bash
#
#
# Written by: Adrian Lim Zheng Ting
#
#
# Description :  builds and runs unit tests
# Usage: sudo ./runDocker.sh <unit_test> <directory containing another 
#	another directory, which then contains all the student's files>
#
# Example: sudo ./runDocker.sh ExampleCourse/unit_test.py 
#	   ExampleCourse/student1
#
#
#===========================================================================
#check if the user rememebered to input the arguments
if [ -z ${2} ]; then
	echo You forgot to supply an argument on the command line!
	exit 1
fi

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
STUDENTFOLDER=${2}
TESTFOLDER=${STUDENTFOLDER}


#check if the directory exists
if [ ! -d ${TESTFOLDER} ]; then
	echo $TESTFOLDER
	echo Directory does not exist
	exit 2
fi

# should be an absolute path to the folder containing the unit_test.cpp file
cp -p ${1} ${TESTFOLDER}

# we are assuming that the custom gtest main file is in the same folder as
# wherever this script is
cp -p ${SCRIPTPATH}/DockerfileCpp ${STUDENTFOLDER}
cp -p ${SCRIPTPATH}/GTestCustom.cpp ${TESTFOLDER}

cd ${STUDENTFOLDER}

# build and run
docker build -t testing_image -f DockerfileCpp . &>/dev/null
docker run --name testing_container testing_image &>/dev/null
# copy out the result.json file from the container to the host
docker cp testing_container:/testing/student_module/result.json -| tar x -O | base64
# clean-up
docker rm -f testing_container &>/dev/null
docker image rm testing_image &>/dev/null
docker container prune -f &>/dev/null

cd ../

# clean up the files we copied in previously
rm ${TESTFOLDER}/unit_test.cpp
rm ${TESTFOLDER}/GTestCustom.cpp
rm ${STUDENTFOLDER}/DockerfileCpp

exit ${?}
