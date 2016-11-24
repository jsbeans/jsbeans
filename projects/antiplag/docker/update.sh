#!/bin/bash
#trap "set +x; sleep 1; set -x" DEBUG
set -x

default_srv=antiplag@172.16.7.1
default_pwd=antiplag
default_name=docker

deploy_server=avicomp@172.16.31.1
#image=antiplag_jsbeans && archive=$image.bz2 && docker save $image | bzip2 > $archive && scp $archive avicomp@172.16.31.1:
# ssh -p 31122 avicomp@87.229.237.226 -t sudo -s
# cat antiplag_jsbeans.bz2 | bunzip | docker load

case $1 in
    upload)
        shift
        file="$1"
        shift
        srv="$1"

        localFile="$file"
        remoteFile=$(basename "$file")

        sshpass -p "$default_pwd" scp $localFile $srv:$remoteFile
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
        $0 install && sshpass -p "$default_pwd" ssh $srv "cd $name && $0 update && $0 restart"
    ;;
    deploy)
        echo -n "Enter deploy server password ($deploy_server): " && read -s deploy_pwd && echo
        #$0 autoupdate || exit $?
        #sshpass -p "$default_pwd" ssh "image=antiplag_jsbeans && archive=\$image.bz2 && docker save \$image | bzip2 > \$archive && scp \$archive $deploy_server:"
        image=antiplag_jsbeans
        archive=$image.bz2
        (docker save $image | bzip2 | pv > $archive) && sshpass -p "$deploy_pwd" scp $archive $deploy_server: || exit $?
        #sshpass -p "$deploy_pwd" ssh $deploy_server -t "cat $archive | bunzip | sudo docker load" || exit $?
        sshpass -p "$deploy_pwd" ssh $deploy_server -t "sudo cp -f $archive /opt/images && cd /opt/images && sudo ./load-images.sh" || exit $?
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