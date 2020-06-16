#!/usr/bin/env bash
docker build -t jcharante/cas-web . && docker push jcharante/cas-web && docker-machine ssh queen-1 'docker service update --image jcharante/cas-web cas-web'
