set /p JARS=<.classpath_jars
set JARS_FIXED=%JARS::=;%
java -XX:+UseConcMarkSweepGC -XX:+CMSPermGenSweepingEnabled -XX:+CMSClassUnloadingEnabled -Xms512m -Xmx8192m -Dfile.encoding=UTF-8 -classpath config;%JARS_FIXED% org.jsbeans.Starter
