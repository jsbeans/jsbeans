{
	$name: 'DataCube.Query.Engine.Cursors.QueryCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
		    'JSB.Crypt.MD5',
        ],

		$constructor: function(query){
		    $base();
		    $this.query = query;

		    // TODO: optimize: cache values of reusable expressions

        },

        build: function(){

            /// build query source

            if ($this.query.$from) {
                if (JSB.isEqual({}, $this.query.$from)) {
                    $this.source = builder.buildEmptyCursor(this);
                } else {
                    $this.source = builder.buildQueryCursor($this.query.$from, this);
                }
            } else if ($this.query.$union){
                $this.source = builder.buildUnionCursor($this.query.$union, this);
            } else if ($this.query.$join){
                $this.source = builder.buildJoinCursor($this.query.$join, this);
            }

            /// build query body

            // init
            $this.groups = {};

            $this.next = function(){
                return $this.source.next();
            };

            $this.close = function(){
                return $this.source.close();
            };

            $this.query.$filter   && $this._buildFilter();
            $this.query.$select   && $this._buildProduce();
//            $this.query.$sort     && $this._buildPreSort();
//            $this.query.$groupBy  && $this._buildAggregate();
//            $this.query.$sort     && $this._buildPostSort();
            $this.query.$distinct && $this._buildDistinct();
        },

        reset: function(){
            if ($this.source) {
                $this.source.close();
            }
            // TODO
            if ($this.executionContext.child) {
                for(var c in $this.executionContext.child) {
                    $this.executionContext.child[c].cursor.close();
                }
            }

            $this.build();
        },

        clone: function(){
            return new $this.Class($this);
        },

        _buildFilter: function(){
            var inputNext = $this.next;
            $this.next = function(){
                var object = $this.object = inputNext.call($this);
                while(object != null && !$this.executionContext.Common.check.call($this.executionContext, $this.query.$filter)) {
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
                        $this.executionContext.Aggregate.init.call($this.executionContext);
                        ordered = [];
                        var object = $this.cursor.object = inputNext.call($this);
                        while(object != null ) {
                            object = $this.executionContext.Aggregate.map.call($this.executionContext);
                            if (!$this.groups[object._id]) {
                                ordered.push(object);
                            }
                            object = $this.cursor.object = inputNext.call($this);
                        }
                    }
                    $this.cursor.object = ordered[++currentPos];
                } else {
                    $this.cursor.object = inputNext.next();
                }

                var object = {};
                for(var outputField in $this.query.$select) {
                    object[outputField] = $this.executionContext.Common.get.call($this.executionContext, $this.query.$select[outputField]);
                }
                return object;
            };

            var inputClose = $this.close;
            $this.close = function(){
                if(ordered) ordered = null;
                inputClose.call(this);
            };
        },

        _buildDistinct: function(exp){
            var inputNext = $this.next;
            var ids = {};
            $this.next = function(){
                do {
                    var object = $this.object = inputNext.call($this);
                    var id = $this.executionContext.Runtime.id.call($this.executionContext);
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