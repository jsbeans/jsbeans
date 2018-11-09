{
	$name: 'DataCube.Query.Engine.Cursors.JoinCursor',
	$parent: 'DataCube.Query.Engine.Cursors.InterpretedCursor',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
            'JSB.Crypt.MD5',
        ],

		$constructor: function(executor, query, params, parent, caller){
		    $base(executor, query, params, parent, caller);
		    $this.type = query.$join.$joinType || 'left outer';
		    $this.types = $this.type.split(' ');
		    $this.filter = query.$join.$filter;

		    QueryUtils.throwError($this.types[0] === 'left', 'Unsupported join type {} in {}', $this.type, query.$context);
		    QueryUtils.throwError($this.types[1] === 'outer' || $this.types[1] === 'inner', 'Unsupported join type {} in {}', $this.type, query.$context);
        },

        count: {left:0,right:0,result:0},
        type:null,
        types: null,
        filter: null,
        left: null,
        right: null,
        createRight: null,
        leftObject: null,

        setLeft: function(cursor){
            $this.left = cursor;
        },

        setRight: function(cursor){
            if ($this.right) {
                $this.right.destroy();
            }
            $this.right = cursor;
            $this.rightContext = cursor.context;
        },

        setCreateRight: function(createRight){
            $this.createRight = function(){
                var right = createRight.apply(null, arguments);
                $this.setRight(right);
                return right;
            };
        },

        getNested: function(){
            var nested = {};
            nested['left'] = $this.left;
            nested['right'] = $this.right;
            return nested;
        },

        destroy: function(){
            if ($this.closed) return;
            $this.left = null;
            $this.right = null;
            $base();
        },

		analyze: function(){
		    var json = $base();
            json.type = $this.type;
		    json.filter = $this.filter;
		    json.left  = $this.left  && $this.left.analyze();
		    json.right = $this.right && $this.right.analyze();
		    return json;
		},

		_patchFilter: function(filter, callback) {
		    function walk(e){
                if (JSB.isObject(e)) {
                    for (var f in e) if (typeof e[f] !== 'undefined') {
                        if (e[f].$field || typeof e[f] === 'string' && !e[f].startsWith('$')) {
                            e[f] = callback(e[f]);
                        } else {
                            walk(e[f]);
                        }
                    }
                } else if (JSB.isArray(e)) {
                    for (var i = 0; i < e.length; i++) {
                        if (e[i].$field || typeof e[i] === 'string' && !e[i].startsWith('$')) {
                            e[i] = callback(e[i]);
                        } else {
                            walk(e[i]);
                        }
                    }
                }
		    }
		    walk(filter);
		    return filter;
		},

        next: function(){
debugger;
            function createRight(){
                var params = {};
                var guid = JSB.generateUid().substring(0, 5);
                var filter = $this._patchFilter(JSB.clone($this.filter), function(field) {
                    if ($this.rightContext == field.$context) {
                        return field.$field;
                    } else if ($this.left.context == field.$context) {
                        var name = "joinParam_" + guid + idx++;
                        params[name] = $this.Common.get.call($this.left, field.$field);
                        return '${' + name + '}';
                    } else {
                        var name = "joinParam_" + guid + idx++;
                        params[name] = $this.Common.get.call($this.left, field);
                        return '${' + name + '}';
                    }
                    return field;
                });
                $this.isRightFirstObject = true;
                $this.right = $this.createRight(filter, params);

                $this.tracer && $this.tracer.profile('New right cursor', params);
            }

            _NEXT: while(true) {

                /// next left or complete
                if (!$this.leftObject) {
                    $this.leftObject = $this.left.next();
                    $this.tracer && $this.tracer.profile('Next left object ['+ $this.count.left++ +']', $this.leftObject);

                    $this.right && $this.right.destroy();
                    $this.right = null;
                    if ($this.leftObject == null) {
                        return null;
                    }
                }

                if (!$this.right) {
                    createRight();
                } else {
                    $this.isRightFirstObject = false;
                }

                /// next right
                var rightObject = $this.right.next();
                $this.tracer && $this.tracer.profile('Next right object ['+ $this.count.right++ +']', rightObject);

                if (rightObject == null) {
                    // clear right
                    $this.right.destroy();
                    $this.right = null;
                    if ($this.types[1] === 'outer' && $this.isRightFirstObject) {
                        /// only left
                        var rightObject = $this.leftObject;
                        $this.leftObject = null
                        return rightObject;
                    } else {
                        /// next left
                        $this.leftObject = null;
                        continue _NEXT; // return next();
                    }
                } else {
                    $this.object = $this._merge(rightObject);
                    $this.tracer && $this.tracer.profile('Return object ['+ $this.count.result++ +']', $this.object);
                    return $this.object;
                }
            }
        },

        getFieldValue: function(e) {
debugger;
            // if external field find parent context
            if (e.$context && e.$context != $this.context) {
                $this.QueryUtils.throwError($this.parent, 'External field is not defined: {}', JSON.stringify(e));
                return $this.Common.get.call($this.parent, e);
            }
            // output or input value
            var value = $this.object[e.$field];
            if (typeof value === 'undefined') {
                value = $this.source.object[e.$field];
            }
            $this.QueryUtils.throwError(typeof value !== 'undefined', 'Field is not defined: {}', JSON.stringify(e));
            return value;
        },

        _merge: function(rightObject){
            function getValue(field) {
                if($this.left.query.$context == field.$context) {
                    return $this.leftObject[field.$field];
                } else if ($this.right.query.$context == field.$context) {
                    return rightObject[field.$field];
                }
debugger
                QueryUtils.throwError(false, 'Unknown field "{}" in join context: {}', field.$field, $this.query.$context);
            }

            var object = {};
            for(var alias in $this.query.$select) {
                var field = $this.query.$select[alias];
                object[alias] = getValue(field);
            }
            return object;
        },

	}
}