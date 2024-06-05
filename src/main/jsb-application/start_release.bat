for /f "delims=" %%x in (classpath_jars) do set JARS=%%x
set JARS_FIXED=%JARS::=;%
set /p LAUNCHER_JAR=<launcher_jar
java -XX:+CMSClassUnloadingEnabled -Xms512m -Xmx8192m -Dfile.encoding=UTF-8 -jar %LAUNCHER_JAR%
REM java -XX:+CMSClassUnloadingEnabled -Xms512m -Xmx8192m -Dfile.encoding=UTF-8 -classpath config;%JARS_FIXED% org.jsbeans.Starter
REM -XX:+UseConcMarkSweepGC -XX:+CMSPermGenSweepingEnabled
