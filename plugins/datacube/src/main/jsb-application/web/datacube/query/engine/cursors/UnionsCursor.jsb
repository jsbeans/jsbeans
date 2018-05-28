{
	$name: 'DataCube.Query.Engine.Cursors.UnionsCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
		    'JSB.Crypt.MD5',
		    'DataCube.Query.Engine.RuntimeFunctions',

            'java:java.util.HashMap'
        ],

		$constructor: function(unions, createCursor){
		    $base();

		    $this.unions = unions;
		    $this.createCursor = createCursor;
		    $this.unionsCursors = null;

            $this._build();
        },

        next: function(){
            for(var i = 0; i < $this.unionsCursors.length; i++) {
                if (!$this.unionsCursors[i].closed) {
                    var value = $this.unionsCursors[i].next();
                    if(value == null) {
                        $this.unionsCursors[i].close();
                        continue;
                    }
                    return value;
                }
            }
            return null;
        },

        _build: function(){
            if($this.unionsCursors) {
                for(var i = 0; i < $this.unionsCursors.length; i++) {
                    if (!$this.unionsCursors[i].closed) {
                        $this.unionsCursors[i].close();
                    }
                }
            } else {
                $this.unionsCursors = [];
            }
            for(var i = 0; i < $this.unions.length; i++) {
                $this.unionsCursors.push(createCursor($this.unions[i]));
            }
        },

        close: function(){
            for(var i = 0; i < $this.unionsCursors.length; i++) {
                $this.unionsCursors[i].close();
            }
        },

        reset: function(){
            $this._build();
        },

        clone: function(){
            return new $this.Class($this.unions, $this.createCursor);
        },
	}
}