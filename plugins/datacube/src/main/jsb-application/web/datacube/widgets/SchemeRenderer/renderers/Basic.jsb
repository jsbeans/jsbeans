{
	$name: 'Scheme.Render.Basic',
	$parent: 'JSB.Controls.Control',
    $client: {
        $constructor: function(opts){
            $base(opts);
            this.addClass('basicRender');
            this.loadCss('Basic.css');
            JSB().loadCss('tpl/font-awesome/css/font-awesome.min.css');

            this._scheme = opts.scheme;
            this._values = opts.values;
            this._schemeController = opts.schemeController;

	        if(Object.keys(this._values).length === 0){
	            this.createValues();
	        }

            this.construct();
        },

        construct: function(){
            throw new Error('This method must be overwritten');
        },

        createRender: function(name, scheme, values){
            return this._schemeController.createRender(name, scheme, values);
        },

        createValues: function(){
	        this._values = {
	            checked: this._scheme.optional === 'checked' ? true : undefined,
	            values: [],
	            key: this._scheme.key
	        }
        },

        destroy: function(){
            for(var i = 0; i < this._renders.length; i++){
                if(this._renders[i]){
                    this._renders[i].destroy();
                }
            }
            $base();
        }
    }
}