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
    echo 'jsb - jsBeans workflow-enhancing tool'
        echo
        echo 'To install jsBeans execute command: $ ./jsb install'
        echo
    }
    echo 'Synopsis:'
    echo '    $ jsb [OPTIONS] COMMAND [ARGUMENTS]'
    echo
    echo 'Terminology:'
    echo '    module - source files project with pom.xml that builds two main artifacts (module.jar and module-jsb-application.jar) stored in Maven repository'
    echo '    assembly - module part defined in pom-assembly.xml and builds runnable application (jsBeans and dependency modules)'
    echo '    package - root project with pom.xml that contains one or some modules in subdirectories and define build sequence'
    echo
    echo 'Commands and arguments:'
    echo '    init GROUP:NAME[:VERSION] - Initialize module in current directory (create base project files), eg.: `jsb init my.test:hello:0.1`'
    echo '    search [PACKAGE]          - List all or search packages by pattern in .jsbeans_packages, ${JSB_HOME}/.jsbeans_packages'
    echo '    install [PACKAGE ID]      - Get, build and install org.jsbeans or other package'
    echo '    build                     - Build current project artifacts'
    echo '    assembly                  - Initialize assembly project files, build and assembly current application distributive'
    echo '    start                     - Assembly and start application based on current module'
    echo '    debug                     - Assembly and start application in debug mode'
    echo
    echo 'Common options:'
    echo '    -h|--help [COMMAND]       - Print help for command or tool, eg.: `jsb --help install`'
    echo '    --verbose                 - Print all executed bash commands, eg.: `jsb --verbose init`'
    echo '    --verbose-syslog          - Print all executed bash commands to syslog'
    echo '    --noclean                 - Does not clean before build and assembly, eg.: `jsb --noclean build`'
    echo
    echo 'Other options look at:'
    echo '    $ jsb [COMMAND] --help'
    echo
    echo 'Package id format:'
    echo '    GIT_URL:BRANCH_TAG        - Public module identity by git repository location (need add .git to the URL)'
    echo '    PREFIX:NAME[:BRANCH_TAG]   - Local module identity transformed to `GIT_URL:TAG`.'
    echo '                                Example:'
    echo '                                    org.jsbeans:jsbeans:LATEST transforms.'
    echo '                                    to https://github.com/jsbeans/jsbeans.git:LATEST'
    echo '                                Git repository location extracted from first of:'
    echo '                                  1. From file .jsbeans_packages is record with module exist.'
    echo '                                  2. If current module has `.git` then get first URL in `git remote -v` and build'
    echo '                                     module URL such `ORIGIN_PREFIX:PREFIX/NAME`.'
    echo '                                     If branch or tag is undefined it extracted from current.'
    echo '                                  3. From file `${JSBEANS_HOME}/.jsbeans_packages` if record with module exists.'

    echo
}