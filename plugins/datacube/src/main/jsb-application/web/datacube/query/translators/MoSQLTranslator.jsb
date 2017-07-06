{
	$name: 'JSB.DataCube.Query.Translators.MoSQLTranslator',
	$parent: 'JSB.DataCube.Query.Translators.Translator',

	$server: {
		$require: [
		    'JSB.DataCube.Providers.SqlTableDataProvider'
        ],

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

		    // translate query and create iterator
		    var mosqlQuery = this.translateQuery(dcQuery, params);
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
            // replace only if not alias
            if (dcQuery.$select && dcQuery.$select[field]) {
                return field;
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
                        JSB.merge(res, translateExpression(exp));
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
                if (exp.$and) return { $or: translateExpressions(exp.$and) };

                if (exp.$eq) return { $equals: translateExpressions(exp.$eq) };
                if (exp.$eq && exp.$eq == null) return { $null: true };

                if (exp.$ne) return { $ne: translateExpressions(exp.$eq) };
                if (exp.$ne && exp.$ne == null) return { $notNull: true };

                if (exp.$gt) return { $ne: translateExpressions(exp.$gt) };
                if (exp.$gte) return { $ne: translateExpressions(exp.$gte) };
                if (exp.$lt) return { $ne: translateExpressions(exp.$lt) };
                if (exp.$lte) return { $ne: translateExpressions(exp.$lte) };

                if (exp.$like) return { $like: translateExpressions(exp.$like) };
                if (exp.$ilike) return { $like: translateExpressions(exp.$ilike) };
                if (exp.$in) return { $in: translateExpressions(exp.$in) };
                if (exp.$nin) return { $in: translateExpressions(exp.$nin) };

                throw new Error('Unsupported select expression');
            }

//debugger;
            var filter = dcQuery.$filter;
            return translateExpressions(filter, translateExpression);
        },

        _translateColumns: function(dcQuery) {
            function translateExpression(key, exp) {
                if (JSB.isString(exp)) {
                    return key ? {name: $this._quotedName(exp), alias: key } : $this._quotedName(exp);
                }
                if (exp.$sum && exp.$sum == 1) return { type: 'SUM', expression: '1', alias: key }
                if (exp.$sum) return { type: 'SUM', expression: translateExpression(null, exp.$sum), alias: key }

                if (exp.$max) return { type: 'MAX', expression: translateExpression(null, exp.$max), alias: key }
                if (exp.$min) return { type: 'MIN', expression: translateExpression(null, exp.$min), alias: key }
                if (exp.$avg) return { type: 'AVG', expression: translateExpression(null, exp.$avg), alias: key }

                if (exp.$array) return { type: 'ARRAY_AGG', expression: translateExpression(null, exp.$array), alias: key }
                if (exp.$flatArray) return { type: 'ARRAY_AGG', expression: translateExpression(null, exp.$flatArray), alias: key }

                throw new Error('Unsupported select expression');
            }

            var select = dcQuery.$select;
            var columns = [];
            for (var p in select) if (select.hasOwnProperty(p)) {
                columns.push(translateExpression(p, select[p]));
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
                var key = dcQuery.$sort[i] > 0 ? 'DESC' : 'ASC';
                sort.push('"' + this._translateField(dcQuery, field) + '" ' + key);
            }
            return sort;
        },
	}
}