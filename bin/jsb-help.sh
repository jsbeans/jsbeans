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

jsb-help(){
    echo

    jsb &> /dev/null || {
        echo 'To install jsBeans execute command: $ ./jsb install'
        echo
    }

    echo 'NAME'
    echo '    jsb - jsBeans workflow-enhancing tool'
    echo 'SYNOPSIS'
    echo '    jsb [OPTIONS] COMMAND [ARGUMENTS]'
    echo
    echo 'COMMANDS AND ARGUMENTS'
    echo '    init GROUP:NAME[:VERSION] - Initialize module in current directory (create base project files)'
    echo '    search [MODULE]           - List all or search module by pattern in .jsb_modules, ${JSB_HOME}/.jsb_modules'
    echo '    install [MODULE ID]       - Get, build and install org.jsbeans or other module'
    echo '    build                     - Build current project artifacts'
    echo '    assembly                  - Initialize assembly project files, build and assembly current application distributive'
    echo '    start                     - Assembly and start current application'
    echo '    debug                     - Assembly and start current application in debug mode'
    echo
    echo 'OPTIONS'
    echo '    -h|--help [COMMAND]       - Print help for command or tool, eg.: `jsb --help install`'
    echo '    --verbose                 - Print all executed bash commands, eg.: `jsb --verbose init`'
    echo '    --verbose-syslog          - Print all executed bash commands to syslog'
    echo
    echo 'MODULE ID FORMAT'
    echo '    GIT_URL:BRANCH_TAG        - Public module identity by git repository location (need add .git to the URL)'
    echo '    GROUP:NAME[:BRANCH_TAG]   - Local module identity transformed to `GIT_URL:TAG`.'
    echo '                                Example:'
    echo '                                    org.jsbeans:jsbeans:LATEST transforms.'
    echo '                                    to https://github.com/jsbeans/jsbeans.git:LATEST'
    echo '                                Git repository location extracted from first of:'
    echo '                                  1. From file .jsbeans_modules is record with module exist.'
    echo '                                  2. If current module has `.git` then get first URL in `git remote -v` and build'
    echo '                                     module URL such `ORIGIN_PREFIX:GROUP/NAME`.'
    echo '                                     If branch or tag is undefined it extracted from current.'
    echo '                                  3. From file `${JSBEANS_HOME}/.jsbeans_modules` if record with module exists.'

    echo
}