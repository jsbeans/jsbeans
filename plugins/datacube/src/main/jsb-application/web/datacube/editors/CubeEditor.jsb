{
	$name: 'JSB.DataCube.CubeEditor',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		$require: ['JSB.Widgets.Diagram',
		           'JSB.Widgets.ToolBar',
		           'JSB.DataCube.Providers.DataProviderRepository'],
		           
		cubeEntry: null,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('CubeEditor.css');
			this.addClass('cubeEditor');
			
			// create toolbar
			this.toolbar = new ToolBar();
			this.append(this.toolbar);
			
			this.toolbar.addItem({
				key: 'addSource',
				tooltip: 'Добавить источник данных',
				element: '<div class="icon"></div>',
				click: function(){
				}
			});
			
			this.toolbar.addSeparator({key: 'createSeparator'});
			
			// create diagram
			this.diagram = new Diagram({
				minZoom: 0.25,
				highlightSelecting: false,
				onInit: function(){
					this.publish('DataCube.CubeEditor.diagramInitialized');
				},
				nodes: {
					dataProviderDiagramNode: {
						jsb: 'JSB.DataCube.DataProviderDiagramNode',
						layout: {
							'default': {
								auto: true,
								animate: true,
								nodeExpand: 20
							}
						}
					},
					
					connectors: {},
					links: {}
				},
			});
			this.append(this.diagram);
			
			this.diagram.getElement().droppable({
				accept: function(d){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i = 0; i < d.get(0).draggingItems.length; i++){
							var node = d.get(0).draggingItems[i].obj;
							if(!JSB.isInstanceOf(node, 'JSB.Workspace.EntryNode')){
								continue;
							}
							var entry = node.getEntry();
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
					$this.diagram.addClass('acceptDraggable');
				},
				out: function(evt, ui){
					if( ui.helper.hasClass('accepted') ){
						ui.helper.removeClass('accepted');
					}
					$this.diagram.removeClass('acceptDraggable');
				},
				drop: function(evt, ui){
					var posPt = $this.diagram.pageToSheetCoords({x: ui.offset.left, y: ui.offset.top});
					$this.diagram.removeClass('acceptDraggable');
					var d = ui.draggable;
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i = 0; i < d.get(0).draggingItems.length; i++){
							var node = d.get(0).draggingItems[i].obj;
							var entry = node.getEntry();
							var dpInfo = DataProviderRepository.queryDataProviderInfo(entry);
							if(dpInfo){
								// create data provider
								$this.addDataProvider(entry, posPt);
							}
						}
					}
				}
			});
		},
		
		setCurrentEntry: function(entry){
			if(this.cubeEntry == entry){
				return;
			}
			this.diagram.clear();
			this.cubeEntry = entry;
			this.cubeEntry.server().load(function(){
				// draw in diagram
			});
		},
		
		addDataProvider: function(dpEntry, pt){
			this.cubeEntry.server().addDataProvider(dpEntry, function(provider){
				var pNode = $this.diagram.createNode('dataProviderDiagramNode', {provider:provider});
				pNode.setPosition(pt.x, pt.y);
			});
		}
	}
}