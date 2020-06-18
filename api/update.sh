#!/usr/bin/env bash
docker build -t jcharante/cas-api . && docker push jcharante/cas-api && docker-machine ssh queen-1 'docker service update --image jcharante/cas-api cas-api'
