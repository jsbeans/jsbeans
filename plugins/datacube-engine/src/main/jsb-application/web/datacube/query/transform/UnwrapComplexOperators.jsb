{
	$name: 'DataCube.Query.Transforms.UnwrapComplexOperators',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(dcQuery, cubeOrDataProvider){
            // unwrap macros and $grmax* to complex expressions
            $this.unwrapMacros(dcQuery);
            $this.unwrapGOperators(dcQuery);
            return dcQuery;
		},

		unwrapMacros: function(dcQuery) {
            QueryUtils.walkQueries(dcQuery, {}, null, function(subQuery){
                // unwrap macros and $grmax* to complex expressions
                QuerySyntax.unwrapMacrosCurrentQuery(subQuery, dcQuery);
            });
		},

        /** Разворачивает $gr* агрегаторы в натуральные подзапросы */
		unwrapGOperators: function(dcQuery) {
            function copySource(target, source){
                if(source.$from) {
                    target.$from = JSB.clone(source.$from);
                } else if(source.$provider) {
                    target.$provider = JSB.clone(source.$provider);
                } else if(source.$join) {
                    target.$join = JSB.clone(source.$join);
                } else if(source.$union) {
                    target.$union = JSB.clone(source.$union);
                } else if(source.$recursive) {
                    target.$recursive = JSB.clone(source.$recursive);
                }
            }
		    function unwrapForQuery(query) {
                function createSubQuery(op, exp) {
                    var innerOp;
                    switch(op){
                        case '$gavg':
                        case '$gmin':
                        case '$gmax':
                        case '$gsum':
                        case '$gcount':
                            switch(op){
                                case '$gavg': innerOp = 'avg'; break
                                case '$gmin': innerOp = 'min'; break
                                case '$gmax': innerOp = 'max'; break
                                case '$gsum': innerOp = 'sum'; break
                                case '$gcount': innerOp = 'count'; break
                            }
                            var subQuery = {};
                            subQuery.$select = {};
                            subQuery.$select[innerOp] = {};
                            subQuery.$select[innerOp]['$'+innerOp] = exp;
                            subQuery.$filter = query.$filter && JSB.clone(query.$filter);
                            copySource(subQuery, query);
                            return subQuery;
                    }
                    switch(op){
                        case '$grmaxcount': innerOp = 'count'; break;
                        case '$grmaxsum': innerOp = 'sum'; break;
                        case '$grmaxavg': innerOp = 'avg'; break;

                        case '$grmax': innerOp = 'value'; break;
                        case '$grmin': innerOp = 'value'; break;
                        default:
                            throw new Error('Unknown operator ' + op);
                    }
                    return {
                        $select: (function(){
                            var sel = {};
                            switch(op){
                                case '$grmaxcount':
                                case '$grmaxsum':
                                case '$grmaxavg':
                                case '$grmax':
                                    sel['max'] = {$max: {$field: innerOp}};
                                    break;
                                case '$grmin':
                                    sel['min'] = {$min: {$field: innerOp}};
                                    break;
                                break;
                            }
                            return sel;
                        })(),
                        $from: (function(){
                            var subQuery = {};
                            subQuery.$select = {};
                            subQuery.$select[innerOp] = {};
                            if (innerOp == 'value') {
                                subQuery.$select[innerOp] = exp;
                            } else {
                                subQuery.$select[innerOp]['$'+innerOp] = exp;
                            }
                            subQuery.$groupBy = query.$groupBy && JSB.clone(query.$groupBy);
                            subQuery.$filter = query.$filter && JSB.clone(query.$filter);
                            copySource(subQuery, query);
                            return subQuery;
                        })()
                    };
                }

                function unwrapExpression(exp, setFunc) {
                    if (JSB.isObject(exp)) {
                        if (exp.$select) return; // skip subquery

                        var key = Object.keys(exp)[0];
                        if (key.startsWith('$grmax') || key.startsWith('$grmin')
                                || key == '$gmax' || key == '$gmin'
                                || key == '$gcount' || key == '$gsum' || key == '$gavg') {
                            setFunc(createSubQuery(key, exp[key]));
                        }
                        for (var f in exp) if(exp[f] != null) {
                            unwrapExpression(exp[f], function(newExp){
                               exp[f] = newExp;
                           });
                        }
                    } else if (JSB.isArray(exp)) {
                        for (var i = 0; i < exp.length; i++) {
                            unwrapExpression(exp[i], function(newExp){
                                exp[i] = newExp;
                            });
                        }
                    }
                }

                for (var alias in query.$select) if(query.$select[alias] !=null) {
                    unwrapExpression(query.$select[alias], function(newExp){
                        query.$select[alias] = newExp;
                    });
                }
            } // unwrapForQuery

            QueryUtils.walkQueries(dcQuery, {}, null, function(query){
                unwrapForQuery(query);
            });
		},
	}
}