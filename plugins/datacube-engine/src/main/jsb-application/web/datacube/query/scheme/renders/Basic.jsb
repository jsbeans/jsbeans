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
	        this._parent = opts.parent;
	        this._scheme = opts.scheme;
	        this._values = opts.values;

	        if(this._scheme.displayName){
	            this.createHeader();
	        }
	    },

	    construct: function(){
	        // must be overridden
	    },

	    changeTo: function(newKey, newValue){
	        if(JSB.isNull(newKey)){
	            newKey = this.getKey();
	        }

	        this.getParent().replaceValue(this.getKey(), newKey, newValue);

	        var render = this.getController().createRender(this.getParent(), newKey, newValue);

	        if(render){
	            this.getElement().replaceWith(render.getElement());
	            this.onChange();
	            this.destroy();
	        }
	    },

	    createHeader: function(){
            this._header = this.$('<header>' + this._scheme.displayName + '</header>');
            this.append(this._header);

            var scheme = this.getScheme();

            if(!scheme.replaceable && !scheme.removable){
                return this._header;
            }

            this.installMenuEvents(this._header);

	        return this._header;
	    },

	    createRender: function(key, values, options){
	        return this.getController().createRender(this, key, values, options);
	    },

	    getController: function(){
	        return this._controller;
	    },

	    getData: function(key){
	        return this.getController().getData(key);
	    },

	    getHeader: function(){
	        return this._header;
	    },

	    getKey: function(){
	        return this._key;
	    },

	    getParent: function(){
	        return this._parent;
	    },

	    getScheme: function(){
	        return this._scheme;
	    },

	    getSlice: function(){
	        return this.getController().getSlice();
	    },

	    getValues: function(){
	        return this._values;
	    },

	    hideMenu: function(){
	        return this.getController().hideMenu();
	    },

	    installMenuEvents: function(element, id, menuOpts){
	        id = id || this.getId();

            element.hover(function(evt){
                evt.stopPropagation();

                JSB.cancelDefer('DataCube.Query.hideMenu' + id);

                JSB.defer(function(){
                    $this.showMenu(element, id, menuOpts);
                }, 300, 'DataCube.Query.showMenu' + id);
            }, function(evt){
                evt.stopPropagation();

                JSB.cancelDefer('DataCube.Query.showMenu' + id);

                JSB.defer(function(){
                    $this.hideMenu(element, id, menuOpts);
                }, 300, 'DataCube.Query.hideMenu' + id);
            });
	    },

	    onChange: function(){
	        this.getController().onChange();
	    },

	    remove: function(){
	        this.getParent().removeValue(this.getKey());
	        this.destroy();
	    },

	    removeValue: function(value){
	        delete this._values[value];
	    },

	    replaceValue: function(oldKey, newKey, newValue){
	        if(!JSB.isDefined(newValue)){
	            newValue = this._values[oldKey];
	        }

	        delete this._values[oldKey];

	        this._values[newKey] = newValue;
	    },

	    showMenu: function(element, id, opts){
	        return this.getController().showMenu(JSB.merge({
	            caller: this,
	            element: element,
	            elementId: id || this.getId(),
	            key: this.getKey(),
	            removable: this.getScheme().removable,
	            replaceable: this.getScheme().replaceable
	        }, opts));
	    },

	    showTool: function(opts){   //element, selectedId, callback
	        return this.getController().showTool(JSB.merge(opts, {
	            key: opts.key || this.getKey()
	        }));
	    },

	    subscribeTo: function(eventName, callback){
	        this.getController().subscribeTo(this.getId(), eventName, callback);
	    },

	    unsubscribe: function(){
	        this.getController().unsubscribe(this.getId());
	    }
	}
}