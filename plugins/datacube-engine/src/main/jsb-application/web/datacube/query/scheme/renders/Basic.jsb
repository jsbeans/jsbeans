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

            this._header.hover(function(){
                JSB.cancelDefer('DataCube.Query.hideMenu' + $this.getId());

                JSB.defer(function(){
                    $this.showMenu();
                }, 300, 'DataCube.Query.showMenu' + $this.getId());
            }, function(){
                JSB.cancelDefer('DataCube.Query.showMenu' + $this.getId());

                JSB.defer(function(){
                    $this.hideMenu();
                }, 300, 'DataCube.Query.hideMenu' + $this.getId());
            });

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

	    hideMenu: function(){
	        return this.getController().hideMenu();
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
	        delete this._values[oldKey];

	        this._values[newKey] = newValue;
	    },

	    showMenu: function(){
	        var element;

	        if(this._header){
	            element = this._header;
	        } else {
	            element = this.getElement();
	        }

	        return this.getController().showMenu({
	            caller: this,
	            element: element,
	            elementId: this.getId(),
	            key: this.getKey(),
	            removable: this.getScheme().removable
	        });
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