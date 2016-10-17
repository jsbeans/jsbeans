#!/bin/bash

name=${PWD##*/} #set module image name

build_github_image() {
    image=${1}
    base_path=${2:-$image}
    path=$base_path
    if [[ -n $3 ]]; then path=$base_path/$3; fi

    echo "*** Build module base image: $image"

    if [[ ! -d ../thirdparty/$base_path ]]; then
        repo=git://github.com/$base_path
        git clone $repo ../thirdparty/$base_path
    fi
    docker build -t="$image" ../thirdparty/$path
}

image_init() {
    build_github_image "dockerfile/ubuntu"
}

image_build() {
    echo "*** Build module image: $name"
    echo "DIR=$(pwd)"
    docker build -t $name .
}

image_all() {
    image_clean && image_init && image_build
}

image_clean() {
    docker rmi $name 2>/dev/null || return 0
}

start() {
    [ -z $1 ] && {
	echo "Command not found: Started default: all" 1>&2
	echo "Usage: \$ $0 all|init|build"
#	exit 1
    }
    op=${1:-all}
    image_$op "${@:2}"
}
