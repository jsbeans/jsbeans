#!/usr/bin/env bash
#--------------------------------------------------------------------------------------------------
# jsb.sh - jsBeans tool script body
# Copyright (c) SIS, LLC
# aa@sis.ru, da@sis.ru
# Licensed under the MIT license
# http://github.com/jsbeans
#--------------------------------------------------------------------------------------------------

set -o errexit
#set -x


print_help(){
    echo

    jsb &> /dev/null || {
        echo 'To install jsBeans execute command: $ ./jsb install'
        echo
    }

    echo 'Enter to the project directory and execute command:'
    echo '    $ jsb [OPTIONS] COMMAND [ARGUMENTS]'
    echo
    echo 'Commands and arguments:'
    echo '    install [MODULE_ID]       - Get, build and install org.jsbeans or other module'
    echo '    init GROUP:NAME[:VERSION] - Initialize module in current directory (create base project files)'
    echo '    build                     - Build current project artifacts'
    echo '    assembly                  - Initialize assembly project files, build and assembly current application distributive'
    echo '    start                     - Assembly and start current application'
    echo '    debug                     - Assembly and start current application in debug mode'
    echo
    echo 'Options:'
    echo '    --verbose                 - Print all executed bash commands'
    echo '    --verbose-syslog          - Print all executed bash commands to syslog'
    echo
    echo 'Module id formats:'
    echo '    GIT_URL:BRANCH_TAG        - Public module identity by git repository location (need add .git to the URL)'
    echo '    GROUP:NAME[:BRANCH_TAG]   - Local module identity transformed to `GIT_URL:TAG`.'
    echo '                                Example org.jsbeans:jsbeans:LATEST transforms to https://github.com/jsbeans/jsbeans.git:LATEST'
    echo '                                Git repository location extracted from first of:'
    echo '                                  1. From file .jsbeans_modules is record with module exist.'
    echo '                                  2. If current module has `.git` then get first URL in `git remote -v` and build module URL `ORIGIN_PREFIX:GROUP/NAME`. If branch or tag is undefined it extracted from current.'
    echo '                                  3. From file `${JSBEANS_HOME}/.jsbeans_modules` if record with module exists.'

    echo
}

##
command_install() {
    local module="${1:-"jsbeans"}"

    # check java and maven
    java -version &> /dev/null || {
        echo 'ERROR: Java is not installed' 1>&2
        return 1
    }
    mvn -v &> /dev/null || {
        echo 'ERROR: Maven is not installed or PATH does not contains directory with git ($MAVEN_HOME/bin)' 1>&2
        return 1
    }

    if [[ "$module" == "org.jsbeans:jsbeans" ]] || [[ "$module" == "jsbeans:jsbeans" ]] || [[ "$module" == "jsbeans" ]]; then

        # check is in jsbeans home
        [[ ! -f ".jsbeans" ]] && { echo 'ERROR: jsBeans sources not found' 1>&2; return 1; }

        # Build jsBeanss
        command_assembly

        # check jsbeans
        [[ ! -d "./target/jsbeans/" ]] && { echo 'ERROR: jsBeans not found in '"./target/jsbeans/" 1>&2; return 1; }

        export JSBEANS_HOME="$JSBEANS_HOME"
        export PATH=$PATH:'${JSBEANS_HOME}/bin'
        if [[ -f ~/.bash_profile ]]; then
            local file=~/.bash_profile
        elif [[ -f ~/.profile ]]; then
            local file=~/.profile
        elif [[ -f ~/.bashrc ]]; then
            local file=~/.bashrc
        else
            local file=
        fi
        if [[ -n $file ]]; then
            echo 'Initialize environment variable JSBEANS_HOME and $JSBEANS_HOME/bin in PATH added to '"$file"
            if ! grep -q 'export JSBEANS_HOME' $file; then
                echo "export JSBEANS_HOME=$JSBEANS_HOME" >> $file
            fi
            if ! grep -q '${JSBEANS_HOME}/bin' $file; then
                echo 'export PATH=$PATH:${JSBEANS_HOME}/bin' >> $file
            fi
        fi

        echo "*** "
        echo "*** Please initialize environment variables ***"
        echo "***     $ export JSBEANS_HOME=$JSBEANS_HOME"
        echo "***     $ "'export PATH=$PATH:${JSBEANS_HOME}/bin'
        echo "*** "

    else

        git --version &> /dev/null || {
            echo 'ERROR: Git is not installed or PATH does not contains directory with git' 1>&2
        }

        local module_group=$(echo $module | cut -d ":" -f 1)
        local module_name=$(echo $module | cut -d ":" -f 2)
        local module_tag=$(echo $module | cut -d ":" -f 3)

        local git_path="$(extractGitUrl "$module")"
        [[ -z "$git_path" ]] && { return 1; }
        local git_url="$(echo "$git_path"|sed 's/^\(.*\.git\)\:.*$/\1/')"
        local git_branch="$(echo "$git_path"|sed 's/.*\.git\:\(.*\)$/\1/')"
        local git_url_group="$(echo "$module_group"|sed 's/\./\//')"

        local module_dir=modules/$git_url_group/$module_name

        echo "Clone module git repository $git_url branch $git_branch to $module_dir"
        mkdir -p $module_dir
        return 0
        git --recurse-submodules --branch $git_branch $git_url $module_dir
        cd $module_dir

        command_build

        local module_mvn_group=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.groupId -q -DforceStdout)
        local module_mvn_name=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.artifactId -q -DforceStdout)
        local module_mvn_version=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.version -q -DforceStdout)

        [[ -z "$module_mvn_group" ]]   && { echo 'ERROR: Module group is undefined' 1>&2; exit 1; }
        [[ -z "$module_mvn_name" ]]    && { echo 'ERROR: Module name is undefined' 1>&2; exit 1; }
        [[ -z "$module_mvn_version" ]] && { echo 'ERROR: Module version is undefined' 1>&2; exit 1; }

        echo "*** "
        echo "*** Add module dependency:"
        echo "*** <dependencies>"
        echo "*** ..."
        echo "***     <dependency>"
        echo "***         <artifactId>$module_mvn_name</artifactId>"
        echo "***         <groupId>$module_mvn_group</groupId>"
        echo "***         <version>$module_mvn_version</version>"
        echo "***     </dependency>"
        echo "*** ..."
        echo "*** </dependencies>"
        echo "*** "
        echo "*** And link project build reactor with module"
        echo "*** <modules>"
        echo "*** ..."
        echo "***     <module>$module_dir</module>"
        echo "*** ..."
        echo "*** </modules>"
        echo "*** "
    fi
}

## print git path: URL + : + TAG_BRANCH
extractGitUrl(){
    local module=$1

    # is git URL
    if [[ "$module" =~ (\.git) ]]; then
        echo "$module"
        return 0
    fi

    # build git URL

    # local .git_modules
    if [[ -f "./.jsbeans_modules" ]]; then
        local git_path="$(cat .jsbeans_modules |grep "$module"|head -n 1|awk '{print "$2:$3"}')"
        if [[ -n "$git_path" ]]; then
            echo "$git_path"
            return 0
        fi

    fi

    # from git repository
    if [[ -f "$./.git" ]]; then
        local git_origin="$(git remote -v|head -n 1|awk '{print "$2"}')"
        local git_origin_branch="$(git branch|awk '/\*/{print "$2"}')"

        local module_group=$(echo $module | cut -d ":" -f 1)
        local module_name=$(echo $module | cut -d ":" -f 2)
        local module_tag=$(echo $module | cut -d ":" -f 3)
        module_tag=${module_tag:-$git_origin_branch}

        local git_url_prefix="$(echo "$git_origin"|sed 's/\(^.*\.\w*[\:\/]\).*\.git.*$/\1/')"
        local git_url_group="$(echo "$module_group"|sed 's/\./\//')"
        local git_url="${git_url_prefix}${git_url_group}/${module_name}.git"
        local git_path="${git_url}:${module_tag}"

        git ls-remote $git_url &>/dev/null && {
            echo "$git_path"
            return 0
        }
    fi

    # $JSBEANS_HOME/.git_modules
    if [[ -f "$JSBEANS_HOME/.jsbeans_modules" ]]; then
        local git_path="$(cat "$JSBEANS_HOME/.git_modules" |grep "$module"|head -n 1|awk '{print "$2:$3"}')"
        if [[ -n "$git_path" ]]; then
            echo "$git_path"
            return 0
        fi
    fi

    echo "ERROR: Git URL not found for $module" 1>&2
    return 1
}

command_init(){

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

command_build(){
    mvn -f pom.xml clean install
}

command_assembly(){
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

    command_build
    mvn -f pom-assembly.xml clean install
}

## main
if [[ "$(pwd)" = */bin ]] && [[ -f ../pom.xml ]]; then
    cd ..
fi

JSBEANS_HOME="${JSBEANS_HOME:-"$(pwd)"}"

while [[ -n "$1" ]]; do
    case "$1" in
        -h|--help|help|usage)
            shift
            print_help
            exit 0
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
            # export all functions name started with command_
            command=$1; shift
            echo "Executing command $command"
            command_${command} "$@" || {
                echo "ERROR: Failed execution of command $command" 1>&2
                exit 1
            }
            exit 0
            ;;
    esac
done

print_help
exit 0