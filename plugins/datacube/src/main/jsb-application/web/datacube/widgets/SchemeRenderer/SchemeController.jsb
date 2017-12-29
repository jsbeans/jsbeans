{
	$name: 'Scheme.Controller',
	$parent: 'JSB.Controls.Control',
	$require: [],
	$client: {
	    $constructor: function(opts){
	        $base(opts);
            this.addClass('scheme');
            this.loadCss('SchemeController.css');

            this._scheme = opts.scheme;
            this._values = opts.values;
            this._rendersDescription = opts.rendersDescription;

            this.createRendersMap();
	    },

	    // inner variables
	    _renders: [],
	    _rendersMap: {},

        addRender: function(render){
            this._renders.push(render);
        },

	    construct: function(){
	        for(var i in this._scheme){
                this.append(this.createRender(this._scheme[i].render, this._scheme[i], this._values[i]));
	        }
	    },

        createRender: function(name, scheme, values){
            var constructor = this.getRenderByName(name);
            var render = new constructor({
                scheme: scheme,
                values: values,
                schemeController: this
            });
            this.addRender(render);
            return render;
        },

	    createRendersMap: function(){
            JSB.chain(this._rendersDescription, function(d, c){
                JSB.lookup(d.render, function(cls){
                    $this._rendersMap[d.name] = cls;
                    c();
                });
            }, function(){
                $this.construct();
            });
	    },

	    getValues: function(){
	        return this._values;
	    },

	    getRenderByName: function(name){
	        if(this._rendersMap[name]){
	            return this._rendersMap[name];
	        } else {
	            throw new Error('Render with name ' + name + 'does not exist');
	        }
	    }
	}
}