{
	$name: 'DataCube.Query.Engine.Cursors.EmptyCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
        ],

		$constructor: function(){
		    $this._pos = -1;
        },

        next: function(){
            return $this.object = (
                $this._pos === -1
                ? ($this._pos = 0, {})
                : null
            );
        },

        close: function(){
            $this.cursor.object = null
        },

        reset: function(){
            $this._pos = -1;
            $this.object = null;
        },

        clone: function(){
            return new $this.Class();
        },
	}
}