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
    echo 'jsb-install - Install jsbeans or dependency package as submodule'
    echo
    echo 'Synopsis:'
    echo '    $ jsb [OPTIONS] install GIT_URL[:BRANCH_TAG]'
    echo '    $ jsb [OPTIONS] install PACKAGE[:BRANCH_TAG]'
    echo
    echo 'Options:'
    echo '    --packages-dir[=DIR_NAME] - Install package to custom modules directory, eg.: `jsb install --packages-dir=thirdparty examples/hello`'
    echo '    --dir=DIR_NAME            - Install package to custom directory, eg.: `jsb install --dir=thirdparty examples/hello`'
    echo '    --git-submodule           - Clone package repo as Git submodule (add to .submodules)'
    echo
    echo '    Other options look at `jsb --help`'
    echo
    echo 'Package id format:'
    echo '    GIT_URL:BRANCH_TAG           - Install package from Git URL and branch'
    echo '    NAMESPACE:NAME[:BRANCH_TAG]  - Relative module identity transformed to Git URL'
    echo '                                 Git repository extracted from (first of):'
    echo '                                   1. From file .jsbeans_packages is record exist;'
    echo '                                   2. Find current git repository, if found get server from `git remote -v` and build git URL;'
    echo '                                   3. From file `${JSBEANS_HOME}/.jsbeans_packages` if record with module exists;'
    echo '                                   4. If ${JSBEANS_HOME} repository has remote then get server from `git remote -v` and build git URL.'
    echo
    echo 'Examples:'
    echo '    # Build and install jsBeans (execute in jsBeans repo/home directory)'
    echo '    $ jsb install'
    echo
    echo '    # Clone, build and install package to default directory (./modules/PACKAGE_NAME)'
    echo '    $ jsb install jsbeans/jsbeans-workspace:master'
    echo
    echo '    # Install package as Git submodule'
    echo '    $ jsb --git-submodule install jsbeans/jsbeans-workspace:master'
    echo
    echo '    # Install submodule: clone, build and install package by Git URL'
    echo '    $ jsb install https://github.com/jsbeans/jsbeans.git:master'
    echo
    echo '    # Clone, build and install package to custom packages directory (./thirdparty/PACKAGE_NAME)'
    echo '    $ jsb install --packages-dir=thirdparty jsbeans/jsbeans-workspace'
    echo
}

jsb-install() {
    local package="$1"

    # check java and maven
    is_command_exists java || {
        echo 'ERROR: Java is not installed' 1>&2
        return 1
    }
    is_command_exists mvn || {
        echo 'ERROR: Maven is not installed or PATH does not contains directory with git ($MAVEN_HOME/bin)' 1>&2
        return 1
    }
    if [[ -z "$package" ]]; then
        jsb-install-jsbeans
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
    local package_or_path="$1"
    local package=
    local git_path=
    local git_url=
    local git_branch=
    local modules_dir=${jsb_packages_dir:-modules}

    is_command_exists git || {
        echo 'ERROR: Git is not installed or PATH does not contains directory with git' 1>&2
    }

    # is git URL or NAMESPACE:NAME:BRANCH
    if [[ "$package_or_path" =~ (\.git) ]] || [[ "$package_or_path" =~ (git@) ]]; then
        git_branch="$(echo "$package_or_path" | sed -nr 's/((git@|http\:\/\/|https\:\/\/).*)\:(.*)\:(.*)/\4/p')"
        if [[ -z "$git_branch" ]]; then
            git_path="$package_or_path:master"
            git_branch="master"
        else
            git_path="$package_or_path"
        fi
        git_url="$(echo "$git_path"|sed -nr 's/((git@|http\:\/\/|https\:\/\/).*)\:(.*)\:(.*)/\1:\3/p')"
        package="$(echo "$git_path" | sed -nr 's/((git@|http\:\/\/|https\:\/\/).*)\:(.*)\:(.*)/\3/p' | sed -r 's/(.*)\.git/\1/')"
    else
        git_path="$(extract_module_repository_path "$package_or_path")"
        git_branch="$(echo "$git_path" | sed -nr 's/((git@|http\:\/\/|https\:\/\/).*)\:(.*)\:(.*)/\4/p')"
        git_url="$(echo "$git_path"|sed -nr 's/((git@|http\:\/\/|https\:\/\/).*)\:(.*)\:(.*)/\1:\3/p')"
        package="$(echo "$git_path" | sed -nr 's/((git@|http\:\/\/|https\:\/\/).*)\:(.*)\:(.*)/\3/p' | sed -r 's/(.*)\.git/\1/')"
    fi
    [[ -z "$git_path" ]] && { return 1; }

    local module_dir="${jsb_dir:-"$modules_dir/$package"}"

    if [[ -z "$jsb_git_submodule" ]]; then
        echo "Clone module git repository '$git_url' branch '$git_branch' to '$module_dir'"
        git clone --recurse-submodules --branch $git_branch $git_url $module_dir || return 1
    else
        echo "Clone git submodule repository '$git_url' branch '$git_branch' to '$module_dir'"
        git submodule add -b $git_branch $git_url $module_dir || return 1
        cd $module_dir
        git submodule update --init --recursive
    fi
    local module_abs_dir="$(cd "$module_dir" && pwd)"

    jsb-build || return $?

    echo_info "    "
    echo_info "    Add module dependencies to your pom.xml:"
    echo_info "    <dependencies>"
    echo_info "    ..."
    jsb-list-maven-modules "$module_abs_dir"
    echo_info "    ..."
    echo_info "    </dependencies>"
    echo_info "    "
    echo_info "    And package to project parent reactor:"
    echo_info "    <modules>"
    echo_info "    ..."
    echo_info "        <module>$module_dir</module>"
    echo_info "    ..."
    echo_info "    </modules>"
    echo_info "    "
}

jsb-list-maven-modules(){
    while IFS= read -r line; do
        local m_dir=$(echo "$line" | awk '{print $1}')
        local m_group=$(echo "$line" | awk '{print $2}')
        local m_name=$(echo "$line" | awk '{print $3}')
        local m_version=$(echo "$line" | awk '{print $4}')
        local m_jsb=$(echo "$line" | awk '{print $5}')
        local m_pom=$(echo "$line" | awk '{print $6}')
        if [[ "$m_pom" != "pom" ]]; then
            echo_info "        <dependency>"
            echo_info "            <artifactId>$m_name</artifactId>"
            echo_info "            <groupId>$m_group</groupId>"
            echo_info "            <version>$m_version</version>"
            echo_info "        </dependency>"
            if [[ "$m_jsb" == "jsb-application" ]]; then
                echo_info "        <dependency>"
                echo_info "            <artifactId>$m_name</artifactId>"
                echo_info "            <groupId>$m_group</groupId>"
                echo_info "            <version>$m_version</version>"
                echo_info "            <classifier>jsb-application</classifier>"
                echo_info "        </dependency>"
            fi
        fi
    done < <(maven_list_projects "$1" | uniq)
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

    #TODO >
    # 1
    local git_path="$(find_package_url_from_file ".jsbeans_packages")"
    if [[ -n "$git_path" ]]; then
        echo $git_path
        return 0
    fi
    # 2
    local current_git_url="$(find_current_git_url)"
    if [[ -n "$current_git_url" ]]; then
        git_path= #TODO
        if [[ -n "$git_path" ]]; then
            echo $git_path
            return 0
        fi
    fi
    # 3
    local git_path="$(find_package_url_from_file "$JSBEANS_HOME/.jsbeans_packages")"
    if [[ -n "$git_path" ]]; then
        echo $git_path
        return 0
    fi
    # 4
    local current_git_url="$(find_current_git_url $JSBEANS_HOME)"
    if [[ -n "$current_git_url" ]]; then
        git_path= #TODO
        if [[ -n "$git_path" ]]; then
            echo $git_path
            return 0
        fi
    fi
    # TODO ..<

#    # local .jsbeans_packages
#    if [[ -f .jsbeans_packages ]]; then
#        local git_path="$(cat .jsbeans_packages |grep "$module"|head -n 1|awk '{print $2":"$3}')"
#        if [[ -n "$git_path" ]]; then
#            echo "$git_path"
#            return 0
#        fi
#
#    fi
#
#    # from git repository
#    if [[ -f .git ]]; then
#        # TODO refactor to new package format (only full name)
#        local git_origin="$(git remote -v|tail -n 1|awk '{print $2}')"
#        [[ $git_origin == *.git ]] || git_origin="${git_origin}.git";
#        local git_origin_branch="$(git branch|awk '/\*/{print $2}')"
#
#        local names=( )
#        IFS=':' read -ra names <<< "$module"
#        local module_group="${names[0]}"
#        local module_name=="${names[1]}"
#        local module_tag=="${names[2]}"
#        module_tag=${module_tag:-$git_origin_branch}
#
#        local git_url_prefix="$(echo "$git_origin"|sed 's/\(^.*\.\w*[\:\/]\).*\.git.*$/\1/')"
#        local git_url_group="$module_group"
#        #local git_url_group="$(echo "$module_group"|sed 's/\./\//')"
#        local git_url="${git_url_prefix}${git_url_group}/${module_name}.git"
#        local git_path="${git_url}:${module_tag}"
#
#        git ls-remote $git_url &>/dev/null && {
#            echo "$git_path"
#            return 0
#        }
#    fi
#
#    # $JSBEANS_HOME/.git_modules
#    if [[ -f "$JSBEANS_HOME/.jsbeans_packages" ]]; then
#        local git_path="$(cat "$JSBEANS_HOME/.git_modules" |grep "$module"|head -n 1|awk '{print $2":"$3}')"
#        if [[ -n "$git_path" ]]; then
#            echo "$git_path"
#            return 0
#        fi
#    fi

    echo "ERROR: Git URL not found for $module" 1>&2
    return 1
}