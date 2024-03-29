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

    echo
}

jsb-search(){
    ( jsb-search-local "$1"; jsb-search-home "$1" ) | sort -u
}

jsb-search-local(){
    local module="$1"
    if [[ -f .jsbeans_packages ]]; then
        cat .jsbeans_packages | grep "$module"
    fi
}

jsb-search-home(){
    local module="$1"
    # $JSBEANS_HOME/.git_modules
    if [[ -f "$JSBEANS_HOME/.jsbeans_packages" ]]; then
        cat "$JSBEANS_HOME/.jsbeans_packages" | grep "$module"
    fi
}