#!/usr/bin/bash
# builds and runs unit tests
# use with sudo runDocker.sh <directory containing student file named "main"
# and unit test file named unit_test.py> or cpp
#===========================================================================
#check if the user rememebered to input the arguments
if [ -z $1 ]; then
	echo You forgot to supply an argument on the command line!
	exit 1
fi
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
STUDENTFOLDER=${SCRIPTPATH}/${1}
TESTFOLDER=${STUDENTFOLDER}/student_module


#check if the directory exists
if [ ! -d ${TESTFOLDER} ]; then
	echo Directory does not exist
	exit 2
fi

cp ${SCRIPTPATH}/unit_test.py ${TESTFOLDER}
cp ${SCRIPTPATH}/Dockerfile ${STUDENTFOLDER}

cd ${STUDENTFOLDER}
docker build -t testing_image -f Dockerfile .
docker run -it --name testing_container testing_image
docker logs testing_container > result.txt
docker rm -f testing_container
docker image rm testing_image
docker container prune -f
cd ../
rm ${TESTFOLDER}/unit_test.py
rm ${STUDENTFOLDER}/Dockerfile

exit ${?}
