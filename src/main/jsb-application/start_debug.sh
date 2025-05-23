#!/usr/bin/env bash

export APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd $APP_DIR

JARS=""
for file in *.classpath; do
  if [[ -n "$JARS" ]]; then
      JARS+=":"
  fi
  JARS+=$(cat $file)
done

if [[ -d logs ]]; then
  bklog="./logs/$(date '+%Y-%m-%d_%H%M%S')/"
  mkdir -p "$bklog"
  find ./logs/ -maxdepth 1 -type f -exec cp {} "$bklog" \;
else
  mkdir -p logs
fi

LANG="en_US.UTF-8"

# -XX:+UseConcMarkSweepGC -XX:+CMSPermGenSweepingEnabled
java \
    -Xms512m -Xmx8192m \
    -Dfile.encoding=UTF-8 \
    -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 \
    -Dcom.sun.management.jmxremote \
    -Dcom.sun.management.jmxremote.port=6006 \
    -Dcom.sun.management.jmxremote.authenticate=false \
    -Dcom.sun.management.jmxremote.ssl=false \
    -Djava.rmi.server.useLocalHostname=true \
    -Djava.rmi.server.hostname=hostname \
    -Djava.rmi.server.logCalls=true \
    -classpath config:$JARS \
    "$@"\
    org.jsbeans.Starter
