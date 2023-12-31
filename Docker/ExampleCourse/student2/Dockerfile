# assuming dockerfile is in the same directory as a folder called 
# "student_module_host" (which will be unique to every student in the future)
# There should be the .py and unit_test.py file in there
# In other words, the backend will unzip the student's files, and insert
#       the instructor's unit test into one folder (which we call 
#       student_module_host)
# 1. New image, makes a folder in /testing/student_module
# 2. check the requirements.txt and get them (in the future)
# 3. Then we switch to another image
# 4. We get the prerequisite files, minus pip, as we do not want to give
#       students access to that
# 5. we copy from the previous image the required libraries
# 6. we copy the files to be tested from the host machine 
# 7. we test that file, output to xml which we can retrieve

#
#
# build stage
FROM debian:stable-slim AS build

# install prerequisites
RUN apt-get update && apt-get install -y python3 python3-pip

# make the testing directory for the prerequisites
RUN mkdir -p /testing/student_module

# some other code here that will check for requirements.txt
# we will handle this later, so we can validate what pip gets
# then some other code here that will use pip and install to that folder

#
#
# test build

FROM debian:stable-slim
ENV PYTHONUNBUFFERED = 1
# install prerequisites again (but not pip, we don't want students to have 
#       access to that)
RUN apt-get update && apt-get install -y python3

# in theory this would copy over the required libraries as well
COPY --from=build /testing/student_module /testing/student_module

# copy in the code from the host machine into the image
COPY student_module /testing/student_module

# go into the working folder
WORKDIR /testing/student_module

# run the test and output to file
CMD python3 -u -m unittest -v unit_test.py