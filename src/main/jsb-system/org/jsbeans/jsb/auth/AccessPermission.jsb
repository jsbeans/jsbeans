/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'JSB.Auth.AccessPermission',
	$parent: 'JSB.Auth.BasicPermission',
	$require: [ 'JSB.Auth' ],

    _maxLevel: 999999,


    /**
        /// access request
        [
            {
                type: 'perm_type',
                read: true,
                write: true,
                create: true,
                delete: true,
            },
            {
                user: 'user',
                type: 'perm_type',
                read: true,
            },
        ]

        /// access permissions
        [
            {
                user: 'user',
                type: 'perm_type',
                read: true,
            },
            {
                group: 'groupId',
                type: 'perm_type',
                read: true,
                write: true,
                create: true,
                delete: true,
            },
            {
                groupName: 'groupName',
                type: 'perm_type',
                read: true,
            },
        ]
    */
	check: function(accessRequest, accessPermissions){
		var user = Auth.getUser();

		if (JSB.isString(accessPermissions)) {
		    accessPermissions = AccessPermissions.parseAccessPermissions(accessPermissions);
		} else if(!JSB.isArray(accessPermissions)) {
		    accessPermissions = [accessPermissions];
		}

        var isAdmin = Kernel.isAdmin();
        var user = Kernel.user();

        // check is admin
        if(isAdmin){
            return this.getMaxLevel();
        }


        var userId = Auth.getUserId();
        var groups = Auth.getUserGroups(userId);
        var groupNames;
        for(var i = 0, l = accessPermissions.length; i < l; i++) {
            var accessPermission = accessPermissions[i];

            if(accessPermission.type == this.getAccessPermissionType()) {

                /// check permission tags
                if(        (!accessRequest.crete || accessPermission.crete)
                        && (!accessRequest.read || accessPermission.read)
                        && (!accessRequest.write || accessPermission.write)
                        && (!accessRequest.delete || accessPermission.delete)) {

                    /// check permission owner
                    if (accessPermission.user == user
                            || accessPermission.group && groups[accessPermission.group]
                            || accessPermission.groupName &&
                                (groupNames||(groupNames=Auth.getUserGroupNames()))[accessPermission.groupName]) {

                        return this.getLevel();
                    }
                }
            }
        }

        throw new Error('Access denied: ' + accessRequest.type);
	},

    getLevel: function() {
        return this.getJsb().$expose.level;
    },

    getMaxLevel: function() {
        return this._maxLevel;
    },

    getAccessPermissionType: function() {
        return this.getJsb().$expose.id;
    },
}