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
		    var columns = this._translateColumns(dcQuery);
		    var from  =  this._translateFrom(dcQuery);
		    var where =  this._translateWhere(dcQuery);
		    var group =  this._translateGroup(dcQuery);
		    var order =  this._translateOrder(dcQuery);
		    where = (where ? ' WHERE ' + where : ' ');
		    group = (group ? ' GROUP BY ' + group : ' ');
		    order = (order ? ' ORDER BY ' + order : ' ');

		    var sql = 'SELECT ' + columns + ' FROM ' + from + where + group + order;
		    Log.debug('Translated SQL Query: \n' + sql);
            return sql;
        },

        _translateColumns: function(dcQuery){
            var sqlColumns = '';
            var select = dcQuery.$select;
            var i = 0;
            for (var alias in select) if (select.hasOwnProperty(alias)) {
                if (i++ > 0) sqlColumns += ', '
                sqlColumns += this._translateColumn(alias, select[alias], dcQuery) + ' AS ' + this._quotedName(alias);
            }
            return sqlColumns;
        },

        _translateColumn: function(alias, exp, dcQuery) {
            function translateGlobalAggregate(subExp, func){
                var column = $this._translateColumn(null, subExp, dcQuery);
                var as     = (alias ? ' AS "' + alias +'"' : '');
                var from   = $this._translateFrom(dcQuery);
                var where  = $this._translateWhere(dcQuery);
                where = where ? ' WHERE ' + where : '';

                return '(SELECT ' + func + '(' + column + ')' + as + ' FROM ' + from + where + ')';
            }

            function translateMaxGroupAggregate(subExp, func){
                var from  =  $this._translateFrom(dcQuery);
                var where =  $this._translateWhere(dcQuery);
		        var group =  $this._translateGroup(dcQuery);
		        var column = $this._translateColumn(null, subExp, dcQuery);
		        var subAlias = JSB.generateUid();
		        var subTableAlias = 'sub_table_' + JSB.generateUid();
                var as     = ' AS ' + $this._quotedName(subAlias, true) +'';
                where = (where ? ' WHERE ' + where : ' ');
                group = (group ? ' GROUP BY ' + group : '');

                var subQ = '(SELECT ' + func + '(' + column + ')' + as + ' FROM ' + from + where + group + ') ' + $this._quotedName(subTableAlias);
                return '(SELECT MAX(' + $this._quotedName(subAlias) + ') FROM ' + subQ + ')';
            }

            function translateNOperator(args, op) {
                var sql = '(';
                for (var i in args) {
                    if (i > 0) sql += ' ' + op + ' ';
                    sql += $this._translateColumn(null, args[i], dcQuery);
                }
                sql += ')';
                return sql;
            }

            function translateSubQuery(subExp){
                throw new 'Not implemented yet';
            }

            if (JSB.isString(exp)) {
                if (exp.match(/^\$\{.*\}/g)) {
                    // is parameter value - as is
                    return exp;
                } else {
                    // is dataprovider or cube field
                    return this._translateField(exp, dcQuery);
                }
            }

            if (exp == 1 || exp == -1) {
                return exp;
            }

            if (!JSB.isPlainObject(exp)) {
                throw new Error('Expected object expression not ' + exp);
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
                    return this._translateField(exp[op], dcQuery);
            }

            // n-operators
            switch(op) {
                case '$add':
                    return translateNOperator(exp[op], '+');
                case '$sub':
                    return translateNOperator(exp[op], '+');
                case '$mod':
                    return translateNOperator(exp[op], '%');
                case '$mul':
                    return translateNOperator(exp[op], '*');
                case '$div':
                    return translateNOperator(exp[op], '/');
            }

            // transform operators
            switch(op) {
                case '$splitString':
                    return 'string_to_array(' + this._translateColumn(null, exp[op].$field, dcQuery) + ", '" + exp[op].$separator + "'" + ')';
                case '$substring':
                    return 'substring(' + this._translateColumn(null, exp[op].$field, dcQuery) + " for " + exp[op].$length + ')';
                case '$trim':
                    return 'TRIM(both from ' + this._translateColumn(null, exp[op], dcQuery) + ')';

                case '$toInt':
                    return 'CAST((' + this._translateColumn(null, exp[op], dcQuery) + ' ) as int)';
                case '$toDouble':
                    return 'CAST((' + this._translateColumn(null, exp[op], dcQuery) + ' ) as double precision)';
                case '$toBoolean':
                    return 'CAST((' + this._translateColumn(null, exp[op], dcQuery) + ' ) as boolean)';
                case '$toString':
                    return 'CAST((' + this._translateColumn(null, exp[op], dcQuery) + ' ) as string)';
            }

            // aggregate operators
            switch(op) {
                case '$distinct':
                    return 'DISTINCT(' + this._translateColumn(null, exp[op], dcQuery) + ')';
                case '$count':
                    return 'COUNT(' + this._translateColumn(null, exp[op], dcQuery) + ')';
                case '$sum':
                    return 'SUM(' + this._translateColumn(null, exp[op], dcQuery) + ')';
                case '$max':
                    return 'MAX(' + this._translateColumn(null, exp[op], dcQuery) + ')';
                case '$min':
                    return 'MIN(' + this._translateColumn(null, exp[op], dcQuery) + ')';
                case '$avg':
                    return 'AVG(' + this._translateColumn(null, exp[op], dcQuery) + ')';
                case '$array':
                case '$flatArray':
                    return 'ARRAY_AGG(' + this._translateColumn(null, exp[op], dcQuery) + ')';
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

                case '$subquery':
                    return '(' + translateSubQuery(exp[op], 'COUNT') + ')';
            }

            throw new Error('Unsupported select expression ' + op);
        },

        _translateField: function(field, dcQuery, onlyColumnName) {
            if (this.cube) {
                if (this.cube.fields[field]) {
                    // is in Cube print full name
                    var binding = this.cube.fields[field].binding;
                    for(var b in binding) {
                        if (this.providers.indexOf(binding[b].provider) != -1) {
                            return onlyColumnName
                                    ? this._quotedName(binding[b].field)
                                    : this._translateTableName(binding[b].provider.getTableFullName()) + '.' + this._quotedName(binding[b].field) + '';
                                }
                    }
                }
            }
            // is in DataProvider print full name
            for(var i in this.providers){
                if(this.providers[i].extractFields()[field]) {
                    if (onlyColumnName) {
                        return this._quotedName(field);
                    } else {
                        return this._translateTableName(this.providers[i].getTableFullName()) + '.' + this._quotedName(field);
                    }
                }
            }
            // or alias - as is
            if (dcQuery.$select[field]) {
                return this._quotedName(field);
            }

            throw new Error('Unknown data provider field or alias ' + field);
        },

        _translateTableName: function(tableName){
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
                for(var p in $this.providers) if ($this.providers[p] != leftProvider) {
                    var rightProvider = $this.providers[p];

                    var on = '';
                    for(var f in $this.cube.fields){
                        var binding = $this.cube.fields[f].binding;
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

        _translateWhere: function(dcQuery) {

            function translateOpExpressions(exps, op) {
                if (!JSB.isArray(exps)) {
                    throw new Error('Unsupported expression type for operator ' + op);
                }

                var sql = '(';
                var cnt = 0;
                for (var i in exps) {
                    if (cnt > 0) sql += ' ' + op + ' ';
                    sql += translateMultiExpressions(exps[i]);
                }
                sql += ')';
                return sql;
            }

            function translateMultiExpressions(exps) {
                if (!JSB.isPlainObject(exps)) {
                    throw new Error('Unsupported expression type ' + exps);
                }

                // translate by single field
                var sql = '';
                var cnt = 0;
                for (var field in exps) if (exps.hasOwnProperty(field)) {
                    if (cnt > 0) sql += ' AND ';
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                                sql +=  '(' + translateOpExpressions(exps[op], 'OR') + ')';
                                break;
                            case '$and':
                                sql += '(' + translateOpExpressions(exps[op], 'AND') + ')';
                                break;
                            case '$not':
                                sql += ' NOT (' +translateExpressions(exps[op]) + ')';
                                break;
                            default:
                                throw new Error('Unsupported operator ' + op);
                        }
                    } else {
                        sql += translateExpression(field, exps[field]);
                    }
                }
                return sql;
            }

            function translateExpression(field, exp) {
                if (!JSB.isPlainObject(exp)) {
                    throw new Error('Unsupported expression type ' + exp);
                }
                if (Object.keys(exp).length != 1) {
                    throw new Error('Unexpected expressions count on field' + field);
                }

                var op = Object.keys(exp)[0];
                switch(op){
                    case '$eq':
                        if (exp[op] === null)
                            return $this._translateField(field, dcQuery) + ' IS NULL ';
                        else
                            return $this._translateField(field, dcQuery) + ' = ' + $this._translateColumn(null, exp[op], dcQuery) + ' ';
                    case '$ne':
                        if (exp[op] === null)
                            return $this._translateField(field, dcQuery) + ' IS NOT NULL ';
                        else
                            return $this._translateField(field, dcQuery) + ' != ' + $this._translateColumn(null, exp[op], dcQuery) + ' ';
                    case '$gt':
                        return $this._translateField(field, dcQuery) + ' > ' + $this._translateColumn(null, exp[op], dcQuery) + ' ';
                    case '$gte':
                        return $this._translateField(field, dcQuery) + ' >= ' + $this._translateColumn(null, exp[op], dcQuery) + ' ';
                    case '$lt':
                        return $this._translateField(field, dcQuery) + ' < ' + $this._translateColumn(null, exp[op], dcQuery) + ' ';
                    case '$lte':
                        return $this._translateField(field, dcQuery) + ' <= ' + $this._translateColumn(null, exp[op], dcQuery) + ' ';

                    case '$like':
                        return $$this._translateField(field, dcQuery) + ' ~~ ' + $this._translateColumn(null, exp[op], dcQuery) + ' ';
                    case '$ilike':
                        return $this._translateField(field, dcQuery) + ' ~~* ' + $this._translateColumn(null, exp[op], dcQuery) + ' ';
                    case '$in':
                        return $this._translateField(field, dcQuery) + ' IN ' + $this._translateColumn(null, exp[op], dcQuery) + ' ';
                    case '$nin':
                        return $this._translateField(field, dcQuery) + ' NOT IN ' + $this._translateColumn(null, exp[op], dcQuery) + ' ';
                }
                throw new Error('Unsupported condition expression ' + op);
            }

            return dcQuery.$filter ? translateMultiExpressions(dcQuery.$filter) : '';
        },

        _translateGroup: function(dcQuery) {
            var group = dcQuery.$groupBy;
            if (group && !JSB.isArray(group)) {
                throw new Error('Unsupported groupBy expression type ' + group);
            }

            var sql = '';
            for (var i in group) {
                if (i > 0) sql += ', ';
                sql += $this._translateField(group[i], dcQuery);
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
                var field = Object.keys(val)[0];
                var key = val[field] < 0 ? ' DESC' : ' ASC';
                sql += $this._translateField(field, dcQuery) + key;
            }
            return sql;
        },
	}
}