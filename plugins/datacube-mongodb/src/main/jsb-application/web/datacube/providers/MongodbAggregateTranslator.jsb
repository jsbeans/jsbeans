{
	$name: 'DataCube.Query.Translators.MongodbAggregateTranslator',
	$parent: 'DataCube.Query.Translators.BaseTranslator',

	$server: {
		
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Query.QueryParser',
		    'DataCube.Providers.SqlTableDataProvider',
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
		    var iterator = store.asMongodb().runCommand(translatedQuery);
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
debugger
		        $this._buildSort(aggregate, query);
		    }

		    if (query.$offset && query.$offset > 0) {
		        aggregate.pipeline.push({
		            $offset: query.$offset
		        });
		    }

		    if (query.$limit && query.$limit > 0) {
		        aggregate.pipeline.push({
		            $limit: query.$limit
		        });
		    }
		},

		_buildJoin: function(aggregate, query){
            if (/left\s*outer/i.test(query.$join.$joinType)) {
                // left outer join

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
            for(var i = 0; i < $this.providers.length; i++) {
                if ($this.providers[i].id == providerId) {
                    return $this.providers[i].getCollectionName();
                }
            }
            QueryUtils.throwError(0, 'Unknown data provider {}', providerId);
		},

		_buildMatch: function(aggregate, query, filter){

            aggregate.pipeline.push({
                $match: translateFilter(query.$filter),
            });

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

		    function translateOperator(op, exp) {
		        switch(op){
		            case '$eq':
		            case '$ne':
		            case '$lt':
		            case '$gt':
		            case '$lte':
		            case '$gte':
		                var res = {};
		                res[op] = [];
		                for(var i = 0; i < exp.length; i++) {
		                    res[op][i] = $this._translateExpression(aggregate, query, exp[i]);
		                }
		                return res;
                    // TODO other operators
		        }
		        QueryUtils.throwError(0, 'Invalid or unsupported operator {}', op);
		    }
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
                    var name = $this._translateExpression(aggregate, query, exp);
                } else {
                    var projectStage = aggregate.pipeline[aggregate.pipeline.length - 1];
                    if (!projectStage.$project) {
                        aggregate.pipeline.push(projectStage = {$project: {}});
                    }

                    var  name = '_sort' + MD5.md5(JSB.stringify(exp));
                    projectStage.$project[name] = $this._translateExpression(aggregate, query, exp);
                }

                sort[name] = type;
            }
		},

		_buildGroupBy: function(aggregate, query){
		    var group = {_id:{}};

            for(var alias in query.$select) {
                var e = query.$select[alias];
                if (QueryUtils.isAggregatedExpression(e)) {
                    group[alias] = $this._translateExpression(aggregate, query, e);
                } else {
                    group._id[alias] = $this._translateExpression(aggregate, query, e);
                }
            }

            for (var i = 0; i < query.$groupBy.length; i++) {
                var e = query.$groupBy[i];
                var exp = $this._translateExpression(aggregate, query, e);

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
debugger
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
		},

		_buildProject: function(aggregate, query){
		    var project = {};
		    var hasGroupBy = query.$groupBy && query.$groupBy.length > 0;
            for(var alias in query.$select) {
                var e = query.$select[alias];

                if (e.$select || query.$join) {
//debugger
                    project[alias] = $this._translateExpression(aggregate, query, e);

                } else if (hasGroupBy) {

                    if (QueryUtils.isAggregatedExpression(e)) {
                       project[alias] = 1;
                    } else {
                        project[alias] = '$_id.' + alias;
                    }

                } else {

                    project[alias] = $this._translateExpression(aggregate, query, e);

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

		_translateExpression: function(aggregate, query, exp){
		    if (JSB.isString(exp)) {
		        exp = {$field:exp};
		    }

		    QueryUtils.throwError(JSB.isObject(exp), 'Unexpected expression type {}', typeof exp);

		    if (exp.$select) {
		        return '$' + $this._getContextFieldName(exp.$context) + '.' + Object.keys(exp.$select)[0];
		    }
		    QueryUtils.throwError(!exp.$select, 'Sub-query expression not supported');
//debugger
		    if (exp.$const) {
		        return { $literal: exp.$const };
		    }
		    if (exp.$field) {
                return $this._translateField(aggregate, query, exp.$field, exp.$context || query.$context);
		    }

		    var op = Object.keys(exp)[0];
		    switch(op){
                case '$coalesce':
                    var firstIfNull = ifNull = [$this._translateExpression(aggregate, query, exp[op][0])];
                    for(var i = 1; i < exp[op].length; i++) {
                        if (i == exp[op].length -1) {
                            ifNull.push($this._translateExpression(aggregate, query, exp[op][i]));
                        } else {
                            ifNull.push({$ifNull: [$this._translateExpression(aggregate, query, exp[op][i])]});
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
                    return {$sqrt: $this._translateExpression(aggregate, query, exp[op])};
                case '$pow2':
                    return {$pow: [$this._translateExpression(aggregate, query, exp[op]), 2]};

                case '$concat':
                    return {$concatArrays: translateArguments(exp[op])};

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
                    return {$sum:   $this._translateExpression(aggregate, query, exp[op])};
                case '$avg':
                    return {$avg:   $this._translateExpression(aggregate, query, exp[op])};
                case '$first':
                    return {$first: $this._translateExpression(aggregate, query, exp[op])};
                case '$last':
                    return {$last:  $this._translateExpression(aggregate, query, exp[op])};
                case '$any':
                    return {$first: $this._translateExpression(aggregate, query, exp[op])};
                case '$max':
                    return {$max:   $this._translateExpression(aggregate, query, exp[op])};
                case '$min':
                    return {$min:   $this._translateExpression(aggregate, query, exp[op])};
                case '$array':
                    return {$push:  $this._translateExpression(aggregate, query, exp[op])};
                case '$count':
                    if (exp[op] == 1) {
                        return {$sum: 1};
                    } else {
                        return {
                            $sum: {
                                $cond: {
                                    if: {$eq: [$this._translateExpression(aggregate, query, exp[op]), null]},
                                    then: 0,
                                    else: 1,
                                }
                            }
                        };
                    }
		    }

            throw new Error('Unsupported expression operator ' + op);

            function translateArguments(args){
                var res = [];
                for(var i = 0; i < args.length; i++){
                    res[i] = $this._translateExpression(aggregate, query, args[i]);
                }
                return res;
            }
		},

		_translateField: function(aggregate, query, field, context) {

		    if (query.$context != context){
                if (query.$join) {
                    if (query.$join.$left.$context == context) {
                        return '$' + field;
                    }
                    if (query.$join.$right.$context == context) {
                        return '$' + $this._getContextFieldName(context) + '.' + field;
                    }
                }
                return declareVar();
            }
            return '$' + field;

            function declareVar(){
                QueryUtils.throwError(aggregate.let, 'Unexpected external field {} in {}', field, query.$context);
                aggregate.let[field] ='$' + field;
                return '$$' + field;
            }
		},

		_getContextFieldName: function(context){
		    return MD5.md5(context);
		},
	}
}