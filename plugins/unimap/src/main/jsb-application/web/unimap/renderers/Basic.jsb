{
	$name: 'Unimap.Render.Basic',
	$parent: 'JSB.Controls.Control',
    $client: {
        $constructor: function(opts){
            $base(opts);
            this.addClass('basicRender');
            JSB().loadCss('tpl/font-awesome/css/font-awesome.min.css');

            this._key = opts.key;
            this._scheme = opts.scheme;
            this._values = opts.values;
            this._schemeController = opts.schemeController;

	        if(this._values && Object.keys(this._values).length === 0){
	            this.createValues();
	        }

            this.construct();
        },

        construct: function(){
            throw new Error('This method must be overwritten');
        },

        changeLinkTo: function(values){
            if(JSB.isFunction(this.options.linkToFunc)){
                this.options.linkToFunc.call(this, values);
                return true;
            }
        },

        changeLinkToWarning: function(){
            // todo: add standard warning
        },

        createRender: function(key, scheme, values){
            return this._schemeController.createRender(this, key, scheme, values);
        },

        createValues: function(){
            this._values.checked = this._scheme.optional === 'checked' ? true : undefined;
            this._values.values = [];
        },

        destroy: function(){
            for(var i = 0; i < this._renders.length; i++){
                if(this._renders[i]){
                    this._renders[i].destroy();
                }
            }
            $base();
        },

        getKey: function(){
            return this._key;
        },

        getParent: function(){
            return this.options.parent;
        },

        getValueByKey: function(){
            return this._schemeController.getValueByKey(this._scheme.linkTo);
        },

        getValue: function(){
            return this._values;
        }
    }
}