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

JSBEANS_HOME="${JSBEANS_HOME:-"$(pwd)"}"
echo $JSBEANS_HOME

for jsb_tool in ${JSBEANS_HOME}/bin/jsb-*.sh
do
    source ${jsb_tool}
done

if [[ "$(pwd)" = */bin ]] && [[ -f ../pom.xml ]]; then
    cd ..
fi

while [[ -n "$1" ]]; do
    case "$1" in
        -h|--help)
            shift
            jsb_help=yes
            ;;
        --verbose)
            shift
            PS4='$LINENO: '
            set -x
            ;;
        --verbose-syslog)
            shift
            exec 5> >(logger -t $0)
            BASH_XTRACEFD="5"
            PS4='$LINENO: '
            set -x
            ;;
        --*)
            name=$1; shift
            var_name=jsb_${name:2}
            if [[ -z "$(echo name | cut -d "=" -f 2)" ]]; then
                var_name=${var_name}=yes;
            fi
            echo "Set variable: ${var_name}"
            export ${var_name}
            ;;
        *)
            # export all functions name started with jsb-
            command=$1; shift
            if [[ -n "${jsb_help}" ]]; then
                jsb-${command}-help "$@"
                exit $?
            fi
            echo "Executing command ${command}"
            jsb-${command} "$@" || {
                echo "ERROR: Failed execution of command ${command}" 1>&2
                exit 1
            }
            exit 0;
            ;;
    esac
done

jsb-help
exit $?