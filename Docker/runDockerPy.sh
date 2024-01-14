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
TESTFOLDER=${STUDENTFOLDER}/student_module


#check if the directory exists
if [ ! -d ${TESTFOLDER} ]; then
	echo Directory does not exist
	exit 2
fi

# remember: we assume that the unit test file is one level up from where 
# the student file is
cp -p ${1} ${TESTFOLDER}
cp -p ${SCRIPTPATH}/Dockerfile ${STUDENTFOLDER}

cd ${STUDENTFOLDER}
docker build -t testing_image -f Dockerfile .
docker run -it --name testing_container testing_image
docker logs testing_container > result.txt
docker cp /testing/student_module/result.json result.json
docker rm -f testing_container
docker image rm testing_image
docker container prune -f

cd ../

rm ${TESTFOLDER}/unit_test.py
rm ${STUDENTFOLDER}/Dockerfile

exit ${?}
