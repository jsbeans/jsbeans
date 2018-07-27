{
	$name: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
        ],

		$constructor: function(executor, parent, caller){
		    $this.Class = JSB.get($this.getJsb().$name).getClass();
		    $this.executor = executor;
		    $this.tracer = executor.tracer;
		    $this.parent = parent;
		    $this.caller = caller;
        },

        object: null,

        next: function(){
            throw new Error('Not implemented');
        },

        close: function(){
            $this.destroy();
        },

        getFieldValue: function(e) {
            return $this.object[e.$field||e];
        },

        destroy: function(){
            if ($this.closed) return;
            $this.closed = true;
            $this.object = null;
            $base();
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
                    $this.destroy();
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