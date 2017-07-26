{
	$name: 'JSB.DataCube.Query.Translators.MoSQLTranslator',
	$parent: 'JSB.DataCube.Query.Translators.Translator',

	$server: {
		$require: [
		    'JSB.DataCube.Query.Translators.TranslatorRegistry',
		    'JSB.DataCube.Providers.SqlTableDataProvider'
        ],

		$bootstrap: function(){
			TranslatorRegistry.register(this, 'JSB.DataCube.Providers.SqlTableDataProvider');
		},

		$constructor: function(providerOrProviders, cube){
		    this.providers = JSB.isArray(providerOrProviders) ? providerOrProviders : [providerOrProviders];
		    $base(this.providers[0]);
		    this.cube = cube;
		    this.queryEngine = cube.queryEngine;
		},

		translatedQueryIterator: function(dcQuery, params){
		    if (this.iterator) {
		        // close previous iterator
		        this.iterator.close();
		    }

		    // translate query and create iterator
		    var mosqlQuery = this.translateQuery(dcQuery, params);
		    Log.debug('MoSQL query: ' + JSON.stringify(mosqlQuery,0,2));
		    var store = this.provider.getStore();
		    this.iterator = store.asMoSQL().iteratedParametrizedQuery2(
		        mosqlQuery,
		        function getValue(param) {
		            return params[param];
		        },
		        function getType(param) {
		            for (var i in $this.providers) {
                        return $this.queryEngine.getParamType(param, $this.providers[i])
                                || store.config.argumentTypes[param];
                    }
		        }
		    );

		    return {
		        next: function(){
		            return $this.translateResult($this.iterator.next());
		        },
		        close:function(){
		            $this.iterator.close();
		        }
		    };
		},

		close: function() {
		    this.iterator.close();
		},

		translateResult: function(result) {
		    return result;
		},

		translateQuery: function(dcQuery, params) {
            var query = {
                type: 'select',
                table: this.provider.getTableFullName()
            };
            if (this.providers.length > 1) {
                query.joins = this.translateJoins(dcQuery, params);
            }
            // todo: add join

            if (dcQuery.$select) {
                query.columns = this._translateColumns(dcQuery);
            }
            if (dcQuery.$filter) {
                query.where = this._translateWhere(dcQuery);
            }
            if (dcQuery.$groupBy) {
                query.groupBy = this._translateGroupBy(dcQuery);
            }
            if (dcQuery.$sort) {
                query.order = this._translateSort(dcQuery);
            }
            //Log.debug('Translated MoSQL: ' + JSON.stringify(query, 0, 2));
            return query;
        },

        translateJoins: function(dcQuery, params){
            var joinedProviders = this.providers.slice(0,1);

            function translateJoin(leftProvider, joinedProviders){
                var joins = [];
                for(var p in $this.providers) if ($this.providers[p] != leftProvider) {
                    var rightProvider = $this.providers[p];
                    var join = {
                        type: 'left',
                        target: rightProvider.getTableFullName(),
                        on: {}
                    };

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
                                join.on[$this._quotedName(binding[b].field)] =
                                        '$' + leftProvider.getTableFullName() + '.' + $this._quotedName(binding[leftPosition].field) + '$';
                            }
                        }
                    }
                    if (Object.keys(join.on).length > 0) {
                        joins.push(join);
                    }
                }
                return joins;
            }

            var joins = [];
            var joinedProviders = this.providers.slice(0,1);
            for(var p in this.providers) {
                joins = joins.concat(translateJoin(this.providers[p], joinedProviders));
            }
            for(var p in this.providers) {
                if (joinedProviders.indexOf(this.providers[p]) == -1) {
                    throw new Error('Join condition is not defined');
                }
            }
            return joins;

//            var joins = [];
//            var joinedProviders = this.providers.slice(0,1);
//            for(var i=1; i < this.providers.length; i++) {
//                var provider = this.providers[i];
//                var join = {
//                    type: 'left',
//                    target: provider.getTableFullName(),
//                    on: {}
//                };
//                for(var f in this.cube.fields){
//                    var binding = this.cube.fields[f].binding;
//                    var left = null, right = null, rightPosition = binding.length;
//                    for(var b in binding) {
//                        if (binding[b].provider == provider) {
//                            right = binding[b];
//                            rightPosition = b;
//                        }
//                    }
//                    if (right) for(var b = 0; b < rightPosition; b++) {
//                        left = binding[b];
//                        join.on[this._quotedName(right.field)] =
//                            '$' + left.provider.getTableFullName() + '.' + this._quotedName(left.field) + '$';
//                        joinedProviders.push(right.provider);
//                    }
//                }
//                if (Object.keys(join.on).length == 0) {
//                    throw new Error('Join condition is not defined');
//                }
//                joins.push(join);
//            }
//            return joins;
        },

        _translateField: function(dcQuery, field, useDefaultTable) {
//            // if alias return as is
//            if (dcQuery.$select && dcQuery.$select[field]) {
//                return this._quotedName(field);
//            }
//            if (!this.cube.fields[field]) {
//                throw new Error('Cube has no field ' + field);
//            }
            // if new alias return as is
            if (!this.cube.fields[field]) {
                //return this._quotedName(field);
                return field;
            }
            var binding = this.cube.fields[field].binding;
            for (var b in binding) {
                if (this.providers.indexOf(binding[b].provider) != -1) {
//                    return this._quotedName(binding[b].field);
                    return useDefaultTable
                            ? this._quotedName(binding[b].field)
                            : binding[b].provider.getTableFullName() + '.' + this._quotedName(binding[b].field);
                }
            }
            throw new Error('Cube has no lined DataProvider for field ' + field);
        },

        _quotedName: function(name) {
            return escape(name) == name ? name : '`' + name + '`';
        },

        _translateColumns: function(dcQuery) {
            function functionExpression(func, subExp, alias, distinct) {
                return {
                    type: func,
                    expression: subExp,
                    distinct: distinct,
                    alias: alias
                };
            }

            function translateExpression(key, exp, useDefaultTable) {
                if (JSB.isString(exp)) {
                    if (key) {
                        var provs = $this._extractUsedProviders(dcQuery, exp, false, true);
                        if (provs.length == 0) throw new Error('Unknown provider for ' + JSON.stringify(exp));
                        return {
                            name: $this._translateField(dcQuery, exp),
                            table: !useDefaultTable && provs[0].getTableFullName(),
                            alias: key
                        };
                    } else {
                        return $this._translateField(dcQuery, exp, useDefaultTable);;
                    }
                }

                if (exp.$distinct) {
                    var e = translateExpression(null, exp.$distinct, useDefaultTable);
                    if (!JSB.isString(e)) {
                        throw new Error('Operator $distinct support only field value');
                    }
                    return 'DISTINCT( ' + e + ' )';
                }

                if (exp.$count && exp.$count == 1) return functionExpression('COUNT', '1', key);
                if (exp.$count)                    return functionExpression('COUNT', translateExpression(null, exp.$count), key);
                if (exp.$sum && exp.$sum == 1)     return functionExpression('SUM', '1', key);
                if (exp.$sum)                      return functionExpression('SUM', translateExpression(null, exp.$sum), key);

                if (exp.$max) return functionExpression('MAX', translateExpression(null, exp.$max), key);
                if (exp.$min) return functionExpression('MIN', translateExpression(null, exp.$min), key);
                if (exp.$avg) return functionExpression('AVG', translateExpression(null, exp.$avg), key);

                if (exp.$array)     return functionExpression('ARRAY_AGG', translateExpression(null, exp.$array), key);
                if (exp.$flatArray) return functionExpression('ARRAY_AGG', translateExpression(null, exp.$flatArray), key);

                if (exp.$splitString) {
                    return functionExpression('string_to_array', translateExpression(null, exp.$splitString.$field) + ", '" + exp.$splitString.$separator + "'", key);
                }

                // { type: 'function', function: 'min', expression: [1, "'foo'"] }

                if (exp.$gmax) return {
                    type: 'select', table: $this._extractTable(dcQuery, exp.$gmax), alias: key,
                    where: $this._subQueryTranslateWhere(dcQuery, exp.$gmax),
                    columns:[{ expression: functionExpression('MAX', translateExpression(null, exp.$gmax, true)) }]
                }
                if (exp.$gmin) return {
                    type: 'select', table: $this._extractTable(dcQuery, exp.$gmin), alias: key,
                    where: $this._subQueryTranslateWhere(dcQuery, exp.$gmin),
                    columns:[{ expression: functionExpression('MIN', translateExpression(null, exp.$gmin, true)) }]
                }
                if (exp.$gcount && exp.$gcount == 1) return {
                    type: 'select', table: $this.providers[0].getTableFullName(), alias: key,
                    where: $this._subQueryTranslateWhere(dcQuery, exp.$gcount),
                    columns:[{ expression: functionExpression('COUNT', '1') }]
                }
                if (exp.$gcount) return {
                    type: 'select', table: $this._extractTable(dcQuery, exp.$gcount), alias: key,
                    where: $this._subQueryTranslateWhere(dcQuery, exp.$gcount),
                    columns:[{ expression: functionExpression('COUNT', translateExpression(null, exp.$gcount, true), null) }]
                }
                if (exp.$gsum && exp.$gsum == 1) return {
                    type: 'select', table: $this.providers[0].getTableFullName(), alias: key,
                    where: $this._subQueryTranslateWhere(dcQuery, exp.$gsum),
                    columns:[{ expression: functionExpression('SUM', '1') }]
                }
                if (exp.$gsum) return {
                    type: 'select', table: $this._extractTable(dcQuery, exp.$gsum), alias: key,
                    where: $this._subQueryTranslateWhere(dcQuery, exp.$gsum),
                    columns:[{ expression: functionExpression('SUM', translateExpression(null, exp.$gsum, true), null) }]
                }
                if (exp.$grmaxsum) return {
                    type: 'select',  alias: key + 'Table2',
                    columns: [{
                        type: 'MAX',
                        expression: '"' + key + '"',
                        alias: key
                    }],
                    table: {
                        type: 'select', alias: key + 'Table',
                        table: $this._extractTable(dcQuery, exp.$grmaxsum),
                        where: $this._subQueryTranslateWhere(dcQuery, exp.$grmaxsum),
                        groupBy: $this._translateGroupBy(dcQuery),
                        columns:[{
                            expression: functionExpression('SUM', translateExpression(null, exp.$grmaxsum, true), null),
                            alias: key
                        }]
                    }
                }


                if (exp.$toInt) return "CAST(( " + translateExpression(null, exp.$toInt, useDefaultTable) + " ) as int)"
                if (exp.$toDouble) return "CAST(( " + translateExpression(null, exp.$toDouble, useDefaultTable) + " ) as double precision)"
                if (exp.$toBoolean) return "CAST(( " + translateExpression(null, exp.$toBoolean, useDefaultTable) + " ) as boolean)"
                if (exp.$toString) return "CAST((" + translateExpression(null, exp.$toString, useDefaultTable) + " ) as string)"

                throw new Error('Unsupported select expression');
            }
//debugger;
            var select = dcQuery.$select;
            var columns = [];
            for (var p in select) if (select.hasOwnProperty(p)) {
                var provs = this._extractUsedProviders(dcQuery, select[p], false, true);
                if (provs.length > 1) {
                    throw new Error('Multiprovider selection not supported: ' + JSON.stringify(select[p]));
                }
                if (provs.length == 0) {
                    // sum:1 - find groupBy provider
                    if (dcQuery.$groupBy && dcQuery.$groupBy[0]) {
                        var provider = this._extractUsedProviders(dcQuery, dcQuery.$groupBy[0], false, true)[0];
                        if (this.providers.indexOf(provider) != -1) {
                            columns.push(translateExpression(p, select[p]));
                        }
                    }
                    //columns.push(translateExpression(p, select[p]));
                } else if(this.providers.indexOf(provs[0]) != -1) {
                    // use only current provider fields
                    columns.push(translateExpression(p, select[p]));
                }
            }
            return columns;
        },

        _translateWhere: function(dcQuery) {
            function translateExpressions(exps) {
                if (JSB.isPlainObject(exps)) {
                    // translate by single field
                    var res = {};
                    for (var p in exps) if (exps.hasOwnProperty(p)) {
                        var exp = {};
                        exp[p] = exps[p];
                        var provs = $this._extractUsedProviders(dcQuery, exp, true, false);
                        if (provs.length > 1) {
                            throw new Error('Multiprovider condition not supported: ' + JSON.stringify(exp));
                        }
                        // use only current provider fields
                        if($this.providers.indexOf(provs[0]) != -1) {
                            JSB.merge(res, translateExpression(exp));
                        }
                    }
                    return res;
                } else if (JSB.isArray(exps)) {
                    var res = [];
                    for (var i in exps){
                        res[i] = translateExpressions(exps[i]);
                    }
                    return res;
                } else if (JSB.isString(exps)) {
                    // is parameter value
                    if (exps.match(/^\$\{.*\}/g)) {
                        return exps;
                    }
                    // or field compared with other field
                    var field = exps;
                    return '$' + $this._translateField(dcQuery, field) + '$';
                }

                throw new Error('Unsupported select expression');
            }
            function translateExpression(exp) {
                // is param
                if (JSB.isString(exp) && exp.match(/^\$/)) {
                    return exp;
                }
                var key = Object.keys(exp)[0];
                // is field
                if (!key.match(/^\$/)) {
                    var res = {};
                    var field = $this._translateField(dcQuery, key);
                    res[field] = translateExpression(exp[key]);
                    return res;
                }
                // or expression

                if (exp.$or) return { $or: translateExpressions(exp.$or) };
                if (exp.$and) return { $and: translateExpressions(exp.$and) };

                if (exp.$eq) return { $equals: translateExpressions(exp.$eq) };
                if (exp.$eq && exp.$eq == null) return { $null: true };

                if (exp.$ne) return { $ne: translateExpressions(exp.$ne) };
                if (exp.$ne && exp.$ne == null) return { $notNull: true };

                if (exp.$gt) return { $gt: translateExpressions(exp.$gt) };
                if (exp.$gte) return { $gte: translateExpressions(exp.$gte) };
                if (exp.$lt) return { $lt: translateExpressions(exp.$lt) };
                if (exp.$lte) return { $lte: translateExpressions(exp.$lte) };

                if (exp.$like) return { $like: translateExpressions(exp.$like) };
                if (exp.$ilike) return { $ilike: translateExpressions(exp.$ilike) };
                if (exp.$in) return { $in: translateExpressions(exp.$in) };
                if (exp.$nin) return { $nin: translateExpressions(exp.$nin) };

                throw new Error('Unsupported select expression');
            }

//debugger;
            // TODO оставить только часть запроса для данного провайдера
            var filter = dcQuery.$filter;
            return translateExpressions(filter, translateExpression);
        },

        _extractTable: function(dcQuery, exp) {
            var provs = $this._extractUsedProviders(dcQuery, exp, false, true);
            if (provs.length == 0) {
                throw new Error('Has no provider associated with expression ' + JSON.stringify(exp));
            }
            return provs[0].getTableFullName();
        },

        _translateGroupBy: function(dcQuery) {
//debugger;
            var groupBy = [];
            for(var i in dcQuery.$groupBy) {
                groupBy.push(this._translateField(dcQuery, dcQuery.$groupBy[i]));
            }
            return groupBy;
        },

        _translateSort: function(dcQuery) {
            var sort = [];
            for(var i in dcQuery.$sort) {
                var field = Object.keys(dcQuery.$sort[i])[0];
                var key = dcQuery.$sort[i][field] < 0 ? 'DESC' : 'ASC';
                sort.push('"' + this._translateField(dcQuery, field) + '" ' + key);
            }
            return sort;
        },

        _subQueryTranslateWhere: function(dcQuery, subExpression) {
            if (!dcQuery.$filter) return null;
            // todo only subExpression fields
            return this._translateWhere(dcQuery);
        },

        _getCubeFieldProviders: function(field) {
            // return providers of cube field or current provider for join fields
            var providers = [];
            if (!this.cube.fields[field]) {
                throw new Error('Cube has no field ' + field);
            }
            var binding = this.cube.fields[field].binding;
            for (var b in binding) {
                if (this.providers.indexOf(binding[b].provider) != -1) {
                    // TODO ????
                    return [binding[b].provider];
                }
                providers.push(binding[b].provider);
            }
            return providers;
        },

        _extractUsedProviders: function(dcQuery, exp, byKey, byValue){
            // input exp - expression with cube fields
            // result - array with providers connected with current expression
            var providers = [];
            if (JSB.isPlainObject(exp)) {
                for(var p in exp) if (exp.hasOwnProperty(p)) {
                    if (!p.match(/^\$/) && byKey) {
                        if (!this.cube.fields[p]) {
                            // may be alias or provider field
                            providers = providers.concat(
                                    this._extractUsedProviders(dcQuery, dcQuery.$select[p], false, true));
                        } else {
                            providers = providers.concat(this._getCubeFieldProviders(p));
                        }
                    } else {
                        providers = providers.concat(this._extractUsedProviders(dcQuery, exp[p], byKey, byValue));
                    }
                }
            } else if (JSB.isArray(exp)) {
                for(var i in exp) {
                    providers = providers.concat(this._extractUsedProviders(dcQuery, exp[i], byKey, byValue));
                }
            } else if (JSB.isString(exp)) {
                if (!exp.match(/^\$/) && byValue) {
                    if (!this.cube.fields[exp]) {
                        // may be provider
                        for(var pp in this.providers) {
                            if (this.providers[pp].extractFields()[exp]) {
                                return [this.providers[pp]];
                            }
                        }
                        // may be alias
                        providers = providers.concat(
                                this._extractUsedProviders(dcQuery, dcQuery.$select[exp], false, true));
                    } else {
                        providers = providers.concat(this._getCubeFieldProviders(exp));
                    }
                }
            }
            return providers;
        }
	}
}