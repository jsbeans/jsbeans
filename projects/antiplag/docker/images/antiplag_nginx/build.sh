#!/bin/bash

. ../build-base.sh

image_init() {
    build_github_image dockerfile/ubuntu
    build_github_image dockerfile/nginx
}

start $@