{
	$name: 'DataCube.Query.Translators.MongodbAggregateTranslator',
	$parent: 'DataCube.Query.Translators.BaseTranslator',

	$server: {
		
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.QuerySyntax',
		    'JSB.Store.Mongodb.Mongodb',
            'JSB.Crypt.MD5',
        ],
        
        $bootstrap: function(){
        	TranslatorRegistry.register(this);
        },

        storedViews: {},

		$constructor: function(providerOrProviders, cubeOrQueryEngine){
		    $base(providerOrProviders, cubeOrQueryEngine);
		    if ($this.cube) {
		        $this.cubeFields = $this.cube.getManagedFields();
            }
		},

		translatedQueryIterator: function(dcQuery, params){
		    return $base(dcQuery, params);
		},

		executeQuery: function(translatedQuery){
            QueryUtils.logDebug('Executing mongodb translated query: {}', JSON.stringify(translatedQuery));

		    var store = this.providers[0].getStore();

//		    translatedQuery.pipeline.push({$limit:10000});

//debugger
            var iterator = store.asMongodb().iterateAggregate(translatedQuery.aggregate, translatedQuery.pipeline);


            if (!$this.dcQuery.$select._id) {
                var oldNext = iterator.next;
                iterator.next = function() {
                    var obj = oldNext.call(this);
                    if (obj) delete obj._id;
                    return obj;
                };
            }

//		    var oldClose = iterator.close;
//		    iterator.close = function() {
//		        oldClose.call(this);
//		    };
		    return iterator;
        },

		analyzeQuery: function(translatedQuery){
		    var json = {
		        translatedQuery: translatedQuery,
		        preparedQuery: this.dcQuery,
		        params: this.params
		    };
		    return {
		        next: function(){
                    try {
                        return json;
                    } finally {
                        if (json) json = null;
                    }
		        },
		        close: function(){
		        }
		    };
		},

		translateQuery: function(){
		    var aggregate = $this.mainAggregate = {
                aggregate: null,
                pipeline: [],
                cursor: { }
		    };
		    $this._buildQuery(aggregate, $this.dcQuery);

		    $this._fixupResultFields($this.dcQuery, aggregate.pipeline);

		    return aggregate;
		},

		translateResult: function(result) {
		    return result;
		},

		close: function() {
		    $base();
		},


		_buildQuery: function(aggregate, query){
//debugger;
		    if (query.$from) {

		        var sourceQuery = JSB.isString(query.$from) ? $this.dcQuery.$views[query.$from] : query.$from;
		        $this._buildQuery(aggregate, sourceQuery);

		    } else  if (query.$provider) {

                if (!aggregate.aggregate) {
                    /// first provider use as start collection
                    aggregate.aggregate = $this._getProviderCollection(query.$provider);
                } else {
                    throw new 'Unexpected logic';
                }

                if (!$this._pipelineFirstContext) $this._pipelineFirstContext = query.$context;

            } else if (query.$join) {

                $this._buildJoin(aggregate, query);

            } else if (query.$union) {

                $this._breakTranslator('$union is not supported');
            }

            $this._buildQueryBodyPipeline(aggregate, query);
		},

		_buildQueryBodyPipeline: function(aggregate, query){
            /// https://docs.mongodb.com/v3.6/reference/command/aggregate/#dbcmd.aggregate

            if (query.$filter) {
		        $this._buildMatch(aggregate, query);
		    }

		    $this._buildJoinedSubQueries(aggregate, query);

		    if (query.$groupBy && query.$groupBy.length > 0) {
		        $this._buildGroupBy(aggregate, query);
		    }

            $this._buildProject(aggregate, query);

		    if (query.$sort && query.$sort.length > 0) {
		        $this._buildSort(aggregate, query);
		    }

		    if (query.$distinct) {
		        $this._buildDistinct(aggregate, query);
		    }

		    if (query.$offset && query.$offset > 0) {
		        aggregate.pipeline.push({
		            $skip: query.$offset
		        });
		    }

		    if (query.$limit && query.$limit > 0) {
		        aggregate.pipeline.push({
		            $limit: query.$limit
		        });
		    }
		},

		_buildJoin: function(aggregate, query){
            if (/left/i.test(query.$join.$joinType)) {

                // build left stages
                $this._buildQuery(aggregate, query.$join.$left);

                // build right stages
                var rightQuery = JSB.clone(query.$join.$right);
                if (query.$join.$filter) {
                    // embed join match filter
                    rightQuery.$filter = QueryUtils.mergeFilters(rightQuery.$filter, query.$join.$filter);
                }
                var joinedAggregate = { let: {}, pipeline: [] };
                $this._buildQuery(joinedAggregate, rightQuery);
                joinedAggregate = {
                    from:     joinedAggregate.aggregate,
                    let:      joinedAggregate.let,
                    pipeline: joinedAggregate.pipeline,
                    as:       $this._getContextFieldName(rightQuery.$context),
                };
                aggregate.pipeline.push({ $lookup: joinedAggregate });

                // filter if inner join
                var isOuter = /outer/i.test(query.$join.$joinType);
                if (!isOuter) {
                    aggregate.pipeline.push({
                        $match: (function(){
                            var match = {};
                            match[$this._getContextFieldName(rightQuery.$context)] = {$ne: null};
                            return match;
                        })()
                    });
                }

                // push to aggregate.pipeline $unwind stage
                aggregate.pipeline.push({
                    $unwind: {
                        path: '$' + $this._getContextFieldName(rightQuery.$context),
                        preserveNullAndEmptyArrays: true
                    }
                });

            } else {
                // other join types
                $this._breakTranslator('$join type is not supported (' + query.$join.$joinType + ')' );
            }
		},

		_getProviderCollection: function (providerId){
		    var provider = QueryUtils.getQueryDataProvider(providerId, $this.cube);
            return provider.getCollectionName();
		},

		_buildMatch: function(aggregate, query, filter){

		    function translateFilter(exp){
		        var and = [];
		        for(var op in exp) {
                    switch(op){
                        case '$or':
                            and.push({$or: translateAndOr(exp.$or)});
                            continue;
                        case '$and':
                            and.push({$and: translateAndOr(exp.$and)});
                           continue;
                        case '$not':
                            and.push({$not: translateFilter(exp.$not)});
                            continue;
                        default:
                            and.push(translateOperator(op, exp[op]));
                            continue;
                    }
		        }
		        return and.length == 1 ? and[0] : {$and: and};
		    }

		    function translateAndOr(arr) {
		        var res = [];
		        for(var i = 0; i < arr.length; i++) {
		            res[i] = translateFilter(arr[i]);
		        }
		        return res;
		    }

		    function isField(e) {
		        return !!e.$field || JSB.isString(e);
		    }

		    function translateOperator(op, exp) {
                function declareConditionField(){
                    var field = '_cond_' + JSB.generateUid();
                    var project = aggregate.pipeline[aggregate.pipeline.length - 1];
                    QueryUtils.throwError(project.$project, 'Last pipeline stage is not $project');
                    var cond = project.$project[field] = {};
                    switch(op) {
                        case '$eq':
                        case '$ne':
                        case '$lt':
                        case '$gt':
                        case '$lte':
                        case '$gte':
                        case '$like':
                        case '$ilike':
                        case '$in':
                        case '$nin':
                            cond[op] = [
                                $this._translateExpression(exp[0], {aggregate:aggregate, query:query}),
                                $this._translateExpression(exp[1], {aggregate:aggregate, query:query})
                            ];
                            break;
                        default:
                            QueryUtils.throwError(0, 'Invalid or unsupported operator {} for expression condition', op);
                    } // end switch
                    return field;
                }

		        switch(op) {
		            case '$eq':
		            case '$ne':
		            case '$lt':
		            case '$gt':
		            case '$lte':
		            case '$gte':
                    case '$like':
                    case '$ilike':
                    case '$in':
                    case '$nin':
                    {
                        /**Логика примерно такая:
                            - если сравнивается поле с константой, то условие вставляется в $match
                            - если любой из операндов выражение, то сначала в $project создаетсяя поле с результатом проверки, а потом в $match выполняется проверка
                        */
                        if (isField(exp[0]) && exp[1].hasOwnProperty('$const')
                            || isField(exp[1]) && exp[0].hasOwnProperty('$const')
                            ) {

//                            if (isField(exp[0]) && isField(exp[1])) {
//                                var key =   $this._translateExpression((exp[1].$context||query.$context) !== query.$context ? exp[0] : exp[1], {aggregate:aggregate, query:query, asKey:true});
//                                var value = $this._translateExpression((exp[1].$context||query.$context) !== query.$context ? exp[1] : exp[0], {aggregate:aggregate, query:query, notLiteral:true});
//                            } else {
                                var key =   $this._translateExpression(isField(exp[0]) ? exp[0] : exp[1], {aggregate:aggregate, query:query, asKey:true});
                                var value = $this._translateExpression(exp[1].hasOwnProperty('$const') ? exp[1] : exp[0], {aggregate:aggregate, query:query, notLiteral:true});
//                            }


                            var cond = {};
                            cond[key] = {};
                            if (op == '$like') {
                                cond[key].$regex = QueryUtils.likeToRegex(value);
                                cond[key].$options = 's';
                            } else if (op == '$ilike') {
                                cond[key].$regex = QueryUtils.likeToRegex(value);
                                cond[key].$options = 'si';
                            } else if (op == '$in') {
                                // TODO: $in (and [] in right side)
                                throw 'TODO';
                            } else if (op == '$nin') {
                                // TODO: $nin (and [] in right side)
                                throw 'TODO';
                            } else {
                                cond[key][op] = value;
                            }
                            return cond;
                        } else if (isField(exp[0]) && isField(exp[1])
                                && ((exp[0].$context||query.$context) !== query.$context || (exp[1].$context||query.$context) !== query.$context )
                            ) {
                            var cond = {
                                $expr: {
                                }
                            };
                            cond.$expr[op] = [];
                            cond.$expr[op][0] = $this._translateExpression(exp[0], {aggregate:aggregate, query:query}),
                            cond.$expr[op][1] = $this._translateExpression(exp[1], {aggregate:aggregate, query:query});
                            return cond;
                        } else {
                            var cond = {};
                            var key = declareConditionField();
                            cond[key] = true;
                            return cond;
                        }
                    }

                    default:
                        QueryUtils.throwError(0, 'Invalid or unsupported operator {}', op);
                } // end switch

		    }

            aggregate.pipeline.push({
                $match: translateFilter(query.$filter),
            });
		},

		_buildSort: function(aggregate, query){
		    var sort = {};
		    for(var i = 0; i < query.$sort.length; i++) {
		        var e = query.$sort[i];
		        buildSortExpression(e.$expr, e.$type);
		    }

            aggregate.pipeline.push({
                $sort: sort,
            });

            function buildSortExpression(exp, type){
                if (JSB.isString(exp) || exp.$field) {
                    var name = $this._translateField(
                                    exp.$field || exp, exp.$context || query.$context,
                                    {aggregate:aggregate, query:query, asKey: true}
                                );

                } else {
                    var projectStage = aggregate.pipeline[aggregate.pipeline.length - 1];
                    if (!projectStage.$project) {
                        aggregate.pipeline.push(projectStage = {$project: {}});
                    }

                    var  name = '_sort' + MD5.md5(JSB.stringify(exp));
                    projectStage.$project[name] = $this._translateExpression(exp, {aggregate:aggregate, query:query});
                }

                sort[name] = type;
            }
		},

		_buildGroupBy: function(aggregate, query){
		    var group = {_id:{}};

            for(var alias in query.$select) {
                var e = query.$select[alias];
                if (QueryUtils.isAggregatedExpression(e)) {
                    group[alias] = $this._translateExpression(e, {aggregate:aggregate, query:query});
                } else {
                    group._id[alias] = $this._translateExpression(e, {aggregate:aggregate, query:query});
                }
            }

            for (var i = 0; i < query.$groupBy.length; i++) {
                var e = query.$groupBy[i];
                var exp = $this._translateExpression(e, {aggregate:aggregate, query:query});

                var exists = false;
                for(var name in group._id) {
                    if (JSB.isEqual(exp, group._id[name])) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    group._id['_'+i] = exp;
                }
            }

            aggregate.pipeline.push({
                $group: group
            });
		},

		_buildDistinct: function(aggregate, query){
            var prevProject = aggregate.pipeline[aggregate.pipeline.length - 1];
            QueryUtils.throwError(prevProject.$project, 'Last pipeline stage is not $project');

		    var group = {_id:{}};
		    var project = {};
            for(var alias in prevProject.$project) if (alias !== '_queryContext') {
                group._id[alias] = '$' + alias;
                project[alias] =  '$_id.' + alias;
            }

            aggregate.pipeline.push({$group: group});
            aggregate.pipeline.push({$project: project});
		},

		_buildJoinedSubQueries: function(aggregate, query){
            for(var alias in query.$select) {
                lookupQuery(query.$select[alias], joinSubQuery);
            }

            function lookupQuery(e, callback) {
                if (e.$select) {
                    callback(e);
                    return;
                }
                if (JSB.isObject(e)) {
                    for(var x in e) {
                        lookupQuery(e[x]);
                    }
                } else if (JSB.isArray(e)) {
                    for(var i=0;i<e.length;i++){
                        lookupQuery(e[i]);
                    }
                }
            }

            function joinSubQuery(subQuery) {
		        $this._breakTranslator('Nested sub-queries is not supported');
debugger
		        // TODO
                if (!QueryUtils.extractParentForeignFields(subQuery, $this.dcQuery)) {
                    // $this.globalQueries
                    throw 'TODO';
                } else {
                    var joinedAggregate = { let: {}, pipeline: [] };
                    $this._buildQuery(joinedAggregate, subQuery);
                    joinedAggregate = {
                        from:     joinedAggregate.aggregate,
                        let:      joinedAggregate.let,
                        pipeline: joinedAggregate.pipeline,
                        as:       $this._getContextFieldName(subQuery.$context),
                    };
                    aggregate.pipeline.push({ $lookup: joinedAggregate });
                    // push to aggregate.pipeline $unwind stage
                    aggregate.pipeline.push({
                        $unwind: {
                            path: '$' + $this._getContextFieldName(subQuery.$context),
                            preserveNullAndEmptyArrays: true
                        }
                    });
                }
            }
		},

		_buildProject: function(aggregate, query){
		    var project = {};
		    var hasGroupBy = query.$groupBy && query.$groupBy.length > 0;
            for(var alias in query.$select) {
//                QueryUtils.throwError(alias !== '_id', 'Rename alias "_id", it is internal name');
                var e = query.$select[alias];

                if (e.$select || query.$join) {
//debugger
                    project[alias] = $this._translateExpression(e, {aggregate:aggregate, query:query});

                } else if (hasGroupBy) {

                    if (QueryUtils.isAggregatedExpression(e)) {
                       project[alias] = 1;
                    } else {
                        project[alias] = '$_id.' + alias;
                    }

                } else {

                    project[alias] = $this._translateExpression(e, {aggregate:aggregate, query:query});

                }
            }

            project._queryContext = {$literal: query.$context };

		    for(var val in project) {
                aggregate.pipeline.push({
                    $project: project,
                });
                return;
            }
		},

		_translateExpression: function(exp, opts){
		    if (JSB.isString(exp)) {
		        if (exp.startsWith('$')) {
		            QueryUtils.throwError(!opts.asKey, 'Variable "{}" has no support as key translation', exp);
		            var varName = exp.match(/\$\{(.*)\}/)[1];
		            return {$literal: $this.params[varName]};
		        } else {
		            exp = {$field:exp};
		        }
		    }

		    QueryUtils.throwError(JSB.isObject(exp), 'Unexpected expression type {}', typeof exp);

		    if (exp.$select) {
		        $this._breakTranslator('Nested sub-queries is not supported');
		        // TODO
		        var isGlobal = opts.aggregate.pipeline[opts.aggregate.pipeline.length-1].$unwind;
		        if(isGlobal){
		            return {$literal:null};
		        } else {
		            return '$' + $this._getContextFieldName(exp.$context) + '.' + Object.keys(exp.$select)[0];
		        }
		    }
//debugger
		    if (exp.hasOwnProperty('$const')) {
		        if (opts.notLiteral){
		            return exp.$const;
		        } else {
		            return { $literal: exp.$const };
		        }
		    }
		    if (exp.$field) {
                return $this._translateField(exp.$field, exp.$context || opts.query.$context, opts);
		    }

		    var op = Object.keys(exp)[0];
		    switch(op){
                case '$coalesce':
                    var firstIfNull = ifNull = [$this._translateExpression(exp[op][0], opts)];
                    for(var i = 1; i < exp[op].length; i++) {
                        if (i == exp[op].length -1) {
                            ifNull.push($this._translateExpression(exp[op][i], opts));
                        } else {
                            ifNull.push({$ifNull: [$this._translateExpression(exp[op][i], opts)]});
                            ifNull = ifNull[1].$ifNull;
                        }
                    }
                    return {$ifNull: firstIfNull};
                case '$add':
                    return {$add: translateArguments(exp[op])};
                case '$sub':
                    return {$subtract: translateArguments(exp[op])};
                case '$mod':
                    return {$mod: translateArguments(exp[op])};
                case '$div':
                case '$divz':
                    return {$divide: translateArguments(exp[op])};
                case '$mod':
                    return {$mod: translateArguments(exp[op])};
                case '$mul':
                    return {$mul: translateArguments(exp[op])};
                case '$sqrt':
                    return {$sqrt: $this._translateExpression(exp[op], opts)};
                case '$pow2':
                    return {$pow: [$this._translateExpression(exp[op], opts), 2]};

                case '$concat':
                    return {$concat: translateArguments(exp[op])};

                case '$if':
                    return {
                        $cond: {
                            $if: translateArguments(exp[op].$cond),
                            $then: translateArguments(exp[op].$then),
                            $else: translateArguments(exp[op].$else),
                        }
                    };
                case '$substring':
                    return {$substr: [translateArguments(exp[op].$value), 0, exp[op].$length]};
		    }

		    // aggregate accumulators
		    switch(op){
                case '$sum':
                    return {$sum:   $this._translateExpression(exp[op], opts)};
                case '$avg':
                    return {$avg:   $this._translateExpression(exp[op], opts)};
                case '$first':
                    return {$first: $this._translateExpression(exp[op], opts)};
                case '$last':
                    return {$last:  $this._translateExpression(exp[op], opts)};
                case '$any':
                    return {$first: $this._translateExpression(exp[op], opts)};
                case '$max':
                    return {$max:   $this._translateExpression(exp[op], opts)};
                case '$min':
                    return {$min:   $this._translateExpression(exp[op], opts)};
                case '$array':
                    return {$push:  $this._translateExpression(exp[op], opts)};
                case '$count':
                    if (exp[op] == 1) {
                        return {$sum: 1};
                    } else {
                        return {
                            $sum: {
                                $cond: {
                                    if: {$eq: [$this._translateExpression(exp[op], opts), null]},
                                    then: 0,
                                    else: 1,
                                }
                            }
                        };
                    }

                case '$toString':
                    return { $toString: $this._translateExpression(exp[op], opts) };
                case '$toInt':
                    return { $toInt: $this._translateExpression(exp[op], opts) };
                case '$toDouble':
                    return { $toDouble: $this._translateExpression(exp[op], opts) };
                case '$toBoolean':
                    return { $toBool: $this._translateExpression(exp[op], opts) };
                case '$toDate':
                    return { $toDate: $this._translateExpression(exp[op], opts) };
                case '$toTimestamp':
                    return { $toDouble : { $toLong: $this._translateExpression(exp[op], opts) } };

		    }

            throw new Error('Unsupported expression operator ' + op);

            function translateArguments(args){
                var res = [];
                for(var i = 0; i < args.length; i++){
                    res[i] = $this._translateExpression(args[i], opts);
                }
                return res;
            }
		},

		_translateField: function(field, context, opts) {

		    if (opts.query.$context != context){
                if (opts.query.$join) {
                    if (opts.query.$join.$left.$context == context) {
                        return opts.asKey ? field : '$' + field;
                    }
                    if (opts.query.$join.$right.$context == context) {
                        return opts.asKey
                                ? $this._getContextFieldName(context) + '.' + field
                                : {$ifNull:['$' + $this._getContextFieldName(context) + '.' + field, null]};
                    }
                }
                return declareVar();
            }
            return opts.asKey ? field : '$' + field;

            function declareVar(){
//                QueryUtils.throwError(!opts.asKey, 'Invalid field for key value');
                if (opts.aggregate.let) {
                QueryUtils.throwError(opts.aggregate.let, 'Unexpected external field {} in {}', field, opts.query.$context);
                opts.aggregate.let[field] ='$' + field;
                }
                return '$$' + field;
            }
		},

		_getContextFieldName: function(context){
		    return MD5.md5(context);
		},

		_fixupResultFields: function(query, pipeline){
		    for(var i = pipeline.length - 1; i >= 0 && pipeline.length - i <= 3; i--) {
                var prevProject = pipeline[i];
                if (prevProject.$project) {
                    break;
                }
            }
            QueryUtils.throwError(prevProject.$project, 'Last pipeline stage is not $project');

		    var project = {};

            for(var alias in query.$select) {
                project[alias] = 1;
            }
            if (Object.keys(prevProject).length > Object.keys(project).length) {
		        pipeline.push({$project:project});
            }
		},
	}
}