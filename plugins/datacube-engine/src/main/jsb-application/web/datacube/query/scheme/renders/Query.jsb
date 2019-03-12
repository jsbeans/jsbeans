{
	$name: 'DataCube.Query.Renders.Query',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$query',

	$client: {
	    $require: ['DataCube.Query.Syntax',
	               'DataCube.Query.Controls.AddMenu',
	               'css:Query.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('queryRender');

	        if(this.getParent()){
	            this.addClass('subQuery');

	            this.createHeader();

	            this.getController().registerContext(this.getContext());
	        }

	        this.construct();
	    },

	    addMenuItem: function(item){
	        this.addMenu.addItem(item);
	    },

	    changeValue: function(){
	        JSB.merge(this.getScope(), this.getDefaultValues());

	        this.getScope().$context = this.getController().generateContext();
	    },

	    construct: function(){
            var descriptions = [],
                order = 0;

            for(var i in this.getScope()){
                descriptions.push({
                    key: i,
                    order: order++,
                    scheme: Syntax.getScheme(i) || {}
                });
            }

            descriptions.sort(function(a, b){
                var aPriority = JSB.isDefined(a.scheme.priority) ? a.scheme.priority : 0.5,
                    bPriority = JSB.isDefined(b.scheme.priority) ? b.scheme.priority : 0.5;

                if(aPriority > bPriority){
                    return -1;
                }

                if(aPriority < bPriority){
                    return 1;
                }

                return a.order - b.order;
            });

            for(var i = 0; i < descriptions.length; i++){
                var render = this.createRender({
                    key: descriptions[i].key,
                    scope: this.getScope()
                });

                if(render){
                    this.append(render);
                }
            }

	        this.addMenu = new AddMenu({
	            existElements: this.getScope(),
	            menuItems: Syntax.getQueryElements(),
	            callback: function(desc){
                    var render = $this.createRender({
                        key: desc.key,
                        scope: $this.getScope(),
                        queryBean: $this
                    });

                    if(render){
                        $this.addMenu.before(render);
                    }

                    $this.onChange();
	            }
	        });
	        this.append(this.addMenu);
	    },

	    createHeader: function(){
            var header = this.$('<header></header>');
            this.append(header);

            var displayName = this.$('<div class="operator">' + this.getScheme().displayName + '<div>');
            header.append(displayName);

            header.append('<div class="context">' + this.getContext() + '</div>');

            this.installMenuEvents({
                element: displayName
            });

	        return header;
	    },

	    getContext: function(){
	        return this.getScope().$context;
	    },

	    getOutputFields: function(){
	        return Object.keys(this.getScope().$select).sort();
	    },

	    replaceValue: function(newKey, newValue){
	        for(var i in this._scope){
	            delete this._scope[i];
	        }
	    }
	}
}