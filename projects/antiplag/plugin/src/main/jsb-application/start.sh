#!/bin/bash
HOME="${JSBEANS_HOME:-$(pwd)}"
#echo "HOME=$HOME"

function print_help() {
    echo
    echo " Запускает или останавливает сервер Ontoed."
    echo " Поддерживается асинхронный запуск с сохранением вывода и PID в файлы $LOG_FILE и $PID_FILE соответственно."
    echo
    echo " Использование: $ ./start.sh [--status|-S] [--start-browser yes|--start-browser no] [--debug|-d] [--daemon|-D] [--stop|-s] [--restart|-r] [--help|-h]"
    echo
    echo " Примеры: $ ./start.sh                     ## - запустить в текущей оболочке (прерывание по Ctrl+C)"
    echo "          $ ./start.sh --daemon            ## - запустить в фоновом подпроцессе (прерывание по kill $PID_FILE или Ctrl+C)"
    echo "          $ ./start.sh --start-browser yes ## - запустить вместе с браузером (опция startBrowser.enabled=true)"
    echo "          $ ./start.sh --start-browser no  ## - запустить без браузера (опция startBrowser.enabled=false)"
    echo "          $ ./start.sh --debug             ## - режим отладки (debug port $DEBUG_PORT, jmx port $JMX_PORT)"
    echo "          $ ./start.sh --stop              ## - остановка приложения, запущенного с --daemon"
    echo "          $ ./start.sh --restart           ## - если приложение уже запущено с --daemon, то перезапустить"
    echo "          $ ./start.sh --status            ## - статус запуска и PID (exit codes: 0 - запущено; 1 - не запущено)"
    echo
}

function msg_info() {
    echo -e "\033[37;1;42m[INFO]  $@\033[0m"
}


while test $# -gt 0
do
    case "$1" in
        --status|-S)
            STATUS=true
            ;;
        --debug|-d)
            DEBUG=true
            ;;
        --daemon|-D)
            DAEMON=true
            ;;
        --start-browser)
            shift
            START_BROWSER=$1
            ;;
        --stop|-s)
            STOP=true
            ;;
        --restart|-r)
            RESTART=true
            ;;
        --help|-h)
            print_help
            exit 0
            ;;
    esac
    shift
done

JAVA=java
JAR_NAME=jsbeans-kernel-1.0-SNAPSHOT.jar
JVM_ARGS=(
    -XX:+UseConcMarkSweepGC
    -XX:+CMSPermGenSweepingEnabled
    -XX:+CMSClassUnloadingEnabled
    -Xms512m -Xmx8192m -XX:MaxPermSize=512m
    -Dfile.encoding=UTF-8
)
CP_JVM_ARGS=(
    -classpath lib/*:config
)
MAIN_CLASS=org.jsbeans.Starter
LOG_FILE=logs/ontoedapp.log
PID_FILE=ontoedapp.pid
DEBUG_PORT=5005
JMX_PORT=6006

[[ -n $DEBUG ]] && DEBUG_JVM_ARGS=(
    -agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=$DEBUG_PORT
    -Dcom.sun.management.jmxremote
    -Dcom.sun.management.jmxremote.port=$JMX_PORT
    -Dcom.sun.management.jmxremote.authenticate=false
    -Dcom.sun.management.jmxremote.ssl=false
    -Djava.rmi.server.hostname=$(hostname)
) || DEBUG_JVM_ARGS=( )
[ -z $START_BROWSER ] && START_BROWSER=yes
[ $START_BROWSER == "no"  ] && JVM_APP_ARGS=( -DstartBrowser.enabled=false ) || JVM_APP_ARGS=( -DstartBrowser.enabled=true )


# main script

[[ -n $PRINT_HELP ]] && print_help && exit 0

APPPID=$(cat $PID_FILE 2>/dev/null)
if [[ -n $STATUS ]] ; then
    if kill -0 $APPPID &>/dev/null; then
        echo "$APPPID"
        msg_info "Запущено"
        exit 0
    else
        msg_info "Не запущено"
        exit 1
    fi
    echo
fi
if [[ -n $STOP ]]; then
    msg_info "Завершение приложения"
    if kill -0 $APPPID &>/dev/null; then
        kill $APPPID
        exit $?
    else
        msg_info "Не запущено"
        exit 0
    fi
fi
if [[ -n $RESTART ]]; then
    kill -0 $APPPID &>/dev/null && {
        msg_info "Завершение приложения"
        kill $APPPID
        sleep 1
    }
fi
kill -0 $APPPID &>/dev/null && {
    msg_info "Приложение уже запущено"
    exit 0
}

mkdir -p $(dirname $LOG_FILE)
if [[ -z $DAEMON ]]; then
    msg_info "Запуск приложения"
    #echo "$JAVA ${JVM_ARGS[@]} ${JVM_APP_ARGS[@]} ${DEBUG_JVM_ARGS[@]} ${CP_JVM_ARGS[@]} $MAIN_CLASS | tee $LOG_FILE"
    $JAVA ${JVM_ARGS[@]} ${JVM_APP_ARGS[@]} ${DEBUG_JVM_ARGS[@]} ${CP_JVM_ARGS[@]} $MAIN_CLASS | tee $LOG_FILE
else
    msg_info "Запуск приложения"
    rm -f $PID_FILE
    #echo "$JAVA ${JVM_ARGS[@]} ${JVM_APP_ARGS[@]} ${DEBUG_JVM_ARGS[@]} ${CP_JVM_ARGS[@]} $MAIN_CLASS &> $LOG_FILE &"
    $JAVA ${JVM_ARGS[@]} ${JVM_APP_ARGS[@]} ${DEBUG_JVM_ARGS[@]} ${CP_JVM_ARGS[@]} $MAIN_CLASS &> $LOG_FILE &
    echo $! > $PID_FILE
fi
