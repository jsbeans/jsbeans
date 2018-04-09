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
                    inputNext.next();
                    var object = this.cursor.object;
                    while(object != null && !this._matched.call(this, $filter)) {
                        inputNext.next();
                        object = inputNext.object;
                    }
                    return object;
                };
            },

            produce: function($select){
                var inputNext = this.cursor.next;
                this.cursor.next = function(){
                    for(var outputField in $select) {
                        this.cursor.object[outputField] = this.__.get.call(this, $select[outputField]);
                    }
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
                var reset = this.cursor.reset;
                this.cursor.reset = function(){
                    reset.call(this);
                    pos = -1;
                    values = [];
                };
                var close = this.cursor.close;
                this.cursor.close = function(){
                    close.call(this);
                    pos = -1;
                    values = [];
                };
            },

            aggregate: function($groupBy){
                var inputNext = this.cursor.next;
                this.cursor.next = function(){
                    // TODO get all values aggregate and iterate
                    return inputNext();
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
                    var id = this.__.id();
                    while(this.cursor.object && ids[id]) {
                        inputNext.call(this);
                        id = this.__.id();
                    }
                    ids[id] = true;
                    return this.cursor.object;
                };
                var reset = this.cursor.reset;
                this.cursor.reset = function(){
                    reset.call(this);
                    ids = {};
                };
                var close = this.cursor.close;
                this.cursor.close = function(){
                    close.call(this);
                    ids = {};
                };
            },
        }

	}
}