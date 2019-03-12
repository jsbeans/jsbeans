{
	$name: 'DataCube.Query.Visitors.ProxyVisitor',
	$parent: 'DataCube.Query.Visitors.Visitor',

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
        ],
        _example: function(){
            var ProxyVisitor = JSB.get('DataCube.Query.Visitors.ProxyVisitor').getClass();
            try {
                var visitor = new ProxyVisitor({
                    query: {
                        before: function(query) {

                        },
                        after: function(query) {

                        }
                    }
                });
                visitor.visit({$select: {"a": "a"}});
            } finally {
            }
        },


        $constructor: function(options){
            $base(options);

            $this.proxyWrapped([
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
                'visitFilter',
                'visitGlobalFilter',
                'visitPostFilter',
                'visitSelect',
                'visitGroupBy',
                'visitSort',
                'visitSortExpression',
                'visitCondition',
            ]);
        },

        getUndefinedView: function(name) {
            if ($this.options.getUndefinedView) {
                return $this.options.getUndefinedView.call(this, name);
            } else {
                return $base(name);
            }
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

        visitFilter: function($filter) {
            $base($filter);
        },

        visitGlobalFilter: function($globalFilter) {
            $base($globalFilter);
        },

        visitPostFilter: function($postFilter) {
            $base($postFilter);
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


        proxyWrapped: function(methods) {
            for(var i = 0; i < methods.length; i++) {
                (function(m){
                    if (!m.startsWith('visit')) {
                        throw 'Invalid visitor method ' + m;
                    }
                    var option = $this._getMethodOption(m);
                    var func = $this[m];
                    $this[m] = function (){
                        if ($this.options[option] && $this.options[option].before) {
                            $this.options[option].before.apply($this, arguments);
                        }
                        if ($this.skip) {
                            delete $this.skip;
                        } else {
                            func.apply($this, arguments);
                        }
                        if ($this.options[option] && $this.options[option].after) {
                            $this.options[option].after.apply($this, arguments);
                        }
                    };
                })(methods[i]);
            }
        },

        _getMethodOption: function(m) {
            return m.substring('visit'.length)[0].toLowerCase() + m.substring('visit'.length+1);
        },
    }
}