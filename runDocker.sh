#!/usr/bin/bash
# builds and runs unit tests
# use with sudo runDocker.sh <directory containing student file named "main"
# and unit test file named unit_test.py or cpp
#===========================================================================


docker build -t testing_image -f Dockerfile.
docker run -it --name testing_container testing_image
docker logs testing_container > result.txt
docker rm -f testing_container
docker image rm testing_image

exit ${?}