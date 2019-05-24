/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

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
                        if (e.$select && e != query) return;
                        for (var op in e) if (e[op] != null && op !== '$$aggregates') {
                            if(this.Aggregate[op]) {
                                e.$$aggregatePath = path; /// store aggregator key path to query for finalize
                                query.$$aggregates[path] = e;
                                break;
                            }
                            walk.call(this, e[op], path + '/' + op);
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
                var id = this.Common.id.call(this);
                if (!this.state.groups[id]) {
//debugger;
                    object.$$aggregateState = {};
                    this.state.groups[id] = object;
                }
                var group = this.state.groups[id];

                for(var path in this.query.$$aggregates) {
                    var exp = this.query.$$aggregates[path];
                    var i = 0;
                    do {
                        var op = Object.keys(exp)[i++];
                    } while (op.startsWith('$$'));
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
                    var val = this.Common.get.call(this, exp);
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
                    if (state.any == null) state.any = this.Common.get.call(this, exp);
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
                    if (state.first == null) state.first = this.Common.get.call(this, exp);
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
                    var value = this.Common.get.call(this, exp);
                    if (value != null) {
                        state.last = value;
                    }
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
                    state.sum += this.Common.get.call(this, exp) || 0;
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

            $avg: {
                init: function() {
                    return {sum:0, count:0};
                },
                aggregate: function(state, exp, path){
                    var value = this.Common.get.call(this, exp);
                    state.sum += value || 0;
                    if (value != null) state.count++;
                },
                get: function(state){
                    return state.sum;
                },
            },

            $max: {
                init: function() {
                    return {max:null};
                },
                aggregate: function(state, exp, path){
                    var value = this.Common.get.call(this, exp) || 0;
                    if (value != null && (state.max == null || state.max < value)) state.max = value;
                },
                get: function(state){
                    return state.max || 0;
                },
            },

            $min: {
                init: function() {
                    return {min:null};
                },
                aggregate: function(state, exp, path){
                    var value = this.Common.get.call(this, exp) || 0;
                    if (value != null && (state.min == null || state.min > value)) state.min = value;
                },
                get: function(state){
                    return state.min || 0;
                },
            },

            $array: {
                init: function() {
                    return {array:[]};
                },
                aggregate: function(state, exp, path){
                    var value = this.Common.get.call(this, exp);
                    if (value != null) {
                        state.array.push(value);
                    }
                },
                get: function(state){
                    return state.array;
                },
            },

            $flatArray: {
                init: function() {
                    return {array:[]};
                },
                aggregate: function(state, exp, path){
                    var value = this.Common.get.call(this, exp);
                    if (value != null) {
                        if (JSB.isArray(value)) {
                            state.array = state.array.concat(value);
                        } else {
                            state.array.push(value);
                        }
                    }
                },
                get: function(state){
                    return state.array;
                },
            },
        },


        Common: {

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
                                and = and && !this.Common.check.call(this, e[op], isAccepted, path.concat([op]));
                            default:
                                // $op: [left, right] expression
                                and = and && this.Common.checkOperator.call(this, op, e[op]);
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
                    value = this.Common.check.call(this, e[i]);
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
                    return this.Common.subQueryValue.call(this, e);
                } else if (JSB.isObject(e)) {
                    var i = 0;
                    do {
                        var op = Object.keys(e)[i++];
                    } while (op.startsWith('$$'));

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

            subQueryValue: function(subQuery) {
                function createCursor(){
                    var createCursorCallback = this.nestedFactories[subQuery.$context];
                    var localParams = {};
                    var self = this;
                    var clonedQuery = JSB.clone(subQuery);
                    this.QueryUtils.walkParentForeignFields(clonedQuery, this.findRootCursor().query, function(field, context, q){
//                        var varName = 'param_' + JSB.generateUid().substring(0,5) + Object.keys(localParams).length;
//                        localParams[varName] = self.Common.get.call(self, {$field: field, $context:context});
                        return {$const: self.Common.get.call(self, {$field: field, $context:context})};
                    });
                    return this.nested[subQuery.$context] = createCursorCallback.call(this, clonedQuery, localParams);
                }

                function getValue(object){
                    return object ? object[Object.keys(subQuery.$select)[0]] : null;
                }

                function getOrCachedValue(state) {
                    if (!state.subQueriesValues) state.subQueriesValues = {};
                    if (state.subQueriesValues.hasOwnProperty(subQuery.$context)) {
                        return state.subQueriesValues[subQuery.$context];
                    } else {
                        var subQueryCursor = createCursor.call(this);
                        subQueryCursor.reset();
                        var object = subQueryCursor.next();
                        var nextObject = subQueryCursor.next()
                        if (nextObject == null || object == null) {
                            var value = getValue(object);
                        } else {
                            var value = [object, nextObject];
                            do {
                                var object = subQueryCursor.next();
                                if (object != null) {
                                    value.push(getValue(object));
                                }
                            } while(object != null);
                        }
                        state.subQueriesValues[subQuery.$context] = value;
                        return value;
                    }
                }


                if (this.globalSubQueries[subQuery.$context]){
                    return getOrCachedValue.call(this, this.state);
                }

                return getOrCachedValue.call(this, this.stepState);
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