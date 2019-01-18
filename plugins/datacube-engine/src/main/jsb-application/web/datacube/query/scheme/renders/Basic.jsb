{
	$name: 'DataCube.Query.Renders.Basic',
	$parent: 'JSB.Controls.Control',
	$require: ['DataCube.Query.RenderRepository'],

	$alias: '$basic',

	$client: {
	    _beans: {},
	    _controller: null,
	    _values: null,

	    $constructor: function(opts){
	        $base(opts);

	        this._controller = opts.controller;
	        this._scheme = opts.desc.scheme;
	        this._values = opts.values;

	        if(this._scheme.displayName){
	            this.append('<div class="name">' + this._scheme.displayName + '</div>');
	        }

	        if(this._scheme.multiple){

	        }

	        this.construct();
	    },

	    construct: function(){
	        //
	    },

	    destroy: function(){
	        //
	    },

	    getData: function(key){
	        return this._controller.getData(key);
	    },

	    onMultipleBtnClick: function(){
	        // open main tooltip
	    }
	}
}