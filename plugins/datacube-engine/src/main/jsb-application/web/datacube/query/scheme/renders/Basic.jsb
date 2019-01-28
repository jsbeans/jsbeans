{
	$name: 'DataCube.Query.Renders.Basic',
	$parent: 'JSB.Controls.Control',

	$alias: '$basic',

	$client: {
		$require: ['DataCube.Query.RenderRepository',
    	           'css:Basic.css'],

	    _controller: null,
	    _values: null,

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('queryRender');

	        this._controller = opts.controller;
	        this._key = opts.key;
	        this._scheme = opts.desc.scheme;
	        this._values = opts.desc.values;

	        if(this._scheme.displayName){
	            this.append('<header>' + this._scheme.displayName + '</header>');
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

	    getKey: function(){
	        return this._key;
	    },

	    onChange: function(){
	        this._controller.onChange();
	    },

	    showTool: function(element, selectedId, callback){
	        return this._controller.showTool({
	            callback: callback,
	            element: element,
	            key: this.getKey(),
	            selectedId: selectedId
	        });
	    }
	}
}