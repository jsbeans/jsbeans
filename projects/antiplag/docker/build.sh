#!/bin/bash

cd images
./build.sh $@ 
[[ -n $2 ]] && {
    cd ..
    ./start-antiplag package
}

