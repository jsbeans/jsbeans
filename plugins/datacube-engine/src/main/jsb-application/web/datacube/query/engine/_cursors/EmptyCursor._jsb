{
	$name: 'DataCube.Query.Engine.Cursors.EmptyCursor',
	$parent: 'DataCube.Query.Engine.Cursors.Cursor',

	$server: {
		$require: [
        ],

		$constructor: function(executor, parent, caller){
		    $base(executor, parent, caller);
        },

        _pos: -1,

        next: function(){
            return $this.object = (
                $this._pos === -1
                ? ($this._pos = 0, {})
                : null
            );
        },

        destroy: function(){
            if ($this.closed) return;
            $this.object = null;
            $base();
        },

        reset: function(){
            $this._pos = -1;
            $this.object = null;
        },

//        clone: function(){
//            return new $this.Class();
//        },

		analyze: function(){
		    var json = $base();
		    return json;
		},
	}
}