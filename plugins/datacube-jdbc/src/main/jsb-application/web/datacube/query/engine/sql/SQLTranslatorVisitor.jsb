{
	$name: 'DataCube.Query.Visitors.SQLTranslatorVisitor',
	$parent: 'DataCube.Query.Visitors.Visitor',

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
			'Datacube.Types.DataTypes',
		    'java:java.util.HashMap',
            'java:java.lang.StringBuilder',
            'DataCube.Query.Extractors.ExpressionsTypesExtractor',
        ],

		$constructor: function(query, params, cube, executor){
		    $this.query = query;
		    $this.params = params;
		    $this.cube = cube;
		    $this.executor = executor;
		    $this.sqlStack = [];
		    $this.vendor = 'H2';
		    $this.current = {
                sql: new StringBuilder(),
            };
            $this.indentation = 0;
            $this.duplicatedContexts = {};
            $this.renameContexts = {}; // or null for disable
		    $this.printedQueries = new HashMap();
            $this.BreakError = 'BREAK TRANSLATOR: ';
		},

		translate: function(){
		    ExpressionsTypesExtractor.extractedTypes($this.query, function(queryFieldsTypes, expressionsTypes){
		        $this.queryFieldsTypes = queryFieldsTypes;
		        $this.expressionsTypes = expressionsTypes;
		    });
		    try {
                $this.visit($this.query);
                return $this.getSQL();
            } catch(e) {
                if(e.startsWith && e.startsWith($this.BreakError)) {
                    return null;
                } else {
                    throw e;
                }
            }
		},

		destroy: function(){
		    $this.current = null;
		    $this.sqlStack = null;
		    $this.sourceQuery = null;
		    $base();
		},

		getSQL: function(){
		    return $this.current.sql ? ''+$this.current.sql.toString() : null;
		},

		breakTranslator: function(reason){
		    QueryUtils.logDebug('Break translator reason: {}', reason);
		    throw $this.BreakError + reason;
		},

		getOutputFieldType: function(alias, query) {
		    var  type = $this.queryFieldsTypes.get(query)[alias];
            return type;
        },

		getType: function(exp) {
		    var  type = $this.expressionsTypes.get(exp);
            return type;
		},

        visitQuery: function(query) {
            if (!query.$context)  {
                query.$context = '##'+JSB.generateUid().substr(0,4);
            }
            var sqlQuery = $this.printScope(function(){
                var hasBody = QueryUtils.queryHasBody(query);
                var isRoot = $this.isRoot();
                var inUnion = $this.getExpressionKey(-2) == '$union';

                $this.current.printBody = isRoot || inUnion || hasBody;
                $this.current.printBrackets = !(isRoot || !$this.current.printBody);
                $this.current.printAlias = $this.current.printBody && $this.current.printBrackets
                    && !inUnion
                    && $this.getExpressionKey(-2) != '$recursive'
                    && !$this.isView()
                    && !$this.isNestedQuery();

                if ($this.current.printBody) {
                    $this.printedQueries.put(query, true);
                }

                if ($this.current.printBrackets) {
                    $this.print('(');
                    $this.indentInc();
                    $this.printNewLineIndent();
                }

                $this.visitViews(query);
                $base(query);

                if ($this.current.printBody) {
                    $this.print('SELECT');
                    if (query.$limit && query.$limit >= 0 && $this.vendor == 'MSSQL') {
                        $this.printNewLineIndent();
                        $this.print('TOP', query.$limit);
                    }
                    $this.print($this.current.select);
                }
                if($this.current.printBody) {
                    $this.printNewLineIndent();
                    $this.print('FROM');
                }
                $this.print($this.current.source);

                if ($this.getExpressionKey() == '$joinedNext') {
                    /// for $this.visitRecursive()
                    $this.printNewLineIndent();
                    $this.print('JOIN');
                    var caller = $this.getCaller();
                    $this.printOriginalContext(caller.$context, true);
                    QueryUtils.throwError(caller.$recursive, 'Invalid $recursive/$joinedNext');
                    $this.printNewLineIndent();
                    $this.print('ON');
                    var filter = caller.$recursive.$filter;
                    $this.withPath('$recursive', '$filter', function(){
                         $this.visit(filter, {asExpression: true});
                    });
                }

                if ($this.current.where) {
                    $this.printNewLineIndent();
                    $this.print('WHERE', $this.current.where);
                }
                if ($this.current.groupBy) {
                    $this.printNewLineIndent();
                    $this.print('GROUP BY', $this.current.groupBy);
                }
                if ($this.current.having) {
                    $this.printNewLineIndent();
                    $this.print('HAVING', $this.current.having);
                }
                if ($this.current.orderBy) {
                    $this.printNewLineIndent();
                    $this.print('ORDER BY', $this.current.orderBy);
                }
                if (query.$offset && query.$offset >= 0) {
                    $this.printNewLineIndent();
                    $this.print('OFFSET', query.$offset);
                }
                if (query.$limit && query.$limit >= 0 && $this.vendor != 'MSSQL') {
                    $this.printNewLineIndent();
                    $this.print('LIMIT', query.$limit);
                }

                if ($this.current.printBrackets) {
                    $this.indentDec();
                    $this.printNewLineIndent();
                    $this.print(')');
                }

                if ($this.current.printAlias) {
                    $this.print(' AS');
                    $this.printDeclareContext(query.$context);
                }
            });
            $this.print(sqlQuery);
        },

		visitViews: function(query){
		    var size = query.$views ? Object.keys(query.$views).length : 0;
		    if (size > 0) {
		        $this.print('WITH');
		        $this.indentInc();
		        for(var name in query.$views) {
		            $this.printNewLineIndent();
		            $this.printOriginalContext(name, true);
		            $this.print('AS');
		            $this.withPath(name, function(){
                        $this.visit(query.$views[name], {asQuery: true});
                    });
                    if (--size > 0) {
                        $this.print(',\n');
                    }
		        }
                $this.indentDec();
                $this.printNewLineIndent();
		    }
		},

        visitSelect: function($select) {
            if ($this.current.printBody) {
                var query = $this.getQuery();
                var sqlSelect = $this.printScope(function(){
                    $this.indentInc();
                    $this.current.select = [];
                    $base($select);
                    for(var i = 0, len = $this.current.select.length; i < len; i++) {
                        $this.print($this.current.select[i], i < len - 1 ? ',' : '');
                    }
                    $this.indentDec();
                });
                $this.current.select = sqlSelect;
            }
        },

        visitOutputField:function(alias, exp) {
            var sqlFieldExpr = $this.printScope(function(){
                $this.printNewLineIndent();
                $base(alias, exp);
                $this.print(' AS');
                $this.printDeclareField(alias);
            });
            $this.current.select.push(sqlFieldExpr);
        },

        visitQuerySource: function(exp) {
            if (JSB.isEqual({}, exp)) {
                $this.current.source = '(SELECT null)';
                return;
            }
            var sqlSource = $this.printScope(function(){
                $base(exp);
            });
            $this.current.source = sqlSource;
        },

        visitField: function(field, context, sourceContext) {
            var query = $this.getQuery();
            var targetQuery = $this.getQuery(context);
            var isExternal = query != targetQuery;
            var aliasPriority = $this.current.aliasPriority || (function(){
                for(var i = $this.sqlStack.length - 1; i >= 0; i--) {
                    if ($this.sqlStack[i].aliasPriority) return true;
                }
            })();

            var sqlField = $this.printScope(function(){
                if(aliasPriority && targetQuery.$select[field]) {
                    /// print as alias
                    $this.printField(field, false, true);
                    return;
                }
                function printSourceField(sourceQuery){
                    if ($this.printedQueries.get(sourceQuery)) {
                        $this.printContext(sourceQuery.$context, isExternal);
                        $this.print('.');
                        $this.printField(field);
                    } else {
                        $this.withPath('$from', sourceQuery, '$select', field, function(){
                            $this.visit(sourceQuery.$select[field], {asExpression:true});
                        });
                    }
                }
                if (targetQuery.$from) {
                    var sourceQuery = $this.getQuery(targetQuery.$from);
                    if (sourceQuery.$select[field]) {
                        printSourceField(sourceQuery);
                        return;
                    }
                } else if (targetQuery.$join) {
                    var leftQuery = $this.getQuery(targetQuery.$join.$left);
                    var rightQuery = $this.getQuery(targetQuery.$join.$right);

                    if (sourceContext) {
                        if (leftQuery.$context == sourceContext) {
                            if (leftQuery.$select[field]) {
                                printSourceField(leftQuery);
                                return;
                            }
                        } else if(rightQuery.$context == sourceContext){
                            if (rightQuery.$select[field]) {
                                printSourceField(rightQuery);
                                return;
                            }
                        }
                    }

                    if (targetQuery.$join.$joinType.indexOf('left') !== -1) {
                        if (leftQuery.$select[field]) {
                            printSourceField(leftQuery);
                            return;
                        }
                    }
                    if (rightQuery.$select[field]) {
                        printSourceField(rightQuery);
                        return;
                    }
                    if (targetQuery.$join.$joinType.indexOf('left') === -1) {
                        if (leftQuery.$select[field]) {
                            printSourceField(leftQuery);
                            return;
                        }
                    }

                } else if (targetQuery.$union) {
                    $this.printContext(targetQuery.$context, isExternal);
                    $this.print('.');
                    $this.printField(field);
                    return;
                } else if (targetQuery.$provider) {
                    var dataProvider = QueryUtils.getQueryDataProvider(targetQuery.$provider);
                    $this.printContext($this.getProviderContext(dataProvider), isExternal);
                    $this.print('.');
                    $this.printField(field, true, false);
                    return;
                } else if (targetQuery.$recursive) {
                    $this.printContext(targetQuery.$context, isExternal);
                    $this.print('.');
                    $this.printField(field);
                    return;
                }

                if(targetQuery.$select[field]) {
                    $this.printField(field, false, true);
                    return;
                }
                QueryUtils.throwError('Invalid field ', JSON.stringify($this.getCurrent()));
            });

            var exp = this.getCurrent();
            if (exp.$type || exp.$nativeType) {
                $this.print('CAST(', sqlField, 'AS', exp.$nativeType||DataTypes.toVendor($this.vendor, exp.$type), ')');
            } else {
                $this.print(sqlField);
            }
        },

        visitAnyExpression: function(exp) {
            var op = Object.keys(exp)[0];

            function simple(prefix, suffix) {
                if(prefix) $this.print(prefix);
                $base(exp);
                if(suffix) $this.print(suffix);
            }
            function casted(type) {
                $this.print('CAST','(', '(')
                $base(exp);
                $this.print(')', 'AS', type, ')')
            }
            function nFunction(prefix, delim, suffix, wrapper/*(sqlArg, i, exp)*/) {
                if(prefix) $this.print(prefix);
                for(var i = 0, len = exp[op].length; i < len; i++) {
                    if (i > 0) $this.print(delim);
                    if (wrapper) {
                        $this.printStart();
                    }
                    $this.withPath(op, i, function(){
                        $this.visit(exp[op][i], {asExpression:true});
                    });
                    if (wrapper) {
                        var sqlArg = $this.printEnd();
                        sqlArg = wrapper(sqlArg, i, exp[op][i]);
                        $this.print(sqlArg);
                    }
                }
                if(suffix) $this.print(suffix);
            }
            function exp1ValueFunction(prefix, opExp, exp, delim, value, suffix) {
                $this.print(prefix);
                $this.withPath(op, opExp, function(){
                    $this.visit(exp, {asExpression:true});
                });
                $this.print(delim);
                $this.printValue(value);
                $this.print(suffix);
            }
            function exp3ValueFunction(prefix, opExp, exp, delim1, value1, delim2, value2, delim3, value3, suffix) {
                $this.print(prefix);
                $this.withPath(op, opExp, function(){
                    $this.visit(exp, {asExpression:true});
                });
                $this.print(delim1);
                $this.printValue(value1);
                $this.print(delim2);
                $this.printValue(value2);
                $this.print(delim3);
                $this.printValue(value3);
                $this.print(suffix);
            }
            function caseExpression(op, exp) {
                $this.print('(');
                    $this.indentInc();
                    $this.printNewLineIndent();
                    $this.print('CASE WHEN');
                    $this.withPath(op, '$cond', function(){
                        $this.visit(exp.$cond, {asCondition: true});
                    });
                    $this.printNewLineIndent();
                    $this.print('THEN');
                    $this.withPath(op, '$then', function(){
                        $this.visit(exp.$then, {asExpression: true});
                    });
                    $this.printNewLineIndent();
                    $this.print('ELSE');
                    $this.withPath(op, '$else', function(){
                        $this.visit(exp.$else, {asExpression: true});
                    });
                    $this.printNewLineIndent();
                    $this.print('END');
                    $this.indentDec();
                $this.printNewLineIndent();
                $this.print(')');
            }

            // aggregate operators
            switch(op) {
                case '$distinct':
                    return simple('DISTINCT(', ')');
                case '$any':
                    return simple('MIN(', ')');
                case '$corr':
                    return nFunction('CORR(', ',', ')');
                case '$first':
                    return simple('(ARRAY_AGG(', '))[1]');
                case '$last':
                    var lastVal = $this.printScope(function(){
                        $base(exp);
                    });
                    return $this.print('(ARRAY_AGG','(', lastVal, ')', ')[ARRAY_LENGTH(ARRAY_AGG','(',lastVal, ')', ',1)]');
                case '$count':
                    return exp.$count == 1
                            ? $this.print('COUNT(*)')
                            : simple('COUNT(', ')');
                case '$sum':
                    return simple('SUM(', ')');
                case '$max':
                    return simple('MAX(', ')');
                case '$min':
                    return simple('MIN(', ')');
                case '$avg':
                    return simple('AVG(', ')');
                case '$array':
                case '$flatArray':
                    switch($this.vendor) {
                        case 'ClickHouse':
                            return simple('groupArray(', ')');
                        default:
                            return simple('ARRAY_AGG(', ')');
                    }
                case '$expandArray':
                    return simple('UNNEST(', ')');
            }

            // transform operators
            switch(op) {
                case '$if':
                    return caseExpression(op, exp[op]);
                case '$greatest':
                    return simple('GREATEST(', ')');
                case '$least':
                    return simple('LEAST(', ')');
                case '$splitString':
                    return exp1ValueFunction('string_to_array(', '$value', exp[op].$value, ', ', exp[op].$separator, ')');
                case '$substring':
                    return exp1ValueFunction('substring(', '$value', exp[op].$value, 'for', exp[op].$length, ')');
                case '$trim':
                    return simple('TRIM(both from ', ')');
                case '$regexpReplace':
                    return exp3ValueFunction('REGEXP_REPLACE(', '$value', exp[op].$value, ', ', exp[op].$pattern, ', ', exp[op].$replacementString, ', ', exp[op].$flags, ')');

                case '$toInt':
                    return casted('int');
                case '$toDouble':
                    return casted('double precision');
                case '$toBoolean':
                    return casted('boolean');
                case '$toString':
                    return casted('varchar');
                case '$toDate':
                    return casted('date');
                case '$toTimestamp':
                    var sql = $this.printScope(function(){
                        casted('double precision');
                    });
                    return $this.print('to_timestamp', '(', sql, ')');
                case '$dateYear':
                    return simple('extract(isoyear from', ')');
                case '$dateMonth':
                    return simple('extract(month from', ')');
                case '$dateMonthDay':
                    return simple('extract(day from', ')');
                case '$dateWeekDay':
                    return simple('extract(dow from', ')');
                case '$dateYearDay':
                    return simple('extract(doy from', ')');
                case '$dateTotalSeconds':
                    return simple('extract(epoch from', ')');
                case '$timeHour':
                    return simple('extract(hour from', ')');
                case '$timeMinute':
                    return simple('extract(minute from', ')');
                case '$timeSecond':
                    return simple('extract(second from', ')');

                case '$dateIntervalOrder':
                    return exp1ValueFunction('CAST((extract(epoch from', '$value', exp[op].$value, ')/', exp[op].$seconds, ') AS int)');
            }

            // n-operators
            switch(op) {
                case '$coalesce':
                    return nFunction('COALESCE (', ',', ')');
                case '$add':
                    return nFunction('(', '+', ')', function(sqlArg, n, exp){
                        return !exp.hasOwnProperty('$const') ? 'COALESCE('+sqlArg+', 0.0)' : sqlArg;
                    });
                case '$sub':
                    return nFunction('(', '-', ')', function(sqlArg, n, exp){
                        return !exp.hasOwnProperty('$const') ? 'COALESCE('+sqlArg+', 0.0)' : sqlArg;
                    });
                case '$mod':
                    return nFunction('(', '%', ')', function(sqlArg, n, exp){
                        return !exp.hasOwnProperty('$const') ? 'COALESCE('+sqlArg+', 0.0)' : sqlArg;
                    });
                case '$mul':
                    return nFunction('(', '*', ')', function(sqlArg, n, exp){
                        return !exp.hasOwnProperty('$const') ? 'COALESCE('+sqlArg+', 0.0)' : sqlArg;
                    });
                case '$div':
                    return nFunction('(', '/', ')', function(sqlArg, n, exp){
                        //return n == 0 ? 'COALESCE('+sqlArg+', 0.0)' : sqlArg;
                        return !exp.hasOwnProperty('$const') ? 'COALESCE('+sqlArg+', 0.0)' : sqlArg;
                    });
                case '$divz':
                    $this.print('(', 'CASE WHEN');
                    $this.withPath(op, 1, function(){
                        $this.visit(exp[op][1], {asExpression: true});
                    });
                    $this.print(' = 0 THEN NULL ELSE (');
                    $this.withPath(op, 0, function(){
                        $this.visit(exp[op][0], {asExpression: true});
                    });
                    $this.print(')', '/', '(');
                    $this.withPath(op, 1, function(){
                        $this.visit(exp[op][1], {asExpression: true});
                    });
                    return $this.print(') END', ')');
                case '$sqrt':
                    return simple('SQRT(', ')');
                case '$pow2':
                    return simple('POW(', ', 2)');
                    return 'POW('+ $this._translateExpression(exp[op], dcQuery, useAlias) + ', 2)';
                case '$concat':
                    return nFunction('CONCAT(', ',', ')');
                case '$concatArray':
                    return nFunction('ARRAY[', ',', ']');
            }

             throw new Error('Unsupported select expression ' + op);
        },

        visitArray: function(array) {
            // over $base(array);
            for (var i = 0, len = array.length; i < len; i++) {
                $this.withPath(i, function(){
                    $this.visit(array[i], {asExpression: true});
                });
                if (i < len - 1) {
                    $this.print(',');
                }
            }
        },

        visitConst: function(value, type, nativeType) {
            var replaceNulls = $this.vendor == 'ClickHouse';

            var sqlValue = $this.printScope(function(){
                if (nativeType || type) {
                    var type = type ? type : DataTypes.fromAny(nativeType);
                    if (value == null && replaceNulls) {
                        switch(type) {
                            case 'null': case 'array': case 'object':
                                $this.print('NULL');
                                break;
                            case 'string':
                                $this.printValue('');
                                break;
                            case 'integer': case 'long': case 'uint': case 'ulong': case 'number':
                                $this.printValue(0);
                                break;
                            case 'boolean':
                                $this.printValue(true);
                                break;
                            case 'float': case 'double':
                                $this.printValue(0.0);
                                break;
                            case 'date': case 'time': case 'datetime': case 'timestamp':
                                $this.printValue(0);
                                break;
                            default: $this.printValue(value);
                        }
                    } else {
                        $this.printValue(value);
                    }

                } else {
                    $this.printValue(value);
                }
            });

            if (type || nativeType) {
                $this.print('CAST(', sqlValue, 'AS', nativeType||DataTypes.toVendor($this.vendor, type), ')');
            } else {
                $this.print(sqlValue);
            }
        },

        visitParam: function(name) {
            for(var i = this.queryPath.length -1; i >=0; i--){
                var par = this.queryPath[i].$params && this.queryPath[i].$params[name] && this.queryPath[i].$params[name];
                if (par.$nativeType || par.$type) {
                    $this.print('CAST(' , name, 'AS', par.$nativeType || DataTypes.toVendor($this.vendor, par.$type), ')');
                    return;
                }
            }
            $this.print(name);
        },

        visitNamedQuery: function($from) {
            $this.printOriginalContext($from, true);
            $this.print('AS');
            $this.printDeclareContext($from);
            /// skip enter views
        },

        visitUnion: function($union) {
            var fields = {};
            for (var i = 0; i < $union.length; i++) {
                var union = $union[i];
                for(var alias in union.$select) {
                    var type = $this.getOutputFieldType(alias, union);
                    var e = {
                        $field: alias
                    };
                    if (type.type) e.$type = type.type;
                    if (type.nativeType) e.$nativeType = type.nativeType;
                    if (fields[alias]) {
                        QueryUtils.throwError(!fields[alias].$type || fields[alias].$type == type.type,
                            'Conflict types for $union field "{}"', alias);
                        QueryUtils.throwError(!fields[alias].$nativeType|| !type.nativeType || fields[alias].$nativeType == type.nativeType,
                            'Conflict native types for $union field "{}"', alias);
                        fields[alias] = JSB.merge(e, fields[alias]);
                    } else {
                        fields[alias] = e;
                    }
                }
            }


            $this.print('(');
                $this.indentInc();
                for (var i = 0; i < $union.length; i++) {
                    var union = $union[i];
                    var oldSelect = union.$select;
                    /// prepare ordered fully fields
                    union.$select = {};
                    for(var field in fields) {
                        union.$select[field] = oldSelect[field] || {
                            $const: null,
                            $type: fields[field].$type,
                            $nativeType: fields[field].$nativeType,
                        };
                    }
                    /// print
                    $this.printNewLineIndent();
                    if (i > 0) $this.print('UNION ALL');
                    $this.withPath('$union', i, function(){
                        $this.visit(union, {asQuery: true});
                    });
                    union.$select = oldSelect;
                }
                $this.indentDec();
            $this.printNewLineIndent();
            $this.print(') AS');
            $this.printOriginalContext($this.getQuery().$context, true);
        },

        visitJoin: function($join) {
            $this.withPath('$join', '$left', function(){
                $this.visit($join.$left, {asQuery: true});
            });
            $this.printNewLineIndent();
            $this.print($join.$joinType.toUpperCase().replace('INNER','').trim(), 'JOIN');

            $this.withPath('$join', '$right', function(){
                $this.visit($join.$right, {asQuery: true});
            });
            $this.printNewLineIndent();
            $this.print('ON');
            $this.withPath('$join', '$filter', function(){
                $this.visit($join.$filter);
            });
        },

        visitRecursive: function($recursive) {
            var query = $this.getQuery();
            $this.print('(');
                $this.indentInc();
                $this.printNewLineIndent();
                $this.print('WITH RECURSIVE');
                $this.printOriginalContext(query.$context, true);
                $this.print('AS', '(');
                    $this.indentInc();
                    $this.printNewLineIndent();
                    $this.withPath('$recursive', '$start', function(){
                         $this.visit($recursive.$start, {asQuery: true});
                    });
                    $this.printNewLineIndent();
                    $this.print('UNION ALL');
                    $this.withPath('$recursive', '$joinedNext', function(){
                         $this.visit($recursive.$joinedNext, {asQuery: true});
                    });
                    /// 'JOIN ON ...' - look $this.visitQuery()
                    $this.indentDec();
                $this.printNewLineIndent();
                $this.print(')');
                $this.printNewLineIndent();
                $this.print('SELECT * FROM');
                $this.printOriginalContext(query.$context, true);
                $this.indentDec();
            $this.printNewLineIndent();
            $this.print(') AS');
            $this.printOriginalContext(query.$context, true);
        },

        visitProvider: function($provider) {
             var dataProvider = QueryUtils.getQueryDataProvider($provider);
             $this.printTable(dataProvider.getTableFullName());
             $this.print('AS');
             var name = $this.getProviderContext(dataProvider);
             $this.printDeclareContext(name);
        },

        visitFilter: function($filter) {
            var sqlWhere = $this.printScope(function(){
                $this.current.whereOrHaving = false;
                $base($filter);
            });
            $this.current.where = sqlWhere;

//            $this.printStart();
//            $this.current.whereOrHaving = true; // TODO $this.current.whereOrHaving
//            $base($filter);
//            var sql = $this.printEnd();
//            $this.current.having = sql;
        },

        visitCondition: function(exp) {
            // TODO $this.current.whereOrHaving
            var printed = false;
            if (exp.$not) {
                $this.withPath('$not', function(){
                    if (printed) $this.print('NOT');
                    $this.print('(');
                    $this.visit(exp.$not, {asCondition:true});
                    $this.print(')');
                });
                printed = true;
            }
            if (exp.$or) {
                if (printed) $this.print('AND');
                $this.print('(');
                $this.withPath('$or', function(){
                    for(var i = 0; i < exp.$or.length; i++) {
                        if (i > 0) $this.print('OR');
                        $this.visit(exp.$or[i], {asCondition:true});
                    }
                });
                $this.print(')');
                printed = true;
            }
            if (exp.$and) {
                if (printed) $this.print('AND');
                $this.print('(');
                $this.withPath('$and', function(){
                    for(var i = 0; i < exp.$and.length; i++) {
                        if (printed || i > 0) $this.print('AND');
                        $this.visit(exp.$and[i], {asCondition:true});
                    }
                });
                $this.print(')');
                printed = true;
            }
            /// other condition expressions
            for(var e in exp) {
                if (e === '$or' || e === '$and' || e === '$not'){
                    continue;
                } else if (e.startsWith('$')) {
                    if (printed) {
                        $this.print('AND');
                        printed = false;
                    }
                    var args = exp[e];
                    $this.withPath(e, function(){
                        var args = exp[e];
                        if (args[0]) {
                            var arg0 = $this.printScope(function(){
                                $this.visit(args[0], {asExpression:true});
                            });
                        }
                        if(args[1]) {
                            var arg1 = $this.printScope(function(){
                                $this.visit(args[1], {asExpression:true});
                            });
                        }
                        switch(e) {
                            case '$eq':
                                if(args[0] === null || args[0].$const === null) {
                                    $this.print(arg1, ' IS NULL');
                                } else if(args[1] === null || args[1].$const === null) {
                                    $this.print(arg0, ' IS NULL');
                                } else {
                                    $this.print(arg0, ' =', arg1);
                                }
                                break;
                            case '$ne':
                                if(args[0] === null || args[0].$const === null) {
                                    $this.print(arg1, 'IS NOT NULL');
                                } else if(args[1] === null || args[1].$const === null) {
                                    $this.print(arg0, ' IS NOT NULL');
                                } else {
                                    $this.print(arg0, ' !=', arg1);
                                }
                                break;
                            case '$gt':
                                $this.print(arg0, ' >', arg1);
                                break;
                            case '$gte':
                                $this.print(arg0, ' >=', arg1);
                                break;
                            case '$lt':
                                $this.print(arg0, ' <', arg1);
                                break;
                            case '$lte':
                                $this.print(arg0, ' <=', arg1);
                                break;
                           case '$like':
                               switch($this.vendor) {
                                   case 'PostgreSQL':
                                        $this.print(arg0, ' ~~', arg1);
                                        break;
                                   default:
                                       $this.print(arg0, ' LIKE', arg1);
                               }
                               break;
                           case '$ilike':
                               switch($this.vendor) {
                                   case 'PostgreSQL':
                                        $this.print(arg0, ' ~~*', arg1);
                                        break;
                                   case 'ClickHouse':
                                        $this.print('lowerUTF8(', arg0, ') LIKE', 'lowerUTF8(', arg1, ')');
                                        break;
                                   default:
                                       $this.print(arg0, ' ILIKE', arg1);
                               }
                               break;
                            case '$in':
                                $this.print(arg0, (JSB.isArray(arg1) ? ' IN' : ' = ANY'), '(', arg1, ')');
                                break;
                            case '$nin':
                                $this.print(arg0, (JSB.isArray(arg1) ? ' NOT IN' : ' != ANY'), '(', arg1, ')');
                                break;
                            default:
                                throw new JSB.Error('Unsupported condition expression ' + op);
                        }
                    });
                } else {
                    throw JSB.error('Unsupported translate `field:{$op:..}` notation');
                }
            }
        },

        visitGroupBy: function($groupBy) {
            if ($groupBy.length == 1 && $groupBy[0].$const) {
                return;
            }
            var sqlGroupBy = $this.printScope(function(){
                /// over $base($groupBy)
                for (var i = 0, len = $groupBy.length; i < len; i++) {
                    $this.withPath('$groupBy', i, function(){
                        $this.visit($groupBy[i], {asExpression:true});
                    });
                    if (i < len - 1) {
                        $this.print(',');
                    }
                }
            });
            $this.current.groupBy = sqlGroupBy;
        },

        visitSort: function($sort) {
            var sqlOrderBy = $this.printScope(function(){
                $this.current.aliasPriority = true;
                $this.current.orderBy = [];
                $base($sort);
                for(var i = 0, len = $this.current.orderBy.length; i < len; i++) {
                    $this.print($this.current.orderBy[i]);
                    if (i < len - 1) {
                        $this.print(', ');
                    }
                }
            });
            $this.current.orderBy = sqlOrderBy;
        },

        visitSortExpression: function(expr, type){
            var sqlExpr = $this.printScope(function(){
                $base(expr, type);
                $this.print(type < 0 ? ' DESC' : ' ASC');
            });
            $this.current.orderBy.push(sqlExpr);
        },

        /** print methods */

		getProviderContext: function(dataProvider) {
		    var context = dataProvider.getDescriptor().name + $this.getQuery().$context;
		    return context;
		},

		renameContext: function(context){
		    if ($this.renameContexts && context.length > 3) {
		        if($this.renameContexts[context]) {
		            context = $this.renameContexts[context];
		        } else {
		            context = $this.renameContexts[context] = '#' + (Object.keys($this.renameContexts).length+1);
		        }
		    }
		    return context;
		},

		printDeclareContext: function(context){
		    context = $this.renameContext(context);
		    /// В случае, если в цепочке вызовов используются повторные названия контекстов,
		    /// то производится переименование.
		    ///  случае цепочки вызова источников, контексты надо сохранять на уровне первого запроса
		    var printContext = context;
		    var number = $this.duplicatedContexts[context] = ($this.duplicatedContexts[context]||0) + 1;
		    var pathIndex = 0;
		    for(var i = $this.sqlStack.length - 1; i >= 0; i --) {
		        if ($this.sqlStack[i].contexts && $this.sqlStack[i].contexts[context]) {
                    if (number > 0) {
                        printContext += '#' + number;
                        pathIndex = $this.sqlStack[i].pathIndex;
                    }
		            break;
		        }
		    }

            /// если мы находится внутри подзапроса, то контекст прописывается в следующем за родительским
            var parents = this.getNestedParentQueries();
            if (parents.length > 0) {
                var parent = parents[0];
                for(var i = $this.sqlStack.length - 1; i >= 0; i --) {
                    if ($this.sqlStack[i].query  == parent) {
                        break;
                    }
                }
                if (i < $this.sqlStack.length - 1) {
                    for(i++; i < $this.sqlStack.length; i++) {
                        if ($this.sqlStack[i].query) {
                            break;
                        }
                    }
                }
                var current = this.sqlStack[i] || $this.current;
            } else {
                var current = $this.sqlStack[$this.sqlStack.length - 1] || $this.current;
            }

		    if (!current.contexts) {
		        current.contexts = {};
		    }
		    current.contexts[context] = printContext;
		    $this.printQuoted(printContext);
        },

		printOriginalContext: function(context, space){
		    context = $this.renameContext(context);
		    $this.printQuoted(context, space);
		},

		printContext: function(context, isExternal){
		    context = $this.renameContext(context);

		    var printContext = context;
		    for(var i = $this.sqlStack.length - 1; i >= 0; i --) {
		        if ($this.sqlStack[i].contexts && $this.sqlStack[i].contexts[context]) {
		            printContext = $this.sqlStack[i].contexts[context];
		            if (isExternal) {
		                isExternal = false;
		                continue;
		            }
		            break;
		        }
		    }
		    $this.printQuoted(printContext);
        },

        printDeclareField: function(field) {
            $this.printQuoted(field);
        },

        printField: function(field, isProvider, isAlias) {
            $this.printQuoted(field);
        },

        printTable: function(tableName){
            if (tableName.startsWith('"') && tableName.endsWith('"')) {
                // is quoted return as is
                $this.print(tableName);
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
                $this.print(name);
            }
        },

        printValue: function(value) {
            if (JSB.isString(value)) {
                $this.print("'" + value + "'");
            } else if (JSB.isNumber(value)) {
                $this.print('' + value);
            } else if (JSB.isBoolean(value)) {
                $this.print(('' + value).toUpperCase());
            } else if (value == null) {
                $this.print('NULL');
            } else if (JSB.isDate(value)) {
                $this.print("'" + value.toISOString() + "'");
            } else {
                throw new Error('Unsupported $const type ' + typeof value);
            }
        },

		printStart: function(s1,s2){
		    $this.sqlStack.push($this.current);
		    $this.current = {
		        sql: new StringBuilder(),
		        pathIndex : $this.path.length - 1
		    };
		    var exp = this.getCurrent();
		    if (exp.$select) {
		        $this.current.query = exp;
		    }
		    $this.print.apply(this, arguments);
		},

		printEnd: function(s1,s2){
		    $this.print.apply(this, arguments);
		    var sql = $this.current.sql;
		    $this.current = $this.sqlStack.pop();
		    return sql;
		},

		printScope: function(scope) {
		    $this.printStart();
		    scope.call($this);
		    var sql = $this.printEnd();
		    return sql;
		},

		printQuoted: function(value, space){
            if (value.indexOf('"') != -1) {
                value = value.replace(new RegExp('"', 'g'), '""');
            }
            $this.current.sql.append('"').append(value).append('"');
            if (space) {
                $this.current.sql.append(' ');
            }
		},

		print: function(s1, s2){
		    for(var i = 0, len = arguments.length; i < len; i++) {
		        var s = arguments[i];
                $this.current.sql.append(s);
                if(s == '' || s == '.' || s == '(' || s == ')' || i < len -1 && (
                           arguments[i+1] == ',' || arguments[i+1] == '.'
                        || arguments[i+1] == '(' || arguments[i+1] == '('
                        || arguments[i+1] == ',' || arguments[i+1] == ', '
                    ) || s.endsWith && s.endsWith("(")
                      || s.startsWith && s.startsWith(")")
                      || s instanceof StringBuilder
                ){
                    continue;
                }
                $this.current.sql.append(' ');
            }
        },

        printNewLineIndent: function(){
            $this.current.sql.append('\n');
            var count = $this.indentation;
            while(count-- > 0) {
                $this.current.sql.append('  ');
            }
        },

        printNewLine: function(){
            $this.current.sql.append('\n');
        },

        printIndent: function(){
            var count = $this.indentation;
            while(count-- > 0) {
                $this.current.sql.append('  ');
            }
        },

        indentInc: function(){
            $this.indentation++;
        },

        indentDec: function(){
            $this.indentation--;
        },

    }
}