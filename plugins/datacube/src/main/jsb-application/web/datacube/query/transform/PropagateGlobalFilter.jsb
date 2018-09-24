{
	$name: 'DataCube.Query.Transforms.PropagateGlobalFilter',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],
        
        $bootstrap: function(){
        	QueryTransformer.register(this);
        },

		transform: function(dcQuery, cube){
            // embed $globalFilter to $filter/$postFilter of root and sub queries
            $this.propagateGlobalFilter(dcQuery, cube);
		    return dcQuery;
		},

        /** Встроить глобальный фильтр в фильры главного и дочерних запросов */
        propagateGlobalFilter: function(dcQuery, cube) {
            function isCubeSourceQuery(query) {
                // TODO NEW_CUBE при переходе на новый куб: заменить на определение запроса, формирующего куб
                return !query.$from;
            }

            /// collect cube filters
            var cubeFilter = {$and:[]};
            QueryUtils.walkQueries(dcQuery, {}, null, function(subQuery){
                if (subQuery.$cubeFilter && Object.keys(subQuery.$cubeFilter).length > 0){
                    if(cubeFilter.$and.indexOf(subQuery.$cubeFilter) == -1) {
                        cubeFilter.$and.push(subQuery.$cubeFilter);
                    }
                    delete subQuery.$cubeFilter;
                }
            });

            var embeddedQueries = [];
            // if global filter defined then embed it to all queries/sub queries
            if (cubeFilter.$and.length > 0) {
                // recursive find all $select
                QueryUtils.walkQueries(dcQuery, {}, null, function(subQuery){
                    if (isCubeSourceQuery(subQuery) && embeddedQueries.indexOf(subQuery) == -1) {
                        $this.embedFilterToSubQuery(
                            cube, subQuery,
                            cubeFilter.$and.length == 1 ? cubeFilter.$and[0] : cubeFilter
                        );
                        embeddedQueries.push(subQuery);
                    }
                });
            }
        },

        /** встроить дополнительный фильтр в текущий по $and с фильтрацией по названию используемого поля
        */
        embedFilterToSubQuery: function (cube, query, additionalFilter, isAccepted) {
            var inputFields = QueryUtils.extractInputFields(query, cube);
            if (Object.keys(inputFields).length == 0) {
debugger;
// TODO check
                // skip abstract query (without from)
                return;
            }

            var skipFields = this.collectSubQueryJoinFields(
                query.$filter,
                function isForeignContext(context) {
                    return !!context && context != query.$context;
                }
            );
//            //Log.debug('\nskipFields: ' + JSON.stringify(skipFields));
//            var subFilter = this.filterFilterByFields(
//                additionalFilter,
//                function isAccepted2(field){
//                    return isAccepted(field) && skipFields.indexOf(field) == -1;
//                }
//            );

            var subFilter = additionalFilter;
            if (subFilter) {
                if (!query.$filter) query.$filter = {};
                if (!query.$filter.$and) query.$filter.$and = [];
                query.$filter.$and.push(subFilter);
            }
            //Log.debug('\nembededFilter: ' + JSON.stringify(subQuery.$filter));
        },

        /** Находит и возвращает массив с названиями полей куба, используемых в фильтре для слияния (join) текущего запроса с другим/родительским
        * (формально не слияния, а привязке к строке (row) из родительского запроса).
        * Признак join поля - оператор $eq и слева и справа поля куба, но одно из полей принадлежит стороннему контексту/запорсу
        */
        collectSubQueryJoinFields: function (subQueryFilter, isForeignContext) {
            // Collect join fields. Join field is:
            // - operator is $eq and left is field and right is field and one from foreign context

            var subQueryJoinFields = [];

            function walkAndOr(array) {
                if (!JSB.isArray(array)) {
                    throw new Error('Unsupported expression type for operator ' + op);
                }

                var resultArray = [];
                for (var i = 0; i < array.length; i++) {
                    var fil = walkMultiFilter(array[i]);
                    if (fil) {
                        resultArray.push(fil);
                    }
                }
                return resultArray.length > 0 ? resultArray : null;
            }

            function walkBinaryCondition(op, args) {
                var leftFields = $this.extractFields(args[0]);
                var rightFields = $this.extractFields(args[1]);
                if (Object.keys(leftFields).length == 1 && Object.keys(rightFields).length == 1) {
                    var leftName = Object.keys(leftFields)[0];
                    var rightName = Object.keys(rightFields)[0];
                    var leftContext = leftFields[leftName].$context;
                    var rightContext = rightFields[rightName].$context;
                    if (!isForeignContext(leftContext) && isForeignContext(rightContext)) {
                        subQueryJoinFields.push(leftName);
                    }
                    if (isForeignContext(leftContext) && !isForeignContext(rightContext)) {
                        subQueryJoinFields.push(rightName);
                    }
                }
            }

            function walkMultiFilter(exps) {
                if (!JSB.isObject(exps)) {
                    throw new Error('Unsupported expression type ' + exps);
                }

                for (var field in exps) if (typeof exps[field] !== 'undefined') {
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                            case '$and':
                                walkAndOr(exps[op]);
                                break;
                            case '$not':
                                walkMultiFilter(exps[op]);
                                break;
                            case '$eq':
                                walkBinaryCondition(op, exps[op]);
                                break;
                            default:
                                // $op: [left, right] expression
                                // ignore other operators
                        }
                    } else {
                        // field: {$eq: expr}
                        var leftField = field;
                        var opp = Object.keys(exps[field])[0];
                        var rightExpr = exps[field][opp];
                        $this.walkExpressionFields(rightExpr, query, false, function(rightField, rightContext, isExp) {
                            if (isForeignContext(rightContext, rightField)) {
                                subQueryJoinFields.push(leftField);
                            }
                        });
                    }
                }
            }

            walkMultiFilter(subQueryFilter||{});
//Log.debug('\ncollectSubQueryJoinFields: ' + JSON.stringify(subQueryJoinFields));
            return subQueryJoinFields;
        },
	}
}