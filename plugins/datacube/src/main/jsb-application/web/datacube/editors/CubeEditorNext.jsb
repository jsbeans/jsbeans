{
	$name: 'DataCube.CubeEditorNext',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['JSB.Widgets.Diagram',
	               'DataCube.Providers.DataProviderRepository',
	               'DataCube.SliceDiagramNode',
	               'DataCube.DataSourceDiagramNode'],

	    $constructor: function(opts){
			$base(opts);

			//$jsb.loadCss('../fonts/fa/fontawesome-all.min.css');
			$jsb.loadCss('CubeEditorNext.css');
			this.addClass('cubeEditor');

			// create diagram
			this.diagram = new Diagram({
				minZoom: 0.25,
				highlightSelecting: false,
				onChange: function(changeType, item){
				    if(changeType === 'createLink'){
				        $this.createLink(item);
				    }

				    if(changeType === 'removeLink'){
				        $this.removeLink(item);
				    }
				},
				onInit: function(){
				    $this.setTrigger('diagramReady');
				},
				nodes: {
					dataSourceDiagramNode: {
						jsb: 'DataCube.DataSourceDiagramNode',
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
					}
				},

				connectors: {
					sliceLeft: {
						acceptLocalLinks: false,
						userLink: true,
						align: 'left',
						offsetX: 2,
						wiringLink: {
							key: 'bind',
							type: 'source'
						}
					},

					providerRight: {
						acceptLocalLinks: false,
						userLink: true,
						offsetX: 2,
						wiringLink: {
							key: 'bind',
							type: 'target'
						}
					}
				},

				links: {
					bind: {
						source: ['sliceLeft'],
						target: ['providerRight'],
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
                        for(var i in d.get(0).draggingItems){
                            var obj = d.get(0).draggingItems[i].obj;

                            if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
                                continue;
                            }

                            var entry = obj.getTargetEntry();
                            if(JSB.isInstanceOf(entry, 'DataCube.Model.DatabaseTable')){
                            // todo: add cube & slice
                            // JSB.isInstanceOf(entry,'DataCube.Model.Slice')
                                return true;
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
                    var d = ui.draggable;

                    for(var i in d.get(0).draggingItems){
                        $this.addDataSource(d.get(0).draggingItems[i].obj.getTargetEntry(), $this.diagram.pageToSheetCoords({x: ui.offset.left, y: ui.offset.top}));
                        break;
                    }
                }
            });

            this.subscribe('Datacube.CubeNode.createSlice', function(sender, msg, slice){
                if(slice.cube === $this.cubeEntry){
                    $this.addSlice(slice);
                }
            });
	    },

	    _dataSources: {},
	    _slices: {},

	    addDataSource: function(entry, position){
	        this.cubeEntry.server().addDataSource(entry, {position: position}, function(res, fail){
	            if(fail){
	                // todo: error
	                console.log('Error due create data source');
	                return;
	            }

                if(JSB.isInstanceOf(entry, "DataCube.Model.DatabaseTable")){
                    var pNode = $this.diagram.createNode('dataSourceDiagramNode', {entry: entry, editor: $this});
                    pNode.setPosition(position.x, position.y);
                }
	        });
	    },

		addSlice: function(slice){
            var sNode = $this.diagram.createNode('sliceDiagramNode', {entry: slice, editor: $this});

            //this.cubeEntry.server().updateSliceSettings()
            /*
            var cubeRect = $this.cubeNode.getRect();
            sNode.setPosition(cubeRect.x + cubeRect.w + 100, cubeRect.y);

            $this.diagram.select($this.diagram.getNodes(), false);
            $this.diagram.select($this.diagram.getLinks(), false);
            sNode.select(true);
            */
		},

	    constructCube: function(desc){
	        function createNode(type, obj){
	            var node = $this.diagram.createNode(type, {entry: obj.entry, editor: $this});

                if(obj.diagramOpts && obj.diagramOpts.position){ // todo: remove 'if'
	                node.setPosition(obj.diagramOpts.position.x, obj.diagramOpts.position.y);
                }

                return {
                    entry: obj.entry,
                    node: node
                }
	        }

	        // create sources' nodes
	        for(var i in desc.dataSources){
	            this._dataSources[desc.dataSources[i].entry.getFullId()] = createNode('dataSourceDiagramNode', desc.dataSources[i]);
	        }

	        // create slices' nodes
	        for(var i in desc.slices){
	            this._slices[desc.slices[i].entry.getFullId()] = createNode('sliceDiagramNode', desc.slices[i]);
	        }

	        // create links
	        // todo
	    },

	    createLink: function(link){
	        link.source.node.createLink(link);
	    },

	    removeLink: function(link){
	        //
	    },

	    refresh: function(entry){
			if(this.cubeEntry == entry){
				return;
			}

			this.cubeEntry = entry;
			this.diagram.clear();

			this.cubeEntry.server().load(true, function(desc){
			    $this.ensureTrigger(['diagramReady'], function(){
			        $this.constructCube(desc);
			    });
			});
	    }
	}
}