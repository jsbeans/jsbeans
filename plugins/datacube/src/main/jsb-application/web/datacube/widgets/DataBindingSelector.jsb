{
	$name: 'JSB.DataCube.Widgets.DataBindingSelector',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('dataBindingSelector');
			this.loadCss('DataBindingSelector.css');
			this.scheme = opts.scheme;
			this.values = opts.values;
			
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
							if(!JSB().isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
								continue;
							}
							return true;
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
						
					}
				}
			});
			
		}
	}
}