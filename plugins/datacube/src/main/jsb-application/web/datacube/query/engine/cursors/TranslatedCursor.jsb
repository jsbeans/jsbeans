{
	$name: 'DataCube.Query.Engine.Cursors.TranslatedCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
        ],

		$constructor: function(executor, query, parent, createIterator){
		    $base(executor, parent);
		    $this.query = query;
		    $this.context = query.$context;
		    $this.createIterator = createIterator;
		    $this.iterator = createIterator.call();
        },

        fields: {},

        next: function(){
            return $this.object = $this.iterator.next();
        },

        close: function(){
            if ($this.closed) return;
            $this.object = null;
            $this.iterator && $this.iterator.close();
            $base();
        },

        reset: function(){
            $this.object = null;
            $this.iterator && $this.iterator.close();
            $this.iterator = createIterator.call();
        },

//        clone: function(){
//            return new $this.Class($this.executor, $this.parent, $this.createIterator);
//        },

		analyze: function(){
		    var json = $base();
		    json.iterator = $this.iterator;
		    return json;
		},
	}
}