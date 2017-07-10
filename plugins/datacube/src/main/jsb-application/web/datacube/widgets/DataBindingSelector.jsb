{
	$name: 'JSB.DataCube.Widgets.DataBindingSelector',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.DataCube.Providers.DataProviderRepository',
	           'JSB.Widgets.RendererRepository'],
	
	$client: {
		dataScheme: null,
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('dataBindingSelector');
			this.loadCss('DataBindingSelector.css');
			this.scheme = opts.scheme;
			this.values = opts.values;
			this.wrapper = opts.wrapper;
			
			this.placeholderElt = this.$('<div class="placeholder">Перетащите сюда источник</div>');
			this.append(this.placeholderElt);
			this.bindingElt = this.$('<div class="binding hidden"></div>');
			this.append(this.bindingElt);
			
			this.setupDroppable();
		},
		
		setupDroppable: function(){
			this.getElement().droppable({
				accept: function(d){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i].obj;
							if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
								continue;
							}
							var entry = obj.getEntry();
							if(JSB.isInstanceOf(entry,'JSB.DataCube.Model.Slice')){
								return true;
							}
							var dpInfo = DataProviderRepository.queryDataProviderInfo(entry);
							if(dpInfo){
								return true;
							}
						}
						
					}
					return false;
				},
				tolerance: 'pointer',
				greedy: true,
				over: function(evt, ui){
					if( !ui.helper.hasClass('accepted') ){
						ui.helper.addClass('accepted');
					}
					$this.getElement().addClass('acceptDraggable');
				},
				out: function(evt, ui){
					if( ui.helper.hasClass('accepted') ){
						ui.helper.removeClass('accepted');
					}
					$this.getElement().removeClass('acceptDraggable');
				},
				drop: function(evt, ui){
					var d = ui.draggable;
					$this.getElement().removeClass('acceptDraggable');
					for(var i in d.get(0).draggingItems){
						var obj = d.get(0).draggingItems[i].obj;
						if(!JSB().isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
							continue;
						}
						$this.setSource(obj.getEntry());
						break;
					}
				}
			});
			
		},
		
		setSource: function(entry){
			this.values.source = entry.getLocalId();
			this.bindingElt.empty().append(RendererRepository.createRendererFor(entry, {showCube: true}).getElement());
			this.placeholderElt.addClass('hidden');
			this.bindingElt.removeClass('hidden');
			if(JSB.isInstanceOf(entry,'JSB.DataCube.Model.Slice')){
				// add slice
				this.source = entry;
			} else {
				var dpInfo = DataProviderRepository.queryDataProviderInfo(entry);
				if(dpInfo){
					this.source = entry;
				}
				
			}
			
			this.wrapper.server().combineDataScheme(this.source, function(dataScheme, fail){
				if(fail){
					
				} else {
					$this.dataScheme = dataScheme;
					if($this.options.onChange){
						$this.options.onChange.call($this);
					}
				}
			});

		},
		
		isFilled: function(){
			return !JSB.isNull(this.dataScheme);
		},
		
		getDataScheme: function(){
			return this.dataScheme;
		}
		
	}
}