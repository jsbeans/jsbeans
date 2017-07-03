{
	$name: 'JSB.DataCube.CubeEditor',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		$require: ['JSB.Widgets.Diagram',
		           'JSB.Widgets.ToolBar',
		           'JSB.DataCube.Providers.DataProviderRepository'],
		           
		cubeEntry: null,
		cubeNode: null,
		ignoreHandlers: false,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('CubeEditor.css');
			this.addClass('cubeEditor');
/*			
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
*/			
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
					sliceDiagramNode: {
						jsb: 'JSB.DataCube.SliceDiagramNode',
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
		
		setupCubeNode: function(desc){
			function diagramItemsReady(){
				return $this.diagram.isNodeRegistered('cubeDiagramNode') 
				&& $this.diagram.isNodeRegistered('dataProviderDiagramNode')
				&& $this.diagram.isNodeRegistered('sliceDiagramNode')
				&& $this.diagram.isConnectorRegistered('cubeFieldLeft')
				&& $this.diagram.isConnectorRegistered('cubeFieldRight')
				&& $this.diagram.isConnectorRegistered('providerFieldRight');
			}
			if(!diagramItemsReady()){
				JSB.deferUntil(function(){
					$this.setupCubeNode(desc);
				}, function(){
					return diagramItemsReady();
				});
				return;
			}
			$this.ignoreHandlers = true;
			// create cube
			var cubePos = {x: -150, y: -150};
			if(desc.cubePosition){
				cubePos = desc.cubePosition;
			}
			this.cubeNode = $this.diagram.createNode('cubeDiagramNode', {editor: $this, entry: $this.cubeEntry});
			this.cubeNode.setPosition(cubePos.x, cubePos.y);
			
			// create providers
			var dpNodes = [];
			var pnMap = {};
			for(var i = 0; i < desc.providers.length; i++){
				var pDesc = desc.providers[i];
				var pNode = $this.diagram.createNode('dataProviderDiagramNode', {provider:pDesc.provider, editor: $this});
				pnMap[pDesc.provider.getId()] = pNode;
				pNode.setPosition(pDesc.position.x, pDesc.position.y);
				dpNodes.push(pNode);
			}
			JSB.chain(dpNodes, function(node, c){
				JSB.deferUntil(function(){
					c.call($this);
				}, function(){
					return node.ready;
				});
			}, function(){
				// sort field
				var fnArr = [];
				for(var fName in desc.fields){
					fnArr.push({
						field: fName,
						order: desc.fields[fName].order
					})
				}
				fnArr.sort(function(a, b){
					return a.order - b.order;
				});
				// connect fields
				for(var j = 0; j < fnArr.length; j++){
					var fName = fnArr[j].field;
					var fDesc = desc.fields[fName];
					$this.cubeNode.addField(fDesc.field, fDesc.type, fDesc.link);
					for(var i = 0; i < fDesc.binding.length; i++){
						var bDesc = fDesc.binding[i];
						var link = $this.diagram.createLink('bind');
						link.setSource($this.cubeNode.leftFieldConnectors[fName]);
						link.setTarget(pnMap[bDesc.provider.getId()].rightFieldConnectors[bDesc.field])
					}
				}
				
				// draw slices
				for(var i = 0; i < desc.slices.length; i++){
					var sDesc = desc.slices[i];
					var sNode = $this.diagram.createNode('sliceDiagramNode', {slice: sDesc.slice, editor: $this});
					sNode.setPosition(sDesc.position.x, sDesc.position.y);
				}
				
				$this.ignoreHandlers = false;
			});
		},
		
		setCurrentEntry: function(entry){
			if(this.cubeEntry == entry){
				return;
			}
			this.cubeEntry = entry;
			this.diagram.clear();
			this.cubeEntry.server().load(function(desc){
				// draw in diagram
				$this.setupCubeNode(desc);
			});
		},
		
		addDataProvider: function(dpEntry, pt){
			this.cubeEntry.server().addDataProvider(dpEntry, function(provider){
				var pNode = $this.diagram.createNode('dataProviderDiagramNode', {provider:provider, editor: $this});
				pNode.setPosition(pt.x, pt.y);
			});
		},
		
		addSlice: function(){
			this.cubeEntry.server().addSlice(function(slice){
				var sNode = $this.diagram.createNode('sliceDiagramNode', {slice: slice, editor: $this});
				var cubeRect = $this.cubeNode.getRect();
				sNode.setPosition(cubeRect.x + cubeRect.w + 100, cubeRect.y);
			});
		}
	}
}