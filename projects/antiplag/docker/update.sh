#!/bin/bash -x
#trap "set +x; sleep 1; set -x" DEBUG

default_srv=antiplag@172.16.7.1
default_name=docker

case $1 in
    upload)
        shift
        file="$1"
        shift
        srv="$1"

        localFile="$file"
        remoteFile=$(basename "$file")

        scp $localFile $srv:$remoteFile
    ;;
    install)
        shift
        srv=${1:-$default_srv}
        ./build.sh || exit $?
        echo "BUILD EXIT=$?"
        file=$(./start-antiplag.sh package | awk '/TARGET_FILE/{print $3}' || exit $?)
        echo "PACKAGE EXIT=$?"
        $0 upload $file $srv
    ;;
    update)
        shift
        name=$default_name
        lastArtifact=$(ls ../*$name*.tar.gz | sort -n -t _ -k 2 | tail -1)
        file="${1:-$lastArtifact}"
        dir="$(pwd)"
        tar xzf $file -C $dir || exit $?
        ./build.sh || exit $?
    ;;
    autoupdate)
        shift
        srv=${1:-$default_srv}
        shift
        name=${1:-$default_name}
        $0 install && ssh $srv "cd $name && $0 update && $0 restart"
    ;;
    restart)
        ./start-antiplag.sh stop && ./start-antiplag.sh startd
    ;;
    --help|-h)
        echo "Usage: \$ $0 [--help|-h]"
        echo ""
        echo "    Client side (connect to remote server):"
        echo "       \$ $0 autoupdate [<srv> <name>] # - install, upload then remote update and restart"
        echo "       \$ $0 install <srv>             # - build images, package application and then upload to <srv> "
        echo "       \$ $0 upload <file> <srv>       # - upload file to <srv> "
        echo ""
        echo "    Server side (local commands):"
        echo "       \$ $0 update [<file>]           # - update from file (unpack, update files and then rebuild images)"
        echo "       \$ $0 restart                   # - stop and then start application daemon"
    ;;
    *)
        $0 --help
    ;;
esac