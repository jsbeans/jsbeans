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
            this._values = opts.values.values;
            this._context = opts.context;

            if(opts.values.commonFields){
                this.createCommonFieldsMap(opts.values.commonFields);
            }

            if(opts.rendersMap){
                this._rendersMap = opts.rendersMap;
            } else {
                this._rendersMap = JSB.getInstance(opts.bootstrap ? opts.bootstrap : 'Unimap.Bootstrap').getRendersMap();
            }

            if(opts.advancedRenders){
                var advBtn = this.$('<span class="advancedBtn">Расширенные настройки<i class="fas fa-cog"></i></span>'),
                    advBtnCont = this.$('<div class="clearfix"></div>');

                advBtn.click(function(){
                    $this.toggleClass('advancedMode');
                });

                advBtnCont.append(advBtn);

                this.append(advBtnCont);
            }

            this.construct();
	    },

	    // inner variables
	    _commonFieldsMap: {},
	    _renders: [],
	    _rendersMap: {},
	    _linksMap: {},

        addRender: function(render){
            this._renders.push(render);
        },

	    construct: function(){
	        for(var i in this._scheme){
	            if(!this._scheme[i].render){
	                continue;
	            }

	            if(!this._values[i]){
	                this._values[i] = {}
	            }

	            var render = this.createRender(null, i, this._scheme[i], this._values[i]);
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

	    getContext: function(){
	        return this._context;
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