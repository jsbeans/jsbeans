#!/usr/bin/env bash

JARS="$(cat .classpath_jars |sed 's/\\/\//g')"

mkdir -p logs
java -XX:+UseConcMarkSweepGC -XX:+CMSPermGenSweepingEnabled -XX:+CMSClassUnloadingEnabled -Xms512m -Xmx8192m -Dfile.encoding=UTF-8 -classpath config:$JARS org.jsbeans.Starter
