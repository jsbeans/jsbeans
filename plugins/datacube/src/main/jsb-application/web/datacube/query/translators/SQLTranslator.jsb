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
            if (i == 0) sqlColumns += 'NULL';
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
                    'FROM (' + subQ + ') AS ' + $this._quotedName(subQuery.$context+'_inner') +
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
                case '$toTimestamp':
                    return 'to_timestamp(CAST((' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ' ) as double precision))';
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
                    return '(ARRAY_AGG(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + '))[1]';
//                    return 'FIRST(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
                case '$last':
                    var lastVal = this._translateExpression(exp[op], dcQuery, useFieldNotAlias);
                    return '(ARRAY_AGG(' + lastVal + '))[ARRAY_LENGTH(ARRAY_AGG(' + lastVal + '),1)]';
//                    return 'LAST(' + this._translateExpression(exp[op], dcQuery, useFieldNotAlias) + ')';
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

        isCubeFieldExpression: function(exp) {
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
                    var managedFields = this.cube.getManagedFields();
                    if (managedFields[field]) {
                        return true;
                    }
                } else {
                    for(var i in this.providers){
                        if(this.providers[i].extractFields()[field]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        _translateField: function(field, context, forceFieldNotAlias) {
            // is allow use aliases
            if (!forceFieldNotAlias) {
                // is alias and not cube field as-is expression return quoted alias
                var query = this._getQueryByContext(context);
                var isAlias = !!query.$select[field];
                var notSimpleCubeExpression = !this.isCubeFieldExpression(query.$select[field]);
                if (isAlias && notSimpleCubeExpression) {
                    // print alias
                    return this._quotedName(field);
                }
            }

            var nameSql = this._translateCubeField(field, context);
            // is not cube field and is alias print as is
            if (!nameSql) {
                if (forceFieldNotAlias) {
                    var query = this._getQueryByContext(context);
                    if (!!query.$select[field]) {
                        nameSql = this._quotedName(field);
                    }
                }
            }
            if (!nameSql) {
                throw new Error('Cube or provider has no field or query has no definition for alias ' + field);
            }
            return nameSql;
        },

        _translateCubeField: function(field, context){
            if (this.cube) {
            	var managedFields = this.cube.getManagedFields();
                if (!managedFields[field]) {
                    return null;
                }
//                var binding = managedFields[field].binding;
//                for(var b in binding) {
//                    if (this.providers.indexOf(binding[b].provider) != -1) {
//                        return this._printFieldTableAlias(field, context, binding[b].provider) + '.' + this._quotedName(binding[b].field);
//                    }
//                }
                return this._quotedName(context) + '.' + this._quotedName(field);
            } else {
                for(var i in this.providers){
                    if(this.providers[i].extractFields()[field]) {
                        return this._quotedName(context) + '.' + this._quotedName(field);
                        //return this._printFieldTableAlias(field, context, this.providers[i]) + '.' + this._quotedName(field);
                    }
                }
            }
            return null;
        },

//        _printTableAlias: function(context, provider){
//            if (provider) {
//                var idx = this.providers.indexOf(provider);
//                if (idx > 0) {
//                    return this._quotedName(context + '_join_' + idx);
//                }
//            }
//            return this._quotedName(context);
//        },

//        _printFieldTableAlias: function(field, context, provider){
//            if (!!context) {
//                return this._printTableAlias(context, provider);
//            } else {
//                return this._printTableName(provider.getTableFullName());
//            }
//        },

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
                debugger; // TODO update uery.$from
                return '(' + this.translateQueryExpression(query.$from) + ') AS ' + this._quotedName(query.$context);
            }

            if (this.cube) {
                return this._translateQueryCubeView(query);
            } else {
                return this._translateQueryDataProviderView(query);
            }

        },

        _translateQueryCubeView: function(query) {
            function providerHasCubeField(providerFields, cubeField) {
                for(var f in providerFields) if(providerFields.hasOwnProperty(f)) {
                    if (providerFields[f] == cubeField) return true;
                }
                return false;
            }

            function printTableView(allFields, prov, skipJoinedFields, skipNulls){
                var sql = '(SELECT ';
                var fieldsSql = '';
                for(var cubeField in allFields) if(allFields.hasOwnProperty(cubeField)) {
                    if (skipJoinedFields && allFields[cubeField]) continue;
                    var isNull = !providerHasCubeField(prov.providerFields, cubeField);
                    if (skipNulls && isNull) continue;

                    if (fieldsSql.length > 0) fieldsSql += ', ';
                    if (isNull) {
                        fieldsSql += 'NULL';
                    } else {
                        var binding = $this.cube.getManagedFields()[cubeField].binding;
                        for (var i in binding) {
                            if (binding[i].provider == prov.provider) {
                                fieldsSql += $this._quotedName(binding[i].field);
                                break;
                            }
                        }
                    }
                    fieldsSql += ' AS ' + $this._quotedName(cubeField);
                }

                sql += fieldsSql + ' FROM ' + $this._printTableName(prov.provider.getTableFullName());
                sql += ')';
                return sql;
            }

            function extractJoinOnCubeFields(provider) {
                var fields = {};
                var managedFields = $this.cube.getManagedFields();
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

            /**
                1) Сначала формируется объединения всех провайдеров типа UNION с выводом
                   всех используемых в них полях как обычных, так и используемых для слияния
                1.1) вместо таблицы в объединении участвуют вью с назначенными алиасами полей куба,
                     если в текущей таблицы нет поля, то в качестве значения устанавливается NULL
                1.2) таким образом на выходе объединения получается вью с кубовыми полями всех UNION провайдеров
                1.3) ((SELECT NULL AS "f1", ... FROM ...) UNION ALL (SELECT "aa" AS "f1", ... FROM ....) ...) AS "*_unions"
                2) Потом формируются слияния с провайдерами типа JOIN:
                2.1) вместо таблицы в слиянии участвуют вью с назначенными алиасами полей куба,
                     участвующих в слиянии (в условии ON) и с данными (isJoined поля)
                2.2) LEFT JOIN (SELECT bb AS "j1",... FROM ...) AS "*_joined_0" ON ... LEFT JOIN ...
                3) Далее формируется вью-обертка со всеми используемыми полями куба и
                   назначением откуда брать значение - либо из вью объединения, либо из вью слияний.
                4) (SELECT "*_unions"."f1" AS "f1", "*_joined_0"."j1" AS "j1", ... FROM UNION+JOINS) AS "*"
            */
//debugger;
            // обойти все используемые в текущем запросе поля куба,
            // исключая подзапросы (т.к. у них своя вьюха)
            var providers = {/**providerName: {provider, providerFields}*/};
            var allFields = {/**cubeField: isJoined*/}; /**isJoined=true when field from only joined provider*/
		    QueryUtils.walkCubeFields(
		        query, /**includeSubQueries=*/false, this.cube,
		        function (cubeField, context, fieldQuery, binding) {
                    // пропустить поля из других запросов
                    if (fieldQuery == query) {
                        allFields[cubeField] = false;
                        var foundProvider = false;
                        for (var i in binding) {
                            if ($this.providers.indexOf(binding[i].provider) != -1) {
                                foundProvider = true;
                                var name = binding[i].provider.name;
                                var prov = providers[name] = providers[name] || {
                                    provider: binding[i].provider,
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


            // and add joinOn (join keys) fields to allFields and providers[].providerFields
            var managedFields = $this.cube.getManagedFields();
            for(var cubeField in managedFields){
                var binding = managedFields[cubeField].binding;
                if (binding.length > 1) {
                    for(var r = 0; r < binding.length; r++) {
                        if (this.providers.indexOf(binding[r].provider) != -1) {
                            allFields[cubeField] = false;
                            var hasOtherBinding = binding.length > 1;
                            providers[binding[r].provider.name].cubeFields[cubeField] = hasOtherBinding;
                            providers[binding[r].provider.name].providerFields[binding[r].field] = cubeField;
                        }
                    }
                }
            }

            // filter redundant providers
            QueryUtils.removeRedundantBindingProviders(providers);
            var singleProv = Object.keys(providers).length == 1 ? providers[Object.keys(providers)[0]] : null;


            if (singleProv) {
                var sql = printTableView(allFields, singleProv, false, false);
                return sql + ' AS ' + this._quotedName(query.$context);
            } else {
                // set isJoined for allFields
                var managedFields = this.cube.getManagedFields();
                for(var cubeField in allFields) if(allFields.hasOwnProperty(cubeField)) {
                    var isJoined = true;
                    var managedField = managedFields[cubeField];
                    var binding = managedField.binding;
                    for (var i in binding) {
                        if (this.providers.indexOf(binding[i].provider) != -1) {
                            if (binding[i].provider.mode != 'join') {
                                isJoined = false;
                            }
                        }
                    }
                    allFields[cubeField] = isJoined;
                }

                // print UNION ALL
                var sqlUnions = '';
                for(var p in providers) if(providers.hasOwnProperty(p)) {
                    var prov = providers[p];
                    if (prov.provider.mode == 'join') continue;

                    if (sqlUnions .length > 0) sqlUnions  += ' UNION ALL ';
                    sqlUnions += printTableView(allFields, prov, true, false);
                }
                var unionsAlias = query.$context + '_unions';

                // print joins
                var sqlJoins = '';
                for(var p in providers) if(providers.hasOwnProperty(p)) {
                    var prov = providers[p];
                    if (prov.provider.mode != 'join') continue;

                    if (sqlJoins.length > 0) sqlJoins += ' LEFT JOIN ';
                    var joinedViewAlias = query.$context + '_joined_' + this.providers.indexOf(prov.provider);
                    sqlJoins += printTableView(allFields, prov, false, true) + ' AS ' + this._quotedName(joinedViewAlias);
                    var sqlOn = '';
                    var joinOnFields = extractJoinOnCubeFields(prov.provider);
                    for (var i in joinOnFields) {
                        if (sqlOn.length > 0) sqlOn  += ' AND ';
                        sqlOn += this._quotedName(unionsAlias) + '.' + this._quotedName(joinOnFields[i]);
                        sqlOn += ' = ';
                        sqlOn += this._quotedName(joinedViewAlias) + '.' + this._quotedName(joinOnFields[i]);
                    }
                    sqlJoins += ' ON ' + sqlOn;
                }
                // build wrapped sql
                var sql = '';
                if (sqlJoins.length > 0) {
                    if (sqlUnions.length > 0) {
                        sql += '(' + sqlUnions + ') AS ' + this._quotedName(unionsAlias);
                        sql += ' LEFT JOIN ' + sqlJoins;
                    } else {
                        sql += sqlJoins;
                    }
                } else {
                    if (sqlUnions.indexOf(' UNION ALL ')) {
                        sql += '(' + sqlUnions + ') AS ' + this._quotedName(unionsAlias);
                    } else {
                        sql += sqlUnions + ' AS ' + this._quotedName(unionsAlias);
                    }
                }

                // print SELECT (mapped fields) FROM (view)
                var fieldsSql = '';
                var managedFields = $this.cube.getManagedFields();
                for(var cubeField in allFields) if(allFields.hasOwnProperty(cubeField)) {
                    if (fieldsSql.length > 0) fieldsSql += ', ';
                    // is joined field find provider or use unions
                    var isJoinedField = allFields[cubeField];
                    if (isJoinedField){
                        var binding = managedFields[cubeField].binding;;
                        for (var p = 0; p < binding.length; p++) {
                            var idx = this.providers.indexOf(binding[p].provider);
                            if (binding[p].provider.mode == 'join' && idx != -1) {
                                var joinedViewAlias = query.$context + '_joined_' + idx;
                                fieldsSql += this._quotedName(joinedViewAlias) + '.' + this._quotedName(cubeField);
                                break;
                            }
                        }
                    } else {
                        fieldsSql += this._quotedName(unionsAlias) + '.' + this._quotedName(cubeField);
                    }
                    fieldsSql += ' AS ' + $this._quotedName(cubeField);
                }

                sql = 'SELECT ' + fieldsSql + ' FROM ' + sql;
                return '(' + sql + ') AS ' + this._quotedName(query.$context);
            }
        },

        _translateQueryDataProviderView: function(query) {
//debugger;
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
            }
            if (fieldsSql.length == 0) fieldsSql += 'NULL';

            sql += fieldsSql + ' FROM ' + $this._printTableName(this.providers[0].getTableFullName());
            sql += ') AS ' + this._quotedName(query.$context);
            return sql;
        },


//        _translateJoins: function(query) {
//            function countLinkedProviders(provider) {
//                var linked = {};
//                var managedFields = $this.cube.getManagedFields();
//                for (var f in managedFields){
//                    var binding = managedFields[f].binding;
//                    for (var p = 0; p < binding.length; p++) {
//                        if (binding[p].provider == provider) {
//                            for (var p1 = 0; p1 < binding.length; p1++) {
//                                if (binding[p1].provider != provider) {
//                                    linked[binding[p1].provider.name] = true;
//                                }
//                            }
//                            break;
//                        }
//                    }
//                }
//                return Object.keys(linked).length;
//            }
//
//            function translateJoin(leftProviders, rightProvider) {
//                var on = '';
//                var managedFields = $this.cube.getManagedFields();
//                for(var f in managedFields){
//                    var binding = managedFields[f].binding;
//                    for(var r = 0; r < binding.length; r++) {
//                        if (binding[r].provider == rightProvider) {
//                            for(var l = 0; l < binding.length; l++) {
//                                if (leftProviders.indexOf(binding[l].provider) != -1) {
//                                    if (on.length > 0) on += ' AND ';
//                                    on += $this._printTableAlias(query.$context, rightProvider) + '.' + $this._quotedName(binding[r].field) +
//                                           ' = ' + $this._printTableAlias(query.$context, binding[l].provider) + '.' + $this._quotedName(binding[l].field);
//                                }
//                            }
//                        }
//                    }
//                }
//                if (on.length > 0) {
//                    var tableAlias = $this._printTableAlias(query.$context, rightProvider);
//                    return $this._printTableName(rightProvider.getTableFullName()) + ' AS ' + tableAlias + ' ON ' + on;
//                }
//                return null;
//            }
//
//            if (!query.$context) {
//                throw new Error('Joins supported only with defined $context');
//            }
//
//            var orderedProviders = this.providers.slice().sort(function(a,b){
//                var ac = countLinkedProviders(a);
//                var bc = countLinkedProviders(b);
//                if (ac == bc) return 0;
//                return ac > bc ? -1 : 1;
//            });
//
//            var tableAlias = this._printTableAlias(query.$context, orderedProviders[0]);
//            var sqlFrom = this._printTableName(orderedProviders[0].getTableFullName()) + ' AS ' + tableAlias;
//
//            var joinedProviders = orderedProviders.slice(0,1);
//            var joinQueueProviders = orderedProviders.slice(1);
//            while(joinQueueProviders.length > 0) {
//                var rightProvider = joinQueueProviders.shift();
//                var join = translateJoin(joinedProviders, rightProvider);
//                if (join) {
//                    sqlFrom += ' LEFT JOIN ' + join;
//                    joinedProviders.push(rightProvider);
//                } else {
//                    throw new Error('DataProvider ' + rightProvider.name + ' has no binding fields (ON condition)');
//                }
//            }
//            return sqlFrom;
//        },

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