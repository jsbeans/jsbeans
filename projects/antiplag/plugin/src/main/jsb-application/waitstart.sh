#!/bin/bash
# created by dimonab
# Universal server-application starter

function msg_info() {
    echo -e "\033[37;1;42m[INFO]  $@\033[0m"
}

function msg_infon() {
    echo -n -e "\033[37;1;42m[INFO]  $@\033[0m"
}

function msg_dot(){
    echo -n -e "."
}

function nop() {
    :
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

function print_help() {
    echo " Start application and wait complete on error in log then returns exit status (0 - OK/STARTED | 1 - FAILED | 2 - TIMEOUT KILLED)"
    echo " Application command must be asynchronous and write pid and log to specified files."
    echo
    echo " Usage  : $ ./waitstart.sh <start_app_cmd> <app_log_file> <app_pid_file> <ok_completed_log_string> <error_completed_log_string> <timeout_sec> [printlog]"
    echo " Example: $ ./waitstart.sh './application.sh' './logs/application.log' './application.pid' 'System initialized' 'ERROR' 20"
    echo " Example: $ ./waitstart.sh './application.sh' './logs/application.log' './application.pid' 'System initialized' 'ERROR' 20 printlog"
    echo
}

[ $# -eq 0 ] && print_help && msg_error "No arguments" && exit 1

CMD=$1
LOG_FILE="$2"
PID_FILE="$3"
MSG_OK="$4"
MSG_FAIL="$5"
TIMEOUT=$6
PRINTLOG=$7
STATUS_FILE=$(tempfile)'.status'

## print arguments
msg_debug "Application command: $CMD"
msg_debug "Log file for scan: $LOG_FILE"
msg_debug "Completed log string: $MSG_OK"
msg_debug "Error log string: $MSG_FAIL"
msg_debug "Application PID file: $PID_FILE"
msg_debug "Timeout (s): $TIMEOUT"
msg_debug "Status temp file: $STATUS_FILE"

[ -f $PID_FILE ] && PID=$(cat $PID_FILE)

## if not started
kill -0 $PID &> /dev/null && msg_info "STARTED" && exit 0

NEW_LOG=$LOG_FILE"."$(date "+%Y%m%d")
[[ -f $LOG_FILE ]] && mv $LOG_FILE $NEW_LOG && msg_info 'Backup log:' $NEW_LOG
mkdir -p $(dirname $LOG_FILE)
touch $LOG_FILE

# start timer background process
sleep $TIMEOUT &>/dev/null &
TIMER_PID=$!

msg_debug 'TIMER_PID='$TIMER_PID

## start background log scanner
echo 'TIMEOUT' > $STATUS_FILE
tail -n0 -F --pid=$TIMER_PID $LOG_FILE | while read line
do
    [ -z $PRINTLOG ] && msg_dot || msg_log "$line"

    ## scan line and write status

    if [[ "$line" == *"$MSG_OK"* ]]; then
        echo 'OK' > $STATUS_FILE
        kill $TIMER_PID &>/dev/null
    elif [[ "$line" == *"$MSG_FAIL"* ]]; then
        echo 'FAIL' > $STATUS_FILE
        kill $TIMER_PID &>/dev/null
        ## kill application
        kill -9 $(cat $PID_FILE) &>/dev/null
        msg_error "Application killed"
    fi
done &

## start background application
msg_info
msg_infon "Starting application"
$CMD

## wait for the timer
#wait $TIMER_PID #> /dev/null 2>&1
while [ $(kill -0 $TIMER_PID &>/dev/null; echo $?) -eq 0 ] ; do
    sleep 1
done
sleep 1

## process result status
[[ $(cat $STATUS_FILE) == "OK" ]] && msg_info 'OK' && exit 0
[[ $(cat $STATUS_FILE) == "FAIL" ]] && msg_error 'INITIALIZATION FAILED' && msg_error 'Look details in:' $LOG_FILE && exit 1
[[ $(cat $STATUS_FILE) == "TIMEOUT" ]] && {
    msg_error 'TIMEOUT KILLED'
    kill -9 $(cat $PID_FILE) &>/dev/null
    exit 2
}

msg_error 'UNKNOWN ERROR' && exit 1
