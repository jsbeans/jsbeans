{
	$name: 'DataCube.CubeEditorNext',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['JSB.Widgets.Diagram', 'DataCube.CubePanel', 'DataCube.Providers.DataProviderRepository'],

	    $constructor: function(opts){
			$base(opts);

			this.loadCss('CubeEditorNext.css');
			this.addClass('cubeEditorNext');

			// create diagram
			this.diagram = new Diagram({
				minZoom: 0.25,
				highlightSelecting: false,
				onInit: function(){
					//this.diagramInitialized = true;
				},
				nodes: {
					dataProviderDiagramNode: {
						jsb: 'DataCube.DataProviderDiagramNode2',
						layout: {
							'default': {
								auto: true,
								animate: true,
								nodeExpand: 20
							}
						}
					},
					/*
					sliceDiagramNode: {
						jsb: 'DataCube.SliceDiagramNode',
						layout: {
							'default': {
								auto: true,
								animate: true,
								nodeExpand: 20
							}
						}
					}
					*/
				},

				connectors: {
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

			// create cube fields panel
			this.cubePanel = new CubePanel();
			this.append(this.cubePanel);

			this.diagram.getElement().droppable({
				accept: function(d){
					if(d && d.length > 0){
					    var draggingItems = d.get(0).draggingItems;
					    if(draggingItems){
                            for(var i = 0; i < draggingItems.length; i++){
                                var node = draggingItems[i].obj;

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
					}
					return false;
				},
				tolerance: 'pointer',
				greedy: true,
                activeClass : 'acceptDraggable',
                hoverClass: 'hoverDraggable',
				drop: function(evt, ui){
					var posPt = $this.diagram.pageToSheetCoords({x: ui.offset.left, y: ui.offset.top});
					var d = ui.draggable;
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i = 0; i < d.get(0).draggingItems.length; i++){
							var entry = d.get(0).draggingItems[i].obj.getTargetEntry();

							$this.addDataProvider(entry, posPt);
						}
					}
				}
			});
	    },

	    addDataProvider: function(entry, position){
			this.cubeEntry.server().addDataProvider(entry, function(provider){
				var pNode = $this.diagram.createNode('dataProviderDiagramNode', {provider: provider, editor: $this});
				pNode.setPosition(position.x, position.y);
				//$this.providersNodes[provider.getId()] = pNode;
			});
	    },

	    constructCube: function(desc){
	        // create providers' nodes
	        for(var i = 0; i < desc.providers.length; i++){
	            var pNode = $this.diagram.createNode('dataProviderDiagramNode', {provider: desc.providers[i].provider, editor: $this});
	            pNode.setPosition(desc.providers[i].position.x, desc.providers[i].position.y);
	        }
	    },

	    refresh: function(entry){
			if(this.cubeEntry == entry){
				return;
			}

			this.cubeEntry = entry;
			this.diagram.clear();

			this.cubeEntry.server().load(true, function(desc){
				$this.constructCube(desc);
			});
	    }
	}
}