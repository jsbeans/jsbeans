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
    echo 'jsb-init         - Initialize jsBeans module or package in current directory and create base project files by template'
    echo 'jsb-init-module  - Initialize module '
    echo 'jsb-init-package - Initialize package '
    echo
    echo 'Synopsis:'
    echo '    jsb [OPTIONS] init GROUP:NAME[:VERSION]'
    echo
    echo 'Options:'
    echo '    --package             - initialize package project files (by default create module)'
    echo '    --new-dir[=DIR_NAME]  - initialize module/package in new directory'
    echo
    echo '    Other options look at `jsb --help`'
    echo
    echo 'Arguments:'
    echo '    GROUP - Maven project groupId'
    echo '    NAME - Maven project artifactId'
    echo '    VERSION - Maven project version (default 0.1-SNAPSHOT)'
    echo
    echo 'Examples:'
    echo '    $ jsb --package init my.example:root'
    echo '    $ jsb --new-dir init my.example:hello:0.1'
    echo '    $ jsb --new-dir=example-hello init my.example:hello:0.1'
    echo
}

jsb-init(){
    module="$1"

    # is git URL
    if [[ "$module" =~ (\.git) ]] || [[ "$module" =~ (git@) ]]; then
        module_git_path="$module"
    fi

    local names=( )
    IFS=':' read -ra names <<< "$module"
    module_group="${names[0]}"
    module_name="${names[1]}"
    module_version="${names[2]-"0.1-SNAPSHOT"}"
	module_cname=$module_name
	module_grouppath=$(echo "$module_group" | sed "s/\./\//")

	[[ -z "$module_group" ]]   && { echo 'ERROR: Module group is undefined, use argument group:name:version' 1>&2; exit 1; }
	[[ -z "$module_name" ]]    && { echo 'ERROR: Module name is undefined, use argument group:name:version' 1>&2; exit 1; }
	[[ -z "$module_version" ]] && { echo 'ERROR: Module version is undefined, use argument group:name:version' 1>&2; exit 1; }

	if [[ -n "${jsb_new_dir}" ]]; then
	    mkdir -p "${jsb_new_dir}"
	    cd "${jsb_new_dir}"
	fi

    if [[ -z "${jsb_package}" ]]; then
        jsb-init-module "$@"
    else
        jsb-init-package "$@"
    fi
}

jsb-init-package(){
    cp -pnR $JSBEANS_HOME/project-templates/package/* .

    # patch pom.xml
	sed -i "s/org\.jsbeans\.modules\.module-template/${module_group}/g" pom.xml
	sed -i "s/module-template/${module_name}/g" pom.xml
	sed -i "s/module-version/${module_version}/g" pom.xml

}

jsb-init-module(){
	cp -pnR $JSBEANS_HOME/project-templates/module/* .

    # patch pom.xml
	sed -i "s/org\.jsbeans\.modules\.module-template/${module_group}/g" pom.xml
	sed -i "s/module-template/${module_name}/g" pom.xml
	sed -i "s/module-version/${module_version}/g" pom.xml


	# patch java Activator
    sed -i "s/org\.jsbeans\.modules\.module-template/${module_group}/g" src/main/java/ModuleTemplateActivator.java
    sed -i "s/ModuleTemplate/${module_name}/g" src/main/java/ModuleTemplateActivator.java
    sed -i "s/module-template/${module_name}/g" src/main/java/ModuleTemplateActivator.java
    mkdir -p src/main/java/${module_grouppath}
    if [[ ! -f src/main/java/${module_grouppath}/${module_name}Activator.java ]]; then
        mv src/main/java/ModuleTemplateActivator.java src/main/java/${module_grouppath}/${module_name}Activator.java
    else
        rm src/main/java/ModuleTemplateActivator.java
    fi

    # patch web
    sed -i "s/org\.jsbeans\.modules\.module-template/${module_group}/g" src/main/jsb-application/web/ModuleTemplate.jsb
    sed -i "s/ModuleTemplate/${module_cname}/g" src/main/jsb-application/web/ModuleTemplate.jsb
    sed -i "s/module-template/${module_name}/g" src/main/jsb-application/web/ModuleTemplate.jsb
    mkdir -p src/main/jsb-application/web/${module_grouppath}
    if [[ ! -f src/main/jsb-application/web/${module_grouppath}/${module_name}.jsb ]]; then
        mv src/main/jsb-application/web/ModuleTemplate.jsb src/main/jsb-application/web/${module_grouppath}/${module_name}.jsb
    else
        rm mv src/main/jsb-application/web/ModuleTemplate.jsb
    fi

    # patch config
    sed -i "s/org\.jsbeans\.modules\.module-template/${module_group}/g" src/main/jsb-application/config/module-template.conf
    sed -i "s/ModuleTemplate/${module_cname}/g" src/main/jsb-module_group/config/module-template.conf
    sed -i "s/module-template/${module_name}/g" src/main/jsb-application/config/module-template.conf
    if [[ ! -f src/main/jsb-application/config/${module_name}.conf ]]; then
        mv src/main/jsb-application/config/module-template.conf src/main/jsb-application/config/${module_name}.conf
    else
        rm src/main/jsb-application/config/module-template.conf
    fi
    if [[ ! -f src/main/jsb-application/config/${module_name}-debug.conf ]]; then
        mv src/main/jsb-application/config/module-template-debug.conf src/main/jsb-application/config/${module_name}-debug.conf
    else
        rm src/main/jsb-application/config/module-template-debug.conf
    fi
}