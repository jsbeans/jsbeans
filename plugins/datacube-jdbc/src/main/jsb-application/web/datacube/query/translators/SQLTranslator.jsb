{
	$name: 'DataCube.Query.Translators.SQLTranslator',
	$parent: 'DataCube.Query.Translators.BaseTranslator',

	$server: {
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.QuerySyntax',
		    'JSB.Store.Sql.JDBC'
        ],

		vendor: 'PostgreSQL',

        _translatedContexts: {},
        
        $bootstrap: function(){
        	TranslatorRegistry.register(this);
        },

		$constructor: function(providerOrProviders, cube){
		    $base(providerOrProviders, cube);
		    $this.config = {
		    }
		},

		translatedQueryIterator: function(dcQuery, params){
		    return $base(dcQuery, params);
		},

		executeQuery: function(translatedQuery){
		    var store = this.providers[0].getStore();
		    var iterator = store.asSQL().iteratedParametrizedQuery2(
		        translatedQuery,
		        function getValue(param) {
		            return $this.params[param];
		        },
		        function getType(param) {
		            var type = $this.getParamType(param);
		            if (type) {
		                return JDBC.toJdbcType(type);
                    }
		            return null;
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

		translateQuery: function() {
		    $this._updateVendor();
		    // translate query
		    var sql = $this.translateQueryExpression($this.dcQuery, true);
		    QueryUtils.logDebug('\n[qid="{}"] Translated SQL Query (2): \n{}', $this.dcQuery.$id, sql);
            return sql;
		},

		translateQueryExpression: function(query, asRoot) {

            var sqlSource = $this._translateSourceQueryExpression(query, asRoot);

            var sql = '';

            if (asRoot || QueryUtils.queryHasBody(query)) {
                var selectSql = '';
                for(var alias in query.$select) {
                    var exp = query.$select[alias];
                    if (selectSql.length > 0) selectSql += ', ';
                    selectSql += $this._translateExpression(exp, query);
                    selectSql += ' AS ' + $this._quotedName(alias);
                }
                sql += '('
                sql += $this._translatePart('WITH\n', function(){
                    return $this._translateWith(query);
                }, '\n');
                sql += 'SELECT ' + (query.$distinct ? 'DISTINCT ' : '') + selectSql + ' FROM ';
                sql += sqlSource;

                sql += $this._translatePart(' WHERE ', function(){
                    return $this._translateWhere(query, $this._extractWhereOrHavingFilter(query, true));
                });
                sql += $this._translatePart(' GROUP BY ', function(){
                    return $this._translateGroup(query);
                });
                sql += $this._translatePart(' HAVING ', function(){
                    return query.$groupBy && query.$groupBy.length > 0
                        ? $this._translateWhere(query, $this._extractWhereOrHavingFilter(query, false))
                        : null;
                });
                sql += $this._translatePart(' ORDER BY ', function(){
                    return $this._translateOrder(query);
                });
                sql += ')'
                if (!asRoot) {
                    sql += ' AS ' + $this._quotedName($this._translateContext(query.$context));
                }
            } else {
                sql += sqlSource;
            }

            return sql;
		},

        _updateVendor: function() {
		    var store = this.providers[0].getStore();
		    store.asSQL().connectedJDBC(function(conn){
		        $this.vendor = JDBC.getDatabaseVendor(conn);
		    });
        },

        _translateContext: function(context) {
            return context;
//            if (!$this._translatedContexts[context]) {
//                var name = $this._translatedContexts[context] = 'Q'+Object.keys($this._translatedContexts).length;
//                QueryUtils.logDebug('Query context: {} = {}',name, context);
//                return name;
//
//            }
//            return $this._translatedContexts[context];
        },

        _generateUid: function(){
            //return JSB.generateUid();
            return '' + (this.lastId = (this.lastId||0) + 1);
        },

        _extractViewKey: function (query, global){
            var key = {
                $groupBy: query.$groupBy,
                $filter: query.$filter,
                global: global
            };
            return JSON.stringify(key);
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

        _translateExpression: function(exp, dcQuery, useAlias) {

            function translateGlobalAggregate(subExp, func){
                var viewKey = $this._extractViewKey(dcQuery, true);
                if ($this.withViews && $this.withViews[viewKey]) {
                    var view = $this.withViews[viewKey];
                    for (var f in view.fields) {
                        if (JSB.isEqual(exp, view.fields[f])) {
                            return '(SELECT ' +  $this._quotedName(f) + ' FROM ' + $this._quotedName(view.name) + ')';
                        }
                    }
                } else {
                    var subQuery = JSB.merge({}, dcQuery, {
                        $context: ''+dcQuery.$context+'_globAgg_' + $this._generateUid()
                    });
                    $this._registerContextQuery(subQuery);
                    var from   = $this._translateFrom(subQuery);
                    var column = $this._translateExpression(subExp === 1 ? '*' : subExp, subQuery, useAlias);
                    var subAlias = 'val_'+$this._generateUid();
                    var where = $this._translateWhere(subQuery, $this._extractWhereOrHavingFilter(subQuery, true));
                    var having = $this._translateWhere(subQuery, $this._extractWhereOrHavingFilter(subQuery, false));
                    where = where ? ' WHERE ' + where : '';
                    having = having ? ' HAVING ' + having : '';

                    return '(SELECT ' + func + '(' + column + ')' + ' AS ' + $this._quotedName(subAlias) + ' FROM ' + from + where + having + ')';
                }
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

            function translateNOperator(args, op, wrapper) {
                var sql = '';
                for (var i in args) {
                    if (i > 0) sql += ' ' + op + ' ';
                    var arg = $this._translateExpression(args[i], dcQuery, useAlias);
                    if (wrapper) {
                        var type = QueryUtils.extractType(args[i], dcQuery, $this.cube || $this.providers[0], function(ctx){
                            return $this.contextQueries[ctx];
                        });
                        sql += wrapper(arg, i, type);
                    } else {
                        sql += arg;
                    }
                }
                sql += '';
                return sql;
            }

            function translateDivzOperator(args) {
                if (args.length != 2) throw new Error('Operator $divz must have two arguments');

                var sql = 'case when ';
                sql += $this._translateExpression(args[1], dcQuery, useAlias);
                sql += " = 0 then NULL else ";
                sql += $this._translateExpression(args[0], dcQuery, useAlias) +
                        '/' + $this._translateExpression(args[1], dcQuery, useAlias);
                sql += ' end';
                return sql;
            }

            function translateCaseExpression($cond, $then, $else){
                var sql = 'case when ';
                sql += $this._translateWhere(dcQuery, $cond);
                sql += " then ";
                sql += $this._translateExpression($then, dcQuery, useAlias);
                sql += " else ";
                sql += $this._translateExpression($else, dcQuery, useAlias);
                sql += ' end';
                return sql;
            }
            function wrapEmptyToNull(exp) {
                //disabled
                //return "case when (" + exp + ") == '' then NULL else (" + exp + ") end";
                return exp;
            }

            if (exp == '*' || exp == 1 || exp == -1) {
                return exp;
            }

            if (JSB.isString(exp)) {
                if (exp.match(/^\$\{.*\}/g)) {
                    // is parameter value - as is
                    return exp;
                } else {
                    // is field
                    return this._translateField(exp, dcQuery.$context, useAlias, dcQuery.$context);
                }
            }

            if (JSB.isArray(exp)) {
                var sql = '';
                for (var i = 0; i < exp.length; i++) {
                    if (i > 0) sql += ', ';
                    sql += $this._translateExpression(exp[i], dcQuery, useAlias);
                }
                sql += '';
                return sql;

            }

            if (!JSB.isPlainObject(exp)) {
                throw new Error('Expected object expression not ' + exp);
            }



            if (exp.$select) {
                // sub query expression
                var subSql = $this.translateQueryExpression(exp, true) ;
                return subSql.startsWith('(') ?  subSql : '(' + subSql + ')';
            }

		    if (exp.$sql) {
		        return '(' + this._prepareEmbeddedSQL(exp.$sql, dcQuery) + ')';
		    }


            if (exp.hasOwnProperty('$const')) {
                var value;
                if (JSB.isString(exp.$const)) {
                    value = "'" + exp.$const + "'";
                } else if (JSB.isNumber(exp.$const)) {
                    value = '' + exp.$const;
                } else if (JSB.isBoolean(exp.$const)) {
                    value =  ('' + exp.$const).toUpperCase();
                } else if (exp.$const == null) {
                    value = 'NULL';
                } else if (JSB.isDate(exp.$const)) {
                    value = "'" + exp.$const.toISOString() + "'";
                } else {
                    throw new Error('Unsupported $const type ' + typeof exp.$const);
                }
                return exp.$type ? value + '::' + JDBC.translateType(exp.$type, $this.vendor): value;
            } else if (exp.$field){
                return this._translateField(
                        exp.$field,
                        // if context is not defined then use current
                        exp.$context || dcQuery.$context,
                        // if foreign context force use table field not alias
                        useAlias && (exp.$context || dcQuery.$context) == dcQuery.$context,
                        dcQuery.$context
                );
            }

            var op = Object.keys(exp)[0];
            // n-operators
            switch(op) {
                case '$coalesce':
                    return 'COALESCE('+ translateNOperator(exp[op], ',') + ')';

                case '$add':
                    return '('+ translateNOperator(exp[op], '+', function(arg, n, type){return type == 'date' ? arg : 'COALESCE('+arg+', 0.0)'}) + ')';
                case '$sub':
                    return '('+ translateNOperator(exp[op], '-', function(arg, n, type){return type == 'date' ? arg : 'COALESCE('+arg+', 0.0)'}) + ')';
                case '$mod':
                    return '('+ translateNOperator(exp[op], '%', function(arg, n, type){return n == 0 ? 'COALESCE('+arg+', 0.0)' : arg}) + ')';
                case '$mul':
                    return '('+ translateNOperator(exp[op], '*', function(arg, n, type){return n == 0 ? 'COALESCE('+arg+', 0.0)' : arg}) + ')';
                case '$div':
                    return '('+ translateNOperator(exp[op], '/', function(arg, n, type){return n == 0 ? 'COALESCE('+arg+', 0.0)' : arg}) + ')';
                case '$divz':
                    return '('+ translateDivzOperator(exp[op]) + ')';
                case '$sqrt':
                    return 'SQRT('+ $this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$pow2':
                    return 'POW('+ $this._translateExpression(exp[op], dcQuery, useAlias) + ', 2)';

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
                    return 'GREATEST(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$least':
                    return 'LEAST(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';

                case '$splitString':
                    return 'string_to_array(' + this._translateExpression(exp[op].$value, dcQuery, useAlias) + ", '" + exp[op].$separator + "'" + ')';
                case '$substring':
                    return 'substring(' + this._translateExpression(exp[op].$value, dcQuery, useAlias) + " for " + exp[op].$length + ')';
                case '$trim':
                    return 'TRIM(both from ' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$regexpReplace':
                    return 'REGEXP_REPLACE(' + this._translateExpression(exp[op].$value, dcQuery, useAlias)
                        + ', \'' + exp[op].$pattern + '\', \'' + exp[op].$replacementString + '\', \'' + exp[op].$flags + '\')';


                case '$toInt':
                    return 'CAST((' + wrapEmptyToNull(this._translateExpression(exp[op], dcQuery, useAlias)) + ' ) as int)';
                case '$toDouble':
                    return 'CAST((' + wrapEmptyToNull(this._translateExpression(exp[op], dcQuery, useAlias)) + ' ) as double precision)';
                case '$toBoolean':
                    return 'CAST((' + wrapEmptyToNull(this._translateExpression(exp[op], dcQuery, useAlias)) + ' ) as boolean)';
                case '$toString':
                    return 'CAST((' + this._translateExpression(exp[op], dcQuery, useAlias) + ' ) as varchar)';
                case '$toDate':
                    return 'CAST((' + wrapEmptyToNull(this._translateExpression(exp[op], dcQuery, useAlias)) + ' ) as date)';
                case '$toTimestamp':
                    return 'to_timestamp(CAST((' + (this._translateExpression(exp[op], dcQuery, useAlias)) + ' ) as double precision))';
                case '$dateYear':
                    return 'extract(isoyear from ' + (this._translateExpression(exp[op], dcQuery, useAlias)) + ')';
                case '$dateMonth':
                    return 'extract(month from ' + (this._translateExpression(exp[op], dcQuery, useAlias)) + ')';
                case '$dateMonthDay':
                    return 'extract(day from ' + (this._translateExpression(exp[op], dcQuery, useAlias)) + ')';
                case '$dateWeekDay':
                    return 'extract(dow from ' + (this._translateExpression(exp[op], dcQuery, useAlias)) + ')';
                case '$dateYearDay':
                    return 'extract(doy from ' + (this._translateExpression(exp[op], dcQuery, useAlias)) + ')';
                case '$dateTotalSeconds':
                    return 'extract(epoch from ' + (this._translateExpression(exp[op], dcQuery, useAlias)) + ')';
                case '$timeHour':
                    return 'extract(hour from ' + (this._translateExpression(exp[op], dcQuery, useAlias)) + ')';
                case '$timeMinute':
                    return 'extract(minute from ' + (this._translateExpression(exp[op], dcQuery, useAlias)) + ')';
                case '$timeSecond':
                    return 'extract(second from ' + (this._translateExpression(exp[op], dcQuery, useAlias)) + ')';

                case '$dateIntervalOrder':
                    return 'CAST((extract(epoch from ' + (this._translateExpression(exp.$dateIntervalOrder.$value, dcQuery, useAlias)) + ')/' + exp.$dateIntervalOrder.$seconds + ') as int)';
            }

            // aggregate operators
            switch(op) {
                case '$recursiveSelect':
                    return this._translateRecursiveSelect(exp[op], dcQuery);
                case '$distinct':
                    return 'DISTINCT(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$any':
                    return 'MIN(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$corr':
                    return 'CORR(' + translateNOperator(exp[op], ',') + ')';
                case '$first':
                    return '(ARRAY_AGG(' + this._translateExpression(exp[op], dcQuery, useAlias) + '))[1]';
//                    return 'FIRST(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$last':
                    var lastVal = this._translateExpression(exp[op], dcQuery, useAlias);
                    return '(ARRAY_AGG(' + lastVal + '))[ARRAY_LENGTH(ARRAY_AGG(' + lastVal + '),1)]';
//                    return 'LAST(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$count':
                    return exp.$count == 1
                            ? 'COUNT(*)'
                            : 'COUNT(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$sum':
                    return 'SUM(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$max':
                    return 'MAX(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$min':
                    return 'MIN(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$avg':
                    return 'AVG(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$array':
                case '$flatArray':
                    return 'ARRAY_AGG(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$expandArray':
                    return 'UNNEST(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
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

//                case '$grmaxsum':
//                    return '(' + translateMaxGroupAggregate(exp[op], 'SUM') + ')';
//                case '$grmaxavg':
//                    return '(' + translateMaxGroupAggregate(exp[op], 'AVG') + ')';
//                case '$grmaxcount':
//                    return '(' + translateMaxGroupAggregate(exp[op], 'COUNT') + ')';
            }

            throw new Error('Unsupported select expression ' + op);
        },

        asCubeFieldExpression: function(exp) {
            if (JSB.isPlainObject(exp) && exp.$field) {
                exp = exp.$field;
            }
            if (JSB.isString(exp)) {
                // is parameter
                if (exp.match(/^\$\{.*\}/g)) {
                    return false;
                }
                var field = exp;
                if (this.cube) {
                    var managedFields = this.cubeFields;
                    if (managedFields[field]) {
                        return field;
                    }
                } else {
                    for(var i in this.providers){
                        if(this.providers[i].extractFields()[field]) {
                            return field;
                        }
                    }
                }
            }
            return false;
        },

        _printTableName: function(tableName){
            if (tableName.startsWith('"') && tableName.endsWith('"')) {
                // is quoted return as is
                return tableName;
            } else {
                // split and quote
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

        _translateWhere: function(query, filterExp) {

            function translateAndOrExpressions(exps, op) {
                if (!JSB.isArray(exps)) {
                    throw new Error('Unsupported expression type (must be array) for operator ' + op);
                }

                var sql = '(';
                var cnt = 0;
                for (var i = 0; i < exps.length; i++) {
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
                       switch($this.vendor) {
                           case 'PostgreSQL':
                               sqlOp = ' ~~ '; break;
                           default:
                               sqlOp = ' LIKE ';
                       }
                       break;
                   case '$ilike':
                       switch($this.vendor) {
                           case 'PostgreSQL':
                               sqlOp = ' ~~* '; break;
                           default:
                               sqlOp = ' LIKE ';
                       }
                       break;
                    case '$in':
                        sqlOp = JSB.isArray(operands[1]) ? ' IN ' : ' = ANY';
                        return $this._translateExpression(operands[0], query) + sqlOp + '(' + $this._translateExpression(operands[1], query) + ') ';
                    case '$nin':
                        sqlOp = JSB.isArray(operands[1]) ? ' NOT IN ' : ' != ANY';
                        return $this._translateExpression(operands[0], query) + sqlOp + '(' + $this._translateExpression(operands[1], query) + ') ';
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
                            case '$not':
                            return 'NOT (' + translateMultiExpressions(exps[op]) + ')';
                                break;
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
            return filterExp && Object.keys(filterExp).length > 0
                    ? translateMultiExpressions(filterExp)
                    : '';
        },

        _translateGroup: function(query) {
            var sql = '';
            if (query.$groupBy) {
                if (!JSB.isArray(query.$groupBy)) {
                    throw new Error('Unsupported $groupBy expression type (must be array):' + JSON.stringify(query.$groupBy));
                }

                if (query.$groupBy.length == 1 && query.$groupBy[0].$const) {
                    return sql;
                }

                for (var i = 0; i < query.$groupBy.length; i++) {
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
                for (var i = 0; i < sort.length; i++) {
                    if (i > 0) sql += ', ';
                    var val = sort[i];
                    if (val.$expr && val.$type) {
                    var key = val.$type < 0 ? ' DESC' : ' ASC';
                        sql += $this._translateExpression(val.$expr, query, true) + key;
                    } else {
                        var field = Object.keys(val)[0];
                        var key = val[field] < 0 ? ' DESC' : ' ASC';
                        sql += $this._translateExpression({$field:field}, query, true) + key;
                    }
                }
            }
            return sql;
        },

		close: function() {
		    $base();
		},

        _findQueryView: function(context){
            var queryView = $this.contextQueryViews[context];
            if (!queryView) {
                throw new Error('Internal error: Cannot find View for query ' + context);
            }
            return queryView;
        },

		_translateSourceQueryExpression: function(query, asRoot) {
            var sqlSource = '';
            if (typeof query === 'string') {
                sqlSource += $this._quotedName($this._translateContext(query));
                sqlSource +=  ' AS ' + $this._quotedName($this._translateContext(query));
            } else if (query.$provider) {
                sqlSource += $this._translateQueryProvider(query, asRoot);
                sqlSource += '';
            } else if (query.$from) {
                sqlSource += $this.translateQueryExpression(query.$from);
                sqlSource += '';
            } else if (query.$join) {
                sqlSource += $this._translateJoin(query);
                sqlSource += '';
            } else if (query.$union) {
                sqlSource += $this._translateUnion(query);
                sqlSource += '';
            } else if (query.$recursive) {
                sqlSource += $this._translateRecursive(query);
                sqlSource +=  ' AS ' + $this._quotedName($this._translateContext(query.$context));
            } else {
                QueryUtils.throwError(0, 'Invalid source in query "{}"', query.$context);
            }
            return sqlSource;
		},

//		_getProvider: function(id) {
//		    var provider = $this.cube.getProviderById(id);
//		    QueryUtils.throwError(provider, 'Data provider with id "{}" is undefined', id);
//		    return provider;
//		},

        _translatePart: function(prefix, valueCallback, suffix) {
            var value = valueCallback();
            return value ? (prefix||'') + value + (suffix||'') : '';
        },

        _translateWith: function(query) {
            var sql = '';

            for(var name in query.$views) {
                var viewQuery = query.$views[name];
                if (sql.length != 0) sql += ',\n';

                /// first translate query only then context name

                var sqlView = $this.translateQueryExpression(viewQuery, true);

                sql += $this._quotedName($this._translateContext(name));
                sql += ' AS ';
                sql += sqlView;
            }

            return sql;
        },

		_translateQueryProvider: function(query, asRoot){
		    var sql = '';
            /// поля датапровайдеров/таблиц без запроса отображаются напрямую
            sql += $this._printTableName(QueryUtils.getQueryDataProvider(query.$provider, $this.cube).getTableFullName());
            sql +=  ' AS ' + $this._quotedName($this._translateContext(query.$context));
            return sql;
		},

        _extractWhereOrHavingFilter: function(query, whereOrHaving /*where is true, having is false*/) {
            function isHaving(filteredField, filteredExpr){
                // is aggregated alias
                if (query.$select[filteredField]) {
                    var e = query.$select[filteredField];
                    if(QueryUtils.isAggregatedExpression(e)) {
                        // if source field
                        if (query.$from) {
                            var sourceQuery = JSB.isObject(query.$from) ? query.$from : $this.contextQueries[query.$from];
                            if (sourceQuery.$select[filteredField]) {
                                return false;
                            }
                        }
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

            var filter = QueryUtils.filterFilterByFields(query.$filter || {}, query, function(filteredField, filteredExpr){
                return whereOrHaving
                        ? !isHaving.call(null, filteredField, filteredExpr)
                        : isHaving.call(null, filteredField, filteredExpr);
            });
            return filter ? filter : {};
        },

		_translateJoin: function(query) {
		    var sql = '';

		    sql += $this.translateQueryExpression(query.$join.$left);
		    sql += ' ' + query.$join.$joinType.toUpperCase().replace('INNER','') + ' JOIN ';
		    sql += $this.translateQueryExpression(query.$join.$right);
            sql += $this._translatePart(' ON ', function(){
                return $this._translateWhere(query, query.$join.$filter);
            });

		    return sql;
		},

		_translateUnion: function(query) {
		    function getQuery(ctx){
		        return $this.contextQueries[ctx];
		    }

		    var sql = '';

		    for(var i = 0; i < query.$union.length; i++) {
		        var subQuery = query.$union[i];
		        var fixedSubQuery = JSB.clone(subQuery);
		        for(var alias in query.$select) {
		            if (!fixedSubQuery.$select[alias]) {
		                fixedSubQuery.$select[alias] = {
		                    $const: null,
		                    $type: QueryUtils.extractType(query.$select[alias], query, $this.cube, getQuery),
                        };
		            }
		        }
                if (sql.length > 0) sql += ' UNION ALL ';
		        sql += $this.translateQueryExpression(fixedSubQuery, true);
		    }

		    sql = '(' + sql + ') AS ' + $this._quotedName($this._translateContext(query.$context));
		    return sql;
		},

		_translateRecursive: function(query) {

		    var sql = '';
		    sql += 'WITH RECURSIVE ' + $this._quotedName($this._translateContext(query.$context)) + ' AS (';
		    sql += $this.translateQueryExpression(query.$recursive.$start, true);
		    sql += ' UNION ALL ';
		    sql += $this.translateQueryExpression(query.$recursive.$joinedNext, true);
		    QueryUtils.throwError(sql.endsWith(')'), 'Internal error: invalid SQL format in recursive query');
		    sql = sql.substring(0, sql.length-1) + ' JOIN ' + $this._quotedName($this._translateContext(query.$context));
            sql += ' ON ' + $this._translateWhere(query, query.$recursive.$filter) + ')';
		    sql += ') ';
		    sql += 'SELECT * FROM ' + $this._quotedName($this._translateContext(query.$context));

		    return '(' + sql + ')';
		},

        _translateRecursiveSelect: function (exp, dcQuery) {
            // this operator deprecated and created as macro $recursiveSelect
            throw new Error('Illegal state exception');
        },

//        _translateRecursiveSelect: function (exp, dcQuery) {
//
//            function translateRecursive(){
//                var firstQuery = {
//                    $context: 'start:' + dcQuery.$context,
//                    $select: {
//                        id: exp.$idField.$field||exp.$idField,
//                        parentId: exp.$parentIdField.$field||exp.$parentIdField,
//                        value: exp.$aggregateExpr[aggFunc],
//                        depth: {$const: 0, $type: 'double'},
//                    },
//                    $filter: {
//                        $eq: [
//                            exp.$idField.$field||exp.$idField,
//                            {$field:exp.$idField.$field||exp.$idField, $context: dcQuery.$context},
//                        ]
//                    }
//                };
//                var recursiveQuery = {
//                    $context: 'recursive:' + dcQuery.$context,
//                    $select: {
//                        id: exp.$idField.$field||exp.$idField,
//                        parentId: exp.$parentIdField.$field||exp.$parentIdField,
//                        value: exp.$aggregateExpr[aggFunc],
//                        depth: {$add: [{$field:"depth"}, {$const:1}]}
//                    }
//                };
//                if (dcQuery.$from) {
//                    firstQuery.$from = dcQuery.$from;
//                    firstQuery.$views = $this.dcQuery.$views;
//                    recursiveQuery.$from = dcQuery.$from;
//                    recursiveQuery.$views = $this.dcQuery.$views;
//                }
//                try {
//                    var builder1 = new QueryViewsBuilder(firstQuery, $this.cube, $this.providers);
//                    var startView = builder1.build();
//
//                    var builder2 = new QueryViewsBuilder(recursiveQuery, $this.cube, $this.providers);
//                    var recursiveView = builder2.build();
//
//                    JSB.merge($this.contextQueryViews, builder1.getContextQueryViews());
//                    JSB.merge($this.contextQueryViews, builder2.getContextQueryViews());
//
//                } finally {
//                    builder1 && builder1.destroy();
//                    builder2 && builder2.destroy();
//                }
//
//                var sql = '';
//                sql += $this._translateAnyView(startView);
//                sql += ' UNION ALL ';
//                sql += $this._translateAnyView(recursiveView);
//                if(sql.endsWith(')')) {
//                    // HACK: remove ')'
//                    sql = sql.substring(0, sql.length-1);
//                    sql += ' JOIN ' + $this._quotedName(treeContext);
//                    sql += ' ON ' + $this._translateField(exp.$parentIdField.$field||exp.$parentIdField, recursiveView.name)
//                        + ' = '
//                        + $this._quotedName(treeContext) + '.id';
//                    sql += ')';
//                } else {
//                    throw new Error('Internal error: Invalid query format, unexpected end');
//                }
//                return sql;
//            }
//
//            var aggFunc = Object.keys(exp.$aggregateExpr)[0];
//            if (!QuerySyntax.schemaAggregateOperators[aggFunc]) {
//                throw new Error('Operator $recursiveSelect supports only aggregate function in $aggregateExpr');
//            }
//
//            var view = $this._findQueryView(dcQuery.$context);
//            if (!view) {
//                throw new Error('Query view not found: ' + dcQuery.$context);
//            }
//
//            if (!(JSB.isString(exp.$idField) || exp.$idField.$field)
//                && !(JSB.isString(exp.$parentIdField) || exp.$parentIdField.$field)
//                ) {
//                throw new Error('Operator $recursiveSelect supports only fields in $idField and $parentIdField');
//            }
//
//            var treeContext = 'tree:' + dcQuery.$context;
//            var sql = '';
//            sql += 'WITH RECURSIVE ' +  $this._quotedName(treeContext) + ' AS (';
//            sql += translateRecursive();
//            sql += ')';
//            sql += ' SELECT ' + $this._translateExpression((function(){
//                var val = {};
//                val[aggFunc] = {$const:'#####'}; // HACK
//                return val;
//            })(), dcQuery).replace("'#####'", '"Q".value');
//            sql += ' FROM ' + $this._quotedName(treeContext) + ' AS "Q"';
////            if (exp.$onlyLeafs) {
////                throw 'TODO';
////                sql += ' INNER JOIN ' + $this._translateFrom(dcQuery) + ' AS ' + $this._quotedName(dcQuery.$context);
////                sql += ' ON "Q".id = ' + $this._translateExpression(exp.$parentIdField.$field||exp.$parentIdField, dcQuery);
////            }
//            if (exp.$onlyLeafs || exp.$depth && (exp.$depth.$max >= 0 || exp.$depth.$min >= 0)) {
//                sql += ' WHERE' ;
//                if (exp.$onlyLeafs) {
//                    sql += ' "Q".id NOT IN (';
//                    sql += 'SELECT ' + $this._translateExpression(exp.$parentIdField.$field||exp.$parentIdField, dcQuery);
//                    sql += ' FROM ' + $this._translateFrom(dcQuery) + ' AS ' + $this._quotedName(dcQuery.$context);
//                    var where = $this._translateWhere(dcQuery, $this._extractWhereOrHavingFilter(dcQuery, true));
//                    if (where) sql += 'WHERE ' + where;
//                    sql += ')';
//                }
//                if (exp.$depth && exp.$depth.$max >= 0 ) {
//                    if (exp.$onlyLeafs) sql += ' AND ';
//                    sql += ' "Q".depth <= ' + exp.$depth.$max;
//                }
//                if (exp.$depth && exp.$depth.$min >= 0) {
//                    if (exp.$onlyLeafs || exp.$depth.$max >= 0 ) sql += ' AND ';
//                    sql += ' "Q".depth >= ' + exp.$depth.$min;
//                }
//            }
//
//            return '(' + sql + ')';
//        },

        _translateField: function(field, context, useAlias, callerContext) {
            var sql = $this._translateFieldInternal(field, context, useAlias, callerContext);
            var query = $this.contextQueries[context];
//            QueryUtils.logDebug(
//                    '\t field={}\tcontext={}\tcaller={}\talias={}\tsource={}\tsql={}',
//                    field, context, callerContext, useAlias,
//                    query.$from ? '$from' : query.$join ? '$join' : query.$union ? '$union' : query.$provider ? '$provider' : '',
//                    sql
//            );
//if (sql =='"parentId"') {
//    debugger;
//    $this._translateFieldInternal(field, context, useAlias, callerContext);
//}
            return sql;
        },

        _translateFieldInternal: function(field, context, useAlias, callerContext) {
            var query = $this.contextQueries[context];
            QueryUtils.throwError(query, 'Query context is undefined: {}', context);

            if (useAlias) {
                for(var alias in query.$select) {
                    if (alias == field) {
                        return $this._quotedName(field);
                    }
                }
            }

            if (context != callerContext) {
                var callerQuery = $this.contextQueries[callerContext];
                QueryUtils.throwError(callerQuery, 'Caller query context is undefined: {}', callerContext);
                // is join filter (link to $left or $right query)
                if (callerQuery.$join && (query == callerQuery.$join.$left || query == callerQuery.$join.$right)) {
                    return $this._translateExpression(query.$select[field], query);
                } else if (callerQuery.$recursive) {
                    return $this._translateExpression(query.$select[field], query);
                }
            }

            if (query.$from) {

                var sourceQuery = JSB.isObject(query.$from) ? query.$from : $this.contextQueries[query.$from];
                QueryUtils.throwError(sourceQuery, 'Source query is undefined with context: {}', query.$from.$context||query.$from);

                /// is source field
                if (sourceQuery.$select[field]) {
                    if (!sourceQuery.$from && !QueryUtils.queryHasBody(sourceQuery)) {
                        return $this._translateExpression(sourceQuery.$select[field], sourceQuery);
                    }
                    return $this._quotedName($this._translateContext(sourceQuery.$context)) + '.' + $this._quotedName(field);
                }

            } else if (query.$join) {

                /// is source field
                if (query.$join.$left.$select[field]) {
                    return $this._translateExpression(query.$join.$left.$select[field], query.$join.$left);
                }
                if (query.$join.$right.$select[field]) {
                    return $this._translateExpression(query.$join.$right.$select[field], query.$join.$right);
                }

            } else if (query.$union) {
                return $this._quotedName($this._translateContext(context)) + '.' + $this._quotedName(field);
            } else if (query.$provider) {

                var provider = QueryUtils.getQueryDataProvider(query.$provider, $this.cube);

                /// is source field (of provider)
                var providerField = provider.extractFields()[field];
                if (providerField) {
                    return $this._quotedName($this._translateContext(context)) + '.' + $this._quotedName(field);
                }

            } else if (query.$recursive) {
                return $this._quotedName($this._translateContext(context)) + "." + $this._quotedName(field);
            } else {
                QueryUtils.throwError(false, 'Undefined source of query with context: {}', context);
            }

            /// is export alias
            QueryUtils.throwError(context == callerContext, 'Field context not equals query context for field {}.{} (caller {})', context, field, callerContext);
            return $this._quotedName(field);
        },

		translateError: function(error) {
		    // TODO: translateError
		    return error;
		},

//		translateError: function(error) {
//            function buildInfo(){
//                if (this.providerField) {
//                    try {
//                        var cubeField = $this.cubeFields[this.field];
//                        for(var b = 0; b < cubeField.binding.length; b++) {
//                            var bind = cubeField.binding[b];
//                            if (bind.provider.id == this.providerId) {
//                                var provider = bind.provider;
//                                var field = provider.extractFields({comment:true})[this.providerField];
//                                if (field) {
//                                    if (field.comment && field.comment.name && this.providerField != field.comment.name) {
//                                        return 'cube field "'+this.field+'" (provider "'+provider.name+'", name "'+field.comment.name+'", column "'+this.origName+'")';
//                                    } else {
//                                        return 'cube field "'+this.field+'" (provider "'+provider.name+'", column "'+this.origName+'")';
//                                    }
//                                } else {
//                                    // not existed in provider
//                                    return 'cube field "'+this.field+'" (provider "'+provider.name+'", column "'+this.origName+'")';
//                                }
//                            }
//                        }
//                    }catch(e) {
//                        Log.error(e);
//                        return 'field "' + this.field + '" (context "' + this.queryContext + '", SQL column "' + this.origName + '")';
//                    }
//                } else {
//                    return 'field "' + this.field + '" (context "' + this.queryContext + '", SQL column "' + this.origName + '")';
//                }
//            }
//
//            function findInfo(origName) {
//                for(var context in $this.contextQueryViews) {
//                    var queryView = $this.contextQueryViews[context];
//                    var sourceView = queryView.getSourceView();
//                    if (sourceView) {
//                        var sourceFields = sourceView.listFields();
//                        for(var f = 0; f < sourceFields.length; f++) {
//                            var sourceField = sourceView.getField(sourceFields[f]);
//                            var sourceOriginalField = sourceView.getOriginalField(sourceFields[f]) || sourceField;
//
//                            if (sourceField && origName == sourceField.context + '.' + sourceField.providerField
//                                    || sourceOriginalField && origName == sourceOriginalField.context + '.' + sourceOriginalField.providerField) {
//
//                                return buildInfo.call({
//                                    origName: origName,
//                                    field: sourceFields[f],
//                                    queryContext: queryView.getContext(),
//                                    providerId: sourceOriginalField.providerId,
//                                    providerField: sourceOriginalField.providerField,
//                                });
//                            }
//                        }
//
//                    }
//                }
//                return null;
//            }
//
//
//            var reg = /column\s*\"?(.*?[^\"].*?)\"?\s/g;
//            var message = error.message.replace(reg, function(s, name) {
//                var info = findInfo(name);
//                return info ? info : name;
//            });
//
//            message = message.replace(/\sPosition:\s*(\d*)/, function(s, pos){
//                return "SQL position: " + pos + ' (for get SQL use analyze)';
//            });
//
//		    return new Error(message);
//		},
	}
}