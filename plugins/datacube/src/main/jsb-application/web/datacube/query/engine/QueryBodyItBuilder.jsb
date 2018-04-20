{
	$name: 'DataCube.Query.Engine.QueryBodyItBuilder',

	$server: {
		$require: [
        ],

		$constructor: function(executionContext){
		    $this.executionContext = executionContext;
		    $this.query = executionContext.query;
		    $this.__ = executionContext.__;
        },

        query: function(){
            var sourceCursor = $this.executionContext.source.cursor.clone();
            $this.it = {
                next: function(){
                    return sourceCursor.next();
                },
                close: function(){
                    sourceCursor.close();
                }
            };

            // TODO

            $this.query.$filter   && $this.filter();
//            $this.query.$select   && $this.produce();
//            $this.query.$sort     && $this.preSort();
//            $this.query.$groupBy  && $this.aggregate();
//            $this.query.$sort     && $this.postSort();
//            $this.query.$distinct && $this.distinct();
        },

        filter: function(){
            var inputNext = $this.it.next;
            $this.it.next = function(){
                var object = inputNext.call(this);
                while(object != null && !$this.__.check.call($this.executionContext, $this.query.$filter)) {
                    object = inputNext.call(this);
                }
                return object;
            };
        },

        produce: function($select){
            var inputNext = this.cursor.next;
            this.cursor.next = function(){
                var object = inputNext.call(this);
                if (object != null) {
                    var obj = {};
                    for(var outputField in $select) {
                        obj[outputField] = this.__.get.call(this, $select[outputField]);
                    }
                    object = this.cursor.object = obj;
                }
                return object;
            }
        },

        preSort: function($sort){
            var preSort = $sort; // TODO: only input fields
            return this._.sort.call(this, preSort);
        },

        sort: function($sort){
            var inputNext = this.cursor.next;
            var values = [];
            var pos = -1;
            this.cursor.next = function(){
                // TODO get all values and sort
            };
            var inputClose = this.cursor.close;
            this.cursor.close = function(){
                inputClose.call(this);
                pos = -1;
                values = [];
            };
        },

        aggregate: function($groupBy){
            var inputNext = this.cursor.next;
            var values = {};
            var pos = -1;
            this.cursor.next = function(){
                // TODO get all values aggregate and iterate
                /// aggregate with map, reduce, finalize
//                    while(inputNext.call(this)) {
//                        if(!values[map.call(this)]) {
//                            values[map.call(this)] =
//                        }
//                    }
                /// TODO return
            };
            var inputClose = this.cursor.close;
            this.cursor.close = function(){
                inputClose.call(this);
                pos = -1;
                values = [];
            };
        },

        postSort: function($sort){
            var preSort = $sort; // TODO: only not input fields
            return this._.sort.call(this, preSort);
        },

        distinct: function(exp){
            var inputNext = this.cursor.next;
            var ids = {};
            this.cursor.next = function(){
                inputNext.call(this);
                var id = this.__.id.call(this);
                while(this.cursor.object && ids[id]) {
                    inputNext.call(this);
                    id = this.__.id.call(this);
                }
                ids[id] = true;
                return this.cursor.object;
            };
            var inputClose = this.cursor.close;
            this.cursor.close = function(){
                inputClose.call(this);
                ids = {};
            };
        },
	}
}