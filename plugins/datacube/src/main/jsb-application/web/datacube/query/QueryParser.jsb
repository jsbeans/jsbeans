{
	$name: 'DataCube.Query.QueryParser',

	$server: {
		$require: [],

		$constructor: function(query, params){
		    this.query = query;
		    this.params = params;
/*
            this.installSuper = function (obj, super) {
                if (!Object.setPrototypeOf) {
                    obj.__proto__ = super;
                } else {
                    Object.setPrototypeOf(obj, super);
                }

                return super;
            };
*/
            /**
            * Query descriptor classes
            */
/*		    
            this.Expression = function Expression(data){
                this.getConstructor = function(){ return $this.Expression; }

                this.getData = function(){
                    return data;
                }

                this.getChildren = function(){
                    // undefined - leaf
                }

                this.toString = function(innerArgs){
                    var innerArgs = !!innerArgs  ? ', ' + innerArgs : '';
                    var children = '';
                    var all = this.getChildren();
                    for (var i in all) {
                        children += all[i].toString();
                        if (i < all.length - 1) {
                            children += ', ';
                        }
                    }
                    var data = JSON.stringify(this.getData());
                    return this.getConstructor().name + '( ' + data + innerArgs + ', [' + children + ']' + ' )';
                }
            };
*/
/*		    
            this.MultiExpression = function MultiExpression(data, expressions) {
                var super = $this.installSuper(this, new $this.Expression(data));
                this.getConstructor = function(){ return $this.MultiExpression; }

                this.getExpressions = function(){
                    return expressions;
                }

                this.getExpression = function(name){
                    for(var i in expressions) {
                        if (Object.keys(expressions[i])[0] == name) {
                            return expressions[i];
                        }
                    }
                }

                this.getChildren = function(){
                    return this.getExpressions();
                }

                this.toString = function(innerArgs){
                    return super.toString.call(this, innerArgs);
                }
            };

            this.ObjectExpression = function ObjectExpression(data, keyExpression, valueExpression){
                var super = $this.installSuper(this, new $this.Expression(data));
                this.getConstructor = function(){ return $this.ObjectExpression; }

                this.getKeyExpression = function(){
                    return keyExpression;
                }

                this.getValueExpression = function(){
                    return valueExpression;
                }

                this.getChildren = function(){
                    return [this.getValueExpression()];
                }

                this.toString = function(innerArgs){
                    var innerArgs = !!innerArgs  ? ', ' + innerArgs : '';
                    var key = this.getKeyExpression().toString();
                    return super.toString.call(this, key + innerArgs);
                }
            };

            this.ArrayExpression = function ArrayExpression(data, valueExpressions){
                var super = $this.installSuper(this, new $this.Expression(data));
                this.getConstructor = function(){ return $this.ArrayExpression; }

                this.getValueExpressions = function(){
                    return valueExpressions
                }

                this.getChildren = function(){
                    return this.getValueExpressions();
                }

                this.toString = function(innerArgs){
                    return super.toString.call(this, innerArgs);
                }
            };

            this.Operator = function Operator(data, name){
                var super = $this.installSuper(this, new $this.Expression(data));
                this.getConstructor = function(){ return $this.Operator; }

                this.getName = function(){
                    return name;
                }

                this.toString = function(innerArgs){
                    var innerArgs = !!innerArgs  ? ', ' + innerArgs : '';
                    return super.toString.call(this, this.getName() + innerArgs);
                }
            };

            this.ParameterValue = function ParameterValue(data, fullName){
                var super = $this.installSuper(this, new $this.Expression(data));
                this.getConstructor = function(){ return $this.ParameterValue; }

                this.getFullName = function(){
                    return fullName;
                }

                this.toString = function(innerArgs){
                    var innerArgs = !!innerArgs  ? ', ' + innerArgs : '';
                    return super.toString.call(this, this.getFullName() + innerArgs);
                }
            };

            this.ConstValue = function ConstValue(data, value){
                var super = $this.installSuper(this, new $this.Expression(data));
                this.getConstructor = function(){ return $this.ConstValue; }

                this.getValue = function(){
                    return value;
                }

                this.toString = function(innerArgs){
                    var innerArgs = !!innerArgs  ? ', ' + innerArgs : '';
                    return super.toString.call(this, this.getValue() + innerArgs);
                }
            };

            this.FunctionValue = function FunctionValue(data, func){
                var super = $this.installSuper(this, new $this.Expression(data));
                this.getConstructor = function(){ return $this.FunctionValue; }

                this.getFunction = function(){
                    return func;
                }

                this.toString = function(innerArgs){
                    var innerArgs = !!innerArgs  ? ', ' + innerArgs : '';
                    return super.toString.call(this, 'function' + innerArgs);
                }
            };

            this.Field = function Field(data, name){
                var super = $this.installSuper(this, new $this.Expression(data));
                this.getConstructor = function(){ return $this.Field; }

                this.getName = function(){
                    return name;
                }

                this.toString = function(innerArgs){
                    var innerArgs = !!innerArgs  ? ', ' + innerArgs : '';
                    return super.toString.call(this, this.getName() + innerArgs);
                }
            };

            this.AliasField = function AliasField(data, name){
                var super = $this.installSuper(this, new $this.Field(data, name));
                this.getConstructor = function(){ return $this.AliasField; }

                this.toString = function(innerArgs){
                    return super.toString.call(this, innerArgs);
                }

            };*/
		},


        /**
        * Parse query json to object representation
        */
        parseQuery: function () {
            return new this.MultiExpression(
                {
                    name: '$query',
                    originalQuery: this.query,
                    originalParams: this.params
                },
                this.parseExpressions(
                    this.query,
                    function keyCallback(key, value) {
                        if (key.startsWith('$')) {
                            return new $this.Operator({}, key);
                        }
                        throw new Error('Expected operator not ' + key);
                    },
                    function valueCallback(value, key){
                        switch(key){
                            case '$filter':
                                return $this.parseFilterExpression(value);
                                break;
                            case '$groupBy':
                                return $this.parseGroupByExpression(value);
                                break;
                            case '$select':
                                return $this.parseSelectExpression(value);
                                break;
                            case '$sort':
                                return $this.parseSortExpression(value);
                                break;
                            case '$finalize':
                                return $this.parseFinalizeExpression(value);
                                break;
                            default:
                                throw new Error('Unsupported query operator ' + key);
                        }
                    }
                )
            );
        },

        parseExpressions: function(exps, keyCallback, valueCallback){
            var expressions = [];
            for (var a in exps) if (exps.hasOwnProperty(a)){
                expressions.push(new this.ObjectExpression(
                    {},
                    keyCallback(a, exps[a]),
                    valueCallback(exps[a], a)
                ));
            }

            return expressions;
        },

        parseSelectExpression: function (select) {
            // format - { alias: select value}
            return new this.MultiExpression(
                {name:'$select'},
                this.parseExpressions(
                    select,
                    function keyCallback(key, value) {
                        if (key.startsWith('$')) {
                            throw new Error('Expected alias not operator ' + key);
                        }
                        return new $this.AliasField({}, key);
                    },
                    function valueCallback(value, key){
                        return $this.parseValueExpression(value);
                    }
                )
            );
        },

        parseValueExpression: function (exp){
        	if (JSB.isString(exp)) {
        	    if (exp.startsWith('${') && exp.endsWith('}')) {
        	        return new this.ParameterValue({}, exp)
        	    }
        		return new this.Field({}, exp); // TODO detect field type
        	}

        	if(JSB.isNumber(exp)) {
        	    if (exp != 1 && exp != -1) {
        	        throw new Error('Unsupported const value');
        	    }
        	    return new this.ConstValue({}, exp);
        	}

        	if (!JSB.isPlainObject(exp)) {
        		throw new Error('Expression is not object');
        	}
        	var op = Object.keys(exp)[0];
        	if (op.indexOf('$') != 0) {
        		throw new Error('Expected operator not ' + op);
        	}

        	return new this.ObjectExpression(
        	    {},
        		new this.Operator({}, op),
        		this.parseValueExpression(exp[op]));
        },

        parseFilterExpression: function(filter){
            // format - { alias: condition value}, { $and/$or: condition values}
            return new this.MultiExpression(
                {name:'$filter'},
                this.parseExpressions(
                    filter,
                    function keyCallback(key, value) {
                        if (key == '$and' || key == '$or') {
                            if (JSB.isArray(value)) {
                                throw new Error('Expected array value for ' + key);
                            }
                            return new $this.Operator({}, key);
                        }
                        if (key.startsWith('$')) {
                            throw new Error('Expected alias not operator ' + key);
                        }
                        return new $this.Field({}, key); // TODO detect field type
                    },
                    function valueCallback(value, key){
                        if (JSB.isArray(value)) {
                            return new $this.ArrayExpression({}, (function(){
                                var expressions = [];
                                for(var i in value) {
                                   var exp = value[i];
                                   expressions.push($this.parseValueExpression(exp));
                                }
                                return expressions;
                            })());
                        }
                        return $this.parseValueExpression(value);
                    }
                )
            );
        },

        parseGroupByExpression: function(groupBy){
            return new this.ArrayExpression({name:'$groupBy'}, (function(){
                var expressions = [];
                for(var i in groupBy) {
                   var exp = groupBy[i];
                   expressions.push($this.parseValueExpression(exp));
                }
                return expressions;
            })());
        },

        parseSortExpression: function(sort){
            return new this.ArrayExpression({name:'$sort'}, (function(){
                var expressions = [];
                for(var i in sort) {
                   var exp = sort[i];
                   var field = Object.keys(exp)[0];
                   expressions.push(new $this.ObjectExpression(
                        {},
                        new $this.Field({}, field), // TODO detect field type
                        new $this.ConstValue({}, exp[field])
                   ));
                }
                return expressions;
            })());
        },

        parseFinalizeExpression: function(finalize){
            if (JSB.isFunction(finalize)) {
                return new this.FunctionValue({}, finalize);
            }
            // format - { alias: translate value}
            return new this.MultiExpression(
                {name:'$finalize'},
                this.parseExpressions(
                    finalize,
                    function keyCallback(key, value) {
                        if (key.startsWith('$')) {
                            throw new Error('Expected alias not operator ' + key);
                        }
                        return new $this.AliasField({}, key);
                    },
                    function valueCallback(value, key){
                        return $this.parseValueExpression(value);
                    }
                )
            );
        },

	}
}