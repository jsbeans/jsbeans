{
	$name: 'JSB.DataCube.Query.Translators.MoSQLTranslator',
	$parent: 'JSB.DataCube.Query.Translators.Translator',

	$server: {
		$require: [
		    'JSB.DataCube.Providers.SqlTableDataProvider'
        ],

		$constructor: function(provider){
		    $base(provider);
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
		            // todo get type from provider
                    return store.config.argumentTypes[param];
		        }
		    );
		},

		close: function() {
		    this.iterator.close();
		},

		translateQuery: function(dcQuery, params) {
debugger;
// TODO: add _translateField(dcQuery, field)
            var query = {
                type: 'select',
                table: this.provider.getTableCanonicalName()
            };
            if (dcQuery.$filter) {
                query.where = this._translateWhere(dcQuery.$filter);
            }
            if (dcQuery.$select) {
                query.columns = this._translateColumns(dcQuery.$select);
            }
            if (dcQuery.$groupBy) {
                query.groupBy = this._translateGroupBy(dcQuery.$groupBy);
            }
            if (dcQuery.$sort) {
                query.sort = this._translateSort(dcQuery.$sort);
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
                    return binding[b].field;
                }
            }
            throw new Error('Cube has no lined DataProvider for field ' + field);
        },

        _translateWhere: function(filter) {
            function translateExpressions(exps) {
                if (JSB.isPlainObject(exps)) {
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
                } else {
                    return exps;
                }
            }
            function translateExpression(exp) {
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

            return translateExpressions(filter, translateExpression);
        },

        _translateColumns: function(select) {
            function translateExpression(exp) {
                if (JSB.isString(exp)) {
                    return exp;
                }
                if (exp.$sum && exp.$sum == 1) return { type: 'SUM', expression: '1' }
                if (exp.$sum) return { type: 'SUM', expression: filter.$sum }

                if (exp.$max) return { type: 'MAX', expression: filter.$sum }
                if (exp.$min) return { type: 'MIN', expression: filter.$sum }
                if (exp.$avg) return { type: 'AVG', expression: filter.$sum }

                if (exp.$array) {} // TODO
                if (exp.$flatArray) {} // TODO

                throw new Error('Unsupported select expression');
            }
            var columns = {};
            for (var p in select) if (select.hasOwnProperty(p)) {
                columns[p] = translateExpression(select[p]);
            }
            return columns;
        },

        _translateGroupBy: function(groupBy) {
            return groupBy;
        },

        _translateSort: function(sort) {
            return sort;
        },
	}
}