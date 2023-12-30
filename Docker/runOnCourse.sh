#!/usr/bin/bash

# runs the runDocker.sh script on every student folder in a folder
# use with sudo ./runOnFolder.sh <Course folder>, where <Course folder>
#	is a folder containing student folders
# Example:
# Course
# |
# L Dockerfile
# |
# L unit_test.py
# |
# L student1
# |  |
# |  L student_module
# |     |
# |     L main.py
# |     L other files
# L student2
#    |
#    L student_module
#        Lmain.py
#        Lother files
#
#
#===========================================================================


#check if the user rememebered to input the arguments
if [ -z $1 ]; then
	echo You forgot to supply an argument on the command line!
	exit 1
fi

# we assume that the runDocker.sh and  Dockerfile files are in the same 
# directory as this script
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

COURSEFOLDER=${1}


#check if the directory exists
if [ ! -d ${1} ]; then
	echo Directory does not exist
	exit 2
fi

for file in ${COURSEFOLDER}/*/; do
	STUDENTFOLDER=${file}
	TESTFOLDER=${STUDENTFOLDER}student_module

	cp ${COURSEFOLDER}/unit_test.py ${TESTFOLDER}

	# Currently I assume that the dockerfiles are inside each course folder,
	# but we can change this since it's all the same docker file anyway
	cp ${SCRIPTPATH}/Dockerfile ${STUDENTFOLDER}

	cd ${STUDENTFOLDER}
	docker build -t testing_image -f Dockerfile .
	docker run -it --name testing_container testing_image
	docker logs testing_container > result.txt
	docker rm -f testing_container
	docker image rm testing_image
	docker container prune -f
	cd ${SCRIPTPATH}

	rm ${TESTFOLDER}/unit_test.py
	rm ${STUDENTFOLDER}Dockerfile
done

exit ${?}
