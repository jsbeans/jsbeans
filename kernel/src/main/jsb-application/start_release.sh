#!/bin/sh

JARS="$(cat .classpath_jars)"

mkdir -p logs
java -XX:+UseConcMarkSweepGC -XX:+CMSPermGenSweepingEnabled -XX:+CMSClassUnloadingEnabled \
    -Xms512m -Xmx4096m \
    -Dfile.encoding=UTF-8 \
    -classpath config:$JARS \
    org.jsbeans.Starter
