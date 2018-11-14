{
	$name: 'DataCube.SliceEditor',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['JSB.Controls.Button',
	               'JSB.Controls.ScrollBox',
                   'DataCube.Query.QueryEditor',
                   'JSB.Widgets.RendererRepository'],

	    $constructor: function(opts){
	        $base(opts);

			$jsb.loadCss('SliceEditor.css');
			this.addClass('sliceEditor');

	        var toolbar = this.$('<div class="toolbar"></div>');
	        this.append(toolbar);

	        var caption = this.$('<span>Редактор среза</span>');
	        toolbar.append(caption);

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

			var scrollBox = new ScrollBox();
			this.append(scrollBox);

			this.queryEditor = new QueryEditor({
			    cssClass: 'queryEditor',
			    mode: 'diagram'
			});
			scrollBox.append(this.queryEditor);

			this.subscribe('DataCube.CubeEditor.sliceNodeSelected', function(sender, msg, obj){
			    message.addClass('hidden');
			    $this.queryEditor.removeClass('hidden');
			    okBtn.enable(true);
			    $this.update(obj);
			});

			this.subscribe('DataCube.CubeEditor.sliceNodeDeselected', function(sender, msg, obj){
			    message.removeClass('hidden');
			    $this.queryEditor.addClass('hidden');
			    okBtn.enable(false);
			});
	    },

	    apply: function(){
	        var query = this.query;
	        this.sliceData.entry.server().setSliceParams({
	            query: query
	        }, function(res, err){
	            if(!err && res.wasUpdated){
	                $this.sliceData.node.refresh({
	                    query: query
	                });
	            }
	        });
	    },

	    update: function(data){
            var sources = data.sources,
                sourceSelectOptions = [];

            for(var i in sources){
                sourceSelectOptions.push({
                    entry: sources[i].entry,
                    key: i,
                    value: RendererRepository.createRendererFor(sources[i].entry, {showSource: true}).getElement()
                });
            }

            this.query = JSB.clone(data.entry.getQuery());
            this.sliceData = data;

            this.queryEditor.setOption('sourceSelectOptions', sourceSelectOptions);

            this.queryEditor.set(this.query);
	    }
	}
}