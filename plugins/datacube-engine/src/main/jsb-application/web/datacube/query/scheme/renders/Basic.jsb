{
	$name: 'DataCube.Query.Renders.Basic',
	$parent: 'JSB.Controls.Control',

	$alias: null,

	$client: {
	    _controller: null,
	    _values: null,

	    $constructor: function(opts){
	        $base(opts);

	        this._controller = opts.controller;
	        this._values = opts.values;
	    },

	    getData: function(key){
	        return this._controller.getData(key);
	    }
	},

	$server: {
	    $require: ['DataCube.Query.RenderRepository'],

		$bootstrap: function(){
			RenderRepository.registerRender(this, this.$alias);
		}
	}
}