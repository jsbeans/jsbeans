{
	$name: 'DataCube.Query.Visitors.PrintVisitor',
	$parent: 'DataCube.Query.Visitors.Visitor',

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
        ],

        $constructor: function(options){
            $base(options);

            $this._installWrappers([
                'visitQuery',
                'visitExpression',
                'visitField',
                'visitOutputField',
                'visitArray',
                'visitConst',
                'visitParam',
                'visitNamedQuery',
                'visitUnion',
                'visitJoin',
                'visitRecursive',
                'visitProvider',
                'visitCube',
                'visitSelect',
                'visitGroupBy',
                'visitSort',
                'visitSortExpression',
                'visitCondition',
            ]);
        },

        visitQuery: function(exp) {
            $base(exp);
        },

        visitExpression: function(exp) {
            $base(exp);
        },

        visitField: function(field, context) {
            $base(field, context);
        },

        visitOutputField:function(alias, exp) {
            $base(alias, exp);
        },

        visitArray: function(array) {
            $base(array);
        },

        visitConst: function(value, type, nativeType) {
            $base(value, type, nativeType);
        },

        visitParam: function(name) {
            $base(name);
        },

        getUndefinedView: function(name) {
            $base(name);
        },

        visitNamedQuery: function($from) {
            $base($from);
        },

        visitUnion: function($union) {
             $base($union);
        },

        visitJoin: function($join) {
             $base($join);
        },

        visitRecursive: function($recursive) {
             $base($recursive);
        },

        visitProvider: function($provider) {
             $base($provider);
        },

        visitCube: function($cube) {
             $base($cube);
        },

        visitSelect: function($select) {
            $base($select);
        },

        visitGroupBy: function($groupBy) {
            $base($groupBy);
        },

        visitSort: function($sort) {
            $base($sort);
        },

        visitSortExpression: function(expr, type){
            $base(expr, type);
        },

        visitCondition: function($filter) {
            $base($filter);
        },


        _installWrappers: function(methods) {
            for(var i = 0; i < methods.length; i++) {
                (function(m){
                    if (!m.startsWith('visit')) {
                        throw 'Invalid visitor method ' + m;
                    }
                    var option = $this._getMethodOption(m);
                    var func = $this[m];
                    $this[m] = function (){
                        Log.debug('enter ' + m + ': ' + JSON.stringify(arguments));
                        func.apply($this, arguments);
                        Log.debug('leave ' + m + ': ' + JSON.stringify(arguments));
                    };
                })(methods[i]);
            }
        },

        _getMethodOption: function(m) {
            return m.substring('visit'.length)[0].toLowerCase() + m.substring('visit'.length+1);
        },
    }
}