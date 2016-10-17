#!/bin/bash

. ../build-base.sh


image_init() {
	build_github_image dockerfile/ubuntu
	build_github_image dockerfile/java:oracle-java8 dockerfile/java oracle-java8
}

image_update() {
    art=$(ls ../../../build/target/*.tar.gz | sort -n -t _ -k 2 | tail -1)
    echo "ARTIFACT=$art"
    cp -f $art .
    
    find *.tar.gz ! -name "$(ls *.tar.gz | sort -n -t _ -k 2 | tail -1)" -type f -exec rm -f {} +
}

image_all() {
     image_init && image_update && image_build
}

start $@