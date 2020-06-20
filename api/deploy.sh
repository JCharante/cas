#!/usr/bin/env bash
CMD="docker service create --name cas-api -p 3300:3300 -e MONGO_URI=\"${CAS_MONGO_URI}\" jcharante/cas-api"
CONT="docker-machine ssh queen-1 '${CMD}'"
docker build -t jcharante/cas-api . && docker push jcharante/cas-api && eval "docker-machine ssh queen-1 '${CMD}'"
