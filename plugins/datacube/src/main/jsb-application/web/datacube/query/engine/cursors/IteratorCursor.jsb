{
	$name: 'DataCube.Query.Engine.Cursors.IteratorCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
        ],

		$constructor: function(executionContext, createIterator){
		    $base(executionContext);
		    $this.createIterator = createIterator;
		    $this.iterator = createIterator.call(executionContext);
        },

        next: function(){
            return $this.object = $this.iterator.next();
        },

        close: function(){
            $this.object = null;
            $this.iterator && $this.iterator.close();
        },

        reset: function(){
            $this.object = null;
            $this.iterator && $this.iterator.close();
            $this.iterator = createIterator.call(executionContext);
        },

        clone: function(){
            return new $this.Class($this.executionContext, $this.createIterator);
        },
	}
}