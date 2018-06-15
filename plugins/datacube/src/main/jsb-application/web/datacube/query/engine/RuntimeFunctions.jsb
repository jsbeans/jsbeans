{
	$name: 'DataCube.Query.Engine.RuntimeFunctions',
	$singleton: true,

	$server: {
		$require: [
        ],

        Aggregate: {
            init: function(){
                var query = this.query;
                query.$$aggregates = {};

                (function walk(e, path) {
                    if (this.JSB.isObject(e)) {
                        for (var op in e) if (e[op] != null) {
                            if(this.Aggregate[op]) {
                                e.$$aggregatePath = path; /// store aggregator key path to query for finalize
                                query.$$aggregates[path] = e;
                                break;
                            }
                            walk.call(this, e[i], path + '/' + op);
                        }
                    } else if (this.JSB.isArray(e)) {
                        for (var i = 0; i < e.length; i++) {
                            walk.call(this, e[i], path + '/' + i);
                        }
                    }
                }).call(this, this.query, '');

                this.state.groups = {};
            },

            map: function(object){
                var id = this.Common.id();
                if (!this.state.groups[id]) {
                    object.$$aggregateState = {};
                    this.state.groups[id] = object;
                }
                var group = this.state.groups[id];

                for(var path in this.query.$$aggregates) {
                    var exp = this.query.$$aggregates[path];
                    var i = 0;
                    do {
                        var op = Object.keys(exp)[i++];
                    } while (!op.startsWith('$$'));
                    var state = group.$$aggregateState[path] || (group.$$aggregateState[path] = this.Aggregate[op].init.call(this));
                    var newState = this.Aggregate[op].aggregate.call(this, state, exp[op]);
                    if (newState) group.$$aggregateState[path] = newState;
                }
                return group;
            },


            /** Aggregate functions:
            *   * aggregate : (inputState, expr) -> nextState
            *   * finalize : (finalState) -> aggregated
            */


            $distinct: {
                init: function() {
                    return {objects: {}, last:null};
                },
                aggregate: function(state, exp, path){
                    var val = this.Common.get(exp);
                    if (val != null) {
                        var id = this.MD5(this.JSB.stringify(val));
                        if(!state.objects[id]) {
                            state.objects[id] = true;
                        } else {
                            val = null;
                        }
                    }
                    state.last = val;
                },
                get: function(state){
                    var val = state.last;
                    state.last = null;
                    return val;
                },
            },

            $any: {
                init: function() {
                    return {any:null};
                },
                aggregate: function(state, exp, path){
                    if (state.any == null) state.any = this.Common.get(exp);
                },
                get: function(state){
                    return state.any;
                },
            },

            $first: {
                init: function() {
                    return {first:null};
                },
                aggregate: function(state, exp, path){
                    if (state.first == null) state.first = this.Common.get(exp);
                },
                get: function(state){
                    return state.first;
                },
            },

            $last: {
                init: function() {
                    return {last:null};
                },
                aggregate: function(state, exp, path){
                    state.last = this.Common.get(exp);
                },
                get: function(state){
                    return state.last;
                },
            },

            $sum: {
                init: function() {
                    return {sum:0};
                },
                aggregate: function(state, exp, path){
                    state.sum += this.Common.get(exp) || 0;
                },
                get: function(state){
                    return state.sum;
                },
            },

            $count: {
                init: function() {
                    return {count:0};
                },
                aggregate: function(state, exp, path){
                    if (this.Common.get(exp) != null) state.count += 1;
                },
                get: function(state){
                    return state.count;
                },
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
                if (e.$field) {
                    return this.getFieldValue(e);
                } else if(typeof e === 'string' && !e.startsWith('$')) {
                    return this.getFieldValue({$field: e});
                } else if (typeof e === 'string') {
                    return this.params[e.substring(1)];
                } else if (e.$select) {
                    return this.Common.subQueryCursor.call(this, e);
                } else if (this.isObject(e)) {
                    var i = 0;
                    do {
                        var op = Object.keys(outputField)[i++];
                    } while (!op.startsWith('$$'));

                    if (this.Operators[op]){
                        return this.Operators[op].call(this);
                    } else if (this.Aggregate[op]) {
                        var path = e.$$aggregatePath;
                        var state = this.object.$$aggregateState[path];
                        return this.Aggregate[op].get.call(this, state);
                    }
                } else {
                    this.QueryUtils.throwError(false, 'Unexpected expression {}', JSON.stringify(e));
                }
            },

            subQueryCursor: function(subQuery) {
                var subQueryCursor = this.child[e.$select.$context].cursor;
                subQueryCursor.reset();
                return  subQueryCursor;
            },

            id: function(){
                if (!this.object._id) {
                    if (!this.query.$groupBy || this.query.$groupBy.length === 0) {
                        this.object._id = this.MD5.md5(JSON.stringify(this.object));
                    } else {
                        var obj = {};
                        for (var i = 0; i < this.query.$groupBy.length; i++) {
                            var e = this.query.$groupBy[i];
                            obj[i] = this.Common.get.call(this, e);
                        }
                        this.object._id = this.MD5.md5(JSON.stringify(obj));
                    }
                }
                return this.object._id;
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