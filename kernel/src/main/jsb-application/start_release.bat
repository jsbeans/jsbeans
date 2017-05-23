java -XX:+UseConcMarkSweepGC -XX:+CMSPermGenSweepingEnabled -XX:+CMSClassUnloadingEnabled -Xms512m -Xmx8192m -XX:MaxPermSize=512m -Dfile.encoding=UTF-8 -classpath config;lib\* org.jsbeans.Starter
