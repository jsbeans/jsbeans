#!/bin/bash

image=antiplag_jsbeans
name=$image"_1"

docker run -t --name $name \
    --restart=always \
    -p 8888:80 \
    -v $(pwd)/$name/repo:/root/.antiplag \
    -v $(pwd)/$name/logs:/root/jsbeans/jsb-application/logs \
    -v $(pwd)/$name/config:/root/jsbeans/jsb-application/external_config \
    $image

