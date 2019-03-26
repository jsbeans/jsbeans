{
	$name: 'DataCube.SliceEditor',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['JSB.Controls.Button',
	               'JSB.Controls.ScrollBox',
                   'JSB.Widgets.PrimitiveEditor',
                   'DataCube.Query.SchemeController'],

        sliceData: null,

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
			    onClick: function(){
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

			this.editor = new SchemeController();
			scrollBox.append(this.editor);

			this.subscribe('DataCube.CubeEditor.sliceNodeSelected', function(sender, msg, obj){
			    if($this.sliceData !== null){
			        return;
			    }

			    $this.addClass('active');

			    okBtn.enable(true);
			    $this.update(obj);
			});

			this.subscribe('DataCube.CubeEditor.sliceNodeDeselected', function(sender, msg, obj){
			    if($this.sliceData === obj){
			        return;
			    }

			    $this.removeClass('active');

			    okBtn.enable(false);

			    $this.sliceData = null;
			});

			function updateData(){
                $this.sliceData.entry.server().getEditorData(function(data, fail){
                    if(fail){
                        // todo: error
                        return;
                    }

                    $this.editor.setData(data);
                });
			}

            this.subscribe('Datacube.CubeNode.createSlice', function(sender, msg, slice){
                if(!$this.sliceData || $this.sliceData.entry.getCube().getId() !== slice.getCube().getId()){
                    return;
                }

                updateData();
            });

            this.subscribe('DataCube.Model.Slice.remove', {session: true}, function(sender, msg, desc){
                if(!$this.sliceData || $this.sliceData.entry.getCube().getFullId() !== desc.cubeFullId){
                    return;
                }

                updateData();
            });
	    },

	    apply: function(){
	        var query = this.editor.getValues(),
	            name = this.sliceName.getData().getValue();

	        this.sliceData.entry.server().setSliceParams({
	            name: name,
	            query: query
	        });
	    },

	    update: function(data){
            this.sliceName.setData(data.entry.getName());

            this.sliceData = data;

            this.editor.refresh({
                data: {
                    cubeFields: data.cubeFields,
                    cubeSlices: data.slices
                },
                slice: data.entry,
                values: data.entry.getQuery(true)
            });
	    }
	}
}