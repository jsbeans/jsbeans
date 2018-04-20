{
	$name: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
        ],

		$constructor: function(executionContext){
		    $this.executionContext = executionContext;
		    $this.Class = JSB.get($this.getJsb().$name).getClass();
        },

        object: null,

        next: function(){
            throw new Error('Not implemented');
        },

        close: function(){
            throw new Error('Not implemented');
        },

        reset: function(){
            throw new Error('Not implemented');
        },

        clone: function(){
            throw new Error('Not implemented');
        },

	}
}