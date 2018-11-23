{
	$name: 'DataCube.Query.Translators.SQLTranslator',
	$parent: 'DataCube.Query.Translators.BaseTranslator',

	$server: {
		vendor: 'PostgreSQL',
		
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.QuerySyntax',
		    'JSB.Store.Sql.JDBC'
        ],
        
        $bootstrap: function(){
//        	TranslatorRegistry.register(this);
        },

		$constructor: function(providerOrProviders, cube){
		    $base(providerOrProviders, cube);
		    $this.cubeFields = $this.cube.getManagedFields();
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

        _translatedContexts: {},

        _translateContext: function(context) {
//            return context;
            if (!$this._translatedContexts[context]) {
                var name = $this._translatedContexts[context] = 'Q'+Object.keys($this._translatedContexts).length;
                QueryUtils.logDebug('Query context: {} = {}',name, context);
                return name;

            }
            return $this._translatedContexts[context];
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
                var sql = $this._printTableName(singleProv.provider.getTableFullName()) + ' AS ' + $this._translateContext($this._quotedName(query.$context));
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
                    var sql = '(' + sqlUnions + ') AS ' + $this._translateContext($this._quotedName(unionsAlias));
                } else if (unionsCount > 0) {
                    var sql = sqlUnions + ' AS ' + $this._translateContext($this._quotedName(unionsAlias));
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
                    sqlJoins += ' AS ' + $this._translateContext($this._quotedName(joinedViewAlias));

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
                                ? $this._translateContext($this._quotedName(unionsAlias)) + '.' + $this._quotedName(unionsFields[cubeField])
                                : $this._translateContext($this._quotedName(fieldsMap[cubeField].joinOn.tableAlias)) + '.' + $this._quotedName(fieldsMap[cubeField].joinOn.fieldAlias);
                        sqlOn += ' = ';
                        sqlOn += $this._translateContext($this._quotedName(joinedViewAlias)) + '.' + $this._quotedName(providerField);
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
            sql += ') AS ' + $this._translateContext(this._quotedName(query.$context));
            return sql;
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
                        sqlOp = ' ~~ '; break;
                    case '$ilike':
                        sqlOp = ' ~~* '; break;
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
	}
}