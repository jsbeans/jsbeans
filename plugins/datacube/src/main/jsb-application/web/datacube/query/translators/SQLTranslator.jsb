{
	$name: 'DataCube.Query.Translators.SQLTranslator',
	$parent: 'DataCube.Query.Translators.Translator',

	$server: {
		$require: [
		    'DataCube.Query.QueryParser',
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Providers.SqlTableDataProvider',
		    'DataCube.Query.QueryUtils'
        ],

		$bootstrap: function(){
			TranslatorRegistry.register(this, 'DataCube.Providers.SqlTableDataProvider');
		},

		$constructor: function(providerOrProviders, cubeOrQueryEngine){
		    $base(providerOrProviders, cubeOrQueryEngine);
		},

		translateQuery: function() {
		    this._collectContextQueries();
		    var sql = this.translateQueryExpression(this.dcQuery);
		    Log.debug('Translated SQL Query: \n' + sql);
            return sql;
        },

		executeQuery: function(translatedQuery){
		    var store = this.providers[0].getStore();
		    var iterator = store.asSQL().iteratedParametrizedQuery2(
		        translatedQuery,
		        function getValue(param) {
		            return $this.params[param];
		        },
		        function getType(param) {
		            for (var i in $this.providers) {
                        return $this.queryEngine && $this.queryEngine.getParamType(param, $this.providers[i])
                                || store.config.argumentTypes[param];
                    }
		        }
		    );
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

		translateQueryExpression: function(query) {
		    var sql = '';
		    if (query.$sql) {
		        sql += this._prepareEmbeddedSQL(query.$sql, query);
		    } else {
                var columns = this._translateSelectColumns(query);
                var from  = this._translateFrom(query);
                var where = this._translateWhere(query, this._extractWhereOrHavingFilter(query, true));
                var group = this._translateGroup(query);
                //TODO: HAVING is not support filter by alias: if $filter contains alias of aggregate expression move it to $postFilter
                var having = this._translateWhere(query, this._extractWhereOrHavingFilter(query, false));
                var order = this._translateOrder(query);
                var offset = query.$offset ? ' OFFSET ' + query.$offset: '';
                var limit = query.$limit ? ' LIMIT ' + query.$limit: '';
                where = where ? ' WHERE ' + where : ' ';
                group = group ? ' GROUP BY ' + group : ' ';
                having = having ? ' HAVING ' + having : ' ';
                order = order ? ' ORDER BY ' + order : ' ';

                sql += 'SELECT ' + columns + ' FROM ' + from + where + group + having + order + offset + limit;
            }

		    if (query.$postFilter) {
		        var wrappedQuery = JSB.merge({}, query, {
		            $context: 'wrapped_' + query.$context
		        });
		        this._registerContextQuery(wrappedQuery);
		        sql = 'SELECT * FROM (' + sql + ') AS ' + this._quotedName(wrappedQuery.$context) + ' WHERE ' + this._translateWhere(wrappedQuery, wrappedQuery.$postFilter);
		    }

//		    Log.debug('Translated SQL Query: \n' + sql);
            return sql;
        },

        _generateUid: function(){
            //return JSB.generateUid();
            return '' + (this.lastId = (this.lastId||0) + 1);
        },

        _registerContextQuery:function(query){
            this.contextQueries[query.$context] = query;
        },

        _collectContextQueries:function(){
            var idx = 0;
            this.contextQueries = {};
            QueryUtils.walkSubQueries(this.dcQuery, function(query){
                if (!query.$context) query.$context = 'context_' + idx++;
                $this._registerContextQuery(query);
            });
        },

        _getQueryByContext: function(context) {
            if (!context) throw new Error('Undefined context');
            var query = this.contextQueries[context];
            if (!query) throw new Error('Unknown query context ' + context);
            return query;
        },

        _prepareEmbeddedSQL: function(sql, dcQuery){
            if (this.cube) {
            	var managedFields = this.cube.getManagedFields();
                for (var field in managedFields) if (managedFields.hasOwnProperty(field)) {
                    // is in Cube print full name
                    var binding = managedFields[field].binding;
                    for(var b in binding) {
                        if (this.providers.indexOf(binding[b].provider) != -1) {
                            var name = this._printTableName(binding[b].provider.getTableFullName()) + '.' + this._quotedName(binding[b].field) + '';
                            while(sql.indexOf('$cube.' + this._quotedName(field)) > 0) {
                                sql = sql.replace('$cube.' + this._quotedName(field), name);
                            }
                        }
                    }
                }
            }
            var fail = sql.match(/\$cube\.\".*\"/i);
            if (fail) {
                throw new Error("Unknown cube field " + fail[0]);
            }
            return sql;
        },

        _extractWhereOrHavingFilter: function(query, whereOrHaving /*where is true, having is false*/) {
            function isHaving(filteredField, filteredExpr){
                // is aggregated alias
                if (query.$select[filteredField]) {
                    var e = query.$select[filteredField];
                    if(QueryUtils.isAggregatedExpression(e)) {
                        return true;
                    }
                }
                // is not simple cube field
                if (filteredExpr == filteredField || filteredExpr.$field == filteredField) {
                    return false;
                }
                // is in groupBy expression
                for(var i in query.$groupBy) {
                    var groupByExpr = query.$groupBy[i];
                    if (JSB.isEqual(groupByExpr, filteredExpr)) {
                        return true;
                    }
                }
                return false;
            }

            var filter = QueryUtils.filterFilterByFields(query.$filter || {}, function(filteredField, filteredExpr){
                return whereOrHaving
                        ? !isHaving.call(null, filteredField, filteredExpr)
                        : isHaving.call(null, filteredField, filteredExpr);
            });
            return filter ? filter : {};
        },

        _translateSelectColumns: function(query){
            var sqlColumns = '';
            var select = query.$select;
            var i = 0;
            for (var alias in select) if (select.hasOwnProperty(alias)) {
                if (i++ > 0) sqlColumns += ', '
                // in SELECT expression force use table fields
                sqlColumns += this._translateExpression(select[alias], query, true) + ' AS ' + this._quotedName(alias);
            }
            return sqlColumns;
        },

        _translateExpression: function(exp, dcQuery, useFieldNotAlias) {

            function translateGlobalAggregate(subExp, func){
                var subQuery = JSB.merge({}, dcQuery, {
                    $context: ''+dcQuery.$context+'_globAgg_' + $this._generateUid()
                });
		        $this._registerContextQuery(subQuery);
                var column = $this._translateExpression(subExp, subQuery, useFieldNotAlias);
		        var subAlias = 'val_'+$this._generateUid();
                var from   = $this._translateFrom(subQuery);
                var where = $this._translateWhere(subQuery, $this._extractWhereOrHavingFilter(subQuery, true));
                var having = $this._translateWhere(subQuery, $this._extractWhereOrHavingFilter(subQuery, false));
                where = where ? ' WHERE ' + where : '';
                having = having ? ' HAVING ' + having : '';

                return '(SELECT ' + func + '(' + column + ')' + ' AS ' + $this._quotedName(subAlias) + ' FROM ' + from + where + having + ')';
            }

            function unwrapGroupByAliases(subQuery) {
                for(var i in subQuery.$groupBy) {
                    var groupByExpr = subQuery.$groupBy[i];
                    // is parent alias replace by expression
                    if (JSB.isString(groupByExpr) && dcQuery.$select[groupByExpr]) {
                        var aliasExpr = dcQuery.$select[groupByExpr];
                        subQuery.$groupBy[i] = aliasExpr;
                    }
                }
                return subQuery;
            }

            function translateMaxGroupAggregate(subExp, func){
                var subQuery = JSB.merge(true, {}, dcQuery, {
                    $context: ''+dcQuery.$context+'_maxGroup_' + $this._generateUid()
                });
		        $this._registerContextQuery(subQuery);
                var from  =  $this._translateFrom(subQuery);
                var where = $this._translateWhere(subQuery, $this._extractWhereOrHavingFilter(subQuery, true));
                var having = $this._translateWhere(subQuery, $this._extractWhereOrHavingFilter(subQuery, false));
		        var group =  $this._translateGroup(unwrapGroupByAliases(subQuery));
		        var column = $this._translateExpression(subExp, subQuery, useFieldNotAlias);
		        var subAlias = 'val_' + $this._generateUid();
                where = (where ? ' WHERE ' + where : ' ');
                having = having ? ' HAVING ' + having : '';
                group = (group ? ' GROUP BY ' + group : '');

                var subQ = 'SELECT ' + func + '(' + column + ') AS ' + $this._quotedName(subAlias) + ' FROM ' + from + where + group + having;
                return '(' +
                    'SELECT MAX(' + $this._quotedName(subAlias) + ') ' +
                    'FROM (' + subQ + ') AS ' + $this._quotedName(subQuery.$context) +
                    ')';
            }

            function translateNOperator(args, op) {
                var sql = '';
                for (var i in args) {
                    if (i > 0) sql += ' ' + op + ' ';
                    sql += $this._translateExpression(args[i], dcQuery, useFieldNotAlias);
                }
                sql += '';
                return sql;
            }

            function translateDivzOperator(args) {
                if (args.length != 2) throw new Error('Operator $divz must have two arguments');

                var sql = 'case when ';
                sql += $this._translateExpression(args[1], dcQuery, useFieldNotAlias);
                sql += " = 0 then NULL else ";
                sql += $this._translateExpression(args[0], dcQuery, useFieldNotAlias) +
                        '/' + $this._translateExpression(args[1], dcQuery, useFieldNotAlias);
                sql += ' end';
                return sql;
            }

            function translateSubQuery(subQuery){
                return $this.translateQueryExpression(subQuery);
            }

            function translateCaseExpression($cond, $then, $else){
                var sql = 'case when ';
                sql += $this._translateWhere(dcQuery, $cond);
                sql += " then ";
                sql += $this._translateExpression($then, dcQuery, useFieldNotAlias);
                sql += " else ";
                sql += $this._translateExpression($else, dcQuery, useFieldNotAlias);
                sql += ' end';
                return sql;
            }

            if (JSB.isString(exp)) {
                if (exp.match(/^\$\{.*\}/g)) {
                    // is parameter value - as is
                    return exp;
                } else {
                    // is field
                    return this._translateField(exp, dcQuery.$context, useFieldNotAlias);
                }
            }

            if (exp == 1 || exp == -1) {
                return exp;
            }

            if (JSB.isArray(exp)) {
                var sql = '';
                for (var i in exp) {
                    if (i > 0) sql += ', ';
                    sql += $this._translateExpression(exp[i], dcQuery, useFieldNotAlias);
                }
                sql += '';
                return sql;

            }

            if (!JSB.isPlainObject(exp)) {
                throw new Error('Expected object expression not ' + exp);
            }



            if (exp.$select) {
                // sub query expression
                return '(' + translateSubQuery(exp) + ')';
            }

		    if (exp.$sql) {
		        return '(' + this._prepareEmbeddedSQL(exp.$sql, dcQuery) + ')';
		    }


            var op = Object.keys(exp)[0];
            // const or field
            switch(op) {
                case '$const':
                    if (JSB.isString(exp[op])) {
                        return "'" + exp[op] + "'"
                    } else if (JSB.isNumber(exp[op])) {
                        return '' + exp[op];
                    } else if (exp[op] == null) {
                        return 'NULL';
                    }
                    throw new Error('Unsupported $const type ' + typeof exp[op]);
                case '$field':
                case '$context':
                    if (!exp.$field) throw new Error('Field $field is not defined:' + JSON.stringify(exp));
                    return this._translateField(
                            exp.$field,
                            // if context is not defined then use current
                            exp.$context || dcQuery.$context,
                            // if foreign context force use table field not alias
                            useFieldNotAlias || (exp.$context || dcQuery.$context) != dcQuery.$context
                    );
            }

            // n-operators
            switch(op) {
                case '$add':
                    return '('+ translateNOperator(exp[op], '+') + ')';
                case '$sub':
                    return '('+ translateNOperator(exp[op], '-') + ')';
                case '$mod':
                    return '('+ translateNOperator(exp[op], '%') + ')';
                case '$mul':
                    return '('+ translateNOperator(exp[op], '*') + ')';
                case '$div':
                    return '('+ translateNOperator(exp[op], '/') + ')';
                case '$divz':
                    return '('+ translateDivzOperator(exp[op]) + ')';

                case '$concat':
                    return 'CONCAT(' + translateNOperator(exp[op], ',') + ')';
                case '$concatArray':
                    return 'ARRAY[' + translateNOperator(exp[op], ',') + ']';
            }

            // transform operators
            switch(op) {
                case '$if':
                    return '(' + translateCaseExpression(exp[op].$cond, exp[op].$then, exp[op].$else) + ')';

                case '$greatest':
                    return 'GREATEST(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$least':
                    return 'LEAST(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';

                case '$splitString':
                    return 'string_to_array(' + this._translateExpression(exp[op].$field, dcQuery, useFieldNotAlias) + ", '" + exp[op].$separator + "'" + ')';
                case '$substring':
                    return 'substring(' + this._translateExpression(exp[op].$field, dcQuery, useFieldNotAlias) + " for " + exp[op].$length + ')';
                case '$trim':
                    return 'TRIM(both from ' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';

                case '$toInt':
                    return 'CAST((' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ' ) as int)';
                case '$toDouble':
                    return 'CAST((' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ' ) as double precision)';
                case '$toBoolean':
                    return 'CAST((' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ' ) as boolean)';
                case '$toString':
                    return 'CAST((' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ' ) as varchar)';
                case '$toDate':
                    return 'CAST((' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ' ) as date)';

                case '$dateYear':
                    return 'extract(isoyear from ' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$dateMonth':
                    return 'extract(month from ' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$dateTotalSeconds':
                    return 'extract(epoch from ' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';

                case '$dateIntervalOrder':
                    return 'CAST((extract(epoch from ' + this._translateExpression(exp.$dateIntervalOrder.$field, dcQuery, useFieldNotAlias) + ')/' + exp.$dateIntervalOrder.$seconds + ') as int)';
            }

            // aggregate operators
            switch(op) {
                case '$distinct':
                    return 'DISTINCT(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$first':
                    return 'FIRST(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$last':
                    return 'LAST(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$count':
                    return 'COUNT(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$sum':
                    return 'SUM(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$max':
                    return 'MAX(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$min':
                    return 'MIN(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$avg':
                    return 'AVG(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$array':
                case '$flatArray':
                    return 'ARRAY_AGG(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$expandArray':
                    return 'UNNEST(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
            }

            // global sub query operators
            switch(op) {
                case '$gmax':
                    return '(' + translateGlobalAggregate(exp[op], 'MAX') + ')';
                case '$gmin':
                    return '(' + translateGlobalAggregate(exp[op], 'MIN') + ')';
                case '$gcount':
                    return '(' + translateGlobalAggregate(exp[op], 'COUNT') + ')';
                case '$gsum':
                    return '(' + translateGlobalAggregate(exp[op], 'SUM') + ')';

                case '$grmaxsum':
                    return '(' + translateMaxGroupAggregate(exp[op], 'SUM') + ')';
                case '$grmaxavg':
                    return '(' + translateMaxGroupAggregate(exp[op], 'AVG') + ')';
                case '$grmaxcount':
                    return '(' + translateMaxGroupAggregate(exp[op], 'COUNT') + ')';
            }

            throw new Error('Unsupported select expression ' + op);
        },

        _isAliasField: function(field, context) {
            var query = this._getQueryByContext(context);
            return !!query.$select[field];
        },

        _translateField: function(field, context, useFieldNotAlias) {
            /** notes:
                * В подзапросах нельзя использовать алиасы из других запросов
            */
            // is allow use aliases
            if (!useFieldNotAlias) {
                // is alias return as is
                if (this._isAliasField(field, context)) {
                    return this._quotedName(field);
                }
            }

            return this._translateCubeField(field, context);
        },

        _translateCubeField: function(field, context){
            if (this.cube) {
            	var managedFields = this.cube.getManagedFields();
                if (!managedFields[field]) {
                    throw new Error('Cube has no field ' + field);
                }
                var binding = managedFields[field].binding;
                for(var b in binding) {
                    if (this.providers.indexOf(binding[b].provider) != -1) {
                        return this._printFieldTableAlias(field, context, binding[b].provider) + '.' + this._quotedName(binding[b].field);
                    }
                }
            } else {
                for(var i in this.providers){
                    if(this.providers[i].extractFields()[field]) {
                        return this._printFieldTableAlias(field, context, this.providers[i]) + '.' + this._quotedName(field);
                    }
                }
                throw new Error('Has no providers with field ' + field);
            }
        },

        _printTableAlias: function(context, provider){
            if (provider) {
                var idx = this.providers.indexOf(provider);
                if (idx > 0) {
                    return this._quotedName(context + '_join_' + idx);
                }
            }
            return this._quotedName(context);
        },

        _printFieldTableAlias: function(field, context, provider){
            if (!!context) {
                return this._printTableAlias(context, provider);
            } else {
                return this._printTableName(provider.getTableFullName());
            }
        },

        _printTableName: function(tableName){
            if (tableName.startsWith('"') && tableName.endsWith('"')) {
                return tableName;
            } else {
                var names = tableName.split(".");
                var name = '"';
                for(var i in names) {
                    name += names[i];
                    if (i < names.length - 1) {
                        name += '"."'
                    }
                }
                name += '"';
                return name;
            }
        },

        _quotedName: function(name, isAlias) {
            if (name.indexOf('"') != -1) {
                name = name.replace(new RegExp('"', 'g'), '""');
            }
            return '"' + name + '"';
        },

        _translateFrom: function(query) {
            function translateJoinWith(leftProvider, joinedProviders){
                var sqlJoins = '';
                var managedFields = $this.cube.getManagedFields();
                for(var p in $this.providers) if ($this.providers[p] != leftProvider) {
                    var rightProvider = $this.providers[p];

                    var on = '';
                    for(var f in managedFields){
                        var binding = managedFields[f].binding;
                        var leftPosition = binding.length;
                        for(var b = 0; b < binding.length; b++) {
                            if (binding[b].provider == leftProvider) {
                                leftPosition = b;
                            }
                        }
                        for(var b = leftPosition; b < binding.length; b++) {
                            if (binding[b].provider == rightProvider) {
                                joinedProviders.push(rightProvider);

                                if (on.length > 0) on += ' AND ';
                                on += $this._printTableAlias(query.$context, rightProvider) + '.' + $this._quotedName(binding[b].field) +
                                       ' = ' + $this._printTableAlias(query.$context, leftProvider) + '.' + $this._quotedName(binding[leftPosition].field);
//                                on += $this._printTableName(rightProvider.getTableFullName()) + '.' + $this._quotedName(binding[b].field) +
//                                       ' = ' + $this._printTableName(leftProvider.getTableFullName()) + '.' + $this._quotedName(binding[leftPosition].field);
                            }
                        }
                    }
                    if (on.length > 0) {
                        var tableAlias = $this._printTableAlias(query.$context, rightProvider);
                        sqlJoins += $this._printTableName(rightProvider.getTableFullName()) + ' AS ' + tableAlias + ' ON ' + on;
                    }
                }
                return sqlJoins;
            }

            // is select from sub-query
            if (query.$from) {
                var tableAlias = this._printTableAlias(query.$context, null);
                return '(' + this.translateQueryExpression(query.$from) + ') AS ' + tableAlias;
            }

            // is select from cube/providers
            var tableAlias = this._printTableAlias(query.$context, this.providers[0]);
            var sqlFrom = this._printTableName(this.providers[0].getTableFullName()) + ' AS ' + tableAlias;
            if (this.providers.length > 1) {
                if (!query.$context) {
                    throw new Error('Joins supported only with defined $context');
                }
                if (!this.cube) {
                    throw new Error('Joins supported only with defined cube');
                }

                var joinedProviders = this.providers.slice(0,1);
                for(var p in this.providers) {
                    var join = translateJoinWith(this.providers[p], joinedProviders);
                    if (join) {
                        sqlFrom += ' LEFT JOIN ' + join;
                    }
                }
                for(var p in this.providers) {
                    if (joinedProviders.indexOf(this.providers[p]) == -1) {
                        throw new Error('Join condition is not defined for linked providers');
                    }
                }
            }
            return sqlFrom;
        },

        _translateWhere: function(query, filterExp) {

            function translateAndOrExpressions(exps, op) {
                if (!JSB.isArray(exps)) {
                    throw new Error('Unsupported expression type (must be array) for operator ' + op);
                }

                var sql = '(';
                var cnt = 0;
                for (var i in exps) {
                    if (cnt++ > 0) sql += ' ' + op + ' ';
                    sql += translateMultiExpressions(exps[i]);
                }
                sql += ')';
                return sql;
            }

            function translateBinCondition(op, operands) {
                if (!JSB.isArray(operands)) {
                    throw new Error('Unsupported expression type (must be array) for operator ' + op + ' :' + JSON.stringify(operands));
                }
                if (op != '$not' && operands.length != 2) {
                    throw new Error('Operator ' + op + ' support only 2 operands:' + JSON.stringify(operands));
                }
                if (op == '$not' && operands.length != 1) {
                    throw new Error('Operator ' + op + ' support only 1 operands:' + JSON.stringify(operands));
                }
                if (operands[0] == null) {
                    throw new Error('First operand cannot be null:' + JSON.stringify(operands));
                }

                var sqlOp = null;
                switch(op){
                    case '$not':
                            return 'NOT ' + $this.translateMultiExpressions(operands[0]) + ' ';
                    case '$eq':
                    case '$ne':
                        if (operands[1] === null || operands[1].$const === null)
                            return $this._translateExpression(operands[0], query) +
                                    (op == '$eq' ? ' IS NULL ' : ' IS NOT NULL ');
                        else if (op == '$eq')
                            sqlOp = ' = ';
                        else
                            sqlOp = ' != ';
                        break;
                    case '$gt':
                        sqlOp = ' > '; break;
                    case '$gte':
                        sqlOp = ' >= '; break;
                    case '$lt':
                        sqlOp = ' < '; break;
                    case '$lte':
                        sqlOp = ' <= '; break;
                    case '$like':
                        sqlOp = ' ~~ '; break;
                    case '$ilike':
                        sqlOp = ' ~~* '; break;
                    case '$in':
                        sqlOp = ' IN '; break;
                    case '$nin':
                        sqlOp = ' NOT IN '; break;
                    default:
                        throw new Error('Unsupported condition expression ' + op);
                }
                return $this._translateExpression(operands[0], query) + sqlOp + $this._translateExpression(operands[1], query) + ' ';
            }

            function translateCondition(field, exp) {
                if (!JSB.isPlainObject(exp)) {
                    throw new Error('Unexpected condition operator type (must be object) ' + field + ': ' + JSON.stringify(exp));
                }
                if (Object.keys(exp).length != 1) {
                    throw new Error('Unexpected condition operators count (allow only single) on field ' + field + ': ' + JSON.stringify(exp));
                }
                var op = Object.keys(exp)[0];
                return translateBinCondition(op, [{$field: field}, exp[op]]);
            }

            function translateMultiExpressions(exps) {
                if (!JSB.isPlainObject(exps)) {
                    throw new Error('Unexpected multi condition expression type (must be object)' + ': ' + JSON.stringify(exps));
                }

                // translate by single field
                var sql = '';
                var cnt = 0;
                for (var field in exps) if (exps.hasOwnProperty(field)) {
                    if (cnt++ > 0) sql += ' AND ';
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                                sql +=  '(' + translateAndOrExpressions(exps[op], 'OR') + ')';
                                break;
                            case '$and':
                                sql += '(' + translateAndOrExpressions(exps[op], 'AND') + ')';
                                break;
                            default:
                                // $op: [left, right] expression
                                sql += translateBinCondition(op, exps[op]);
                        }
                    } else {
                        sql += translateCondition(field, exps[field]);
                    }
                }
                return sql;
            }
            var filterExp = filterExp || query.$filter;
            return filterExp ? translateMultiExpressions(filterExp) : '';
        },

        _translateGroup: function(query) {
            var sql = '';
            if (query.$groupBy) {
                if (!JSB.isArray(query.$groupBy)) {
                    throw new Error('Unsupported $groupBy expression type (must be array):' + JSON.stringify(query.$groupBy));
                }

                for (var i in query.$groupBy) {
                    if (i > 0) sql += ', ';
                    sql += $this._translateExpression(query.$groupBy[i], query);
                }
            }
            return sql;
        },

        _translateOrder: function(query) {
            var sql = '';
            if (query.$sort) {
                var sort = query.$sort;
                if (!JSB.isArray(sort)) {
                    throw new Error('Unsupported $sort expression type (must be array):' + JSON.stringify(sort));
                }
                for (var i in sort) {
                    if (i > 0) sql += ', ';
                    var val = sort[i];
                    if (val.$expr && val.$type) {
                    var key = val.$type < 0 ? ' DESC' : ' ASC';
                        sql += $this._translateExpression(val.$expr, query) + key;
                    } else {
                        var field = Object.keys(val)[0];
                        var key = val[field] < 0 ? ' DESC' : ' ASC';
                        sql += $this._translateExpression({$field:field}, query) + key;
                    }
                }
            }
            return sql;
        },

		close: function() {
		    this.destroy();
		}
	}
}