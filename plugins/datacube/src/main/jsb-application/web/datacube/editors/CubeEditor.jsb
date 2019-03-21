{
	$name: 'DataCube.CubeEditor',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['JSB.Controls.SearchBox',
	               'JSB.Widgets.Diagram',
	               'JSB.Widgets.ToolManager',
	               'DataCube.Dialogs.JoinSettingsTool',
	               'DataCube.Dialogs.AddProviderTool',
	               'DataCube.SliceDiagramNode',
					'css:CubeEditor.css'],

	    _cube: null,
	    _dimensions: {},
	    _nodes: {},
	    _slices: {},

	    _selectedItems: {},

	    $constructor: function(opts){
			$base(opts);

			this.addClass('cubeEditor');

			var linkOpts = {
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
                    source: {
                        shape: 'arrow',
                        offset: 3,
                        strip: 6
                    }
                },
                userSelect: false
			};
			
			var fromLink = JSB.merge({}, linkOpts, {});
			var joinLink = JSB.merge({}, linkOpts, {
				heads: {
					source: {
                        shape: 'diamond',
                        offset: 3,
                        strip: 6
                    }
				}
			});
			var unionLink = JSB.merge({}, linkOpts, {
				heads: {
					source: {
                        shape: 'pentagon',
                        offset: 3,
                        strip: 6
                    }
				}
			});

			// create diagram
			this.diagram = new Diagram({
				minZoom: 0.25,
				highlightSelecting: false,
				onInit: function(){
				    $this.setTrigger('diagramReady');
				},
				onPositionChanged: function(type, changes){
				    if($this.getCube()){
				        $this.getCube().server().updateDiagramPosition(changes);
				    }
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
				    $from: fromLink,
					$join: joinLink,
					$union: unionLink,
					$recursive: linkOpts
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
                            if(JSB.isInstanceOf(entry, 'DataCube.Model.QueryableEntry')){
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
                        ToolManager.activate({
                            id: 'addProviderTool',
                            cmd: 'show',
                            data: {
                                tableEntry: d.get(0).draggingItems[i].obj.getTargetEntry()
                            },
                            target: {
                                selector: $this.getElement()
                            },
                            callback: function(selectedFields){
                                $this.addDataSource(d.get(0).draggingItems[i].obj.getTargetEntry(), selectedFields, $this.diagram.pageToSheetCoords({x: ui.offset.left, y: ui.offset.top}));
                            }
                        });
                        break;
                    }
                }
            });

            // search
            var searchBox = new SearchBox({
                useFA: true,
                onChange: function(val){
                    $this.publish('DataCube.CubeEditor.search', val);
                },
                onClose: function(){
                    $this.publish('DataCube.CubeEditor.search');
                }
            });
            this.append(searchBox);

            // create add buttons
            var addBtn = this.$('<div class="addBtn fas fa-plus"></div>');
            this.append(addBtn);

            var addAdvancedBtns = this.$('<ul></ul>');
            addBtn.append(addAdvancedBtns);

            var joinBtn = this.$('<li key="$join" class="joinIcon excess"><div class="tooltip">Join</div></li>');
            addAdvancedBtns.append(joinBtn);

            var unionBtn = this.$('<li key="$union" class="unionIcon excess"><div class="tooltip">Union</div></li>');
            addAdvancedBtns.append(unionBtn);

            var fromBtn = this.$('<li key="$from" class="fromIcon excess"><div class="tooltip">From</div></li>');
            addAdvancedBtns.append(fromBtn);

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
                        data: {
                            cubeSlices: $this.getSlices(),
                            sources: sources
                        },
                        target: {
                            selector: $this.getElement()
                        },
                        callback: function(sourceOpts){
                            $this.addSlice(null, {
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

                $this.addSlice();
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
                if(sender !== $this && slice.cube === $this.getCube()){
                    $this.addSlice(slice);
                }
            });

            this.subscribe('DataCube.CubeEditor.toggleDimension', function(sender, msg, desc){
                if(desc.isDimension){
                    $this._dimensions[desc.field] = true;
                } else {
                    delete $this._dimensions[desc.field];
                }
            });

            this.subscribe('_jsb_diagramSelectionChanged', function(sender, msg, selectedItems){
                var keysCount = Object.keys(selectedItems).length;

                // excess - мало
                // flaw - много
                switch(keysCount){
                    case 0:
                        addAdvancedBtns.children().removeClass('flaw').addClass('excess');
                        break;
                    case 1:
                        fromBtn.removeClass('flaw excess');
                        joinBtn.removeClass('flaw').addClass('excess');
                        unionBtn.removeClass('flaw').addClass('excess');
                        break;
                    case 2:
                        fromBtn.removeClass('excess').addClass('flaw');
                        joinBtn.removeClass('flaw excess');
                        unionBtn.removeClass('flaw excess');
                        break;
                    default:
                        fromBtn.removeClass('excess').addClass('flaw');
                        joinBtn.removeClass('excess').addClass('flaw');
                        unionBtn.removeClass('flaw excess');
                        break;
                }

                if(keysCount > 0){
                    removeBtn.removeClass('hidden');
                } else {
                    removeBtn.addClass('hidden');
                }

                $this._selectedItems = selectedItems;
            });

			this.subscribe('DataCube.CubeEditor.sliceNodeSelected', function(sender, msg, obj){
                $this.options.layoutManager.ensureInitialize(function(){
                    $this.options.layoutManager.getWidget('grid').refresh(obj.entry);
                });
			});

			this.subscribe('DataCube.CubeEditor.sliceNodeDeselected', function(sender, msg, obj){
                $this.options.layoutManager.ensureInitialize(function(){
                    $this.options.layoutManager.getWidget('grid').clear();
                });
			});

            this.subscribe('DataCube.Model.Slice.remove', {session: true}, function(sender, msg, desc){
                if($this.getCube().getFullId() !== desc.cubeFullId){
                    return;
                }

                if($this._slices[desc.fullId]){
                    delete $this._slices[desc.fullId];
                }

                if($this._nodes[desc.fullId]){
                    $this._nodes[desc.fullId].destroy();
                }
            });
	    },

	    addDataSource: function(entry, selectedFields, position){
	        this.getCube().server().addSlice({
	            diagramOpts: {position: position},
                name: entry.getName(),
                selectedFields: selectedFields,
	            sources: [entry],
	            sourceType: '$provider'
	        }, function(slice, fail){
	            if(fail){
	                // todo: error
	                console.log('Error due create data source');
	                return;
	            }

                $this._slices[slice.getFullId()] = slice;
                $this._nodes[slice.getFullId()] = $this.diagram.createNode('sliceDiagramNode', {entry: slice, editor: $this, position: position});

                $this.publish('Datacube.CubeNode.createSlice', slice);
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

				    $this._slices[sliceRes.getFullId()] = sliceRes;
				    $this._nodes[sliceRes.getFullId()] = $this.diagram.createNode('sliceDiagramNode', {entry: sliceRes, editor: $this});

                    $this.publish('Datacube.CubeNode.createSlice', sliceRes);
				});
		        return;
		    }

            $this.diagram.createNode('sliceDiagramNode', {entry: slice, editor: $this});
		},

	    constructCube: function(desc){
	        this._cubeFields = desc.fieldsMap;
	        this._dimensions = desc.dimensions;
	        this._slices = {};
	        this._nodes = {};

	        // create slices' nodes
	        for(var i in desc.slices){
	            this._slices[desc.slices[i].entry.getFullId()] = desc.slices[i].entry;

                this._nodes[desc.slices[i].entry.getFullId()] = this.diagram.createNode('sliceDiagramNode', {
                    dimensions: desc.dimensions,
                    editor: this,
                    entry: desc.slices[i].entry,
                    position: desc.slices[i].diagramOpts && desc.slices[i].diagramOpts.position
                });
	        }

	        this.diagram.setPan(desc.diagramOpts.position);
	        this.diagram.setZoom(desc.diagramOpts.zoom);

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

	    getCubeFields: function(){
	        return this._cubeFields;
	    },

	    getDimensions: function(){
	        return this._dimensions;
	    },

	    getSliceNode: function(id){
	        return this._nodes[id];
	    },

	    getSlices: function(){
	        return this._slices;
	    },

	    refresh: function(entry){
			if(this.getCube() == entry){
				return;
			}

			this._cube = entry;
			this.diagram.clear();

			this.getCube().server().load(true, function(desc){
			    $this.ensureTrigger(['diagramReady'], function(){
			        $this.constructCube(desc);
			    });
			});
	    }
	}
}