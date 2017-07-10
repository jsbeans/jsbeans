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

		$constructor: function(provider, cube){
		    $base(provider);
		    this.cube = cube;
		    this.queryEngine = cube.queryEngine;
		},

		translatedQueryIterator: function(dcQuery, params){
		    if (this.iterator) {
		        // close previous iterator
		        this.iterator.close();
		    }
//debugger;
		    // translate query and create iterator
		    var mosqlQuery = this.translateQuery(dcQuery, params);
//		    Log.debug('MoSQL query: ' + JSON.stringify(mosqlQuery));
		    var store = this.provider.getStore();
		    this.iterator = store.asMoSQL().iteratedParametrizedQuery2(
		        mosqlQuery,
		        function getValue(param) {
		            return params[param];
		        },
		        function getType(param) {
		            return $this.queryEngine.getParamType(param, $this.provider)
		                    || store.config.argumentTypes[param];
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
//debugger;
            var query = {
                type: 'select',
                table: this.provider.getTableFullName()
            };

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
            return query;
        },

        _translateField: function(dcQuery, field) {
//debugger;
            // if alias return as is
            if (dcQuery.$select && dcQuery.$select[field]) {
                return this._quotedName(field);
            }
            if (!this.cube.fields[field]) {
                throw new Error('Cube has no field ' + field);
            }
            var binding = this.cube.fields[field].binding;
            for (var b in binding) {
                if (binding[b].provider == this.provider) {
                    return this._quotedName(binding[b].field);
                }
            }
            throw new Error('Cube has no lined DataProvider for field ' + field);
        },

        _quotedName: function(name) {
            return escape(name) == name ? name : '`' + name + '`';
        },

        _translateWhere: function(dcQuery) {
            function translateExpressions(exps) {
                if (JSB.isPlainObject(exps)) {
                    // translate by single field
                    var res = {};
                    for (var p in exps) if (exps.hasOwnProperty(p)) {
                        var exp = {};
                        exp[p] = exps[p];
                        var provs = $this._extractUsedProviders(exp, true, false);
                        if (provs.length > 1) {
                            throw new Error('Multiprovider condition not supported: ' + JSON.stringify(exp));
                        }
                        // use only current provider fields
                        if(provs[0] == $this.provider) {
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

                if (exp.$ne) return { $ne: translateExpressions(exp.$eq) };
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

        _translateColumns: function(dcQuery) {
            function translateExpression(key, exp) {
                if (JSB.isString(exp)) {
                    return key ? {name: $this._translateField(dcQuery, exp), alias: key } : $this._translateField(dcQuery, exp);
                }
                if (exp.$sum && exp.$sum == 1) return { type: 'SUM', expression: '1', alias: key }
                if (exp.$sum) return { type: 'SUM', expression: translateExpression(null, exp.$sum), alias: key }

                if (exp.$max) return { type: 'MAX', expression: translateExpression(null, exp.$max), alias: key }
                if (exp.$min) return { type: 'MIN', expression: translateExpression(null, exp.$min), alias: key }
                if (exp.$avg) return { type: 'AVG', expression: translateExpression(null, exp.$avg), alias: key }

                if (exp.$array) return { type: 'ARRAY_AGG', expression: translateExpression(null, exp.$array), alias: key }
                if (exp.$flatArray) return { type: 'ARRAY_AGG', expression: translateExpression(null, exp.$flatArray), alias: key }

                // { type: 'function', function: 'min', expression: [1, "'foo'"] }

                if (exp.$toInt) return "CAST(( " + translateExpression(null, exp.$toInt) + " ) as int)"
                if (exp.$toDouble) return "CAST(( " + translateExpression(null, exp.$toDouble) + " ) as double precision)"
                if (exp.$toBoolean) return "CAST(( " + translateExpression(null, exp.$toBoolean) + " ) as boolean)"
                if (exp.$toString) return "CAST((" + translateExpression(null, exp.$toString) + " ) as string)"

                throw new Error('Unsupported select expression');
            }

            var select = dcQuery.$select;
            var columns = [];
            for (var p in select) if (select.hasOwnProperty(p)) {
                var provs = this._extractUsedProviders(select[p], false, true);
                if (provs.length > 1) {
                    throw new Error('Multiprovider selection not supported: ' + JSON.stringify(select[p]));
                }
                if (provs.length == 0) {
                    // sum:1 - find groupBy provider
                    if (dcQuery.$groupBy && dcQuery.$groupBy[0]) {
                        var provider = this._extractUsedProviders(dcQuery.$groupBy[0], false, true)[0];
                        if (provider == this.provider) {
                            columns.push(translateExpression(p, select[p]));
                        }
                    }
                    //columns.push(translateExpression(p, select[p]));
                } else if(provs[0] == this.provider) {
                    // use only current provider fields
                    columns.push(translateExpression(p, select[p]));
                }
            }
            return columns;
        },

        _translateGroupBy: function(dcQuery) {
            var groupBy = dcQuery.$groupBy;
            for(var i in groupBy) {
                groupBy[i] = this._translateField(dcQuery, groupBy[i]);
            }
            return groupBy;
        },

        _translateSort: function(dcQuery) {
            var sort = [];
            for(var i in dcQuery.$sort) {
                var field = Object.keys(dcQuery.$sort[i])[0];
                var key = dcQuery.$sort[i] < 0 ? 'DESC' : 'ASC';
                sort.push('"' + this._translateField(dcQuery, field) + '" ' + key);
            }
            return sort;
        },

        _getCubeFieldProviders: function(field) {
            // return providers of cube field or current provider for join fields
            var providers = [];
            var binding = this.cube.fields[field].binding;
            for (var b in binding) {
                if (binding[b].provider == this.provider) {
                    return [this.provider];
                }
                providers.push(binding[b].provider);
            }
            return providers;
        },

        _extractUsedProviders: function(exp, byKey, byValue){
            // input exp - expression with cube fields
            // result - array with providers connected with current expression
            var providers = [];
            if (JSB.isPlainObject(exp)) {
                for(var p in exp) if (exp.hasOwnProperty(p)) {
                    if (!p.match(/^\$/) && byKey) {
                        providers = providers.concat(this._getCubeFieldProviders(p));
                    } else {
                        providers = providers.concat(this._extractUsedProviders(exp[p], byKey, byValue));
                    }
                }
            } else if (JSB.isArray(exp)) {
                for(var i in exp) {
                    providers = providers.concat(this._extractUsedProviders(exp[i], byKey, byValue));
                }
            } else if (JSB.isString(exp)) {
                if (!exp.match(/^\$/) && byValue) {
                    providers = providers.concat(this._getCubeFieldProviders(exp));
                }
            }
            return providers;
        }
	}
}