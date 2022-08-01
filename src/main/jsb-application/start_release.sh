#!/usr/bin/env bash

export APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd $APP_DIR

JARS="$(cat .classpath_jars |sed 's/\\/\//g')"

#fix

mkdir -p logs


#  -XX:+UseConcMarkSweepGC \
#  -XX:+CMSPermGenSweepingEnabled \
java \
  -XX:+CMSClassUnloadingEnabled \
  -Xms512m -Xmx8192m -Dfile.encoding=UTF-8 \
  "$@" -classpath config:$JARS \
  org.jsbeans.Starter
