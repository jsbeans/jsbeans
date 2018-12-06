{
	$name: 'DataCube.CubeEditor',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['JSB.Widgets.Diagram',
	               'DataCube.SliceDiagramNode',
	               'DataCube.DataSourceDiagramNode',
	               'JSB.Widgets.Button',
	               'JSB.Widgets.ToolManager',
					'css:CubeEditor.css'],

	    _cube: null,
	    _dataSources: {},
	    _slices: {},

	    $constructor: function(opts){
			$base(opts);

			this.addClass('cubeEditor');

			// todo: add toolbar

			// create diagram
			this.diagram = new Diagram({
				minZoom: 0.25,
				highlightSelecting: false,
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
						userLink: false,
						align: 'left',
						offsetX: 2,
						wiringLink: {
							key: 'bind',
							type: 'source'
						}
					},

					providerRight: {
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

            var editTool = this.$('<div class="editTool hidden"></div>');
            this.append(editTool);

            var removeBtn = new Button({
                cssClass: 'roundButton btnDelete btn10',
                tooltip: 'Удалить элементы',
                onClick: function(){
                    ToolManager.showMessage({
                        icon: 'removeDialogIcon',
                        text: 'Вы уверены что хотите удалить выбранные элементы?',
                        buttons: [{text: 'Удалить', value: true},
                                  {text: 'Нет', value: false}],
                        target: {
                            selector: removeBtn.getElement()
                        },
                        constraints: [{
                            weight: 10.0,
                            selector: removeBtn.getElement()
                        }],
                        callback: function(bDel){
                            if(bDel){
                                for(var i in $this._selectedItems){
                                    if(JSB.isInstanceOf($this._selectedItems[i], 'JSB.Widgets.Diagram.Link')){
                                        continue;
                                    }

                                    if(JSB.isInstanceOf($this._selectedItems[i].entry, 'DataCube.Model.Slice') &&
                                       $this._cube.getId() === $this._selectedItems[i].entry.getCube().getId()){
                                        (function(node){
                                            $this._selectedItems[i].entry.server().remove(function(res, fail){
                                                if(!fail){
                                                    node.destroy();
                                                }
                                            });
                                        })($this._selectedItems[i]);
                                    } else {
                                        (function(node){
                                            $this._cube.server().removeDataSource($this._selectedItems[i].entry.getFullId(), function(res, fail){
                                                if(!fail){
                                                    node.destroy();
                                                }
                                            });
                                        })($this._selectedItems[i]);
                                    }
                                }
                            }
                        }
                    });
                }
            });
            editTool.append(removeBtn.getElement());

            this.subscribe('Datacube.CubeNode.createSlice', function(sender, msg, slice){
                if(slice.cube === $this._cube){
                    $this.addSlice(slice);
                }
            });

            this.subscribe('_jsb_diagramSelectionChanged', function(sender, msg, selectedItems){
                if(Object.keys(selectedItems).length > 0){
                    editTool.removeClass('hidden');
                } else {
                    editTool.addClass('hidden');
                }

                this._selectedItems = selectedItems;
            });
	    },

	    addDataSource: function(entry, position){
	        this._cube.server().addDataSource(entry, {position: position}, function(res, fail){
	            if(fail){
	                // todo: error
	                console.log('Error due create data source');
	                return;
	            }

                if(JSB.isInstanceOf(entry, "DataCube.Model.DatabaseTable")){
                    var pNode = $this.diagram.createNode('dataSourceDiagramNode', {entry: entry, editor: $this});
                    pNode.setPosition(position.x, position.y);

                    $this._dataSources[entry.getFullId()] = {
                        entry: entry,
                        node: pNode
                    }
                }
	        });
	    },

		addSlice: function(slice){
            $this.diagram.createNode('sliceDiagramNode', {entry: slice, editor: $this});
		},

	    constructCube: function(desc){
	        function createNode(type, obj){
	            var node = $this.diagram.createNode(type, JSB.merge({
	                editor: $this
	            }, obj));

                if(obj.diagramOpts && obj.diagramOpts.position){
	                node.setPosition(obj.diagramOpts.position.x, obj.diagramOpts.position.y, true);
                }

                return {
                    entry: obj.entry,
                    node: node
                }
	        }

	        this._dataSources = {};
	        this._slices = {};

	        // create sources' nodes
	        for(var i in desc.dataSources){
	            this._dataSources[desc.dataSources[i].entry.getFullId()] = createNode('dataSourceDiagramNode', desc.dataSources[i]);
	        }

	        // create slices' nodes
	        for(var i in desc.slices){
	            this._slices[desc.slices[i].entry.getFullId()] = createNode('sliceDiagramNode', desc.slices[i]);
	        }

	        this.options.layoutManager.ensureInitialize(function(){
                $this.options.layoutManager.getWidget('cubePanel').refresh($this.getCube(), desc.dimensions);
	        });
	    },

	    createLink: function(linkType, linkOpts){
	        return this.diagram.createLink(linkType, linkOpts);
	    },

	    getCube: function(){
	        return this._cube;
	    },

	    getSource: function(id){
	        return this._dataSources[id] || this._slices[id];
	    },

	    getSlices: function(){
	        return this._slices;
	    },

	    getSources: function(){
	        return this._dataSources;
	    },

	    refresh: function(entry){
			if(this._cube == entry){
				return;
			}

			this._cube = entry;
			this.diagram.clear();

			this._cube.server().load(true, function(desc){
			    $this.ensureTrigger(['diagramReady'], function(){
			        $this.constructCube(desc);
			    });
			});
	    }
	}
}