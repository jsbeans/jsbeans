{
	$name: 'DataCube.Query.Renders.Query',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$query',

	$client: {
	    $require: ['DataCube.Query.Syntax'],

	    _source: null,

	    $constructor: function(opts){
	        $base(opts);

	        var sourceKeys = Syntax.getSourceKeys();

	        this.subscribeTo('onRenderCreate', function(render){
	            if(render.getParent() === $this && sourceKeys[render.getKey()]){
	                $this._source = render;
	            }
	        });

	        this.construct();
	    },

	    construct: function(){
            var descriptions = [],
                order = 0;

            for(var i in this.getScope()){
                descriptions.push({
                    key: i,
                    order: order++,
                    scheme: Syntax.getSchema(i) || {}
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
                    scope: this.getScope(),
                    queryBean: this
                });

                if(render){
                    this.append(render);
                }
            }
	    },

	    destroy: function(){
	        this.unsubscribe();

	        $base();
	    },

	    getSourceFields: function(callback){
	        this._source.getSourceFields(callback);
	    }
	}
}