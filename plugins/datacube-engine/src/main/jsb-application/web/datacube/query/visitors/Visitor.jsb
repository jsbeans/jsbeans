{
	$name: 'DataCube.Query.Visitors.Visitor',

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
        ],

        $constructor: function(options){
            $this.options = JSB.merge({
                cached: false,
            }, options);
        },

        flags: null,
        path: [],
        flagsPath: [],
        queryPath: [],


        visit: function(exp, flags) {
            try {
                if (JSB.isObject(exp)) {
                    for(var i = $this.path.length - 1; i >= 0; i--) {
                        if ($this.path[i] == exp) {
                            // break circle recursion
                            return;
                        }
                    }
                }

                $this.path.push(exp);
                $this.flagsPath.push($this.flags = flags||{});

                if (JSB.isString(exp)) {
                    if (exp.match(/^\$\{.*\}/g)) {
                        return $this.visitParam(exp);
                    }
                    QueryUtils.throwError(flags, 'Visitor flags is undefined for string expression');
                    if (flags.asField || flags.asExpression) {
                        return $this.visitExpression(exp);
                    } else if (flags.asQuery) {
                        return $this.visitNamedQuery(exp);
                    }
                }

                if (exp.$select) {
                    return $this.visitQuery(exp);
                }

                if (JSB.isArray(exp)) {
                    return $this.visitArray(exp);
                }

                if (flags && flags.asCondition || exp.$and || exp.$or || exp.$not || $this._isCondition()) {
                    return $this.visitCondition(exp);
                }

                QueryUtils.throwError(JSB.isObject(exp), 'Invalid expression type, object expected');

                return $this.visitExpression(exp);
            }finally{
                $this.path.pop();
                $this.flagsPath.pop();
            }
        },

        /**Returns current query if context is undefined or query/view by context or view by name*/
        getQuery: function(context){
            if (context) {
                if (JSB.isObject(context)) {
                    return context;
                }
                for(var i = $this.queryPath.length - 1; i >= 0; i--) {
                    if ($this.queryPath[i].$context == context) {
                        return $this.queryPath[i];
                    } else {
                        for(var view in $this.queryPath[i].$views) {
                            if ($this.queryPath[i].$views[view].$context == context) {
                                return $this.queryPath[i].$views[view];
                            }
                        }
                    }
                }
                return $this.getView(context);
            }
            return $this.queryPath[$this.queryPath.length - 1];
        },

        /**Return parent queries of current nested query*/
        getNestedParentQueries: function(){
            var current = this.getQuery();
            var start = false;
            var parents = [];
            for(var i = $this.path.length - 1; i >= 0; i--) {
                if ($this.path[i] == current) {
                    start = true;
                }
                if (start && $this.path[i] == '$select') {
debugger;
                    parents.push($this.path[i-1]);
                }
            }
            return parents;
        },

        /**Returns last expression in path (current expression)*/
        getCurrent: function(){
            return $this.path[$this.path.length-1];
        },


        getView: function(name) {
            for (var i = $this.queryPath.length - 1; i >= 0; i--) {
                var query = $this.queryPath[i];
                if(query.$views && query.$views[name]) {
                    return query.$views[name];
                }
            }

            return $this.getUndefinedView(name);
        },

        getUndefinedView: function(name) {
            throw new Error('View in undefined: ' + name);
        },

        _isCondition: function(){
            if ($this.path.length > 1) return false;
            var prevKey = $this.path[$this.path.length - 1];
            switch(prevKey) {
                case '$filter':
                case '$cond':
                    return true;
            }
            return false;
        },

        visitWithPath: function(k1,k2,callback) {
            try {
                var count = 0;
                for(var i = 0; i < arguments.length; i++, count++) {
                    if(JSB.isString(arguments[i])) {
                        $this.path.push(arguments[i]);
                    } else {
                        break;
                    }
                }
                var callback = arguments[arguments.length - 1];
                callback.call(this);
            } finally{
                while(count--) {
                    $this.path.pop();
                }
            }
        },

        visitQuery: function(exp) {
            QueryUtils.throwError(exp.$select, 'Invalid query expression, $select is undefined');
            try {
                $this.queryPath.push(exp);

                /// visit sources: $from, $join, $union, $recursive, $cube, $provider
                if (exp.$from && JSB.isString(exp.$from)) {
                    $this.visitWithPath('$from', function(){
                        $this.visit(exp.$from, {asQuery: true});
                    });
                } else if (exp.$from && JSB.isObject(exp.$from)) {
                    $this.visitWithPath('$from', function(){
                        $this.visit(exp.$from, {});
                    });
                } else if (exp.$provider) {
                    $this.visitProvider(exp.$provider);
                } else if (exp.$join) {
                    $this.visitJoin(exp.$join);
                } else if (exp.$union) {
                    $this.visitUnion(exp.$union);
                } else if (exp.$recursive) {
                    $this.visitRecursive(exp.$recursive);
                } else {
                    $this.visitCube(exp.$cube||null);
                }

                if (exp.$filter && Object.keys(exp.$filter).length > 0) {
                    $this.visitWithPath('$filter', function(){
                        $this.visit(exp.$filter, {asCondition:true});
                    });
                }

                if (exp.$globalFilter && Object.keys(exp.$globalFilter).length > 0) {
                    $this.visitWithPath('$globalFilter', function(){
                        $this.visit(exp.$globalFilter, {asCondition:true});
                    });
                }

                if (exp.$groupBy && exp.$groupBy.length > 0) {
                    $this.visitGroupBy(exp.$groupBy);
                }

                $this.visitSelect(exp.$select);

                if (exp.$sort && exp.$sort.length > 0) {
                    $this.visitSort(exp.$sort);
                }

                if (exp.$postFilter && Object.keys(exp.$postFilter).length > 0) {
                    $this.visitWithPath('$postFilter', function(){
                        $this.visit(exp.$postFilter, {asCondition:true});
                    });
                }

            }finally{
                $this.queryPath.pop();
            }
        },

        visitExpression: function(exp) {
            if (JSB.isObject(exp) && exp.hasOwnProperty('$const')) {
                return $this.visitConst(exp.$const, exp.$type, exp.$nativeType);
            }

            if (exp.$field || $this.flags && $this.flags.asField || JSB.isString(exp) && $this.flags && $this.flags.asExpression) {
                return $this.visitFieldExpression(exp);
            }

            $this.visitAnyExpression(exp);
        },

        visitAnyExpression: function(exp) {
            for(var op in exp) {
                if (!QuerySyntax.constValueOperators[op]) {
                    $this.visitWithPath(op, function(){
                        $this.visit(exp[op], {asExpression:true});
                    });
                }
            }
        },

        visitFieldExpression: function(exp) {
            QueryUtils.throwError(exp.$field || JSB.isString(exp), 'Invalid field expression');

            var name = JSB.isString(exp) ? exp : exp.$field;
            var context = exp.$context || $this.queryPath[$this.queryPath.length-1].$context;

            $this.visitField(name, context, exp.$sourceContext);
        },

        visitField: function(field, context, sourceContext) {

        },

        visitArray: function(array) {

        },

        visitConst: function(value, type, nativeType) {

        },

        visitParam: function(name) {

        },


        visitNamedQuery: function($from) {
            var view = $this.getView($from);
            $this.visit(view, {asQuery: true});
        },

        visitUnion: function($union) {
            for (var i = 0; i < $union.length; i++) {
                $this.visit($union[i], {asQuery: true});
            }
        },

        visitJoin: function($join) {
             $this.visit($join.$left, {asQuery: true});
             $this.visit($join.$right, {asQuery: true});
             $this.visit($join.$filter);
        },

        visitRecursive: function($recursive) {
             $this.visit($recursive.$start, {asQuery: true});
             $this.visit($recursive.$joinedNext, {asQuery: true});
             $this.visit($recursive.$filter);
        },

        visitProvider: function($provider) {
        },

        visitCube: function($cube) {

        },

        visitSelect: function($select) {
            for(var alias in $select) {
                $this.visitOutputField(alias, $select[alias]);
            }
        },

        visitOutputField:function(alias, exp) {
            $this.visitWithPath(alias,function(){
                $this.visit(exp, {asExpression:true});
            });

        },

        visitGroupBy: function($groupBy) {
            for (var i = 0; i < $groupBy.length; i++) {
                $this.visit($groupBy[i]);
            }
        },

        visitSort: function($sort) {
            for (var i = 0; i < $sort.length; i++) {
                var val = $sort[i];
                $this.visitWithPath(i, function(){
                    if (val.$expr && val.$type) {
                        $this.visitSortExpression(val.$expr, val.$type);
                    } else {
                        var field = Object.keys(val)[0];
                        $this.visitSortExpression(field, val[field]);
                    }
                });
            }
        },

        visitSortExpression: function(expr, type){
            $this.visit(expr, {asExpression: true});
        },

        visitCondition: function($filter) {
            for(var e in $filter) {
                if (e === '$or' || e === '$and') {
                    $this.visitWithPath(e, function(){
                        for(var i = 0; i < $filter[e].length; i++) {
                            $this.visit($filter[e][i], {asCondition:true});
                        }
                    });
                } else if (e === '$not'){
                    $this.visitWithPath(e, function(){
                        $this.visit($filter[e], {asCondition:true});
                    });
                } else if (e.startsWith('$')) {
                    var args = $filter[e];
                    $this.visitWithPath(e, function(){
                        $this.visit(args[0], {asExpression:true});
                        $this.visit(args[1], {asExpression:true});
                    });
                } else {
                    var op = Object.keys($filter[e])[0];
                    $this.visitWithPath(op, function(){
                        $this.visit(e, {asField:true});
                        $this.visit($filter[e][op], {asExpression:true});
                    });
                }
            }
        },
    }
}