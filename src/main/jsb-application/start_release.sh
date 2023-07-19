#!/usr/bin/env bash

export APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd $APP_DIR

JARS="$(cat .classpath_jars |sed 's/\\/\//g')"

if [[ -f version.txt ]]; then
  echo "build.version=\"$(cat version.txt)\"" > config/version.conf
fi

if [[ -d logs ]]; then
  bklog="./logs/$(date '+%Y-%m-%d %H:%M:%S')/"
  mkdir -p "$bklog"
  find ./logs/ -maxdepth 1 -type f -exec cp {} "$bklog" \;
else
  mkdir -p logs
fi

LANG="en_US.UTF-8"

#  -XX:+UseConcMarkSweepGC \
#  -XX:+CMSPermGenSweepingEnabled \
java -DBUILD_VERSION="$(cat version.txt 2>/dev/null||echo)"\
  -XX:+CMSClassUnloadingEnabled \
  -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8 \
  "$@" -classpath config:$JARS \
  org.jsbeans.Starter
