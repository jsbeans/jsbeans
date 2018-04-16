{
	$name: 'DataCube.Query.Translators.SQLTranslator',
	$parent: 'DataCube.Query.Translators.Translator',

	$server: {
		vendor: 'PostgreSQL',
		
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Query.QueryParser',
		    'DataCube.Providers.SqlTableDataProvider',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.QuerySyntax',
		    'JSB.Store.Sql.JDBC'
        ],
        
        $bootstrap: function(){
        	TranslatorRegistry.register(this);
        },

		$constructor: function(providerOrProviders, cubeOrQueryEngine){
		    $base(providerOrProviders, cubeOrQueryEngine);
		    if ($this.cube) {
		        $this.cubeFields = $this.cube.getManagedFields();
            }
		},

		translateQuery: function() {
//		    this._prepareWithViews();
		    this._verifyFields();
		    var sql = '';
//		    sql += this._translateWith();
		    sql += this.translateQueryExpression(this.dcQuery);
		    QueryUtils.logDebug('\n[qid='+this.dcQuery.$id+'] Translated SQL Query: \n' + JSON.stringify(this.dcQuery, 0, 2));
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
                var from  = this._translateFrom(query);
                var columns = this._translateSelectColumns(query);
                var where = this._translateWhere(query, this._extractWhereOrHavingFilter(query, true));
                var group = this._translateGroup(query);
                //TODO: HAVING is not support filter by alias: if $filter contains alias of aggregate expression move it to $postFilter
                var having = this._translateWhere(query, this._extractWhereOrHavingFilter(query, false));
                var order = this._translateOrder(query);
                var offset = query.$offset ? ' OFFSET ' + query.$offset: '';
                var limit = query.$limit ? ' LIMIT ' + query.$limit: '';
                from = from ? ' FROM ' + from : ' ';
                where = where ? ' WHERE ' + where : ' ';
                group = group ? ' GROUP BY ' + group : ' ';
                having = having ? ' HAVING ' + having : ' ';
                order = order ? ' ORDER BY ' + order : ' ';

                sql += 'SELECT ' + columns + from + where + group + having + order + offset + limit;
            }

		    if (query.$postFilter && Object.keys(query.$postFilter).length > 0) {
		        var wrappedQuery = JSB.merge({}, query, {
		            $context: 'wrapped_' + query.$context
		        });
		        this._registerContextQuery(wrappedQuery);
		        sql = 'SELECT * FROM (' + sql + ') AS ' + this._quotedName(wrappedQuery.$context) +
		              ' WHERE ' + this._translateWhere(wrappedQuery, wrappedQuery.$postFilter);
		    }

//		    Log.debug('Translated SQL Query: \n' + sql);
            return sql;
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

//        _prepareWithViews: function(){
//            function forEach$g (callback){
//                for (var alias in $this.dcQuery.$select) {
//                    var exp = $this.dcQuery.$select[alias];
//                    if (typeof exp === 'object' && QuerySyntax.getSchema()[Object.keys(exp)[0]].global) {
//                        callback(alias, exp);
//                    }
//                }
//            }
//
//            var withViews = {};
//            // extract views for $g* expression
//            QueryUtils.walkSubQueries(this.dcQuery, function(query){
//                forEach$g(function(alias, exp){
//                    var viewKey = $this._extractViewKey(query, true);
//                    var view = withViews[viewKey] = withViews[viewKey] || {
//                        viewKey: viewKey,
//                        fields: {},
//                        global: true,
//                        name: 'global_view_' + Object.keys(withViews).length
//                    };
//                    var field = 'global_' + alias;//JSON.stringify(expr);
//                    if (view.fields[field]) {
//                        throw new Error('Result field alias ' + alias + ' has some expressions');
//                    }
//                    view.fields[field] = query.$select[alias];
//                });
//            });
//            for (var id in withViews) {
//                var view = withViews[id];
//                var from = this._translateFrom(this.dcQuery);
//
//                var columns = '';
//                for (var field in view.fields) {
//                    if (columns.length != 0) columns += ', ';
//                    columns += this._translateExpression(view.fields[field], this.dcQuery, true) + ' AS ' + this._quotedName(field);
//                }
//
//                if (view.global) {
//                    view.sql = 'SELECT ' + columns;
//                } else {
//                    var where = this._translateWhere(this.dcQuery, this._extractWhereOrHavingFilter(this.dcQuery, true));
//                    var group = this._translateGroup(this.dcQuery);
//                    var having = this._translateWhere(this.dcQuery, this._extractWhereOrHavingFilter(this.dcQuery, false));
//                    where = where ? ' WHERE ' + where : ' ';
//                    group = group ? ' GROUP BY ' + group : ' ';
//                    having = having ? ' HAVING ' + having : ' ';
//                    from = from ? ' FROM ' + from : ' ';
//
//                    view.sql = 'SELECT ' + columns + from + where + group + having;
//                }
//            }
//            this.withViews = withViews;
//        },

        _translateWith: function(){
            var sqlWith = '';
            for (var id in this.withViews) {
                if (sqlWith.length > 0) sqlWith += ', ';
                var view = this.withViews[id];
                sqlWith += '\n\t' + this._quotedName(view.name) + ' AS (' + view.sql + ')'
            }
            return sqlWith.length > 0 ? 'WITH' + sqlWith + '\n' : '';
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
                        // if cube field has same name
                        if($this.cube && $this.cubeFields[filteredField]) {
                            return false;
                        } else {
                            return true;
                        }
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
                sqlColumns += this._translateExpression(select[alias], query) + ' AS ' + this._quotedName(alias);
            }
            if (i == 0) sqlColumns += 'NULL';
            return sqlColumns;
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
                    return this._translateField(exp, dcQuery.$context, useAlias);
                }
            }

            if (JSB.isArray(exp)) {
                var sql = '';
                for (var i in exp) {
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
                var subSql = $this.translateQueryExpression(exp) ;
                return subSql.startsWith('(') ?  subSql : '(' + subSql + ')';
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
                    } else if (JSB.isBoolean(exp[op])) {
                        return ('' + exp[op]).toUpperCase();
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
                            useAlias && (exp.$context || dcQuery.$context) == dcQuery.$context
                    );
            }

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
                    return 'string_to_array(' + this._translateExpression(exp[op].$field, dcQuery, useAlias) + ", '" + exp[op].$separator + "'" + ')';
                case '$substring':
                    return 'substring(' + this._translateExpression(exp[op].$field, dcQuery, useAlias) + " for " + exp[op].$length + ')';
                case '$trim':
                    return 'TRIM(both from ' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';

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
                    return 'CAST((extract(epoch from ' + (this._translateExpression(exp.$dateIntervalOrder.$field, dcQuery, useAlias)) + ')/' + exp.$dateIntervalOrder.$seconds + ') as int)';
            }

            // aggregate operators
            switch(op) {
                case '$distinct':
                    return 'DISTINCT(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
                case '$any':
                    return 'MIN(' + this._translateExpression(exp[op], dcQuery, useAlias) + ')';
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

        _translateField: function(field, context, useAlias) {
            var query = this._getQueryByContext(context);
            var cubeField = this.asCubeFieldExpression(query.$select[field]);
//            // is allow use aliases
//            if (!notAlias) {
//                // is alias and not cube field as-is expression return quoted alias
//                var isAlias = !!query.$select[field];
//                if (isAlias && !cubeField) {
//                    // print alias
//                    return this._quotedName(field);
//                }
//            }
            if (!this.contextFieldsMap[context]){
                // print alias
                return this._quotedName(field);
            }

            var nameSql = this._translateCubeField(cubeField || field, context);
            // is not cube field and is alias print as is
            if (!nameSql) {
//                if (notAlias) {
                    var query = this._getQueryByContext(context);
                    if (!!query.$select[field]) {
                        nameSql = this._quotedName(field);
//                    }
                }
            }
            if (!nameSql) {
                throw new Error('Cube or provider has no field or query has no definition for alias ' + field);
            }
            return nameSql;
        },

        _translateCubeField: function(field, context){
            if (this.cube) {
            	var managedFields = this.cubeFields;
                if (!managedFields[field]) {
                    return null;
                }
                var fieldsMap = this.contextFieldsMap[context];
                if (!fieldsMap) {
                    throw new Error('Fields map is not defined for context ' + context);
                }
                var fieldDesc = fieldsMap[field];
                if (!fieldsMap) {
                    throw new Error('Field descriptor is not defined for context ' + context);
                }
                if (fieldDesc.tableAlias && fieldDesc.fieldAlias) {
                    return this._quotedName(fieldDesc.tableAlias) + '.' + this._quotedName(fieldDesc.fieldAlias);
                } else if (fieldDesc.providerTable && fieldDesc.providerField) {
                    return this._printTableName(fieldDesc.providerTable) + '.' + this._quotedName(fieldDesc.providerField);
                } else {
                    throw new Error('Field descriptor is wrong ' + JSON.stringify(fieldDesc));
                }
            } else {
                for(var i in this.providers){
                    if(this.providers[i].extractFields()[field]) {
                        return this._quotedName(context) + '.' + this._quotedName(field);
                    }
                }
            }
            return null;
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

        _translateFrom: function(query) {
            // is select from sub-query
            if (query.$from) {
//                debugger; // TODO update uery.$from
                return '(' + this.translateQueryExpression(query.$from) + ') AS ' + this._quotedName(query.$context);
            }

            if (this.cube) {
                return this._translateQueryCubeView(query);
            } else {
                return this._translateQueryDataProviderView(query);
            }

        },

        _translateQueryCubeView: function(query) {
            function collectProvidersAndFields(allFields, providers) {
                QueryUtils.walkCubeFields(
                    query, /**includeSubQueries=*/false, $this.cube,
                    function (cubeField, context, fieldQuery, binding) {
                        // пропустить поля из других запросов
                        if (fieldQuery == query) {
                            allFields[cubeField] = false;
                            var foundProvider = false;
                            for (var i in binding) {
                                if ($this.providers.indexOf(binding[i].provider) != -1) {
                                    foundProvider = true;
                                    var id = binding[i].provider.id;
                                    var prov = providers[id] = providers[id] || {
                                        provider: binding[i].provider,
                                        isJoinedProvider: (binding[i].provider.getMode()||'union') == 'join',
                                        cubeFields: {/**hasOtherBinding*/},
                                        providerFields: {/**providerField: cubeField*/}
                                    };
                                    var hasOtherBinding = binding.length > 1;
                                    prov.cubeFields[cubeField] = hasOtherBinding;
                                    prov.providerFields[binding[i].field] = cubeField;
                                }
                            }
                            if (!foundProvider) throw Error('Illegal iterator provider ' + binding[i].provider.name + ' for field ' + cubeField);
                        }
                    }
                );
            }
            function buildSingleTableAndFieldsMap(allFields, providers, fieldsMap){
                var singleProv = providers[Object.keys(providers)[0]];
                forEachCubeFieldBinding(allFields, function(cubeField, binding){
                    // if current provider build fieldsMap
                    if (singleProv.provider == binding.provider) {
                        fieldsMap[cubeField] = {
                            context: query.$context,
                            cubeField: cubeField,

                            providerField: binding.field,
                            providerTable: binding.provider.getTableFullName(),

                            tableAlias: query.$context,
                            fieldAlias: binding.field
                        };
                        return true;
                    }
                });
                var sql = $this._printTableName(singleProv.provider.getTableFullName()) + ' AS ' + $this._quotedName(query.$context);
                return sql;
            }
            function addJoinOnFields(allFields, providers){
                var managedFields = $this.cubeFields;
                for(var cubeField in managedFields){
                    var binding = managedFields[cubeField].binding;
                    if (binding.length > 1) {
                        // TODO: оставить только поля, участвующие в JOIN
                        var hasJoin = false;
                        for(var r = 0; r < binding.length; r++) {
                            if ($this.providers.indexOf(binding[r].provider) != -1
                                    && binding[r].provider.getMode() == 'join') {
                                hasJoin = true;
                                break;
                            }
                        }
                        if (hasJoin) {
                            for(var r = 0; r < binding.length; r++) {
                                if ($this.providers.indexOf(binding[r].provider) != -1) {
                                    allFields[cubeField] = false;
                                    var hasOtherBinding = binding.length > 1;
                                    providers[binding[r].provider.id].cubeFields[cubeField] = hasOtherBinding;
                                    providers[binding[r].provider.id].providerFields[binding[r].field] = cubeField;
                                }
                            }
                        }
                    }
                }
            }
            function forEachCubeFieldBinding(allFields, callback){
                for(var cubeField in allFields) if(allFields.hasOwnProperty(cubeField)) {
                    var binding = $this.cubeFields[cubeField].binding;
                    for (var i in binding) {
                        if(callback(cubeField, binding[i])) {
                            break;
                        }
                    }
                }

            }
            function setIsJoinedFields(allFields) {
                var managedFields = $this.cubeFields;
                for(var cubeField in allFields) if(allFields.hasOwnProperty(cubeField)) {
                    var isJoined = true;
                    var managedField = managedFields[cubeField];
                    var binding = managedField.binding;
                    for (var i in binding) {
                        if ($this.providers.indexOf(binding[i].provider) != -1) {
                            if (binding[i].provider.getMode() != 'join') {
                                isJoined = false;
                            }
                        }
                    }
                    allFields[cubeField] = isJoined;
                }
            }
            function isProviderHasCubeField(providerFields, cubeField) {
                for(var f in providerFields) if(providerFields.hasOwnProperty(f)) {
                    if (providerFields[f] == cubeField) return true;
                }
                return false;
            }
            function forEachViewColumn(allFields, prov, visitField){
                for(var cubeField in allFields) if(allFields.hasOwnProperty(cubeField)) {
                    var isNull = !isProviderHasCubeField(prov.providerFields, cubeField);
                    var visited = false;
                    var binding = $this.cubeFields[cubeField].binding;
                    for (var i in binding) {
                        if (binding[i].provider == prov.provider) {
                            visitField(cubeField, isNull, binding[i]);
                            visited = true;
                            break;
                        }
                    }
                    if (!visited) {
                        visitField(cubeField, isNull, null);
                    }
                }

            }
            function buildUNIONsSqlAndFieldsMap(allFields, providers, unionsAlias, unionsFields) {
                var sqlUnions = '';
                var unionsCount = 0;
                var lastProv;
                for(var id in providers) if(providers.hasOwnProperty(id)) {
                    var prov = providers[id];
                    if ((prov.provider.getMode()||'union') != 'union') continue;
                    unionsCount++;
                    lastProv = prov;
                }
                if (unionsCount == 1) {
                    forEachCubeFieldBinding(allFields, function(cubeField, binding){
                        // if current provider build fieldsMap
                        if (lastProv.provider == binding.provider) {
                            fieldsMap[cubeField] = {
                                context: query.$context,
                                cubeField: cubeField,

                                providerField: binding.field,
                                providerTable: binding.provider.getTableFullName(),

                                tableAlias: unionsAlias,
                                fieldAlias: binding.field
                            };
                            unionsFields[cubeField] = binding.field;
                            return true;
                        }
                    });
                    sqlUnions += $this._printTableName(lastProv.provider.getTableFullName());

                } else {

                    for(var id in providers) if(providers.hasOwnProperty(id)) {
                        var prov = providers[id];
                        if ((prov.provider.getMode()||'union') != 'union') continue;
                        if (sqlUnions .length > 0) sqlUnions  += ' UNION ALL ';

                        // print unions view columns and build fieldsMap
                        var fieldsSql = '';
                        var skipNulls = false;
                        forEachViewColumn(allFields, prov,
                            function visitField(cubeField, isNull, binding){
                                if (skipNulls && isNull) {
                                    // skip field if skipNulls
                                    return;
                                }
                                if (allFields[cubeField]) {
                                    // skip isJoined fields
                                    return;
                                }

                                if (fieldsSql.length > 0) fieldsSql += ', ';
                                if (isNull) {
                                    var fieldType = QueryUtils.getFieldJdbcType($this.cube || $this.providers[0], cubeField);
                                    fieldsSql += 'CAST(NULL AS ' + JDBC.translateType(fieldType, $this.vendor) + ')';
                                } else {
                                    fieldsSql += $this._quotedName(binding.field);
                                }
                                fieldsSql += ' AS ' + $this._quotedName(cubeField);

                                fieldsMap[cubeField] = isNull && fieldsMap[cubeField] || {
                                    context: query.$context,
                                    cubeField: cubeField,

                                    providerField: binding && binding.field || null,
                                    providerTable: binding && binding.provider.getTableFullName() || null,

                                    tableAlias: unionsAlias,
                                    fieldAlias: cubeField
                                };
                                unionsFields[cubeField] = cubeField;
                            }
                        );

                        sqlUnions += '(SELECT ' + fieldsSql + ' FROM '+
                            $this._printTableName(prov.provider.getTableFullName()) + ')';
                    }
                }
                if (unionsCount > 1) {
                    var sql = '(' + sqlUnions + ') AS ' + $this._quotedName(unionsAlias);
                } else if (unionsCount > 0) {
                    var sql = sqlUnions + ' AS ' + $this._quotedName(unionsAlias);
                } else {
                    var sql = '';
                }
                return sql;
            }
            function extractJoinOnCubeFields(provider) {
                var fields = {};
                var managedFields = $this.cubeFields;
                for(var f in managedFields){
                    var binding = managedFields[f].binding;
                    if (binding.length > 1) {
                        for(var r = 0; r < binding.length; r++) {
                            if (binding[r].provider == provider) {
                                fields[f] = true;
                            }
                        }
                    }
                }
                return Object.keys(fields);
            }
            function buildJOINsSqlAndFieldsMap(allFields, providers, unionsAlias, hasUnions, unionsFields) {
                var sqlJoins = '';
                var firstProv;
                for (var p in $this.providers) if(providers.hasOwnProperty($this.providers[p].id) && $this.providers[p].getMode() == 'join') {
                    var prov = providers[$this.providers[p].id];
                    firstProv = firstProv || prov;

                    if (sqlJoins.length > 0) sqlJoins += ' LEFT JOIN ';

                    var joinedViewAlias = query.$context + '_joined_' + $this.providers.indexOf(prov.provider);

                    sqlJoins += $this._printTableName(prov.provider.getTableFullName());
                    sqlJoins += ' AS ' + $this._quotedName(joinedViewAlias);

                    forEachViewColumn(allFields, prov,
                        function visitField(cubeField, isNull, binding){
                            if (isNull) {
                                // skip null fields
                                return;
                            }

                            var isJoinedField = allFields[cubeField];
                            fieldsMap[cubeField] = {
                                context: query.$context,
                                cubeField: cubeField,

                                providerField: binding && binding.field || null,
                                providerTable: binding && binding.provider.getTableFullName() || null,

                                tableAlias: isJoinedField ? joinedViewAlias : unionsAlias,
                                fieldAlias: isJoinedField ? binding.field : unionsFields[cubeField],

                                joinOn: fieldsMap[cubeField] && fieldsMap[cubeField].joinOn || binding && {
                                        tableAlias: joinedViewAlias,
                                        fieldAlias: binding.field
                                    } || null
                            };
                        }
                    );

                    var sqlOn = '';
                    var joinOnFields = extractJoinOnCubeFields(prov.provider);
                    for (var i in joinOnFields) {
                        var cubeField = joinOnFields[i];
                        // is joined and without UNIONs - skip first ON
                        if (!unionsFields[cubeField] && firstProv == prov) continue;

                        if (sqlOn.length > 0) sqlOn  += ' AND ';
                        var providerField = fieldsMap[cubeField].providerField;
                        sqlOn += unionsFields[cubeField]
                                ? $this._quotedName(unionsAlias) + '.' + $this._quotedName(unionsFields[cubeField])
                                : $this._quotedName(fieldsMap[cubeField].joinOn.tableAlias) + '.' + $this._quotedName(fieldsMap[cubeField].joinOn.fieldAlias);
                        sqlOn += ' = ';
                        sqlOn += $this._quotedName(joinedViewAlias) + '.' + $this._quotedName(providerField);
                    }
                    if (sqlOn) {
                        sqlJoins += ' ON ' + sqlOn;
                    }
                }

                var sql = '';
                if (sqlJoins.length > 0) {
                    if (hasUnions) {
                        sql += ' LEFT JOIN ' + sqlJoins;
                    } else {
                        sql += sqlJoins;
                    }
                }
                return sql;
            }
// debugger;
            //      begin ...

            this.contextFieldsMap = this.contextFieldsMap || {/**queryContext: {}*/};
            var fieldsMap = this.contextFieldsMap[query.$context] = this.contextFieldsMap[query.$context] || {};

            //      collect providers and fields
            var providers = {/**providerId: {provider, providerFields:{providerField: cubeField}, cubeFields: {hasOtherBinding}}*/};
            var allFields = {/**cubeField: isJoined*/}; /**isJoined=true when field from only joined provider*/
            collectProvidersAndFields(allFields, providers);

            //      if single provider - simple SELECT from provider`s table
            if (Object.keys(providers).length == 1) {
                var sql = buildSingleTableAndFieldsMap(allFields, providers, fieldsMap);
                return sql;
            }

            //      if some providers - build UNION view and JOIN ON tables

            // and add joinOn (join keys) fields to allFields, providers.(providerFields, cubeFields)
            addJoinOnFields(allFields, providers);

            // set isJoined for allFields
            setIsJoinedFields(allFields);

            // build UNIONs
            var unionsAlias = query.$context + '_unions';
            var unionsFields = {};
            var sqlUnions = buildUNIONsSqlAndFieldsMap(allFields, providers, unionsAlias, unionsFields);

            // build JOINs
            var sqlJoins = buildJOINsSqlAndFieldsMap(allFields, providers, unionsAlias, sqlUnions.length > 0, unionsFields);

            var sql = sqlUnions + sqlJoins;
            return sql.match(/^\s+$/) ? '' : sql;
        },

        _translateQueryDataProviderView: function(query) {
//debugger;
            this.contextFieldsMap = this.contextFieldsMap || {/**queryContext: {}*/};
            var fieldsMap = this.contextFieldsMap[query.$context] = this.contextFieldsMap[query.$context] || {};

            if (this.providers.length != 1) {
                throw new Error('Multiple or not defined provider');
            }
            var allFields = {/**cubeField: true*/};
		    QueryUtils.walkDataProviderFields(
		        query, /**includeSubQueries=*/false, this.providers[0],
		        function(field, context, fieldQuery){
		            if (fieldQuery == query) {
                        allFields[field] = (allFields[field]||0) + 1;
                    }
                }
            );
            var sql = '(SELECT ';
            var fieldsSql = '';
            for(var providerField in allFields) if(allFields.hasOwnProperty(providerField)) {
                if (fieldsSql.length > 0) fieldsSql += ', ';
                fieldsSql += this._quotedName(providerField);
                fieldsSql += ' AS ' + this._quotedName(providerField);
                fieldsMap[providerField] = {
                    context: query.$context,
                    cubeField: providerField,

                    providerField: providerField,
                    providerTable: this.providers[0].getTableFullName(),

                    tableAlias: query.$context,
                    fieldAlias: providerField
                };
            }
            if (fieldsSql.length == 0) fieldsSql += 'NULL';

            sql += fieldsSql + ' FROM ' + $this._printTableName(this.providers[0].getTableFullName());
            sql += ') AS ' + this._quotedName(query.$context);
            return sql;
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
	}
}