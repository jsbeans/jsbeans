{
	$name: 'Unimap.Controller',
	$parent: 'JSB.Controls.Control',
	$require: [],
	$client: {
	    $constructor: function(opts){
	        $base(opts);
            this.addClass('scheme');
            this.loadCss('UnimapController.css');

            this._scheme = opts.scheme;
            this._values = opts.values;

            this.createRendersMap(opts.rendersDescription);
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

                this.append(this.createRender(null, i, this._scheme[i], this._values[i]));
	        }
	    },

	    createLink: function(key, render){
	        if(!this._linksMap[key]){
	            this._linksMap[key] = {
	                linkedRenders: []
	            }
	        }
	        this._linksMap[key].linkedRenders.push(render);
	    },

        createRender: function(parent, key, scheme, values){
            var constructor = this.getRenderByName(scheme.render);
            var render = new constructor({
                key: key,
                scheme: scheme,
                values: values,
                parent: parent,
                schemeController: this,
                onChange: function(value){
                    $this.updateLinks(key, value);
                }
            });
            this.addRender(render);

            if(scheme.linkTo){
                this.createLink(scheme.linkTo, render);
            }

            return render;
        },

	    createRendersMap: function(rendersDescription){
            JSB.chain(rendersDescription, function(d, c){
                JSB.lookup(d.render, function(cls){
                    $this._rendersMap[d.name] = cls;
                    c();
                });
            }, function(){
                $this.construct();
            });
	    },

	    destroy: function(){
	        for(var i = 0; i < this._renders.length; i++){
	            this._renders[i].destroy();
	        }
	        $base();
	    },

	    isInnerScheme: function(){
	        return this.options.isInnerScheme;
	    },

	    findRenderByKey: function(key){
	        for(var i = 0; i < this._renders.length; i++){
	            if(this._renders[i].getKey() == key){
	                return this._renders[i];
	            }
	        }
	    },

	    getLinkedFields: function(){
	        var links = {};

	        for(var i in this._linksMap){
	            links[i] = [];
	            for(var j = 0; j < this._linksMap[i].linkedRenders.length; j++){
	                links[i].push(this._linksMap[i].linkedRenders[j].getKey());
	            }
	        }

	        return links;
	    },

	    getValueByKey: function(key){
	        var render = this.findRenderByKey(key);
	        return render ? render.getValue() : null;
	    },

	    getValues: function(b){
	        for(var i = 0; i < this._renders.length; i++){
	            this._renders[i].setDefaultValue();
	        }

	        var values = {
	            values: this._values,
	            linkedFields: this.getLinkedFields()
	        };

	        if(b){
	            values.validateResult = this.validate();
	        }

	        return values;
	    },

	    getRenderByName: function(name){
	        if(this._rendersMap[name]){
	            return this._rendersMap[name];
	        } else {
	            throw new Error('Render with name ' + name + ' does not exist');
	        }
	    },

	    validate: function(){
	        var valRes = [];

	        for(var i = 0; i < this._renders.length; i++){
	            var res = this._renders[i].validate();
	            if(Object.keys(res).length > 0){
	                valRes.push(res);
	            }
	        }

	        return valRes;
	    },

	    updateLinks: function(key, value){
	        if(this._linksMap[key]){
	            if(!this._linksMap[key].render){
	                this._linksMap[key].render = this.findRenderByKey(key);
	            }

	            for(var i = 0; i < this._linksMap[key].linkedRenders.length; i++){
	                this._linksMap[key].linkedRenders[i].changeLinkTo(value, this._linksMap[key].render);
	            }
	        }
	    }
	}
}