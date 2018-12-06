{
	$name: 'DataCube.Query.Transforms.PropagateSourceFilters',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

        /* Когда это возможно, выносит условия фильтрации ближе к источнику запроса через цепочку $from/$join/$union;
            Для каждого условия от корня по И производится проверка, может ли оно быть применено к источнику
            (перенесено в запрос-источник), если да - выкусывается, заменяются поля, и помещается в запрос-источник,
            если нет - опять разбивается по И, проверяется и т.д.
            для $from - поле заменяется на выражение $from.$select[field]
            для $join - если все используемые в условии поля принадлежат одному запросу-источнику;
                     -- inner - всегда
                     -- left outer - удаление из правой не влияет на размер выборки, поэтому проверяется только левый запрос-источник
                     -- right outer - проверяется только для правой
            для $union - фильтр переносится во все запросы-источники
            для остальных - игнорируется

            // TODO похожую историю в определенной мере можно реализовать для $sort и $groupBy
        */
		transform: function(rootQuery, cube){
            QueryUtils.walkQueries(rootQuery, {},
                function enter(query){
                    if (query.$filter && Object.keys(query.$filter).length > 0 && (query.$from||query.$join||query.$union)) {
                        $this._propagateFilter(query, rootQuery);
                    }
                },
                null
            );
            return rootQuery;
		},

		_checkTargetQuery: function(query){

		    return true;
		},

		_propagateFilter: function(query, rootQuery){
		    function transformFilter(filter, transformField){
                var subFilter = JSB.clone(filter);
                QueryUtils.walkExpressionFields(subFilter, query, /**skipSubQuery=*/true, function(field, context){
                    var e = transformField(field, context);
                    // TODO: if $groupBy exists - only group fields
                    if (e) {
                        return e;
                    } else {
                        subFilter = null;
                    }
                });
                return subFilter;
		    }

            function propagate(filter){
                if (query.$from) {
                    var sourceQuery = JSB.isString(query.$from) ? rootQuery.$views[exp.$from] : query.$from;
                    var newFilter = transformFilter(filter, function(field, context){
                        return sourceQuery.$select[field];
                    });
                    if (newFilter) {
                        sourceQuery.$filter = QueryUtils.mergeFilters(sourceQuery.$filter, newFilter);
                        return true;
                    }
                } else if (query.$join){
                    var prevContext;
                    var inner = /inner/i.test(query.$join.$joinType);
                    var left = /left/i.test(query.$join.$joinType);
                    var right = /right/i.test(query.$join.$joinType);
                    var newFilter = transformFilter(filter, function(field, context){
                        if (prevContext && prevContext != context) {
                            return null;
                        }
                        prevContext = context;
                        if (query.$join.$left.$context == context && (inner || left)) {
                            return query.$join.$left.$select[field];
                        } else if (query.$join.$right.$context == context && (inner || right)) {
                            return query.$join.$right.$select[field];
                        }
                    });
                    if (newFilter) {
                        if (query.$join.$left.$context == prevContext && $this.checkTargetQuery(query.$join.$left)) {
                            query.$join.$left.$filter = QueryUtils.mergeFilters(query.$join.$left.$filter, newFilter);
                            return true;
                        } else if (query.$join.$right.$context == prevContext && $this.checkTargetQuery(query.$join.$left)) {
                            query.$join.$right.$filter = QueryUtils.mergeFilters(query.$join.$right.$filter, newFilter);
                            return true;
                        }
                    }
                } else if (query.$union){
                    for (var i = 0; i < query.$union.length; i++) {
                        var newFilter = transformFilter(filter, function(field, context){
                            return {$field: field};
                        });
                        query.$union[i].$filter = QueryUtils.mergeFilters(query.$union[i].$filter, newFilter);
                    }
                    return true;
                } else {
                    // other - skip
                    return false;
                }

                // if not propagated: try split

                for(var op in filter) {
                    switch(op) {
                        case '$or':
                            return;
                        case '$and': {
                            if (filter.$and.length > 1) {
                                for (var i = 0 ; i < filter.$and.length; i++) {
                                    if(propagate(filter.$and[i])) {
                                        filter.$and.splice(i--, 1);
                                    }
                                }
                                if (filter.$and.length == 0) {
                                    delete filter.$and;
                                }
                            }
                            break;
                        }
                        default: {
                            var part = {};
                            part[op] = filter[op];
                            if (propagate(part)) {
                                delete filter[op];
                            }
                        }
                    }
                }
                if (Object.keys(filter).length == 0) {
                    return true; // delete
                }
            } // end propagate()

            if (propagate(query.$filter)) {
                delete query.$filter;
            }
		}
	}
}