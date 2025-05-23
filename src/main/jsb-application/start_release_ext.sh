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

java -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8 \
  "${@}" -classpath config:$JARS org.jsbeans.Starter
