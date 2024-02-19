#!/bin/bash 
# Debug script used to clean up any unnecessary files
#=========================================================
COURSEFOLDER=/home/trent/dockerTest/4000Y/Docker/ExampleCourse
rm -f ${COURSEFOLDER}/student1/Dockerfile
rm -f ${COURSEFOLDER}/student1/result.txt
rm -f ${COURSEFOLDER}/student1/student_module/unit_test.py
rm -f ${COURSEFOLDER}/student2/Dockerfile
rm -f ${COURSEFOLDER}/student2/result.txt
rm -f ${COURSEFOLDER}/student2/student_module/unit_test.py
