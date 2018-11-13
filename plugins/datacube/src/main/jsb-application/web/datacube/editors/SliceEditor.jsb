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

			var okBtn = new Button({
			    caption: 'Сохранить',
				hasIcon: false,
				hasCaption: true,
				tooltip: 'Сохранить',
			    onclick: function(){
			        $this.apply();
			    }
			});
			toolbar.append(okBtn.getElement());

			var scrollBox = new ScrollBox();
			this.append(scrollBox);

			this.queryEditor = new QueryEditor({
			    allowNames: [],
			    cssClass: 'queryEditor',
			    mode: 'diagram'
			});
			scrollBox.append(this.queryEditor);

			this.subscribe('DataCube.CubeEditor.sliceNodeSelected', function(sender, msg, obj){
			    $this.update(obj);
			});
	    },

	    apply: function(){
	        //
	    },

	    update: function(data){
debugger;
            var sources = data.sources,
                allowNames = [], //['$from', '$join', '$union', '$provider', '$recursive']
                sourceSelectOptions = [];

            switch(Object.keys(sources).length){
                case 0:
                    // current cube
                    break;
                case 1:
                    // provider || cube || slice
                    for(var i in sources){
                        if(JSB.isInstanceOf(sources[i], 'DataCube.Model.DatabaseTable')){
                            allowNames = ['$provider'];
                            break;
                        }

                        // todo: cube, slice
                    }
                    break;
                case 2:
                    allowNames = ['$join', '$union'];
                    break;
                default: // 3 or more
                    allowNames = ['$union'];
            }

            for(var i in sources){
                sourceSelectOptions.push({
                    entry: sources[i].entry,
                    key: i,
                    value: RendererRepository.createRendererFor(sources[i].entry, {showSource: true})
                });
            }

            this.query = JSB.clone(data.query);

            this.queryEditor.setOption('allowNames', allowNames);
            this.queryEditor.setOption('sourceSelectOptions', sourceSelectOptions);

            this.queryEditor.set(data.query);
	    }
	}
}