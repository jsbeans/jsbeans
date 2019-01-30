{
	$name: 'DataCube.Query.SchemeController',
	$parent: 'JSB.Controls.Control',
	$require: ['JSB.Widgets.ToolManager',
	           //'DataCube.Query.Syntax',
	           'DataCube.Query.QuerySyntax',
	           'DataCube.Query.SchemeTool',
	           'DataCube.Query.RenderRepository',
	           'css:Controller.css'],

	$client: {
	    _renders: [],
	    _sliceId: null,

	    $constructor: function(opts){
	        $base(opts);
            this.addClass('queryController');

            if(opts && opts.data && opts.values){
                this.refresh(opts);
            }

            // add + btn
	    },

	    options: {
	        onChange: undefined
	    },

	    clear: function(){
            for(var i = 0; i < this._renders.length; i++){
                this._renders[i].destroy();
            }
	    },

        construct: function(values){
            var descriptions = [],
                order = 0;

            for(var i in values){
                descriptions.push({
                    key: i,
                    order: order++,
                    scheme: QuerySyntax.getSchema(i) || {},
                    values: values[i]
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
                if(!descriptions[i].scheme.render){
                    continue;
                }

                var render = this.createRender(null, descriptions[i]);

                if(render){
                    this.append(render);
                }
            }

            this._values = values;
        },

        createRender: function(parent, desc){
            var render = RenderRepository.createRender({
                controller: this,
                desc: desc,
                parent: parent,
            });

            if(render){
                this._renders.push(render);
            }

            return render;
        },

        destroy: function(){
            this.clear();

            $base();
        },

        getData: function(key){
            if(key){
                return this._data[key];
            }

            return this._data;
        },

        getValues: function(){
            return this._values;
        },

        onChange: function(){
            if(this.options.onChange){
                this.options.onChange.call(this, this.getValues());
            }
        },

        refresh: function(opts){
            RenderRepository.ensureReady(function(){
                $this._data = opts.data || {};

                $this._sliceId = opts.sliceId;

                $this.construct(opts.values);
            });
        },

        showTool: function(opts){
			var popupTool = ToolManager.activate({
				id: 'querySchemeTool',
				cmd: 'show',
				data: {
				    data: this._data,
                    selectedId: opts.selectedId,
                    sliceId: this._sliceId,
				},
				scope: null,
				target: {
					selector: opts.element,
					dock: 'bottom',
					offsetVert: -1
				},
				/*
				constraints: [{
					selector: element,
					weight: 10.0
				}],
				*/
				callback: opts.callback
			});
        }
    }
}