{
	$name: 'JSB.DataCube.CubeEditor',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		$require: ['JSB.Widgets.Diagram',
		           'JSB.Widgets.ToolBar',
		           'JSB.DataCube.Providers.DataProviderRepository'],
		           
		cubeEntry: null,
		cubeNode: null,
		
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
					this.diagramInitialized = true;
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
					cubeDiagramNode: {
						jsb: 'JSB.DataCube.CubeDiagramNode',
						layout: {
							'default': {
								auto: true,
								animate: true,
								nodeExpand: 20
							}
						}
					},
				},
				
				connectors: {
					cubeFieldLeft: {
						acceptLocalLinks: false,
						align: 'left',
						offsetX: 2,
						wiringLink: {
							key: 'bind',
							type: 'source'
						}
					},
					
					cubeFieldRight: {
						acceptLocalLinks: false,
					},
					
					providerFieldRight: {
						acceptLocalLinks: false,
						offsetX: 2,
						wiringLink: {
							key: 'bind',
							type: 'target'
						}
					}

				},
				
				links: {
					bind: {
						source: ['cubeFieldLeft'],
						target: ['providerFieldRight'],
						joints: [{
							name: 'offsStart',
							position: function(){
								var ptStart = this.getLink().getSourcePosition();
								var ptEnd = this.getLink().getTargetPosition();
								var dist = Math.sqrt((ptEnd.x - ptStart.x)*(ptEnd.x - ptStart.x) + (ptEnd.y - ptStart.y)*(ptEnd.y - ptStart.y));
								var offs = dist / 4;
								if(ptStart && ptEnd){
									return {x: ptStart.x - 40, y: ptStart.y};
								}
								return null;
							}
						},{
							name: 'offsEnd',
							position: function(){
								var ptStart = this.getLink().getSourcePosition();
								var ptEnd = this.getLink().getTargetPosition();
								var dist = Math.sqrt((ptEnd.x - ptStart.x)*(ptEnd.x - ptStart.x) + (ptEnd.y - ptStart.y)*(ptEnd.y - ptStart.y));
								var offs = dist / 4;
								if(ptStart && ptEnd){
									return {x: ptEnd.x + 40, y: ptEnd.y};
								}
								return null;
							}
						}],
						heads: {
							target: {
								shape: 'arrow',
								strip: 0
							}
						}
					}
				}

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
		
		setupCubeNode: function(){
			if(!this.diagram.isNodeRegistered('cubeDiagramNode') 
				|| !this.diagram.isConnectorRegistered('cubeFieldLeft')
				|| !this.diagram.isConnectorRegistered('cubeFieldRight')){
				JSB.deferUntil(function(){
					$this.setupCubeNode();
				}, function(){
					return $this.diagram.isNodeRegistered('cubeDiagramNode') 
						&& $this.diagram.isConnectorRegistered('cubeFieldLeft')
						&& $this.diagram.isConnectorRegistered('cubeFieldRight');
				});
				return;
			}
			this.cubeNode = $this.diagram.createNode('cubeDiagramNode', {editor: $this, entry: $this.cubeEntry});
			this.cubeNode.setPosition(-150, -150);
		},
		
		setCurrentEntry: function(entry){
			if(this.cubeEntry == entry){
				return;
			}
			this.diagram.clear();
			this.cubeEntry = entry;
			this.cubeEntry.server().load(function(){
				// draw in diagram
				$this.setupCubeNode();
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