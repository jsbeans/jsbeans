{
	$name: 'DataCube.Query.Engine.CursorFunctions',
	$singleton: true,

	$server: {
		$require: [
        ],
        _: {
            query: function(){
                var q = this.query;
                q.$filter   && this._.filter.call(this, q.$filter);
                q.$select   && this._.produce.call(this, q.$select);
                q.$sort     && this._.preSort.call(this, q.$sort);
                q.$groupBy  && this._.aggregate.call(this, q.$groupBy);
                q.$sort     && this._.postSort.call(this, q.$sort);
                q.$distinct && this._.distinct.call(this, q.$distinct);
            },

            filter: function($filter){
                var inputNext = this.cursor.next;
                this.cursor.next = function(){
                    var object = inputNext.call(this);
                    while(object != null && !this.__.check.call(this, $filter)) {
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
}