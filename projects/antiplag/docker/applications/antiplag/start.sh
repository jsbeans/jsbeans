#!/bin/bash

APPLICATION=${PWD##*/}

# uncomment for default verbose output
#VERBOSE=--verbose

if [[ -z $1 ]]; then 
    $0 help
    exit 0
fi

case $1 in
    -v|--verbose)
	VERBOSE=--verbose
	shift
    ;;
esac

DOCKER_COMPOSE="docker-compose $VERBOSE"

case $1 in
    package|install)
        TARGET_DIR=$(pwd)/target
        name=docker-$APPLICATION-$(date +%Y-%m-%d)

        rm -fr $TARGET_DIR
        mkdir -p $TARGET_DIR/$name
        ignorefiles="$(find  ../.. -name .gitignore 2>/dev/null)"
        rsync -avz --exclude applications --exclude            .git $(echo "$ignorefiles" | sed -e 's/^/--exclude-from /') ../.. $TARGET_DIR/$name
        rsync -avz --exclude images --exclude target --exclude .git $(echo "$ignorefiles" | sed -e 's/^/--exclude-from /') ../$APPLICATION $TARGET_DIR/$name/applications

        cd $TARGET_DIR/$name
        tar czf ../$name.tar.gz .

        echo "Packaged TARGET_FILE $TARGET_DIR/$name.tar.gz"
    ;;
    build)
        $DOCKER_COMPOSE build
    ;;
    start|up)
        $DOCKER_COMPOSE up
    ;;
    startd|upd)
        $DOCKER_COMPOSE up -d
    ;;
    stop)
        $DOCKER_COMPOSE stop
    ;;
    kill)
        $DOCKER_COMPOSE kill
    ;;
    clean|down)
        $DOCKER_COMPOSE down
    ;;
    ps)
        $DOCKER_COMPOSE ps
    ;;
    logs)
        $DOCKER_COMPOSE logs
    ;;
    exec)
        $DOCKER_COMPOSE exec ${@:2}
    ;;
    help)
        echo "Usage: $0 [-v|--verbose] [package|build|start|startd|stop|kill|clean|exec|ps|logs] [x <docker-compose-arguments>]"
    ;;
    x)
        $DOCKER_COMPOSE ${@:2}
    ;;
esac