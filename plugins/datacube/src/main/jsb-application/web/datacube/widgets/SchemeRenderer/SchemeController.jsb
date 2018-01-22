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
	    _linksMap: {},

        addRender: function(render){
            this._renders.push(render);
        },

	    construct: function(){
	        for(var i in this._scheme){
	            if(!this._values[i]){
	                this._values[i] = {}
	            }

	            // todo: this.createRender(i, this._scheme[i], this._values[i]) - for remove key field

                this.append(this.createRender(this._scheme[i].render, this._scheme[i], this._values[i]));
	        }
	    },

	    createLink: function(key, render){
	        if(!this._linksMap[key]){
	            this._linksMap[key] = {
	                linkedRender: []
	            }
	        }
	        this._linksMap[key].linkedRender.push(render);
	    },

        createRender: function(name, scheme, values){
            var constructor = this.getRenderByName(name);
            var render = new constructor({
                scheme: scheme,
                values: values,
                schemeController: this,
                onChange: function(value){
                    $this.updateLinks(scheme.key, value);
                }
            });
            this.addRender(render);

            if(scheme.linkTo){
                this.createLink(scheme.linkTo, render);
            }

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
	            throw new Error('Render with name ' + name + ' does not exist');
	        }
	    },

	    updateLinks: function(key, value){
	        if(this._linksMap[key]){
	            for(var i = 0; i < this._linksMap[key].linkedRender.length; i++){
	                this._linksMap[key].linkedRender[i].changeLinkTo(value);
	            }
	        }
	    }
	}
}