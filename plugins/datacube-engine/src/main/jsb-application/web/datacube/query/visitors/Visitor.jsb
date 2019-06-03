/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Visitors.Visitor',

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
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

        reset: function(){
            $this.flags = null;
            $this.path = [];
            $this.flagsPath = [];
            $this.queryPath = [];
        },

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
                    if(!flags) throw new Error('Visitor flags is undefined for string expression');
                    if (flags.asField || flags.asExpression) {
                        return $this.visitExpression(exp);
                    } else if (flags.asQuery) {
                        return $this.visitNamedQuery(exp);
                    }
                }

                if (exp.$select) {
                    try {
                        $this.queryPath.push(exp);
                        return $this.visitQuery(exp);
                    }finally{
                        $this.queryPath.pop();
                    }
                }

                if (JSB.isArray(exp)) {
                    return $this.visitArray(exp);
                }

                if (flags && flags.asCondition || $this._isCondition(exp)) {
                    return $this.visitCondition(exp);
                }

                if(!JSB.isObject(exp)) throw new Error('Invalid expression type, object expected');

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
                var current = this.getQuery();
                if (current.$recursive && current.$recursive.$start.$context == context) {
                    return current.$recursive.$start;
                }
                if (current.$recursive && current.$recursive.$joinedNext.$context == context) {
                    return current.$recursive.$joinedNext;
                }
                if (current.$join && current.$join.$left.$context == context) {
                    return current.$join.$left;
                }
                if (current.$join && current.$join.$right.$context == context) {
                    return current.$join.$right;
                }
                for(var i = $this.queryPath.length - 1; i >= 0; i--) {
                    if ($this.queryPath[i].$context == context) {
                        return $this.queryPath[i];
                    } else if($this.queryPath[i].$views) {
                        for(var view in $this.queryPath[i].$views) {
                            if ($this.queryPath[i].$views[view].$context == context) {
                                return $this.queryPath[i].$views[view];
                            }
                        }
                        if ($this.queryPath[i].$views[context]) {
                            return $this.queryPath[i].$views[context];
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
                if (start && $this.path[i] == '$select' && i > 0) {
                     parents.push($this.path[i-1]);
                }
            }
            return parents;
        },

        /** Returns true if current query is nested-query expression*/
        isNestedQuery: function(){
            var parents = $this.getNestedParentQueries();
            var parentQuery = parents.length > 0 ? parents[0] : null;
            return $this.queryPath.length > 1 && parentQuery == $this.queryPath[$this.queryPath.length-2];
        },

        isRoot: function() {
            return $this.queryPath.length == 1;
        },

        isCallerJoinedNext: function(){
            var caller = $this.getCaller();
            var isJoinedNext;
            for(var i = $this.path.length - 1; i >=0; i--) {
                if (isJoinedNext === false && $this.path[i] == '$joinedNext') {
                    isJoinedNext = true;
                    break;
                }
                if ($this.path[i] == caller) {
                    isJoinedNext = false;
                }
            }
            return isJoinedNext || false;
        },

        isHasPath: function(a1,a2,a3){
            /// $this.isHasPath('$recursive', '$filter');
            LOOP:
            for(var i = $this.path.length - 1; i >= arguments.length - 1; i--) {
                for(var j = 0, len = arguments.length; j < len; j++) {
                    if(arguments[j] != $this.path[i-len-1+j]) {
                        continue LOOP;
                    }
                }
                return true;
            }
            return false;
        },

        isView: function() {
            var query = $this.getQuery();
            for(var i = $this.path.length - 1; i >= 0; i--){
                var e = $this.path[i];
                if (start && JSB.isObject(e) && e.$select) {
                    break;
                }
                if (e == query) {
                    var start = true;
                }
                if (start && JSB.isString(e) && !e.startsWith('$')) {
                    return true;
                }
            }
            return false;
        },

        getCaller: function() {
            var query = $this.getQuery();
            var exp = $this.getCurrent();
            if (exp == query) {
                /// parent query
                for(var i = $this.path.length - 2; i >= 0; i--){
                    if ($this.path[i].$select) {
                        return $this.path[i];
                    }
                }
            }
            return query;
        },

        /**Returns last expression in path (current expression)*/
        getCurrent: function(){
            return $this.path[$this.path.length-1];
        },

        /***/
        getExpressionKey: function(offset){
            var offset = offset || -1;
            return JSB.isObject($this.path[$this.path.length-1]) && JSB.isString($this.path[$this.path.length+offset-1])
                ? $this.path[$this.path.length+offset-1] : null;
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

        getParam: function(name) {
            for(var i = this.queryPath.length - 1; i >= 0 ; i--) {
                var query = this.queryPath[i];
                if(query.$params && query.$params.hasOwnProperty(name)) {
                    return query.$params[name];
                }
            }
        },

        getDefinedParams: function(externalParams){
            var params = {}
            for(var i = this.queryPath.length - 1; i >= 0 ; i--) {
                var query = this.queryPath[i];
                JSB.merge(params, query.$params);
            }
            if (externalParams) {
                for(var param in externalParams) {
                    var name = param.startsWith('${') ? param.substr(2, param.length - 3) : param;
                    var def = params['${' + name + '}'] ? params['${' + name + '}'] : {};
                    def.$defaultValue = externalParams[param];
                }
            }
            return params;
        },

        getUndefinedView: function(name) {
            throw new Error('View in undefined: ' + name);
        },

        _isCondition: function(exp){
            if ($this.path.length >= 1)  {
                var prevKey = $this.path[$this.path.length - 1];
                switch(prevKey) {
                    case '$filter':
                    case '$cond':
                        return true;
                }
            }
            if (JSB.isObject(exp)) {
                var op = Object.keys(exp)[0];
                switch(op) {
                    case '$and':
                    case '$or':
                    case '$not':
                    case '$eq':
                    case '$ne':
                    case '$gt':
                    case '$gte':
                    case '$lt':
                    case '$lte':
                    case '$like':
                    case '$ilike':
                    case '$in':
                    case '$nin':
                        return true;
                }
            }
            return false;
        },

        withPath: function(k1, k2, callback) {
            try {
                var count = 0;
                var queryCount = 0;
                for(var i = 0, len = arguments.length; i < len; i++) {
                    var v = arguments[i];
                    if (JSB.isObject(v)) {
                        if (v.$select) {
                            queryCount++;
                            $this.queryPath.push(v);
                        }
                        count++;
                        $this.path.push(v);
                    } else if (JSB.isFunction(v)) {
                        break;
                    } else {
                        count++;
                        $this.path.push(v);
                    }
                }
                var callback = arguments[len - 1];
                callback.call(this);
            } finally{
                while(count--) {
                    $this.path.pop();
                }
                while(queryCount--) {
                    $this.queryPath.pop();
                }
            }
        },

        visitQuery: function(exp) {
            if(!exp.$select) throw new Error('Invalid query expression, $select is undefined');
            $this.visitQuerySource(exp);

            if (exp.$filter && Object.keys(exp.$filter).length > 0) {
                $this.visitFilter(exp.$filter);
            }

            if (exp.$globalFilter && Object.keys(exp.$globalFilter).length > 0) {
                $this.visitGlobalFilter(exp.$globalFilter);
            }

            if (exp.$groupBy && exp.$groupBy.length > 0) {
                $this.visitGroupBy(exp.$groupBy);
            }

            $this.visitSelect(exp.$select);

            if (exp.$sort && exp.$sort.length > 0) {
                $this.visitSort(exp.$sort);
            }

            if (exp.$postFilter && Object.keys(exp.$postFilter).length > 0) {
                $this.visitPostFilter(exp.$postFilter);
            }
        },

        visitQuerySource: function(exp) {
            /// visit sources: $from, $join, $union, $recursive, $cube, $provider
            if (exp.$from && JSB.isString(exp.$from)) {
                $this.withPath('$from', function(){
                    $this.visit(exp.$from, {asQuery: true});
                });
            } else if (exp.$from && JSB.isObject(exp.$from)) {
                $this.withPath('$from', function(){
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
//            var key = this.getExpressionKey();
//            if ($this.scheme[key]) {
//                $this.scheme[key].visitor.call(this, exp);
//                return;
//            }
            if (exp.$count == 1 || exp.$sum == 1) {
                return;
            }
            if (exp.$if) {
                $this.withPath('$if', '$else', function(){
                    $this.visit(exp.$if.$cond, {asCondition:true});
                });
                $this.withPath('$if', '$else', function(){
                    $this.visit(exp.$if.$then, {asExpression:true});
                });
                $this.withPath('$if', '$else', function(){
                    $this.visit(exp.$if.$else, {asExpression:true});
                });
                return;
            }
            // default visitor
            for(var op in exp) {
                switch(op) {
                    case '$cond':
                    case '$filter':
                        $this.withPath(op, function(){
                            $this.visit(exp[op], {asCondition:true});
                        });
                        return;
                }
                if (op.startsWith('$')) {
                    if (!QuerySyntax.constValueOperators[op]) {
                        $this.withPath(op, function(){
                            $this.visit(exp[op], {asExpression:true});
                        });
                    }
                } else {
                    /// detect condition `field: {$op: ...}`
                    var op2 = Object.keys(exp[op])[0];
                    if (op2.startsWith('$')) {
                        $this.visitCondition(exp);
                    }
                }
            }
        },

        visitFieldExpression: function(exp) {
            if (!(exp.$field || JSB.isString(exp))) {
                throw new Error('Invalid field expression');
            }

            var name = JSB.isString(exp) ? exp : exp.$field;
            var context = exp.$context || $this.queryPath[$this.queryPath.length-1].$context;

            $this.visitField(name, context, exp.$sourceContext);
        },

        visitField: function(field, context, sourceContext) {

        },

        visitArray: function(array) {
            for (var i = 0; i < array.length; i++) {
                $this.withPath(i, function(){
                    $this.visit(array[i], {asExpression: true});
                });
            }
        },

        visitConst: function(value, type, nativeType) {

        },

        visitParam: function(name) {

        },


        visitNamedQuery: function($from) {
//            $this.withPath($from, function(){
                var view = $this.getView($from);
                $this.visit(view, {asQuery: true});
//            });
        },

        visitUnion: function($union) {
            for (var i = 0; i < $union.length; i++) {
                $this.withPath('$union', i, function(){
                    $this.visit($union[i], {asQuery: true});
                });
            }
        },

        visitJoin: function($join) {
            $this.withPath('$join', '$left', function(){
                $this.visit($join.$left, {asQuery: true});
            });
            $this.withPath('$join', '$right', function(){
                $this.visit($join.$right, {asQuery: true});
            });
            $this.withPath('$join', '$filter', function(){
                $this.visit($join.$filter);
            });
        },

        visitRecursive: function($recursive) {
            $this.withPath('$recursive', '$start', function(){
                 $this.visit($recursive.$start, {asQuery: true});
            });
            $this.withPath('$recursive', '$joinedNext', function(){
                 $this.visit($recursive.$joinedNext, {asQuery: true});
            });
            $this.withPath('$recursive', '$filter', function(){
                 $this.visit($recursive.$filter);
            });
        },

        visitProvider: function($provider) {
        },

        visitCube: function($cube) {

        },

        visitFilter: function($filter) {
            $this.withPath('$filter', function(){
                $this.visit($filter, {asCondition:true});
            });
        },

        visitGlobalFilter: function($globalFilter) {
            $this.withPath('$globalFilter', function(){
                $this.visit($globalFilter, {asCondition:true});
            });
        },

        visitPostFilter: function($postFilter) {
            $this.withPath('$postFilter', function(){
                $this.visit($postFilter, {asCondition:true});
            });
        },

        visitSelect: function($select) {
            $this.withPath('$select',function(){
                for(var alias in $select) {
                    $this.visitOutputField(alias, $select[alias]);
                }
            });
        },

        visitOutputField:function(alias, exp) {
            $this.withPath(alias,function(){
                $this.visit(exp, {asExpression:true});
            });
        },

        visitGroupBy: function($groupBy) {
            for (var i = 0; i < $groupBy.length; i++) {
                $this.withPath('$groupBy', i, function(){
                    $this.visit($groupBy[i], {asExpression:true});
                });
            }
        },

        visitSort: function($sort) {
            for (var i = 0; i < $sort.length; i++) {
                var val = $sort[i];
                $this.withPath('$sort', i, function(){
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
                    $this.withPath(e, function(){
                        for(var i = 0; i < $filter[e].length; i++) {
                            $this.visit($filter[e][i], {asCondition:true});
                        }
                    });
                } else if (e === '$not'){
                    $this.withPath(e, function(){
                        $this.visit($filter[e], {asCondition:true});
                    });
                } else if (e.startsWith('$')) {
                    var args = $filter[e];
                    $this.withPath(e, function(){
                        $this.visit(args[0], {asExpression:true});
                        $this.visit(args[1], {asExpression:true});
                    });
                } else {
                    var op = Object.keys($filter[e])[0];
                    $this.withPath(op, function(){
                        $this.visit(e, {asField:true});
                        $this.visit($filter[e][op], {asExpression:true});
                    });
                }
            }
        },
    }
}