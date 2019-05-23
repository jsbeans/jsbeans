/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

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
                'visitFilter',
                'visitGlobalFilter',
                'visitPostFilter',
                'visitGroupBy',
                'visitSort',
                'visitSortExpression',
                'visitCondition',
            ]);
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