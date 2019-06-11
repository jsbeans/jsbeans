#!/usr/bin/env bash

set -e
#set -x

export START_DIR=$(pwd)
export SCRIPT_BASE_DIR="$(cd "$( dirname "$0")" && pwd )"
export JSBEANS_HOME=${JSBEANS_HOME:-'/home/ubuntu/data/jsbeans-public/jsbeans'}

print_help(){
    echo 'Usage: $ jsb install|init|assembly|start|debug [arguments]'
    echo
    echo 'install                   - Get, build and install jsBeans'
    echo 'init group:name[:version] - Initialize module in current directory (create base project files)'
    echo 'build                     - Build project artifacts'
    echo 'assembly                  - Initialize assembly project files, build and assembly application distributive'
    echo 'start                     - Assembly and start application'
    echo 'debug                     - Assembly and start application in debug mode'
}

command_install(){
	build_jsbeans
	install_jsbeans
}

command_init(){

	local group=$(echo $1 | cut -d ":" -f 1)
	local name=$(echo $1 | cut -d ":" -f 2)
	local version1=$(echo $1 | cut -d ":" -f 3)
	local version="${version1:-"0.1-SNAPSHOT"}"
	local cname=$name
	local grouppath=$(echo "$group" | sed "s/\./\//")

	[[ -z "$group" ]] && echo 'ERROR: Module group is undefined, use argument group:name:version'
	[[ -z "$name" ]] && echo 'ERROR: Module name is undefined, use argument group:name:version'
	[[ -z "$version" ]] && echo 'ERROR: Module version is undefined, use argument group:name:version'

	cp -nR ${JSBEANS_HOME}/project-templates/module/* .

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

command_build(){
    mvn -f pom.xml clean install
}

command_assembly(){
    echo 'Extract group, name and version from pom.xml'
    local group=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.groupId -q -DforceStdout)
    local name=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.artifactId -q -DforceStdout)
    local version=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.version -q -DforceStdout)

   	[[ -z "$group" ]] && echo 'ERROR: Module group is undefined'
	[[ -z "$name" ]] && echo 'ERROR: Module name is undefined'
	[[ -z "$version" ]] && echo 'ERROR: Module version is undefined'

    # copy assembly project
    cp -nR ${JSBEANS_HOME}/project-templates/assembly/* .

    # patch pom.xml
	sed -i "s/org\.jsbeans\.modules\.module-template/${group}/g" pom-assembly.xml
	sed -i "s/module-template/${name}/g" pom-assembly.xml
	sed -i "s/module-version/${version}/g" pom-assembly.xml

    command_build
    mvn -f pom-assembly.xml clean install
}

cd ${START_DIR}
while [[ -n "$1" ]]; do
    case "$1" in
        -h|--help|help|usage)
            shift
            print_help
            exit 0
            ;;
        --*)
            name=$1; shift
             if [[ "$1" == "--*" ]]; then
                unshift
                val=yes
            else
                val="$1"; shift
            fi
            var_name=${name:2}
            export $var_name="$val"
            echo "Set parameter: $var_name=$val"
            ;;
        *)
            # export all functions name started with script_command_
            command=$1; shift
            echo "Executing command $command"
            command_${command} "$@" || {
                echo "ERROR: Failed execution of command $command"
                exit 1
            }
            exit 0
            ;;
    esac
done
exit 0
