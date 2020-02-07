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

declare -r ECHO_DEFAULT_COLOR="\033[0m"
declare -r ECHO_ERROR_COLOR="\033[1;31m"
declare -r ECHO_INFO_COLOR="\033[1m"

export SCRIPT_BASE_DIR=${SCRIPT_BASE_DIR:-"$(cd "$(dirname "$0")" && pwd)"}
export JSBEANS_HOME="${JSBEANS_HOME:-"$(dirname $SCRIPT_BASE_DIR)"}"

is_command_exists() {
    command -v "$1" >/dev/null 2>&1;
}

echo_info(){
    echo -e "$ECHO_INFO_COLOR" "$@" "$ECHO_DEFAULT_COLOR"
}

## basedir group name version jsb-application pom
maven_list_projects(){
    local dir="$(pwd)"
    cd "${1:-.}"

    while IFS= read -r line; do
        echo "$line" $([[ -d "$(echo "$line"|awk '//{print $1}')/src/main/jsb-application" ]] && echo "jsb-application"|| echo "-")\
            $(cat "$(echo "$line"|awk '//{print $1}')/pom.xml" | grep -q '<modules>' && echo "pom" || echo "-")
    done < <(mvn -q -Dexec.executable=echo -Dexec.args='${basedir} ${project.groupId} ${project.artifactId} ${project.version}' exec:exec 2>/dev/null)
    cd "$dir"
}

maven_get_project(){
    local dir="$(pwd)"
    cd "${1:-.}"

    while IFS= read -r line; do
        echo "$line" $([[ -d "$(echo "$line"|awk '//{print $1}')/src/main/jsb-application" ]] && echo "jsb-application"|| echo "-")\
            $(cat "$(echo "$line"|awk '//{print $1}')/pom.xml" | grep -q '<modules>' && echo "pom" || echo "-")
    done < <(mvn -q -Dexec.executable=echo -Dexec.args='${basedir} ${project.groupId} ${project.artifactId} ${project.version}' --non-recursive exec:exec 2>/dev/null)
    cd "$dir"
}


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
        help|-h|--help)
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
            var_name=$(echo "$var_name" | sed 's/\-?=/_/')
            if [[ -z "$(echo "$name" | grep "=")" ]]; then
                var_name=${var_name}=yes;
            fi
            echo "Set variable: ${var_name}"
            export ${var_name}
            ;;
        *)
    esac
done

## prepare command
selected_command=
command_arguments=()
while [[ -n "$1" ]]; do
    case "$1" in
        help|-h|--*)
            shift
            ;;
        *)
            if [[ -z "$selected_command" ]]; then
                selected_command=$1
            else
                command_arguments+=("$1")
            fi
            shift
    esac
done

## execute first command
if [[ -n "$selected_command" ]]; then
    if [[ -n "${jsb_help}" ]]; then
        jsb-${selected_command}-help "$@"
        exit $?
    fi
    echo "Executing command - ${selected_command} ${command_arguments[@]}"
    jsb-${selected_command} "${command_arguments[@]}" || {
        exit_code=$?
        echo "ERROR: Failed execution of command ${selected_command}" 1>&2
        exit $?
    }
    exit 0;
fi
## default command
jsb-help
exit $?