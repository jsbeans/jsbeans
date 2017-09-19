{
	$name: 'DataCube.Query.Translators.SQLTranslator',
	$parent: 'DataCube.Query.Translators.Translator',

	$server: {
		$require: [
		    'DataCube.Query.QueryParser',
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Providers.SqlTableDataProvider'
        ],

		$bootstrap: function(){
			TranslatorRegistry.register(this, 'DataCube.Providers.SqlTableDataProvider');
		},

		$constructor: function(providerOrProviders, cubeOrQueryEngine){
		    $base(providerOrProviders, cubeOrQueryEngine);
		},

		executeQuery: function(translatedQuery, params){
		    var store = this.providers[0].getStore();
		    var iterator = store.asSQL().iteratedParametrizedQuery2(
		        translatedQuery,
		        function getValue(param) {
		            return params[param];
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

		translateQuery: function(dcQuery, params) {
		    var sql = this.translateQueryExpression(dcQuery);

//		    Log.debug('Translated SQL Query: \n' + sql);
            return sql;
        },

		translateQueryExpression: function(dcQuery) {
		    var sql = '';
		    if (dcQuery.$sql) {
		        sql += this._prepareEmbeddedSQL(dcQuery.$sql, dcQuery);
		    } else {
                var columns = this._translateExpressions(dcQuery);
                var from  = this._translateFrom(dcQuery);
                var where = this._translateWhere(dcQuery);
                var group = this._translateGroup(dcQuery);
                var order = this._translateOrder(dcQuery);
                var limit = dcQuery.$limit ? ' LIMIT ' + dcQuery.$limit: '';
                from  = dcQuery.$context ? from + ' ' + this._quotedName(dcQuery.$context, true) : from;
                where = where ? ' WHERE ' + where : ' ';
                group = group ? ' GROUP BY ' + group : ' ';
                order = order ? ' ORDER BY ' + order : ' ';

                sql += 'SELECT ' + columns + ' FROM ' + from + where + group + order + limit;
            }

		    if (dcQuery.$postFilter) {
		        sql = 'SELECT * FROM (' + sql + ') "result" WHERE ' + this._translateWhere(dcQuery, dcQuery.$postFilter, "result");
		    }

//		    Log.debug('Translated SQL Query: \n' + sql);
            return sql;
        },

        _prepareEmbeddedSQL: function(sql, dcQuery){
            if (this.cube) {
            	var managedFields = this.cube.getManagedFields();
                for (var field in managedFields) if (managedFields.hasOwnProperty(field)) {
                    // is in Cube print full name
                    var binding = managedFields[field].binding;
                    for(var b in binding) {
                        if (this.providers.indexOf(binding[b].provider) != -1) {
                            var name = this._translateTableName(binding[b].provider.getTableFullName()) + '.' + this._quotedName(binding[b].field) + '';
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

        _translateExpressions: function(dcQuery){
            var sqlColumns = '';
            var select = dcQuery.$select;
            var i = 0;
            for (var alias in select) if (select.hasOwnProperty(alias)) {
                if (i++ > 0) sqlColumns += ', '
                sqlColumns += this._translateExpression(alias, select[alias], dcQuery) + ' AS ' + this._quotedName(alias, true);
            }
            return sqlColumns;
        },

        _translateExpression: function(alias, exp, dcQuery, forceTableAlias) {
            function translateGlobalAggregate(subExp, func){
                var column = $this._translateExpression(null, subExp, dcQuery);
		        var subAlias = JSB.generateUid();
                var as     = ' AS ' + $this._quotedName(subAlias, true) + '';
                var from   = $this._translateFrom(dcQuery);
                var where  = $this._translateWhere(dcQuery);
                where = where ? ' WHERE ' + where : '';

                return '(SELECT ' + func + '(' + column + ')' + as + ' FROM ' + from + where + ')';
            }

            function translateMaxGroupAggregate(subExp, func){
                var from  =  $this._translateFrom(dcQuery);
                var where =  $this._translateWhere(dcQuery);
		        var group =  $this._translateGroup(dcQuery);
		        var column = $this._translateExpression(null, subExp, dcQuery);
		        var subAlias = JSB.generateUid();
		        var subTableAlias = 'sub_table_' + JSB.generateUid();
                var as     = ' AS ' + $this._quotedName(subAlias, true) +'';
                where = (where ? ' WHERE ' + where : ' ');
                group = (group ? ' GROUP BY ' + group : '');

                var subQ = '(SELECT ' + func + '(' + column + ')' + as + ' FROM ' + from + where + group + ') ' + $this._quotedName(subTableAlias, true);
                return '(SELECT MAX(' + $this._quotedName(subAlias, true) + ') FROM ' + subQ + ')';
            }

            function translateNOperator(args, op) {
                var sql = '(';
                for (var i in args) {
                    if (i > 0) sql += ' ' + op + ' ';
                    sql += $this._translateExpression(null, args[i], dcQuery);
                }
                sql += ')';
                return sql;
            }

            function translateDivzOperator(args) {
                if (args.length != 2) throw new Error('Operator $divz must have two arguments');

                var sql = '(case when ';
                sql += $this._translateExpression(null, args[1], dcQuery);
                sql += " = 0 then NULL else ";
                sql += $this._translateExpression(null, args[0], dcQuery) + '/' + $this._translateExpression(null, args[1], dcQuery);
                sql += ' end)';
                return sql;
            }


            function translateSubQuery(subQuery, parentFilters){
                subQuery = JSB.merge(true, {}, subQuery);
                if (parentFilters.$filter) {
                    subQuery.$filter = subQuery.$filter || {};
                    subQuery.$filter.$and = subQuery.$filter.$and || [];
                    subQuery.$filter.$and.push(parentFilters.$filter)
                }
                return $this.translateQueryExpression(subQuery);
            }

            function translateCaseExpression($cond, $then, $else){
                var sql = 'case when ';
                sql += $this._translateWhere(dcQuery, $cond, forceTableAlias);
                sql += " then ";
                sql += $this._translateExpression(null, $then, dcQuery);
                sql += " else ";
                sql += $this._translateExpression(null, $else, dcQuery);
                sql += ' end';
                return sql;
            }

            if (JSB.isString(exp)) {
                if (exp.match(/^\$\{.*\}/g)) {
                    // is parameter value - as is
                    return exp;
                } else {
                    // is dataprovider or cube field
                    return this._translateField(exp, dcQuery, forceTableAlias, !!forceTableAlias);
                }
            }

            if (exp == 1 || exp == -1) {
                return exp;
            }

            if (JSB.isArray(exp)) {
                var sql = '';
                for (var i in exp) {
                    if (i > 0) sql += ', ';
                    sql += $this._translateExpression(null, exp[i], dcQuery, forceTableAlias);
                }
                sql += '';
                return sql;

            }

            if (!JSB.isPlainObject(exp)) {
                throw new Error('Expected object expression not ' + exp);
            }



            if (exp.$select) {
                // sub query expression
                return '(' + translateSubQuery(exp, {
                    $filter: dcQuery.$filter,
                    $postFilter: dcQuery.$postFilter
                }) + ')';
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
                    }
                case '$field':
                case '$context':
                    if (!exp.$field) throw new Error('Field $field is not defined with $context=' + exp.$context);
                    return this._translateField(exp.$field, dcQuery, exp.$context, forceTableAlias, !!forceTableAlias);
            }

            // n-operators
            switch(op) {
                case '$add':
                    return translateNOperator(exp[op], '+');
                case '$sub':
                    return translateNOperator(exp[op], '-');
                case '$mod':
                    return translateNOperator(exp[op], '%');
                case '$mul':
                    return translateNOperator(exp[op], '*');
                case '$div':
                    return translateNOperator(exp[op], '/');
                case '$divz':
                    return translateDivzOperator(exp[op]);

            }

            // transform operators
            switch(op) {
                case '$if':
                    return '(' + translateCaseExpression(exp[op].$cond, exp[op].$then, exp[op].$else) + ')';

                case '$greatest':
                    return 'GREATEST(' + this._translateExpression(null, exp[op], dcQuery) + ')';
                case '$least':
                    return 'LEAST(' + this._translateExpression(null, exp[op], dcQuery) + ')';

                case '$splitString':
                    return 'string_to_array(' + this._translateExpression(null, exp[op].$field, dcQuery) + ", '" + exp[op].$separator + "'" + ')';
                case '$substring':
                    return 'substring(' + this._translateExpression(null, exp[op].$field, dcQuery) + " for " + exp[op].$length + ')';
                case '$trim':
                    return 'TRIM(both from ' + this._translateExpression(null, exp[op], dcQuery) + ')';

                case '$toInt':
                    return 'CAST((' + this._translateExpression(null, exp[op], dcQuery) + ' ) as int)';
                case '$toDouble':
                    return 'CAST((' + this._translateExpression(null, exp[op], dcQuery) + ' ) as double precision)';
                case '$toBoolean':
                    return 'CAST((' + this._translateExpression(null, exp[op], dcQuery) + ' ) as boolean)';
                case '$toString':
                    return 'CAST((' + this._translateExpression(null, exp[op], dcQuery) + ' ) as varchar)';
                case '$toDate':
                    return 'CAST((' + this._translateExpression(null, exp[op], dcQuery) + ' ) as date)';

                case '$dateYear':
                    return 'extract(isoyear from ' + this._translateExpression(null, exp[op], dcQuery) + ')';
                case '$dateMonth':
                    return 'extract(month from ' + this._translateExpression(null, exp[op], dcQuery) + ')';
                case '$dateTotalSeconds':
                    return 'extract(epoch from ' + this._translateExpression(null, exp[op], dcQuery) + ')';

                case '$dateIntervalOrder':
                    return 'CAST((extract(epoch from ' + this._translateExpression(null, exp.$dateIntervalOrder.$field, dcQuery) + ')/' + exp.$dateIntervalOrder.$seconds + ') as int)';
            }

            // aggregate operators
            switch(op) {
                case '$distinct':
                    return 'DISTINCT(' + this._translateExpression(null, exp[op], dcQuery) + ')';
                case '$count':
                    return 'COUNT(' + this._translateExpression(null, exp[op], dcQuery) + ')';
                case '$sum':
                    return 'SUM(' + this._translateExpression(null, exp[op], dcQuery) + ')';
                case '$max':
                    return 'MAX(' + this._translateExpression(null, exp[op], dcQuery) + ')';
                case '$min':
                    return 'MIN(' + this._translateExpression(null, exp[op], dcQuery) + ')';
                case '$avg':
                    return 'AVG(' + this._translateExpression(null, exp[op], dcQuery) + ')';
                case '$array':
                case '$flatArray':
                    return 'ARRAY_AGG(' + this._translateExpression(null, exp[op], dcQuery) + ')';
                case '$expandArray':
                    return 'UNNEST(' + this._translateExpression(null, exp[op], dcQuery) + ')';
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

        _translateField: function(field, dcQuery, tableAlias, asAlias) {
            if (asAlias) {
                return tableAlias
                        ? this._quotedName(tableAlias, true) + '.' + this._quotedName(field, true)
                        : this._quotedName(field, true);
            }
            var tableAlias = tableAlias || dcQuery.$context;
            if (this.cube) {
            	var managedFields = this.cube.getManagedFields();
                if (managedFields[field]) {
                    // is in Cube print full name
                    var binding = managedFields[field].binding;
                    for(var b in binding) {
                        if (this.providers.indexOf(binding[b].provider) != -1) {
                            return tableAlias
                                    ? this._quotedName(tableAlias, true) + '.' + this._quotedName(binding[b].field)
                                    : this._translateTableName(binding[b].provider.getTableFullName()) + '.' + this._quotedName(binding[b].field) + '';
                                }
                    }
                }
            }
            // is in DataProvider print full name
            for(var i in this.providers){
                if(this.providers[i].extractFields()[field]) {
                    if (tableAlias) {
                        return this._quotedName(tableAlias, true) + '.' + this._quotedName(field);
                    } else {
                        return this._translateTableName(this.providers[i].getTableFullName()) + '.' + this._quotedName(field);
                    }
                }
            }

            // or table alias or main alias
            if (tableAlias) {
                return this._quotedName(tableAlias, true) + '.' + this._quotedName(field);
            } else if (dcQuery.$select[field]) {
                return this._quotedName(field);
            }

            throw new Error('Unknown data provider field or alias ' + field);
        },

        _translateTableName: function(tableName){
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

        _translateFrom: function(dcQuery) {
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
                                on += $this._translateTableName(rightProvider.getTableFullName()) + '.' + $this._quotedName(binding[b].field) +
                                       ' = ' + $this._translateTableName(leftProvider.getTableFullName()) + '.' + $this._quotedName(binding[leftPosition].field);
                            }
                        }
                    }
                    if (on.length > 0) {
                        sqlJoins += $this._translateTableName(rightProvider.getTableFullName()) + ' ON ' + on;
                    }
                }
                return sqlJoins;
            }

            if (dcQuery.$from) {
                //if (!dcQuery.$from.$context) throw new Error('Field $context is not defined in sub query $from');
                if (!dcQuery.$context) throw new Error('Field $context is not defined query with $from');
                return '(' + this.translateQueryExpression(dcQuery.$from) +
                            ') ';// + this._quotedName(dcQuery.$from.$context, true);
            }

            var sqlFrom = this._translateTableName(this.providers[0].getTableFullName());
            if (this.providers.length > 1) {
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

        _translateWhere: function(dcQuery, filterExp, forceTableAlias) {

            function translateOpExpressions(exps, op) {
                if (!JSB.isArray(exps)) {
                    throw new Error('Unsupported expression type for operator ' + op);
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
                    throw new Error('Operands for ' + op + ' must be array not ' + typeof operands);
                }
                if (op != '$not' && operands.length != 2) {
                    throw new Error('Operator ' + op + ' support only 2 operands');
                }
                if (op == '$not' && operands.length != 1) {
                    throw new Error('Operator ' + op + ' support only 1 operands');
                }
                if (operands[0] == null) {
                    throw new Error('First operand cannot be null');
                }

                switch(op){
                    case '$not':
                            return 'NOT ' + $this.translateMultiExpressions(operands[0]) + ' ';
                    case '$eq':
                        if (operands[1] === null)
                            return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' IS NULL ';
                        else
                            return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' = ' + $this._translateExpression(null, operands[1], dcQuery, forceTableAlias) + ' ';
                    case '$ne':
                        if (operands[1] === null)
                            return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' IS NOT NULL ';
                        else
                            return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' != ' + $this._translateExpression(null, operands[1], dcQuery, forceTableAlias) + ' ';
                    case '$gt':
                        return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' > ' + $this._translateExpression(null, operands[1], dcQuery, forceTableAlias) + ' ';
                    case '$gte':
                        return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' >= ' + $this._translateExpression(null, operands[1], dcQuery, forceTableAlias) + ' ';
                    case '$lt':
                        return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' < ' + $this._translateExpression(null, operands[1], dcQuery, forceTableAlias) + ' ';
                    case '$lte':
                        return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' <= ' + $this._translateExpression(null, operands[1], dcQuery, forceTableAlias) + ' ';

                    case '$like':
                        return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' ~~ ' + $this._translateExpression(null, operands[1], dcQuery, forceTableAlias) + ' ';
                    case '$ilike':
                        return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' ~~* ' + $this._translateExpression(null, operands[1], dcQuery, forceTableAlias) + ' ';
                    case '$in':
                        return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' IN ' + $this._translateExpression(null, operands[1], dcQuery, forceTableAlias) + ' ';
                    case '$nin':
                        return $this._translateExpression(null, operands[0], dcQuery, forceTableAlias) + ' NOT IN ' + $this._translateExpression(null, operands[1], dcQuery, forceTableAlias) + ' ';
                }
                throw new Error('Unsupported binary condition expression ' + op);

            }

            function translateCondition(field, exp) {
                if (!JSB.isPlainObject(exp)) {
                    throw new Error('Expression type must be object not ' + typeof exp);
                }
                if (Object.keys(exp).length != 1) {
                    throw new Error('Unexpected expressions count on field ' + field);
                }

                var op = Object.keys(exp)[0];
                switch(op){
                    case '$eq':
                        if (exp[op] === null)
                            return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' IS NULL ';
                        else
                            return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' = ' + $this._translateExpression(null, exp[op], dcQuery, forceTableAlias) + ' ';
                    case '$ne':
                        if (exp[op] === null)
                            return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' IS NOT NULL ';
                        else
                            return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' != ' + $this._translateExpression(null, exp[op], dcQuery, forceTableAlias) + ' ';
                    case '$gt':
                        return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' > ' + $this._translateExpression(null, exp[op], dcQuery, forceTableAlias) + ' ';
                    case '$gte':
                        return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' >= ' + $this._translateExpression(null, exp[op], dcQuery, forceTableAlias) + ' ';
                    case '$lt':
                        return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' < ' + $this._translateExpression(null, exp[op], dcQuery, forceTableAlias) + ' ';
                    case '$lte':
                        return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' <= ' + $this._translateExpression(null, exp[op], dcQuery, forceTableAlias) + ' ';

                    case '$like':
                        return $$this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' ~~ ' + $this._translateExpression(null, exp[op], dcQuery, forceTableAlias) + ' ';
                    case '$ilike':
                        return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' ~~* ' + $this._translateExpression(null, exp[op], dcQuery, forceTableAlias) + ' ';
                    case '$in':
                        return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' IN ' + $this._translateExpression(null, exp[op], dcQuery, forceTableAlias) + ' ';
                    case '$nin':
                        return $this._translateField(field, dcQuery, forceTableAlias, !!forceTableAlias) + ' NOT IN ' + $this._translateExpression(null, exp[op], dcQuery, forceTableAlias) + ' ';
                }
                throw new Error('Unsupported condition expression ' + op);
            }

            function translateMultiExpressions(exps) {
                if (!JSB.isPlainObject(exps)) {
                    throw new Error('Unsupported expression type ' + exps);
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
                                sql +=  '(' + translateOpExpressions(exps[op], 'OR') + ')';
                                break;
                            case '$and':
                                sql += '(' + translateOpExpressions(exps[op], 'AND') + ')';
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
            var filterExp = filterExp || dcQuery.$filter;
            return filterExp ? translateMultiExpressions(filterExp) : '';
        },

        _translateGroup: function(dcQuery) {
            var group = dcQuery.$groupBy;
            if (group && !JSB.isArray(group)) {
                throw new Error('Unsupported groupBy expression type ' + group);
            }

            var sql = '';
            for (var i in group) {
                if (i > 0) sql += ', ';
                //sql += $this._translateField(group[i], dcQuery);
                sql += $this._translateExpression(null, group[i], dcQuery);
            }
            return sql;
        },

        _translateOrder: function(dcQuery) {
            var sort = dcQuery.$sort;
            if (sort && !JSB.isArray(sort)) {
                throw new Error('Unsupported sort expression type ' + sort);
            }

            var sql = '';
            for (var i in sort) {
                if (i > 0) sql += ', ';
                var val = sort[i];
                if (val.$expr && val.$type) {
                var key = val.$type < 0 ? ' DESC' : ' ASC';
                    sql += $this._translateExpression(null, val.$expr, dcQuery) + key;
                } else {
                    var field = Object.keys(val)[0];
                    var key = val[field] < 0 ? ' DESC' : ' ASC';
                    sql += $this._translateField(field, dcQuery) + key;
                }
            }
            return sql;
        },

		close: function() {
		    this.destroy();
		}
	}
}