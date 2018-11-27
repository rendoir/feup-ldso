#!/bin/bash

docker login -u ${CI_REGISTRY_USER} -p ${CI_REGISTRY_PASSWORD} ${CI_REGISTRY}
cd /root/home/LDSO
docker-compose pull
docker-compose up -d