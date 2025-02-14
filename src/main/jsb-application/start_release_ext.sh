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

paste -sd ':' $(find . -name "*.classpath" -print0 | tr '\0' '\n' | sort | xargs cat)

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

java -DBUILD_VERSION="$(cat version.txt 2>/dev/null||echo)"\
  -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8 \
  "${@}" -classpath config:$JARS org.jsbeans.Starter
