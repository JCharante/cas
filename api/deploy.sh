#!/usr/bin/env bash
docker build -t jcharante/cas-api . && docker push jcharante/cas-api && docker-machine ssh queen-1 'docker service create --name cas-api -p 3300:3300 jcharante/cas-api'
