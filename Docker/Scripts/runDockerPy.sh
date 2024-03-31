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
# echo $STUDENTFOLDER
TESTFOLDER=${STUDENTFOLDER}


#check if the directory exists
if [ ! -d ${TESTFOLDER} ]; then
	echo Directory does not exist
	echo ${TESTFOLDER}
	exit 2
fi

# we assume that this script is stored with the docker files
cp -p ${1} ${TESTFOLDER}
cp -p ${SCRIPTPATH}/customTestRunner.py ${TESTFOLDER}
cp -p ${SCRIPTPATH}/DockerfilePy ${STUDENTFOLDER}

cd ${STUDENTFOLDER}

# build and run
docker build -t testing_image -f DockerfilePy . &>/dev/null
docker run --name testing_container testing_image &>/dev/null
# copy the .json file as base64 to stdout for grading server to process and return
docker cp testing_container:/testing/student_module/result.json - | tar x -O | base64
docker rm -f testing_container &>/dev/null
docker image rm testing_image &>/dev/null
docker container prune -f &>/dev/null

cd ../

# clean up the files we copied in previously
rm ${TESTFOLDER}/unit_test.py
rm ${TESTFOLDER}/customTestRunner.py 
rm ${STUDENTFOLDER}/DockerfilePy 

exit ${?} 
