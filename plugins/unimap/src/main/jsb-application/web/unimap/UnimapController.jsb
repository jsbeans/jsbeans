{
	$name: 'Unimap.Controller',
	$parent: 'JSB.Controls.Control',
	$require: ['Unimap.Bootstrap'],
	$client: {
	    $constructor: function(opts){
	        $base(opts);
            this.addClass('scheme');
            this.loadCss('UnimapController.css');

            this._scheme = opts.scheme;
            this._values = opts.values;

            if(opts.rendersMap){
                this._rendersMap = opts.rendersMap;
            } else {
                this._rendersMap = JSB.getInstance(opts.bootstrap ? opts.bootstrap : 'Unimap.Bootstrap').getRendersMap();
            }

            this.construct();
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

        createRender: function(parent, key, scheme, values, opts){
            var constructor = this.getRenderByName(scheme.render);
            var render = new constructor({
                key: key,
                scheme: scheme,
                values: values,
                parent: parent,
                options: opts,
                schemeController: this,
                onchange: function(value){
                    if(JSB.isFunction($this.options.onchange)){
                        $this.options.onchange.call($this, key, value);
                    }
                    $this.updateLinks(key, value);
                }
            });
            this.addRender(render);

            if(scheme.linkTo){
                this.createLink(scheme.linkTo, render);
            }

            return render;
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

	    findRendersByRender: function(name){
	        var renders = [];

	        for(var i = 0; i < this._renders.length; i++){
	            if(this._renders[i].getRenderName() == name){
	                renders.push(this._renders[i]);
	            }
	        }

	        return renders;
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

	    getRenderByName: function(name){
	        if(this._rendersMap[name]){
	            return this._rendersMap[name];
	        } else {
	            throw new Error('Render with name ' + name + ' does not exist');
	        }
	    },

	    getRenderMap: function(){
	        return this._rendersMap;
	    },

	    getValueByKey: function(key){
	        var render = this.findRenderByKey(key);
	        return render ? render.getValues() : null;
	    },

	    getValues: function(b){
	        return this._values;
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