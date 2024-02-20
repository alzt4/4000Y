#!/usr/bin/bash
#
#
# Written by: Adrian Lim Zheng Ting
#
#
# Description : checks if all dependencies are installed (I think this works)
# Never tried it but it should
# If this script doesn't work, install docker manually
#
#
#
# Usage: sudo ./setUp.sh
#
# Example: sudo ./setUp.sh
#
#
#===========================================================================
#check if the user rememebered to input the argumen
apt-get update

#docker
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done


apt-get install ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin


#jq
apt install jq

exit ${?}
