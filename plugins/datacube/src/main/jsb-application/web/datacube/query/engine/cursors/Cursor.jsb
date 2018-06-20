{
	$name: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
        ],

		$constructor: function(executor, parent){
		    $this.Class = JSB.get($this.getJsb().$name).getClass();
		    $this.executor = executor;
		    $this.profiler = executor.profiler;
		    $this.parent = parent;
        },

        object: null,

        next: function(){
            throw new Error('Not implemented');
        },

        getFieldValue: function(e) {
            return $this.object[e.$field||e];
        },

        close: function(){
            if ($this.closed) return;
            $this.closed = true;
            $this.object = null;
            $this.destroy();
        },

        reset: function(){
            throw new Error('Not implemented');
        },

//        clone: function(){
//            throw new Error('Not implemented');
//        },

		asIterator: function(){
            return {
                next: function() {
                    return $this.next();
                },
                close: function(){
                    $this.close();
                },
            };
		},

		analyze: function(){
		    return {
		        type: $this.getJsb().$name,
		    };
		},

	}
}