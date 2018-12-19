{
	$name: 'DataCube.CubeEditor',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['JSB.Controls.SearchBox',
	               'JSB.Widgets.Diagram',
	               'JSB.Widgets.ToolManager',
	               'DataCube.Dialogs.JoinSettingsTool',
	               'DataCube.SliceDiagramNode',
					'css:CubeEditor.css'],

	    _cube: null,
	    _dimensions: {},
	    _slices: {},

	    _selectedItems: {},

	    $constructor: function(opts){
			$base(opts);

			this.addClass('cubeEditor');

			// create diagram
			this.diagram = new Diagram({
				minZoom: 0.25,
				highlightSelecting: false,
				onInit: function(){
				    $this.setTrigger('diagramReady');
				},
				nodes: {
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

					sliceRight: {
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
						target: ['sliceRight'],
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
						},
						userSelect: false
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

            // search
            var searchBox = new SearchBox({
                onChange: function(val){
                    $this.publish('DataCube.CubeEditor.search', val);
                },
                onClose: function(){
                    $this.publish('DataCube.CubeEditor.search');
                }
            });
            this.append(searchBox);

            // create add buttons
            var addBtn = this.$('<div class="addBtn fas fa-plus-circle"></div>');
            this.append(addBtn);

            var addAdvancedBtns = this.$('<ul class="hidden"></ul>');
            addBtn.append(addAdvancedBtns);

            addAdvancedBtns.append('<li key="$join" class="joinIcon"></li>');
            addAdvancedBtns.append('<li key="$union" class="unionIcon"></li>');

            addAdvancedBtns.find('li').click(function(evt){
                evt.stopPropagation();

                var sources = [],
                    sourceType = $this.$(evt.target).attr('key');

                for(var i in $this._selectedItems){
                    sources.push($this._selectedItems[i].entry);
                }

                if(sourceType === '$join'){
                    ToolManager.activate({
                        id: 'joinSettingsTool',
                        cmd: 'show',
                        data: sources,
                        target: {
                            selector: $this.getElement()
                        },
                        callback: function(sourceOpts){
                            $this.addSlice(null, {
                                sources: sources,
                                sourceType: sourceType,
                                sourceOpts: sourceOpts
                            });
                        }
                    });
                } else {
                    $this.addSlice(null, {
                        sources: sources,
                        sourceType: sourceType
                    });
                }
            });

            addBtn.click(function(evt){
                evt.stopPropagation();

                var sources = [],
                    sourceType = undefined;

                for(var i in $this._selectedItems){
                    sources.push($this._selectedItems[i].entry);
                }

                if(sources.length === 1){
                    sourceType = '$from';
                } else if (sources.length > 2){
                    sourceType = '$union';
                } else if(sources.length === 0) {
                } else {
                    return;
                }

                $this.addSlice(null, {
                    sources: sourceType ? sources : undefined,
                    sourceType: sourceType
                });
            });

            var removeBtn = this.$('<div class="removeBtn hidden fas fa-trash-alt"></div>');
            this.append(removeBtn);
            removeBtn.click(function(){
                ToolManager.showMessage({
                    icon: 'removeDialogIcon',
                    text: 'Удалить выбранные элементы?',
                    buttons: [{text: 'Удалить', value: true},
                              {text: 'Отмена', value: false}],
                    target: {
                        selector: removeBtn.element
                    },
                    constraints: [{
                        weight: 10.0,
                        selector: removeBtn.element
                    }],
                    callback: function(bDel){
                        if(bDel){
                            for(var i in $this._selectedItems){
                                (function(node){
                                    $this._selectedItems[i].entry.server().remove(function(res, fail){
                                        if(!fail){
                                            node.destroy();
                                        }
                                    });
                                })($this._selectedItems[i]);
                            }
                        }
                    }
                });
            });

            this.subscribe('Datacube.CubeNode.createSlice', function(sender, msg, slice){
                if(sender !== $this && slice.cube === $this._cube){
                    $this.addSlice(slice);
                }
            });

            this.subscribe('_jsb_diagramSelectionChanged', function(sender, msg, selectedItems){
                var keysCount = Object.keys(selectedItems).length;

                if(keysCount > 0){
                    removeBtn.removeClass('hidden');
                } else {
                    removeBtn.addClass('hidden');
                }

                if(keysCount === 0 || keysCount === 1 || keysCount > 2){
                    addAdvancedBtns.addClass('hidden');
                } else {
                    addAdvancedBtns.removeClass('hidden');
                }

                $this._selectedItems = selectedItems;
            });
	    },

	    addDataSource: function(entry, position){
	        this._cube.server().addSlice({
	            diagramOpts: {position: position},
                name: entry.getName(),
	            sources: [entry],
	            sourceType: '$provider'
	        }, function(slice, fail){
	            if(fail){
	                // todo: error
	                console.log('Error due create data source');
	                return;
	            }

                $this._slices[slice.getFullId()] = {
                    entry: slice,
                    node: $this.diagram.createNode('sliceDiagramNode', {entry: slice, editor: $this, position: position})
                };
	        });
	    },

		addSlice: function(slice, opts){
		    if(!slice){
				$this.getCube().server().addSlice(opts, function(sliceRes, fail){
				    if(fail){
				        // todo: error
				        console.log('Error due create slice');
				        return;
				    }

                    $this._slices[sliceRes.getFullId()] = {
                        entry: sliceRes,
                        node: $this.diagram.createNode('sliceDiagramNode', {entry: sliceRes, editor: $this})
                    };

                    $this.publish('Datacube.CubeNode.createSlice', sliceRes);
				});
		        return;
		    }

            $this.diagram.createNode('sliceDiagramNode', {entry: slice, editor: $this});
		},

	    constructCube: function(desc){
	        this._dimensions = desc.dimensions;
	        this._slices = {};

	        // create slices' nodes
	        for(var i in desc.slices){
	            this._slices[desc.slices[i].entry.getFullId()] = {
	                entry: desc.slices[i].entry,
	                node: this.diagram.createNode('sliceDiagramNode', {
	                    dimensions: desc.dimensions,
                        editor: this,
                        entry: desc.slices[i].entry,
                        position: desc.slices[i].diagramOpts && desc.slices[i].diagramOpts.position
                    })
	            };
	        }

	        this.options.layoutManager.ensureInitialize(function(){
                $this.options.layoutManager.getWidget('cubePanel').refresh($this.getCube(), desc);
	        });
	    },

	    createLink: function(linkType, linkOpts){
	        return this.diagram.createLink(linkType, linkOpts);
	    },

	    getCube: function(){
	        return this._cube;
	    },

	    getDimensions: function(){
	        return this._dimensions;
	    },

	    getSlice: function(id){
	        return this._slices[id];
	    },

	    getSlices: function(){
	        return this._slices;
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