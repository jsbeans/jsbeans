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

jsb-init-help(){
    echo

    echo 'NAME'
    echo '    jsb-init - Initialize jsBeans module in current directory and create base project files by template'
    echo 'SYNOPSIS'
    echo '    jsb [OPTIONS] init GROUP:NAME[:VERSION]'
    echo
    echo 'OPTIONS'
    echo '    Look `jsb help`'
    echo
    echo 'ARGUMENTS'
    echo '    GROUP - Maven project groupId'
    echo '    NAME - Maven project artifactId'
    echo '    VERSION - Maven project version (default 0.1-SNAPSHOT)'
    echo
    echo 'EXAMPLES'
    echo '    jsb init my.example:hello-world'

    echo
}

jsb-init(){

	local group=$(echo $1 | cut -d ":" -f 1)
	local name=$(echo $1 | cut -d ":" -f 2)
	local version1=$(echo $1 | cut -d ":" -f 3)
	local version="${version1:-"0.1-SNAPSHOT"}"
	local cname=$name
	local grouppath=$(echo "$group" | sed "s/\./\//")

	[[ -z "$group" ]]   && { echo 'ERROR: Module group is undefined, use argument group:name:version' 1>&2; exit 1; }
	[[ -z "$name" ]]    && { echo 'ERROR: Module name is undefined, use argument group:name:version' 1>&2; exit 1; }
	[[ -z "$version" ]] && { echo 'ERROR: Module version is undefined, use argument group:name:version' 1>&2; exit 1; }

	cp -pnR $JSBEANS_HOME/project-templates/module/* .

    # patch pom.xml
	sed -i "s/org\.jsbeans\.modules\.module-template/${group}/g" pom.xml
	sed -i "s/module-template/${name}/g" pom.xml
	sed -i "s/module-version/${version}/g" pom.xml


	# patch java Activator
    sed -i "s/org\.jsbeans\.modules\.module-template/${group}/g" src/main/java/ModuleTemplateActivator.java
    sed -i "s/ModuleTemplate/${name}/g" src/main/java/ModuleTemplateActivator.java
    sed -i "s/module-template/${name}/g" src/main/java/ModuleTemplateActivator.java
    mkdir -p src/main/java/${grouppath}
    if [[ ! -f src/main/java/${grouppath}/${name}Activator.java ]]; then
        mv src/main/java/ModuleTemplateActivator.java src/main/java/${grouppath}/${name}Activator.java
    else
        rm src/main/java/ModuleTemplateActivator.java
    fi

    # patch web
    sed -i "s/org\.jsbeans\.modules\.module-template/${group}/g" src/main/jsb-application/web/ModuleTemplate.jsb
    sed -i "s/ModuleTemplate/${cname}/g" src/main/jsb-application/web/ModuleTemplate.jsb
    sed -i "s/module-template/${name}/g" src/main/jsb-application/web/ModuleTemplate.jsb
    mkdir -p src/main/jsb-application/web/${grouppath}
    if [[ ! -f src/main/jsb-application/web/${grouppath}/${name}.jsb ]]; then
        mv src/main/jsb-application/web/ModuleTemplate.jsb src/main/jsb-application/web/${grouppath}/${name}.jsb
    else
        rm mv src/main/jsb-application/web/ModuleTemplate.jsb
    fi

    # patch config
    sed -i "s/org\.jsbeans\.modules\.module-template/${group}/g" src/main/jsb-application/config/module-template.conf
    sed -i "s/ModuleTemplate/${cname}/g" src/main/jsb-application/config/module-template.conf
    sed -i "s/module-template/${name}/g" src/main/jsb-application/config/module-template.conf
    if [[ ! -f src/main/jsb-application/config/${name}.conf ]]; then
        mv src/main/jsb-application/config/module-template.conf src/main/jsb-application/config/${name}.conf
    else
        rm src/main/jsb-application/config/module-template.conf
    fi
    if [[ ! -f src/main/jsb-application/config/${name}-debug.conf ]]; then
        mv src/main/jsb-application/config/module-template-debug.conf src/main/jsb-application/config/${name}-debug.conf
    else
        rm src/main/jsb-application/config/module-template-debug.conf
    fi
}