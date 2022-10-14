/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'JSB.Auth.AccessPermissions',
	$require: [ ],

	$singleton: true,

    parseAccessRequest: function(exp) {
	    var exps = exp.split(',');
	    var rules = [];
	    for(var i = 0, l = exps.length; i < l; i++) {
	        var e = exps[i].trim();
	        var s = e.split(':');

	        rules.push({
	            type: s[0],
	            create: s[1].indexOf('c') != -1,
	            read: s[1].indexOf('r') != -1,
	            write: s[1].indexOf('w') != -1,
	            delete: s[1].indexOf('d') != -1,
	        });
	    }
	    return rules;
    },

    parseAccessPermissions: function(exp, opts) {
        // format: user:type:crwd,@group:type:crwd,@@groupName:type:crwd
	    var exps = exp.split(',');
	    var permissions = [];
	    for(var i = 0, l = exps.length; i < l; i++) {
	        var e = exps[i].trim();
	        var s = e.split(':');

	        var perm = {
	            type: s[1].trim(),
	            create: s[2].indexOf('c') != -1,
	            read: s[2].indexOf('r') != -1,
	            write: s[2].indexOf('w') != -1,
	            delete: s[2].indexOf('d') != -1,
	        };
	        var target = s[0].trim();
	        if(target[0] == '@') {
	            if(target[1] == '@') {
	                perm.groupName = target.substring(2);
                } else {
                    perm.group = target.substring(1);
                }
	        } else {
	            perm.user = target;
	        }
	        permissions.push(perm);
	    }
	    return permissions;
    },

}