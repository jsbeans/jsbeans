{
	$name: 'Unimap.Controller',
	$parent: 'JSB.Controls.Control',
	$require: ['Unimap.Repository',
	           'css:UnimapController.css'],

	$client: {
	    $constructor: function(opts){
	        $base(opts);
            this.addClass('scheme');

            this._scheme = opts.scheme;
            this._values = (opts.values && opts.values.values) || {};
            this._context = opts.context;
            this._data = opts.data;

            if(opts.values && opts.values.commonFields){
                this.createCommonFieldsMap(opts.values.commonFields);
            }


            Repository.ensureInitialized(function(){
                $this.construct();
            });
	    },

	    // inner variables
	    _commonFieldsMap: {},
	    _renders: [],
	    _linksMap: {},

        addRender: function(render){
            this._renders.push(render);
        },

	    construct: function(){
	        var keys = Object.keys(this._scheme);
	        for(var i = 0; i < keys.length; i++){
	        	this._scheme[keys[i]]._order = i;
	        }

	        keys.sort(function(a, b){
	            var aPriority = JSB.isDefined($this._scheme[a].priority) ? $this._scheme[a].priority : 0.5,
	                bPriority = JSB.isDefined($this._scheme[b].priority) ? $this._scheme[b].priority : 0.5;

                if(aPriority > bPriority){
                    return -1;
                }

                if(aPriority < bPriority){
                    return 1;
                }
                
                return $this._scheme[a]._order - $this._scheme[b]._order;
	        });

	        for(var i = 0; i < keys.length; i++){
	            var k = keys[i];

	            if(!this._scheme[k].render){
	                continue;
	            }

	            if(!this._values[k]){
	                this._values[k] = {}
	            }

	            var render = this.createRender(null, k, this._scheme[k], this._values[k]);
	            if(render){
	                this.append(render);
	            }
	        }
	    },

	    createCommonFieldsMap: function(commonFields){
	        for(var i in commonFields){
                this._commonFieldsMap[i] = {
                    commonRenders: [],
                    commonValues: commonFields[i].values
                };
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
            var render = Repository.createRender({
                key: key,
                scheme: scheme,
                values: values,
                parent: parent,
                options: opts,
                schemeController: this,
                onchange: function(value, callback){
                    if(JSB.isFunction($this.options.onchange)){
                        $this.options.onchange.call($this, key, value);
                    }
                    $this.updateLinks(key, value, callback);
                    /*
                    if(scheme.commonField){
                        $this.updateCommonFields(key, scheme.commonField, value);
                    }
                    */
                }
            });
            this.addRender(render);

            if(scheme.linkTo){
                this.createLink(scheme.linkTo, render);
            }

            if(scheme.commonField){
                if(!this._commonFieldsMap[scheme.commonField]){
                    this._commonFieldsMap[scheme.commonField] = {
                        commonRenders: [],
                        commonValues: []
                    };
                }

                this._commonFieldsMap[scheme.commonField].commonRenders.push(render);
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

	    findRendersByKey: function(key){
	        var renders = [];

	        for(var i = 0; i < this._renders.length; i++){
	            if(this._renders[i].getKey() == key){
	                renders.push(this._renders[i]);
	            }
	        }

	        return renders;
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

	    getCommonFields: function(){
	        var commonFields = {};

	        for(var i in this._commonFieldsMap){
	            commonFields[i] = {
	                values: this._commonFieldsMap[i].commonValues
	            }
	        }

	        return commonFields;
	    },

	    getCommonGroupValues: function(commonGroup){
	        return this._commonFieldsMap[commonGroup] && this._commonFieldsMap[commonGroup].commonValues;
	    },

	    getContext: function(isObj){
	        if(isObj){
	            if(typeof this._context === 'object'){
	                return this._context;
	            } else {
	                return this;
	            }
	        }

	        return this._context;
	    },

	    getData: function(){
	        return this._data;
	    },

	    getLinkedFields: function(){
	        var links = {};

	        for(var i in this._linksMap){
	            links[i] = [];
	            for(var j = 0; j < this._linksMap[i].linkedRenders.length; j++){
	                var key = this._linksMap[i].linkedRenders[j].getKey();

	                if(links[i].indexOf(key) < 0){
	                    links[i].push(key);
	                }
	            }
	        }

	        return links;
	    },

	    getLinkedRenders: function(key){
	        if(this._linksMap[key]){
	            return this._linksMap[key].linkedRenders;
	        } else {
	            return [];
	        }
	    },

	    getValueByKey: function(key){
	        var render = this.findRenderByKey(key);
	        return render ? render.getValues() : null;
	    },

	    getValues: function(){
	        return {
	            commonFields: this.getCommonFields(),
	            linkedFields: this.getLinkedFields(),
	            values: this._values
	        }
	    },

	    redraw: function(key){
	        var oldRender = this.findRenderByKey(key),
	            newRender = this.createRender(null, key, oldRender.getScheme(), oldRender.getValues());

            if(newRender){
                oldRender.getElement().replaceWith(newRender.getElement());
                oldRender.destroy();
            }
	    },

	    validate: function(){
	        var valRes = [];

	        for(var i = 0; i < this._renders.length; i++){
	            var res = this._renders[i].validate();
	            if(res){
	                valRes.push(res);
	            }
	        }

	        return valRes;
	    },

	    updateCommonFields: function(key, commonGroup, newValue, oldValue){
	        if(!this._commonFieldsMap[commonGroup]){
                this._commonFieldsMap[commonGroup] = {
                    commonRenders: [],
                    commonValues: []
                };
	        }

	        if(oldValue){
	            var index = this._commonFieldsMap[commonGroup].commonValues.indexOf(oldValue);

	            if(index > -1){
	                this._commonFieldsMap[commonGroup].commonValues.splice(index, 1);
	            }
	        }

	        if(newValue && JSB.isString(newValue) && this._commonFieldsMap[commonGroup].commonValues.indexOf(newValue) === -1){
	            this._commonFieldsMap[commonGroup].commonValues.push(newValue);

	            for(var i = 0; i < this._commonFieldsMap[commonGroup].commonRenders.length; i++){
	                if(this._commonFieldsMap[commonGroup].commonRenders[i].getKey() === key){
	                    continue;
	                }

	                this._commonFieldsMap[commonGroup].commonRenders[i].changeCommonGroup && this._commonFieldsMap[commonGroup].commonRenders[i].changeCommonGroup(this._commonFieldsMap[commonGroup].commonValues);
	            }
	        }
	    },

	    updateLinks: function(key, value, callback){
	        if(this._linksMap[key]){
	            if(!this._linksMap[key].render){
	                this._linksMap[key].render = this.findRenderByKey(key);
	            }

	            for(var i = 0; i < this._linksMap[key].linkedRenders.length; i++){
	                this._linksMap[key].linkedRenders[i].changeLinkTo(value, this._linksMap[key].render, callback);
	            }
	        }
	    }
	}
}