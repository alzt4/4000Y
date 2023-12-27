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

TESTFOLDER = ${1}/student_module

#check if the directory exists
if [ ! -d TESTFOLDER ]; then
	echo Directory does not exist
	exit 2
fi

cp unit_test.py $TESTFOLDER
co Dockerfile $TESTFOLDER

docker build -t testing_image -f Dockerfile .
docker run -it --name testing_container testing_image
docker logs testing_container > result.txt
docker rm -f testing_container
docker image rm testing_image
docker system prune -a

rm ${TESTFOLDER}/unit_test.py
rm ${TESTFOLDER}/Dockerfile

exit ${?}