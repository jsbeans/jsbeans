#!/bin/bash

image=antiplag_jsbeans
name=$image"_1"

docker stop $name
docker rm $name
