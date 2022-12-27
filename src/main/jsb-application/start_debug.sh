#!/usr/bin/env bash

export APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd $APP_DIR

JARS="$(cat .classpath_jars |sed 's/\\/\//g')"


if [[ -d ./logs ]]; then
  bklog="./logs/$(date '+%Y-%m-%d %H:%M:%S')/"
  mkdir -p "$bklog"
  find ./logs/ -maxdepth 1 -type f -exec cp {} "$bklog" \;
else
  mkdir -p logs
fi

# -XX:+UseConcMarkSweepGC -XX:+CMSPermGenSweepingEnabled
java \
    -XX:+CMSClassUnloadingEnabled \
    -Xms512m -Xmx8192m \
    -Dfile.encoding=UTF-8 \
    -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 \
    -Dcom.sun.management.jmxremote \
    -Dcom.sun.management.jmxremote.port=6006 \
    -Dcom.sun.management.jmxremote.authenticate=false \
    -Dcom.sun.management.jmxremote.ssl=false \
    -Djava.rmi.server.hostname=$(hostname) \
    -classpath config:$JARS \
    "$@"\
    org.jsbeans.Starter
