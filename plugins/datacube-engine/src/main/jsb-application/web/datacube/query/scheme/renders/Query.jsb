{
	$name: 'DataCube.Query.Renders.Query',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$query',

	$client: {
	    $require: ['DataCube.Query.Syntax',
	               'JSB.Widgets.ToolManager',
	               'DataCube.Query.SimpleSelectTool'],

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
/*
            var addBtn = this.$('<i class="addBtn"></i>');
            this.append(addBtn);
            addBtn.click(function(){
                var values = Syntax.getQueryElements(),
                    curValues = Object.keys($this.getScope());

                for(var i = 0; i < curValues.length; i++){
                    var index = values.indexOf(curValues[i]);

                    if(index > -1){
                        values.splice(index, 1);
                    }
                }

                ToolManager.activate({
                    id: 'simpleSelectTool',
                    cmd: 'show',
                    data: {
                        key: JSB.generateUid(),
                        values: values
                    },
                    scope: null,
                    target: {
                        selector: $this.getElement(),
                        dock: 'bottom'
                    },
                    callback: function(desc){
                        var render = $this.createRender({
                            key: desc.key,
                            scope: $this.getScope(),
                            queryBean: $this
                        });

                        if(render){
                            addBtn.before(render);
                        }

                        // todo: hide btn if values not exist

                        $this.onChange();
                    }
                });
            });
*/
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