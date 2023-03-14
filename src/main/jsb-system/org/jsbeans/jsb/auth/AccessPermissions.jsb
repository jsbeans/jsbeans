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

    printAccessRequest: function(request) {
        var exp = '';
	    for(var i = 0, l = request.length; i < l; i++) {
	        var req = request[i];
            if(i > 0) exp += ',';
            exp += req.type + ':';
            if(req.create) exp += 'c';
            if(req.read) exp += 'r';
            if(req.write) exp += 'w';
            if(req.delete) exp += 'd';
	    }
	    return exp;
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
	            access: s[2].indexOf('!') == -1,
	            deny: s[2].indexOf('!') != -1,
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

    parseAccessPermissionsSettings: function(context) {
	    var permissions = [];
        if(context) {
	        var rules = context.find('assessRules').values();
            for(var ri = 0; ri < rules.length; ri++) {
                var rule = rules[ri];

                var perm = {
                    type: rule.find('accessPermission').value(),
                    access: rule.find('accessOrDeny').value() == 'access',
                    deny: rule.find('accessOrDeny').value() != 'access',
                    create: rule.find('accessCreate').checked(),
                    read: rule.find('accessRead').checked(),
                    write: rule.find('accessWrite').checked(),
                    delete: rule.find('accessDelete').checked(),
                };

                switch(rule.find('accessFor').value()) {
                    case 'accessForGroup':
                        perm.group = rule.find('accessForGroupId').value();
                        break;
                    case 'accessForUser':
                        perm.user = rule.find('accessForUserName').value();
                        break;
                }
                permissions.push(perm);
            }
        }
	    return {
	        applyChildren: context ? context.find('applyChildren').checked() : false,
	        permissions: permissions,
	    };
    },

}