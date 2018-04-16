{
	$name: 'DataCube.Query.Engine.RuntimeFunctions',
	$singleton: true,

	$server: {
		$require: [
        ],
        __: {

            /** *** Filter functions *** */

            check: function(e) {
                this.QueryUtils.throwError(JSB.isObject(e), 'Filter is not Object: {}', JSB.stringify(e));
                var and = true;
                for (var op in e) {
                    if (op.startsWith('$')) {
                        switch(op) {
                            case '$or':
                            case '$and':
                                and = and && this.__.checkAndOr.call(this, op, e[op]);
                            case '$not':
                                and = and && !this.__.check.call(this, exps, isAccepted, path.concat([op]));
                            default:
                                // $op: [left, right] expression
                                and = and && this.__.checkOperator.call(this, (op, exps[op]);
                        }
                    } else {
                        var leftField = op;
                        op = Object.keys(e[op])[0];
                        and = and && this.__.checkOperator.call(this, op, [{$field:leftField}, e[leftField][op]);
                    }
                }
                return and;
            },

            checkAndOr: function (op, e){
                this.QueryUtils.throwError(JSB.isArray(e), 'Unexpected operator type: {} is not array', op);
                for(var i = 0; i < e.length; i++) {
                    value = this.__.match.call(this, e[i]);
                    if (op === '$and' && !value) return false;
                    if (op === '$or' && value) return true;
                }
                return true;
            }

            checkOperator: function (op, operands){
                if (op === '$eq') {
                    return this.__.get.call(this, operands[0]) == this.__.get.call(this, operands[1]);
                }
                if (op === '$ne') {
                    return this.__.get.call(this, operands[0]) != this.__.get.call(this, operands[1]);
                }
                if (op === '$lt') {
                    return this.__.get.call(this, operands[0]) < this.__.get.call(this, operands[1]);
                }
                // TODO ...
                this.QueryUtils.throwError(false, 'TODO operator {}', op);
            },



            /** *** Value functions */

            get: function (e){
                if (typeof e.$const !== 'undefined') {
                    return e.$const;
                }
                if (e.$field || typeof e === 'string')) {
                    // if external field find parent context
                    if (e.$context && e.$context != this.context) {
                        this.QueryUtils.throwError(!!parent, 'External field is not defined: {}', e.$field||e);
                        return this.__.get.call(parent, e);
                    }
                    // output or input value
                    var value = this.cursor.object[e.$field||e];
                    if (typeof value === 'undefined') {
                        value = this.sourceCursor.object[e.$field||e];
                    }
                    this.QueryUtils.throwError(typeof value !== 'undefined', 'Field is not defined: {}', e.$field||e);
                    return value;
                } else if (e.$select) {
                    return this.__.subQueryCursor.call(this, e);
                } else if (this.__[Object.keys(outputField)[0]]){
                    var opFunction = this.__['_'+Object.keys(outputField)[0]];
                    return opFunction.call(this);
                }
            },

            subQueryCursor: function(subQuery) {
                var subQueryCursor = this.child[e.$select.$context].cursor;
                subQueryCursor.reset();
                return  subQueryCursor;
            },

            id: function(){
                return this.cursor.object._id || (this.cursor.object._id = this.MD5.md5(JSON.stringify(this.cursor.object)));
            },

            /** *** Aggregate function *** */

            // TODO ...

            /** *** Cast function */

            _$toInt: function(e){
                var value = get(e[0]);
                return this.JSB.isInteger(value) ? value : parseInt(''+value);
            };

            _$toDouble: function(e){
                var value = get(e[0]);
                return this.JSB.isFloat(value) ? value : parseFloat(''+value);
            };

            _$toBoolean: function(e){
                var value = get(e[0]);
                return this.JSB.isFloat(value) ? value : parseBoolean(''+value);
            };

            _$toString: function(e){
                var value = get(e[0]);
                return this.JSB.isString(value) ? value : value;
            };

            _$toTimestamp: function(e){
                this.QueryUtils.trowError(false, 'TODO $toTimestamp');
            };


            /** *** Math function */

            _$add: function(e){
                return get(e[0]) + get(e[1]);
            };

            _$sub: function(e){
                return get(e[0]) - get(e[1]);
            };

            _$mul: function(e){
                return get(e[0]) * get(e[1]);
            };

            _$div: function(e){
                return get(e[0]) / get(e[1]);
            };

            _$divz: function(e){
                return get(e[0]) / get(e[1]);
            };

            _$mod: function(e){
                this.QueryUtils.trowError(false, 'TODO $mod');
            };




            // TODO ...
        }

	}
}