#!/bin/bash -x

# list folders except -thirdpatry
modules=($(ls -l | grep '^d'|awk '{print $9}'|grep -v thirdparty))

base=$(pwd)

echo "*** Start build modules: ${modules[*]}"

for module in ${modules[*]}; do
    cd $base/$module && ./build.sh $@ || exit $?
done

echo "*** Build modules images completed: ${modules[*]}"

exit 0