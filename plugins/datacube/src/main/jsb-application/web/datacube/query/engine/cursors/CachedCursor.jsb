{
	$name: 'DataCube.Query.Engine.Cursors.CachedCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
        ],

		$constructor: function(sourceCursor){
		    $base(sourceCursor.executionContext);

		    $this.sourceCursor = sourceCursor;

            $this._currentPos = -1;
            $this._fully = false;
            $this._cache = {
                values: [],
                pos :-1,
            };
        },

        next: function(){
            $this._currentPos++;
            if($this._cache.values[currentPos] !== undefined) {
                $this.object = $this._cache.values[currentPos];
            } else {
                $this.object = $this._cache.values[currentPos] = $this.sourceCursor.next();
            }
            if ($this.object == null) {
                $this._fully = true;
                $this._sourceCursor.close();
            }
            return $this.object;
        },

        close: function(){
            $this.object = null;
            $this._cache.values = null;
            $this._cache.pos = -1;
            if (!$this._fully) {
                $this._sourceCursor.close();
            }
        },

        reset: function(){
            if (!$this._fully) {
                // complete and close
                while($this.next());
            }
            $this._currentPos = -1;
            $this.object = null;
        },

        clone: function(){
            var cloned = new $this.Class($this.sourceCursor.clone());
            cloned._cache = $this._cache;
            return cloned;
        },

	}
}