{
	$name: 'DataCube.Query.Engine.LoopbackProvider',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

        $constructor: function(owner){
            $this.owner = owner;
        },

		register: function(queryTask){
            throw 'interface method not implemented: return uri';
		},

		destroy: function() {
		    $base();
		},
	}
}