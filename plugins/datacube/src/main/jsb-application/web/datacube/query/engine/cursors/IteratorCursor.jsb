{
	$name: 'DataCube.Query.Engine.Cursors.IteratorCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
        ],

		$constructor: function(createIterator){
		    $base();
		    $this.createIterator = createIterator;
		    $this.iterator = createIterator.call();
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
            $this.iterator = createIterator.call();
        },

        clone: function(){
            return new $this.Class($this.createIterator);
        },
	}
}