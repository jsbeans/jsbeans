{
	$name: 'DataCube.Query.Engine.RuntimeFunctions',
	$singleton: true,

	$server: {
		$require: [
        ],

        Aggregate: {
            map: function(){
                function walk(e) {
                    if(this.Aggregate[op]) {
                        this.Aggregate[op].map();
                    }
                }
                walk.
            },

            reduce: function(){
            },



            $sum: {
                map: function(){},
                reduce: function(){},
            },
        },

        Common: {

            /** *** Filter functions *** */

            check: function(e) {
                this.QueryUtils.throwError(this.JSB.isObject(e), 'Filter is not Object: {}', JSB.stringify(e));
                var and = true;
                for (var op in e) {
                    if (op.startsWith('$')) {
                        switch(op) {
                            case '$or':
                            case '$and':
                                and = and && this.Common.checkAndOr.call(this, op, e[op]);
                            case '$not':
                                and = and && !this.Common.check.call(this, exps, isAccepted, path.concat([op]));
                            default:
                                // $op: [left, right] expression
                                and = and && this.Common.checkOperator.call(this, op, exps[op]);
                        }
                    } else {
                        var leftField = op;
                        op = Object.keys(e[op])[0];
                        and = and && this.Common.checkOperator.call(this, op, [{$field:leftField}, e[leftField][op]]);
                    }
                }
                return and;
            },

            checkAndOr: function (op, e){
                this.QueryUtils.throwError(JSB.isArray(e), 'Unexpected operator type: {} is not array', op);
                for(var i = 0; i < e.length; i++) {
                    value = this.Common.match.call(this, e[i]);
                    if (op === '$and' && !value) return false;
                    if (op === '$or' && value) return true;
                }
                return true;
            },

            checkOperator: function (op, operands){
                if (op === '$eq') {
                    return this.Common.get.call(this, operands[0]) == this.Common.get.call(this, operands[1]);
                }
                if (op === '$ne') {
                    return this.Common.get.call(this, operands[0]) != this.Common.get.call(this, operands[1]);
                }
                if (op === '$lt') {
                    return this.Common.get.call(this, operands[0]) < this.Common.get.call(this, operands[1]);
                }
                // TODO ...
                this.QueryUtils.throwError(false, 'TODO operator {}', op);
            },



            /** *** Value functions */

            get: function (e){
                if (typeof e.$const !== 'undefined') {
                    return e.$const;
                }
                if (e.$field || typeof e === 'string' && !s.startsWith('$')) {
                    // if external field find parent context
                    if (e.$context && e.$context != this.context) {
                        this.QueryUtils.throwError(!!parent, 'External field is not defined: {}', e.$field||e);
                        return this.Common.get.call(parent, e);
                    }
                    // output or input value
                    var value = this.cursor.object[e.$field||e];
                    if (typeof value === 'undefined') {
                        value = this.sourceCursor.object[e.$field||e];
                    }
                    this.QueryUtils.throwError(typeof value !== 'undefined', 'Field is not defined: {}', e.$field||e);
                    return value;
                } if (typeof e === 'string') {
                    return $this.params[e.substring(1)];
                } else if (e.$select) {
                    return this.Common.subQueryCursor.call(this, e);
                } else if (this.Operators[Object.keys(outputField)[0]]){
                    var opFunction = this.Operators['_'+Object.keys(outputField)[0]];
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


            // TODO ...
        },

        Operators: {
            /** *** Cast function */

            $toInt: function(e){
                var value = get(e[0]);
                return this.JSB.isInteger(value) ? value : parseInt(''+value);
            },

            $toDouble: function(e){
                var value = get(e[0]);
                return this.JSB.isFloat(value) ? value : parseFloat(''+value);
            },

            $toBoolean: function(e){
                var value = get(e[0]);
                return this.JSB.isFloat(value) ? value : parseBoolean(''+value);
            },

            $toString: function(e){
                var value = get(e[0]);
                return this.JSB.isString(value) ? value : value;
            },

            $toTimestamp: function(e){
                this.QueryUtils.trowError(false, 'TODO $toTimestamp');
            },


            /** *** Math function */

            $add: function(e){
                return get(e[0]) + get(e[1]);
            },

            $sub: function(e){
                return get(e[0]) - get(e[1]);
            },

            $mul: function(e){
                return get(e[0]) * get(e[1]);
            },

            $div: function(e){
                return get(e[0]) / get(e[1]);
            },

            $divz: function(e){
                return get(e[0]) / get(e[1]);
            },

            $mod: function(e){
                this.QueryUtils.trowError(false, 'TODO $mod');
            },
        },

	}
}