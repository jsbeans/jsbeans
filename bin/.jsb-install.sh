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

jsb-install-help(){
    echo
    echo 'jsb-install         - Install jsbeans or dependency package to modules directory'
    echo 'jsb-install-jsbeans - Install jsbeans '
    echo 'jsb-install-package - Install package '
    echo
    echo 'Synopsis:'
    echo '    jsb [OPTIONS] install [PACKAGE ID]'
    echo
    echo 'Options:'
    echo '    --packages-dir[=DIR_NAME] - install package in custom modules directory, eg.: `jsb install --packages-dir=thirdparty my/project:workspace`'
    echo
    echo '    Other options look at `jsb --help`'
    echo
    echo 'Package id format:'
    echo '    GIT_URL:BRANCH_TAG        - Public module identity by git repository location (need add .git to the URL)'
    echo '    PREFIX:NAME[:BRANCH_TAG]  - Local module identity transformed to `GIT_URL:TAG`.'
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
    echo 'Examples:'
    echo '    $ jsb install'
    echo '    $ jsb install my/project:workspace'
    echo '    $ jsb install --packages-dir=thirdparty my/project:workspace'
    echo
}

jsb-install() {
    module="${1:-"jsbeans"}"
    modules_dir=${jsb_packages_dir:-modules}

    # is git URL
    if [[ "$module" =~ (\.git) ]] || [[ "$module" =~ (git@) ]]; then
        module_git_path="$module"
    fi

    # check java and maven
    is_command_exists java || {
        echo 'ERROR: Java is not installed' 1>&2
        return 1
    }
    is_command_exists mvn || {
        echo 'ERROR: Maven is not installed or PATH does not contains directory with git ($MAVEN_HOME/bin)' 1>&2
        return 1
    }

    if [[ "$module" == "org.jsbeans:jsbeans" ]] || [[ "$module" == "jsbeans" ]]; then
        jsb-install-jsbeans "$@"
    else
        jsb-install-package "$@"
    fi
}

jsb-install-jsbeans() {
    # check is in jsbeans home
    [[ ! -f ".jsbeans" ]] && { echo 'ERROR: jsBeans sources not found' 1>&2; return 1; }

    # Build jsBeanss
    jsb-build || return $?

    # check jsbeans
    if [[ ! -f "./target/org.jsbeans-jsbeans.jar" ]] || [[ ! -f "./target/org.jsbeans-jsbeans-jsb-application.jar" ]]; then
        echo 'ERROR: jsBeans not found in '"./target" 1>&2;
        return 1;
    fi


    echo 'Initialize alias for jsb tool:'
    echo '    $ alias jsb=${JSBEANS_HOME}/bin/jsb '
    if ! grep -q "alias jsb=${JSBEANS_HOME}/bin/jsb" ~/.bashrc; then
        echo "alias jsb=${JSBEANS_HOME}/bin/jsb" >> ~/.bashrc
        echo
        echo 'Reenter bash session to apply alias `jsb`'
    fi
}

##
jsb-install-package() {
    is_command_exists git || {
        echo 'ERROR: Git is not installed or PATH does not contains directory with git' 1>&2
    }
##  TODO: debug setup from git URL
    local names=( )
    IFS=':' read -ra names <<< "my/project:workspace:tag"
    local module_group="${names[0]}"
    local module_name=="${names[1]}"
    local module_tag=="${names[2]-master}"

    local git_path="$(extract_module_repository_path "$module")"
    [[ -z "$git_path" ]] && { return 1; }
    local git_url="$(echo "$git_path"|sed 's/^\(.*\.git\)\:.*$/\1/')"
    local git_branch="$(echo "$git_path"|sed 's/.*\.git\:\(.*\)$/\1/')"
    local git_url_group="$(echo "$module_group"|sed 's/\./\//')"

    local module_dir=$modules_dir/$git_url_group/$module_name

    echo "Clone module git repository $git_url branch $git_branch to $module_dir"
    mkdir -p $module_dir
    git clone --recurse-submodules --branch $git_branch $git_url $module_dir || return 1
    cd $module_dir

    jsb-build || return $?

    local module_mvn_group=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.groupId -q -DforceStdout)
    local module_mvn_name=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.artifactId -q -DforceStdout)
    local module_mvn_version=$(mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.version -q -DforceStdout)

    [[ -z "$module_mvn_group" ]]   && { echo 'ERROR: Module group is undefined' 1>&2; exit 1; }
    [[ -z "$module_mvn_name" ]]    && { echo 'ERROR: Module name is undefined' 1>&2; exit 1; }
    [[ -z "$module_mvn_version" ]] && { echo 'ERROR: Module version is undefined' 1>&2; exit 1; }

    echo "*** "
    echo "*** Add module dependencies:"
    echo "*** <dependencies>"
    echo "*** ..."
    echo "***     <dependency>"
    echo "***         <artifactId>$module_mvn_name</artifactId>"
    echo "***         <groupId>$module_mvn_group</groupId>"
    echo "***         <version>$module_mvn_version</version>"
    echo "***     </dependency>"
    echo "***     <dependency>"
    echo "***         <artifactId>$module_mvn_name</artifactId>"
    echo "***         <groupId>$module_mvn_group</groupId>"
    echo "***         <version>$module_mvn_version</version>"
    echo "***         <classifier>jsb-application</classifier>"
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
}



## print git path: URL + : + TAG_BRANCH
extract_module_repository_path(){
    local module=$1

    # is git URL
    if [[ "$module" =~ (\.git) ]] || [[ "$module" =~ (git@) ]]; then
        echo "$module"
        return 0
    fi

    # build git URL

    # local .git_modules
    if [[ -f .jsbeans_packages ]]; then
        local git_path="$(cat .jsbeans_packages |grep "$module"|head -n 1|awk '{print $2":"$3}')"
        if [[ -n "$git_path" ]]; then
            echo "$git_path"
            return 0
        fi

    fi

    # from git repository
    if [[ -f .git ]]; then
        local git_origin="$(git remote -v|tail -n 1|awk '{print $2}')"
        [[ $git_origin == *.git ]] || git_origin="${git_origin}.git";
        local git_origin_branch="$(git branch|awk '/\*/{print $2}')"

        local names=( )
        IFS=':' read -ra names <<< "my/project:workspace:tag"
        local module_group="${names[0]}"
        local module_name=="${names[1]}"
        local module_tag=="${names[2]}"
        module_tag=${module_tag:-$git_origin_branch}

        local git_url_prefix="$(echo "$git_origin"|sed 's/\(^.*\.\w*[\:\/]\).*\.git.*$/\1/')"
        local git_url_group="$module_group"
        #local git_url_group="$(echo "$module_group"|sed 's/\./\//')"
        local git_url="${git_url_prefix}${git_url_group}/${module_name}.git"
        local git_path="${git_url}:${module_tag}"

        git ls-remote $git_url &>/dev/null && {
            echo "$git_path"
            return 0
        }
    fi

    # $JSBEANS_HOME/.git_modules
    if [[ -f "$JSBEANS_HOME/.jsbeans_packages" ]]; then
        local git_path="$(cat "$JSBEANS_HOME/.git_modules" |grep "$module"|head -n 1|awk '{print $2":"$3}')"
        if [[ -n "$git_path" ]]; then
            echo "$git_path"
            return 0
        fi
    fi

    echo "ERROR: Git URL not found for $module" 1>&2
    return 1
}