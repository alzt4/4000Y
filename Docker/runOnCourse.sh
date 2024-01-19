#!/usr/bin/bash
#
#
#
# Written by: Adrian Lim Zheng Ting
#
# Description: runs the runDocker.sh script on every student folder in a folder
#
# Usage: sudo ./runOnCourse.sh <unit test> <Course folder>, where 
#	<Course folder> is a folder containing student folders, and
#	<unit test> is the path to the unit test file which works for
# 	all files in each student folder in the Course folder. Absolute
#	paths only.
#
#
# Example file structure:
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
# Example usage: sudo ./runOnCourse.sh /ExampleCourse/unit_test.py 
#		  /ExampleCourse
#
#
#===========================================================================


#check if the user rememebered to input the arguments
if [ -z ${2} ]; then
	echo You forgot to supply an argument on the command line!
	exit 1
fi

# we assume that the runDocker.sh and Dockerfile files are in the same 
# directory as this script


SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

COURSEFOLDER=${2}


#check if the directory exists
if [ ! -d ${2} ]; then
	echo Directory does not exist
	exit 2
fi


REQUIRED_PKG="jq"
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' $REQUIRED_PKG|grep "install ok installed")
echo Checking for $REQUIRED_PKG: $PKG_OK
if [ "" = "$PKG_OK" ]; then
  echo "No $REQUIRED_PKG. Setting up $REQUIRED_PKG."
  sudo apt --yes install $REQUIRED_PKG
fi


for file in ${COURSEFOLDER}/*/; do
	./runDockerPy.sh "${1}" "${file%/}"

done

jq -n 'reduce inputs as $s (.; .[input_filename|split("/")|.[-1]| rtrimstr(".json")] += $s)'\
	 ${COURSEFOLDER}/*/*.json > result.json

for file in ${COURSEFOLDER}/*/; do 
	rm "${file}$(basename ${file}).json"
done
exit ${?}
