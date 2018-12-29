{
	$name: 'DataCube.Query.SchemeController',
	$parent: 'JSB.Controls.Control',
	$require: ['DataCube.Query.QuerySyntax',
	           'DataCube.Query.RenderRepository'],

	$client: {
	    _renders: [],

	    $constructor: function(opts){
	        $base(opts);
            this.addClass('scheme');

            // add + btn
	    },

	    clear: function(){
            for(var i = 0; i < this._renders.length; i++){
                this._renders[i].destroy();
            }
	    },

        construct: function(values){
            var queryValues = QuerySyntax.getSchema('$query').values,
                scheme = [],
                order = 0;

            for(var i in values){
                scheme.push({
                    key: i,
                    order: order++,
                    scheme: QuerySyntax.getSchema(queryValues[i]),
                    values: values[i]
                });
            }

            scheme.sort(function(a, b){
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

            for(var i = 0; i < scheme.length; i++){
                if(!scheme[i].render){
                    continue;
                }

                var render = this.createRender(null, scheme[i]);

                if(render){
                    this.append(render);
                }
            }
        },

        createRender: function(parent, scheme){
            if(scheme[i].key !== '$join'){  // debug
                return;
            }

            var render = RenderRepository.createRenderFor(scheme[i].key, JSB.merge(scheme[i], {parent: parent}));

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

        refresh: function(opts){
            RenderRepository.ensureReady(function(){
                $this._data = opts.data || {};

                $this.construct(opts.values);
            });
        }
    }
}