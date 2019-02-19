{
	$name: 'DataCube.Query.Renders.Query',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$query',

	$client: {
	    $require: ['DataCube.Query.Syntax'],

	    $constructor: function(opts){
	        $base(opts);

	        var sourceKeys = Syntax.getSourceKeys();

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

            //
	    },

	    getSourceFields: function(callback){
	        var children = this.getChildren(),
	            sourceKeys = Syntax.getSourceKeys();

	        for(var i in children){
	            if(sourceKeys[children[i].getKey()]){
	                children[i].getSourceFields(callback);

	                return;
	            }
	        }
	    }
	}
}