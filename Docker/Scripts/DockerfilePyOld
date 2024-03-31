# assuming dockerfile is in the same directory as a folder called 
# "student1" (which will be unique to every student in the future)
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
#RUN apt-get update && apt-get install -y python3 python3-pip
# Essentially I need to get Python 3,12 and above, but apt gets 3.11
# so this part just manually gets and installs python 3.12
# the part I need is the collectedDurations class variable in unittest,
# which only exists in 3.12 and above


#RUN apt-get update && apt-get install -y python3
RUN apt update
RUN apt --assume-yes update
RUN apt --assume-yes install wget
RUN apt --assume-yes install build-essential zlib1g-dev  libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev curl software-properties-common
RUN wget https://www.python.org/ftp/python/3.12.1/Python-3.12.1.tar.xz
RUN tar -xf Python-3.12.1.tar.xz
RUN cd Python-3.12.1; ./configure; make altinstall

# make the testing directory for the prerequisites
RUN mkdir -p /testing/student_module

# conditionally copy requirements.txt
COPY student_module/requirements.tx[t] /testing/requirements.txt

RUN apt --assume-yes install pip
# this will throw an error if there is no requirements,txt but hopefully
# we can just ignore that
RUN pip install -r /testing/requirements.txt --target /testing/student_module || true

#
#
# test stage

FROM debian:stable-slim
ENV PYTHONUNBUFFERED = 1
# install prerequisites again (but not pip, we don't want students to have 
#       access to that)
#RUN apt-get update && apt-get install -y python3
RUN apt update
RUN apt --assume-yes update
RUN apt --assume-yes install wget
RUN apt --assume-yes install build-essential zlib1g-dev  libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev curl software-properties-common
RUN wget https://www.python.org/ftp/python/3.12.1/Python-3.12.1.tar.xz
RUN tar -xf Python-3.12.1.tar.xz
RUN cd Python-3.12.1; ./configure; make altinstall
# in theory this would copy over the required libraries as well
COPY --from=build /testing/student_module /testing/student_module

# copy in the code from the host machine into the image
COPY student_module /testing/student_module

# go into the working folder
WORKDIR /testing/student_module

# run the test and output to file
CMD python3.12 ./unit_test.py

