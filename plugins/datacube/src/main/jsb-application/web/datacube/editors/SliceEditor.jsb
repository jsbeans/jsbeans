{
	$name: 'DataCube.SliceEditor',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['JSB.Controls.Button',
	               'JSB.Controls.ScrollBox',
                   'DataCube.Query.QueryEditor',
                   'JSB.Widgets.PrimitiveEditor',
                   'DataCube.Query.SchemeController',
                   'JSB.Widgets.RendererRepository'],

	    $constructor: function(opts){
	        $base(opts);

			$jsb.loadCss('SliceEditor.css');
			this.addClass('sliceEditor');

	        var toolbar = this.$('<div class="toolbar"></div>');
	        this.append(toolbar);

	        var icon = this.$('<div class="icon"></div>');
	        toolbar.append(icon);

	        this.caption = this.$('<span class="caption">Редактор среза</span>');
	        toolbar.append(this.caption);

            this.sliceName = new PrimitiveEditor({
                cssClass: 'sliceName'
            });
            toolbar.append(this.sliceName.getElement());

			var okBtn = new Button({
			    caption: 'Сохранить',
			    cssClass: 'okBtn',
			    enabled: false,
				tooltip: 'Сохранить',
			    onclick: function(){
			        $this.apply();
			    }
			});
			toolbar.append(okBtn.getElement());

			var message = this.$('<span class="selectMessage">Выберите срез</span>');
			this.append(message);

			var scrollBox = new ScrollBox({
			    xAxisScroll: false
			});
			this.append(scrollBox);

			this.newEditor = new SchemeController();
			scrollBox.append(this.newEditor);

			this.oldEditor = new QueryEditor({
			    cssClass: 'queryEditor',
			    editorView: this,
			    mode: 'diagram'
			});
			scrollBox.append(this.oldEditor);

			this.subscribe('DataCube.CubeEditor.sliceNodeSelected', function(sender, msg, obj){
			    $this.addClass('active');

			    okBtn.enable(true);
			    $this.update(obj);
			});

			this.subscribe('DataCube.CubeEditor.sliceNodeDeselected', function(sender, msg, obj){
			    $this.removeClass('active');

			    okBtn.enable(false);
			});
	    },

	    apply: function(){
	        var query = this.collectQuery(),
	            name = this.sliceName.getData().getValue();

	        this.sliceData.entry.server().setSliceParams({
	            name: name,
	            query: query,

	            returnUpdates: true
	        }, function(res, err){
	            if(!err && res.wasUpdated){
	                $this.publish('DataCube.CubeEditor.sliceUpdated', {
	                    fields: res.updates.fields,
	                    name: res.updates.name,
	                    slice: $this.sliceData.entry,
	                    query: res.updates.query
	                });
	            }
	        });
	    },

		// временная функция пока не полностью реализован новый редактор
		collectQuery: function(){
		    return JSB.merge({}, this.oldEditor.getValue(), this.newEditor.getValues());
		},

		getSourceFields: function(callback){
            this.newEditor.getSourceFields(callback);
		},

	    update: function(data){
            var sliceId = data.entry.getId(),
                slices = data.slices,
                sliceSelectOptions = [];

            for(var i in slices){
                if(sliceId === slices[i].getId()){
                    continue;
                }

                sliceSelectOptions.push({
                    entry: slices[i],
                    key: i,
                    value: RendererRepository.createRendererFor(slices[i], {showSource: true}).getElement()
                });
            }

            this.sliceName.setData(data.entry.getName());

            this.sliceData = data;

            var slicedQuery = this.sliceQuery(data.entry.getQuery());

            this.newEditor.refresh({
                data: {
                    cubeFields: data.cubeFields,
                    cubeSlices: data.slices
                },
                slice: data.entry,
                values: slicedQuery.newEditor
            })

            this.oldEditor.setOption('sliceId', sliceId);
            this.oldEditor.setOption('cubeFields', data.cubeFields);
            this.oldEditor.setOption('cubeSlices', slices);
            this.oldEditor.setOption('sliceSelectOptions', sliceSelectOptions);

            this.oldEditor.set(slicedQuery.oldEditor);
	    },

		// временная функция пока не полностью реализован новый редактор
		sliceQuery: function(query){
		    var slicedQuery = {
		        newEditor: {},
		        oldEditor: {}
		    };

		    var newKeys = ['$join', '$from', '$union', '$cube', '$provider'];

		    for(var i in query){
		        if(newKeys.indexOf(i) > -1){
		            slicedQuery.newEditor[i] = query[i];
		        } else {
		            slicedQuery.oldEditor[i] = query[i];
		        }
		    }

		    return slicedQuery;
		}
	}
}