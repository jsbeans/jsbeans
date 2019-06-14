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

jsb-search-help(){
    echo

    echo 'NAME'
    echo '    jsb-search - Search jsBeans modules in repositories'
    echo
    echo 'SYNOPSIS'
    echo '    jsb [OPTIONS] search MODULE'
    echo
    echo 'OPTIONS'
    echo '    Look `jsb help`'
    echo
    echo 'STANDARD OUTPUT'
    echo '    MODULE_ID REPOSITORY_URL VERSION_TAG'
    echo
    echo 'EXAMPLES'
    echo '    jsb search jsbeans'

    echo
}

jsb-search(){
    ( jsb-search-local "$1"; jsb-search-home "$1" ) | sort -u
}

jsb-search-local(){
    local module="$1"
    if [[ -f .jsbeans_modules ]]; then
        cat .jsbeans_modules | grep "$module"
    fi
}

jsb-search-home(){
    local module="$1"
    # $JSBEANS_HOME/.git_modules
    if [[ -f "$JSBEANS_HOME/.jsbeans_modules" ]]; then
        cat "$JSBEANS_HOME/.jsbeans_modules" | grep "$module"
    fi
}