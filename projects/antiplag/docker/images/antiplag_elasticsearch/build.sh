#!/bin/bash

. ../build-base.sh

image_init() {
    build_github_image dockerfile/ubuntu
    build_github_image dockerfile/java:oracle-java8 dockerfile/java oracle-java8
    build_github_image dockerfile/elasticsearch
}

start $@
