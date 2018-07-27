{
	$name: 'DataCube.CubeEditor',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		$require: ['JSB.Widgets.Diagram',
		           'JSB.Widgets.ToolBar',
		           'DataCube.Providers.DataProviderRepository'],
		           
		cubeEntry: null,
		cubeNode: null,
		ignoreHandlers: false,
		providersNodes: {},
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('CubeEditor.css');
			this.addClass('cubeEditor');
			
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
						jsb: 'DataCube.DataProviderDiagramNode',
						layout: {
							'default': {
								auto: true,
								animate: true,
								nodeExpand: 20
							}
						}
					},
					cubeDiagramNode: {
						jsb: 'DataCube.CubeDiagramNode',
						layout: {
							'default': {
								auto: true,
								animate: true,
								nodeExpand: 20
							}
						}
					},
					sliceDiagramNode: {
						jsb: 'DataCube.SliceDiagramNode',
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
						userLink: false,
						align: 'left',
						offsetX: 2,
						wiringLink: {
							key: 'bind',
							type: 'source'
						}
					},
					
					cubeFieldRight: {
						acceptLocalLinks: false
					},
					
					providerFieldRight: {
						acceptLocalLinks: false,
						userLink: false,
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
							var entry = node.getTargetEntry();
							var dpInfo = DataProviderRepository.queryDataProviderInfo(entry);
							if(dpInfo){
								if(JSB.isInstanceOf(entry, 'DataCube.Model.SqlTable')){
									if(entry.isMissing()){
										continue;
									}
								}
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
							var entry = node.getTargetEntry();
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
				$this.diagram.setPan({x:-(cubePos.x + 150), y:-(cubePos.y + 150)});
			}
			this.cubeNode = $this.diagram.createNode('cubeDiagramNode', {editor: $this, entry: $this.cubeEntry});
			this.cubeNode.setPosition(cubePos.x, cubePos.y);
			if(desc.cubeSize){
			    this.cubeNode.getElement().width(desc.cubeSize.width);
			}
			
			// create providers
			var dpNodes = [];
			var pnMap = {};
			for(var i = 0; i < desc.providers.length; i++){
				var pDesc = desc.providers[i];
				var pNode = $this.diagram.createNode('dataProviderDiagramNode', {provider:pDesc.provider, editor: $this});
				pnMap[pDesc.provider.getId()] = pNode;
				if(pDesc.position && JSB.isDefined(pDesc.position.x) && JSB.isDefined(pDesc.position.y)){
					pNode.setPosition(pDesc.position.x, pDesc.position.y);
				}
				if(pDesc.size){
				    pNode.getElement().width(pDesc.size.width);
				}
				dpNodes.push(pNode);
				$this.providersNodes[pDesc.provider.getId()] = pNode;
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
					return a.field.localeCompare(b.field);
				});

				// connect fields
				for(var j = 0; j < fnArr.length; j++){
					var fName = fnArr[j].field;
					var fDesc = desc.fields[fName];
					var isKeyField = fDesc.binding.length > 1;
					$this.cubeNode.addField(fDesc.field, fDesc.type, isKeyField ? null : fDesc.binding[0].provider ? { id: fDesc.binding[0].provider.getId(), name: fDesc.binding[0].provider.getName() }: null, fDesc.link, isKeyField, true);
					if(isKeyField){
                        for(var i = 0; i < fDesc.binding.length; i++){
                            var bDesc = fDesc.binding[i];
                            var link = $this.diagram.createLink('bind');
                            link.setSource($this.cubeNode.leftFieldConnectors[fName]);
                            link.setTarget(pnMap[bDesc.provider.getId()].rightFieldConnectors[bDesc.field]);
                        }
                    }
				}
				$this.cubeNode.updateResizable();

				// mark default fields
				$this.cubeNode.markDefaultFields(desc.defaultFields);
/*
				// draw slices
				for(var i = 0; i < desc.slices.length; i++){
					var sDesc = desc.slices[i];
					var sNode = $this.diagram.createNode('sliceDiagramNode', {slice: sDesc.slice, editor: $this});
					if(sDesc.position && JSB.isDefined(sDesc.position.x) && JSB.isDefined(sDesc.position.y)){
						sNode.setPosition(sDesc.position.x, sDesc.position.y);
					}
				}
*/				
				$this.ignoreHandlers = false;
			});
		},
		
		setCurrentEntry: function(entry){
			if(this.cubeEntry == entry){
				return;
			}
			this.cubeEntry = entry;
			this.diagram.clear();

			this.providersNodes = {};
			this.cubeEntry.server().load(true, function(desc){
				// draw in diagram
				$this.cubeDescription = desc;
				$this.setupCubeNode(desc);
			});
		},
		
		addDataProvider: function(dpEntry, pt){
			this.cubeEntry.server().addDataProvider(dpEntry, function(provider){
				var pNode = $this.diagram.createNode('dataProviderDiagramNode', {provider:provider, editor: $this});
				pNode.setPosition(pt.x, pt.y);
				$this.providersNodes[provider.getId()] = pNode;
			});
		},
		
		addSlice: function(checkedFieldList){
			this.cubeEntry.server().addSlice(checkedFieldList, false, function(slice){
				$this.publish('JSB.Workspace.Entry.open', slice);
/*				
				var sNode = $this.diagram.createNode('sliceDiagramNode', {slice: slice, editor: $this});
				var cubeRect = $this.cubeNode.getRect();
				sNode.setPosition(cubeRect.x + cubeRect.w + 100, cubeRect.y);
				
				$this.diagram.select($this.diagram.getNodes(), false);
				$this.diagram.select($this.diagram.getLinks(), false);
				sNode.select(true);
*/				
			});
		},
		
		removeSlice: function(slice, sliceNode){
			this.cubeEntry.server().removeSlice(slice.getId(), function(){
				sliceNode.destroy();
			});
		}
	}
}