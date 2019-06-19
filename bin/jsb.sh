#!/usr/bin/env bash
#--------------------------------------------------------------------------------------------------
# This file is the part of jsBeans, high-level JavaScript client-server framework.
# The contents of this file are subject to the MIT License (MIT).
# (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
#
# Настоящий файл является частью клиент-серверной JavaScript платформы.
# Условия использования и распространения содержимого данного файла соответствуют программному
# обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
# Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
#--------------------------------------------------------------------------------------------------
set -o errexit

is_command_exists() {
  command -v "$1" >/dev/null 2>&1;
}

export SCRIPT_BASE_DIR=${SCRIPT_BASE_DIR:-"$(cd "$(dirname "$0")" && pwd)"}
export JSBEANS_HOME="${JSBEANS_HOME:-"$(dirname $SCRIPT_BASE_DIR)"}"

if [[ "$(pwd)" = */bin ]] && [[ -f ../pom.xml ]]; then
    cd ..
fi


for jsb_tool in ${JSBEANS_HOME}/bin/.jsb-*.sh
do
    source ${jsb_tool}
done

## collect options
for arg in "$@"
do
    case "$arg" in
        -h|--help)
            jsb_help=yes
            ;;
        --verbose)
            PS4='$LINENO: '
            set -x
            ;;
        --verbose-syslog)
            exec 5> >(logger -t $0)
            BASH_XTRACEFD="5"
            PS4='$LINENO: '
            set -x
            ;;
        --*)
            name=$arg
            var_name=jsb_${name:2}
            var_name=$(echo "$var_name" | sed 's/\-/_/')
            if [[ -z "$(echo "$name" | grep "=")" ]]; then
                var_name=${var_name}=yes;
            fi
            echo "Set variable: ${var_name}"
            export ${var_name}
            ;;
    esac
done

## execute command
while [[ -n "$1" ]]; do
    case "$1" in
        -h|--*)
            shift
            ;;
        *)
            selected_command=$1
            shift
            if [[ -n "${jsb_help}" ]]; then
                jsb-${selected_command}-help "$@"
                exit $?
            fi
            echo "Executing command - ${selected_command}"
            jsb-${selected_command} "$@" || {
                exit_code=$?
                echo "ERROR: Failed execution of command ${selected_command}" 1>&2
                exit $?
            }
            exit 0;
            ;;
    esac
done

## default command
jsb-help
exit $?