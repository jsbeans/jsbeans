{
	$name: 'DataCube.SliceEditor',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['JSB.Controls.Button',
	               'JSB.Controls.ScrollBox',
                   'DataCube.Query.QueryEditor',
                   'JSB.Widgets.PrimitiveEditor',
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
				hasIcon: false,
				hasCaption: true,
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

			this.queryEditor = new QueryEditor({
			    cssClass: 'queryEditor',
			    mode: 'diagram'
			});
			scrollBox.append(this.queryEditor);

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
	        var query = this.query,
	            measurements = this.measurements,
	            name = this.sliceName.getData().getValue();

	        this.sliceData.entry.server().setSliceParams({
	            name: name,
	            measurements: measurements,
	            query: query
	        }, function(res, err){
	            if(!err && res.wasUpdated){
	                /*
	                $this.sliceData.node.refresh({
	                    measurements: measurements,
	                    query: query
	                });
	                */
	                $this.publish('DataCube.CubeEditor.sliceUpdated', {
	                    measurements: measurements,
	                    name: name,
	                    slice: $this.sliceData.entry,
	                    query: query
	                });
	            }
	        });
	    },

	    update: function(data){
            var sliceId = data.entry.getId(),
                slices = data.slices,
                sliceSelectOptions = [];

            for(var i in slices){
                if(sliceId === slices[i].entry.getId()){
                    continue;
                }

                sliceSelectOptions.push({
                    entry: slices[i].entry,
                    key: i,
                    value: RendererRepository.createRendererFor(slices[i].entry, {showSource: true}).getElement()
                });
            }

            this.sliceName.setData(data.entry.getName());

            this.query = JSB.clone(data.entry.getQuery());
            //this.measurements = JSB.clone(data.entry.getMeasurements());
            this.sliceData = data;

            this.queryEditor.setOption('sliceId', sliceId);
            this.queryEditor.setOption('measurements', this.measurements);
            this.queryEditor.setOption('sliceSelectOptions', sliceSelectOptions);

            this.queryEditor.set(this.query);
	    }
	}
}