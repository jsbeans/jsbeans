#!/bin/bash

while test $# -gt 0
do
    case "$1" in
        --help|-h)
            echo "Usage: $0 [-d|--debug]"
            exit 0
        ;;
        --init)
            cd jsb-application && chmod +x *.sh
            exhi $?
        ;;
        --debug|-d)
            DEBUG="$1"
        ;;
    esac
    shift
done

cd jsb-application
if [[ -n $DEBUG ]]; then
    ./start_debug.sh
else
    ./start_release.sh
fi