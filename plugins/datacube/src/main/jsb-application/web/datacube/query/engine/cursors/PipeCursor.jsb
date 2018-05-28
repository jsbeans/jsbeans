{
	$name: 'DataCube.Query.Engine.Cursors.PipeCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
        ],

		$constructor: function(inputCursor){
		    $base();
		    $this.inputCursor = inputCursor;
        },

        next: function(){
            return $this.inputCursor.next();
        },

        close: function(){
            $this.inputCursor.close();
        },

        reset: function(){
            $this.inputCursor.reset();
        },

        clone: function(){
            return new $this.Class($this.inputCursor.clone());
        },
	}
}