#!/usr/bin/env bash
docker build -t jcharante/cas-web . && docker push jcharante/cas-web && docker-machine ssh queen-1 'docker service create --name cas-web -p 3301:3301 jcharante/cas-web'
