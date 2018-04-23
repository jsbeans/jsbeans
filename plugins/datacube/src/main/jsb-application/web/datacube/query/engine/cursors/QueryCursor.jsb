{
	$name: 'DataCube.Query.Engine.Cursors.QueryCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
		    'JSB.Crypt.MD5',
		    'DataCube.Query.Engine.RuntimeFunctions',
        ],

		$constructor: function(executionContext){
		    $base(executionContext);
		    $this.query = executionContext.query;
		    $this.JSB = JSB;
		    $this.Common = RuntimeFunctions.Common;
		    $this.Aggregate = RuntimeFunctions.Aggregate;

		    // TODO: index reusable expressions

            $this._build();
        },

        _build: function(){
            $this.next = function(){
                return $this.executionContext.source.cursor.next();
            };

            $this.close = function(){
                return $this.executionContext.source.cursor.close();
            };

            $this._buildFieldsFunctions();

            $this.query.$filter   && $this._buildFilter();
            $this.query.$select   && $this._buildProduce();
//            $this.query.$sort     && $this._buildPreSort();
//            $this.query.$groupBy  && $this._buildAggregate();
//            $this.query.$sort     && $this._buildPostSort();
            $this.query.$distinct && $this._buildDistinct();
        },

        reset: function(){
            if ($this.executionContext.source) {
                $this.executionContext.source.cursor.close();
            }
            if ($this.executionContext.child) {
                for(var c in $this.executionContext.child) $this.executionContext.child[c].cursor.close();
            }

            $this._build();
        },

        clone: function(){
            return new $this.Class($this.executionContext);
        },

        _buildFilter: function(){
            var inputNext = $this.next;
            $this.next = function(){
                var object = $this.object = inputNext.call($this);
                while(object != null && !$this.Runtime.check.call($this.executionContext, $this.query.$filter)) {
                    object = $this.object = inputNext.call($this);
                }
                return object;
            };
        },

        _buildProduce: function(){
            var inputNext = $this.next;
            var ordered = null;
            var currentPos = -1;
            $this.next = function(){
                if ($this.query.$groupBy && $this.query.$groupBy.length > 0) {
                    if (!ordered) {
                        ordered = [];
                        var object = $this.cursor.object = inputNext.call($this);
                        while(object != null ) {
                            object = $this.Aggregate.map.call($this.executionContext);
                            if (!groups[object._id]) {
                                ordered.push(object);
                            }
                            object = $this.cursor.object = inputNext.call($this);
                        }
                        for(var i = 0; i < ordered.length; i++) {
                            $this.cursor.object = ordered[i];
                            object = $this.Aggregate.reduce.call($this.executionContext);
                        }
                        object = $this.Aggregate.finalize.call($this.executionContext);
                        object = $this.cursor.object = inputNext.call($this);
                    }
                    $this.cursor.object = ordered[++currentPos];
                } else {
                    $this.cursor.object = inputNext.next();
                }

                var object = {};
                for(var outputField in $this.query.$select) {
                    object[outputField] = $this.Runtime.get.call($this.executionContext, $this.query.$select[outputField]);
                }
                return object;
            };

            var inputClose = $this.close;
            this.close = function(){
                $this.ordered && $this.ordered = null;
                inputClose.close();
            };
        },

        _buildDistinct: function(exp){
            var inputNext = $this.next;
            var ids = {};
            $this.next = function(){
                do {
                    var object = $this.object = inputNext.call($this);
                    var id = $this.Runtime.id.call($this.executionContext);
                } while(object != null && ids[id]);

                ids[id] = true;
                return object;
            };

            var inputClose = $this.close;
            $this.close = function(){
                inputClose.call($this);
                ids = {};
            };
        },
	}
}