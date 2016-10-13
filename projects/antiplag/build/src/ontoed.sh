#!/bin/bash


function msg_info() {
    echo -e "\033[37;1;42m[INFO]  $@\033[0m"
}

function msg_log() {
    echo "" $@
}

function msg_debug() {
    echo "[DEBUG] " $@
}

function msg_error() {
    echo -e "\033[37;1;41m[ERROR] $@\033[0m"
}

function translate_log_to_console() {
    tail -f $APPLOG &
}

function start_browser_url_andwait_close() {
    URL="$1"
    BROWSER_PROFILE=ontoed
    which firefox && {
        firefox --no-remote -CreateProfile $BROWSER_PROFILE
        firefox --no-remote -P $BROWSER_PROFILE "$URL" &> /dev/null # wait
        return 0
    }

    msg_error "Браузер не запущен"
    return 1
}

function print_help() {
    echo
    echo " Запускает приложение Ontoed и ожидает завершения инициализации."
    echo
    echo " Завершение приложения: - закрыть браузер"
    echo "                        - $ ./ontoed.sh --stop # команда для остановки демона"
    echo
#    echo " Использование: $ ./ontoed.sh [--help|-h] [--stop|-s] [--verbose|-v] [--no-verbose|-n] ..."
    echo " Использование: $ ./ontoed.sh [--help|-h] | [--stop|-s] | [--status|-S]"
    echo
    echo " Аргументы:                   - (default) запуск Ontoed с выводом сообщений в консоль"
    echo "          --help, -h          - текущая справка"
#    echo "          --verbose, -v       - запуск Ontoed с выводом сообщений в консоль"
#    echo "          --no-verbose, -n    - (default) запуск Ontoed без вывода сообщений приложения в консоль"
    echo "          --stop, -s          - остановка приложения, запущенного с --daemon"
#    echo "          --restart, -r       - если приложение уже запущено с --daemon, то перезапустить"
    echo "          --status, -S        - статус запуска и PID (exit codes: 0 - запущено; 1 - не запущено)"
#    echo "          --start-browser yes - запустить браузер из приложения (опция startBrowser.enabled=true)"
#    echo "          --start-browser no  - (default) не запускать браузер из приложения, будет запущен в текущем скрипте (опция startBrowser.enabled=false)"
#    echo "          --debug, -d         - запуск в режиме отладки (debug port $DEBUG_PORT, jmx port $JMX_PORT)"
    echo
    echo " Примеры: $ ./ontoed.sh"
    echo "          $ ./ontoed.sh -h"
#    echo "          $ ./ontoed.sh --restart"
    echo "          $ ./ontoed.sh --stop"
    echo "          $ ./ontoed.sh --status"
#    echo "          $ ./ontoed.sh --verbose"
#    echo "          $ ./ontoed.sh --debug"
#    echo "          $ ./ontoed.sh --start-browser no"
#    echo "          $ ./ontoed.sh -v -d --start-browser no"
}

APP_HOME=$(pwd)

cd jsb-application
chmod +x ./waitstart.sh #TODO: move to future install script
chmod +x ./start.sh #TODO: move to future install script

START_BROWSER="--start-browser no"
while test $# -gt 0
do
    case "$1" in
        --help|-h)
            print_help
            exit 0
            ;;
        --stop|-s)
            ./start.sh --stop
            exit $?
            ;;
        --restart|-r)
            ./start.sh --stop
            # without exit
            ;;
        --status|-S)
            ./start.sh --status
            exit $?
            ;;
        --start-browser)
            shift
            START_BROWSER="--start-browser $1"
            msg_error "option '--start-browser' temporary disabled"
            ;;
        --debug|-d)
            DEBUG="$1"
            ;;
        --verbose|-v)
            VERBOSE=true
            ;;
        --no-verbose|-n)
            VERBOSE=
            ;;
    esac
    shift
done

APPPIDFILE=ontoedapp.pid
APPLOG=logs/ontoedapp.log
APPLICATION="./start.sh --daemon $DEBUG $START_BROWSER"
ONTOED_URL="http://localhost:8888/ontoed.html"

# if not started
kill -0 $APPPID &>/dev/null && {
     msg_info "Приложение уже запущено"
     exit 0
} || {
    msg_info "Запуск приложения"

    [[ -n $VERBOSE ]] && PRINTLOG=printlog

    echo ./waitstart.sh "$APPLICATION" "$APPLOG" "$APPPIDFILE" "System initialized" "ERROOR" 20 $PRINTLOG
    ./waitstart.sh "$APPLICATION" "$APPLOG" "$APPPIDFILE" "System initialized" "ERROR" 20 $PRINTLOG && {
        if [[ -n $START_BROWSER ]]; then
            msg_info "Приложение запущено и инициализировано"
            msg_info "Откройте в браузере ссылку $ONTOED_URL"
        else
            msg_info "Приложение запущено и инициализировано, ждите открытия браузера с приложением"
            msg_info "$ONTOED_URL"
        fi
        translate_log_to_console
        start_browser_url_andwait_close "$ONTOED_URL" && msg_info "Браузер закрыт"
        cd $APP_HOME
        $0 --stop
        exit $?
    } || {
        msg_error "Приложение не запущено"
        msg_error "Дополнительную инфомрацию смотрите в $APPLOG"
        [[ -n $VERBOSE ]] && msg_error "Для вывода деталей ошибки используйте опцию --verbose"
        exit 1
    }
}