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
                'visitQuerySource',
                'visitExpression',
                'visitAnyExpression',
                'visitFieldExpression',
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

        proxyWrapped: function(methods) {
            for(var i = 0; i < methods.length; i++) {
                (function(m){
                    if (!m.startsWith('visit')) {
                        throw 'Invalid visitor method ' + m;
                    }
                    var option = $this._getMethodOption(m);
                    if ($this.options[option]) {
                        var before = $this.options[option].before;
                        var after = $this.options[option].after;
                        var func = $this[m];
                        $this[m] = function (){
                            if (before) {
                                before.apply($this, arguments);
                            }
                            if ($this.skip) {
                                delete $this.skip;
                            } else {
                                func.apply($this, arguments);
                            }
                            if (after) {
                                after.apply($this, arguments);
                            }
                        };
                    }
                })(methods[i]);
            }
        },

        _getMethodOption: function(m) {
            return m.substring('visit'.length)[0].toLowerCase() + m.substring('visit'.length+1);
        },
    }
}