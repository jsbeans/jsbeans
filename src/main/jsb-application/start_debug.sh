#!/bin/sh

JARS="$(cat .classpath_jars)"

mkdir -p logs
java -XX:+UseConcMarkSweepGC -XX:+CMSPermGenSweepingEnabled -XX:+CMSClassUnloadingEnabled \
    -Xms512m -Xmx4096m  \
    -Dfile.encoding=UTF-8 \
    -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 \
    -Dcom.sun.management.jmxremote \
    -Dcom.sun.management.jmxremote.port=6006 \
    -Dcom.sun.management.jmxremote.authenticate=false \
    -Dcom.sun.management.jmxremote.ssl=false \
    -Djava.rmi.server.hostname=$(hostname) \
    -classpath config:$JARS \
    org.jsbeans.Starter