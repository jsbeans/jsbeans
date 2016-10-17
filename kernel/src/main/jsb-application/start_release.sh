#!/bin/sh

JAR_NAME=kernel-1.0-SNAPSHOT.jar

mkdir -p logs
java -XX:+UseConcMarkSweepGC -XX:+CMSPermGenSweepingEnabled -XX:+CMSClassUnloadingEnabled \
    -Xms512m -Xmx4096m \
    -Dfile.encoding=UTF-8 \
    -classpath config:libs/$JAR_NAME:libs/* \
    org.jsbeans.Starter
