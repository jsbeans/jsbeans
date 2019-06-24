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

jsb-init-assembly(){
    if [[ -f ./pom-assembly.xml ]]; then
        echo "Assembly already initialized"
        return 0;
    fi

    local group=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.groupId -q -DforceStdout)
    local name=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.artifactId -q -DforceStdout)
    local version=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.version -q -DforceStdout)

   	[[ -z "$group" ]]   && { echo 'ERROR: Module group is undefined' 1>&2; exit 1; }
	[[ -z "$name" ]]    && { echo 'ERROR: Module name is undefined' 1>&2; exit 1; }
	[[ -z "$version" ]] && { echo 'ERROR: Module version is undefined' 1>&2; exit 1; }

    # copy assembly project
    cp -pnR $JSBEANS_HOME/project-templates/assembly/* .

    # patch pom.xml
	sed -i "s/org\.jsbeans\.modules\.module-template/${group}/g" pom-assembly.xml
	sed -i "s/module-template/${name}/g" pom-assembly.xml
	sed -i "s/module-version/${version}/g" pom-assembly.xml
}

jsb-assembly(){
    jsb-init-assembly

    jsb-build || return $?

    # assembly
    local clean=
    if [[ -z "${jsb_noclean}" ]]; then
        clean=clean
    fi
    mvn -f pom-assembly.xml $clean install

    return $?
}