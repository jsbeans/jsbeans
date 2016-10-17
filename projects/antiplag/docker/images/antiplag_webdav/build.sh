#!/bin/bash

. ../build-base.sh

image_init() {
    build_github_image dockerfile/ubuntu
}

start $@