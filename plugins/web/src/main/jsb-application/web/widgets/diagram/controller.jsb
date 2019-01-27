{
	$name: 'JSB.Widgets.Diagram.Controller',
	
	$client: {
		diagram: null,
		wiringStartPt: null,
		wiringConnector: null,
		panStartPt: null,
		selectorToolPt: null,
		nodeMovePt: null,
		isSelecting: false,
		isNodeMoving: false,
		

		$constructor: function(d){
			var self = this;
			this.diagram = d;
			$base();
		},
		
		onMessage: function(sender, msg, params){
			switch(msg){
			case '_jsb_diagramMouseEvent':
				return this.handleMouseEvent(sender, params);
				break;
			default:
				throw 'Unexpected message: ' + msg;
			}
		},
		
		setCapture: function(){
			if(this.diagram.captureObj){
				return;
			}
			this.diagram.captureObj = {
				click: function(evt){
					$this.diagram.publish('_jsb_diagramMouseEvent', {name: 'click', event: evt});
				},

				mouseover: function(evt){
					$this.diagram.publish('_jsb_diagramMouseEvent', {name: 'mouseover', event: evt});
				},
				
				mouseout: function(evt){
					$this.diagram.publish('_jsb_diagramMouseEvent', {name: 'mouseout', event: evt});
				},
				
				click: function(evt){
					$this.diagram.publish('_jsb_diagramMouseEvent', {name: 'click', event: evt});
				},
				
				mousedown: function(evt){
					$this.diagram.publish('_jsb_diagramMouseEvent', {name: 'mousedown', event: evt});
				},

				mouseup: function(evt){
					$this.diagram.publish('_jsb_diagramMouseEvent', {name: 'mouseup', event: evt});
				},

				mousemove: function(evt){
					$this.diagram.publish('_jsb_diagramMouseEvent', {name: 'mousemove', event: evt});
				},
				
				mousewheel: function(evt, delta){
					$this.diagram.publish('_jsb_diagramMouseEvent', {name: 'mousewheel', event: evt, delta: delta});
				}
			};
			this.$(document).on(this.diagram.captureObj);
		},
		
		releaseCapture: function(){
			if(!this.diagram.captureObj){
				return;
			}
			this.$(document).off(this.diagram.captureObj);
			this.diagram.captureObj = null;
		},
		
		handleMouseEvent: function(sender, params){
			var self = this;
			switch(params.name){
			case 'click':
				if(this.preventClick){
					this.preventClick = false;
					params.event.stopPropagation();
					return;
				}
				if(sender == this.diagram && params.event.which == 1){
					if(params.event.ctrlKey || params.event.altKey){
						return;
					}
					var nodeMap = this.diagram.getNodesUnderCursor(this.diagram.pageToSheetCoords({x: params.event.pageX, y: params.event.pageY}));
					if(Object.keys(nodeMap).length === 0){
						this.select(this.diagram.nodes, false);	
						this.select(this.diagram.links, false);
					}
				} else if(JSB().isInstanceOf(sender, 'JSB.Widgets.Diagram.Connector') && params.event.which == 1) {
					params.event.stopPropagation();
				} else if(JSB().isInstanceOf(sender, 'JSB.Widgets.Diagram.Node') && params.event.which == 1){
					params.event.stopPropagation();
					if(params.event.altKey){
						if(sender.isSelected()){
							sender.select(false);
						}
						
					} else if(params.event.ctrlKey){
						// toggle
						sender.select(!sender.isSelected());
					} else {
						// select new
						sender.select(true);
						
						// remove old selected
						var rMap = {};
						for(var nodeId in this.diagram.nodes){
							var node = this.diagram.nodes[nodeId];
							if(node == sender){
								continue;
							}
							rMap[nodeId] = node;
						}
						this.select(rMap, false);
						this.select(this.diagram.links, false);
					}
				} else if(JSB().isInstanceOf(sender, 'JSB.Widgets.Diagram.Link') && params.event.which == 1){
					params.event.stopPropagation();
					if(params.event.altKey){
						if(sender.isSelected()){
							sender.select(false);
						}
						
					} else if(params.event.ctrlKey){
						// toggle
						sender.select(!sender.isSelected());
					} else {
						// select new
						sender.select(true);
						
						// remove old selected
						var rMap = {};
						for(var linkId in this.diagram.links){
							var link = this.diagram.links[linkId];
							if(link == sender){
								continue;
							}
							rMap[linkId] = link;
						}
						this.select(rMap, false);
						this.select(this.diagram.nodes, false);
					}
				}
				break;
			case 'mouseover':
				if(JSB().isInstanceOf(sender, 'JSB.Widgets.Diagram.Connector') && !this.isSelecting && !this.panStartPt){
					if(sender.isEnabled()){
						this.publish('_jsb_diagramConnectorUserHover', sender);
					}
				}
				break;
			case 'mouseout':
				if(JSB().isInstanceOf(sender, 'JSB.Widgets.Diagram.Connector') && !this.isSelecting && !this.panStartPt){
					if(sender.isEnabled()){
						this.publish('_jsb_diagramConnectorUserOut', sender);
					}
				}
				break;
			case 'mousedown':
				this.setCapture();
				if(JSB().isInstanceOf(sender, 'JSB.Widgets.Diagram.Connector') && params.event.which == 1){
					if(sender.isEnabled()){
						this.wiringStartPt = this.diagram.pageToSheetCoords({x: params.event.pageX, y: params.event.pageY});
						this.wiringConnector = sender;
						params.event.stopPropagation();
					}
				} else if(sender == this.diagram && params.event.which == 3){
					this.panStartPt = {x: params.event.pageX, y: params.event.pageY};
					this.diagram.addClass('panning');
					params.event.stopPropagation();
				} else if(sender == this.diagram && params.event.which == 1 && !self.isSelecting){
					var pt = self.diagram.pageToSheetCoords({x: params.event.pageX, y: params.event.pageY});
					self.selectorToolPt = {x: pt.x, y: pt.y};
					params.event.stopPropagation();
					
					// store select and highlight states
					this.lastSelectedStateMap = JSB().clone(this.diagram.getSelected());
				} else if(JSB().isInstanceOf(sender, 'JSB.Widgets.Diagram.Node') && params.event.which == 1 && !self.isNodeMoving && params.handle.type == 'drag'){
					var pt = self.diagram.pageToSheetCoords({x: params.event.pageX, y: params.event.pageY});
					self.nodeMovePt = {x: pt.x, y: pt.y};
					self.nodeMove = sender;
					params.event.stopPropagation();
				} else if(JSB().isInstanceOf(sender, 'JSB.Widgets.Diagram.Node') && params.event.which == 1 && !self.isNodeResizing && params.handle.type == 'resize'){
					var pt = self.diagram.pageToSheetCoords({x: params.event.pageX, y: params.event.pageY});
					self.nodeResizePt = {x: pt.x, y: pt.y};
					self.nodeResize = sender;
					self.nodeResizeHandle = params.handle;
					self.nodeRect = sender.getRect();
					self.isNodeResizing = true;
					params.event.stopPropagation();
				}
				break;
			case 'mouseup':
				this.releaseCapture();
				if(params.event.which == 1){
					this.nodeResizePt = null;
					this.wiringStartPt = null;
					this.wiringConnector = null;
					this.selectorToolPt = null;
					this.nodeMovePt = null;
					
					if(this.isSelecting){
						
						// remove all highlights
						this.highlight(this.diagram.nodes, false);
						this.highlight(this.diagram.links, false);
						var itemMap = self.diagram.getItemsUnderSelection();
						
						self.diagram.selectorTool.css({
							'display': 'none'
						});
						
						if(params.event.altKey){
							// subtract highlighted from current selection
							var rItemMap = {};
							for(var itemId in this.lastSelectedStateMap){
								var item = this.lastSelectedStateMap[itemId];
								if(itemMap[itemId]){
									rItemMap[itemId] = item;
								}
							}
							this.select(rItemMap, false);
							
						} else if(params.event.ctrlKey){
							// append highlighted to current selection
							this.select(itemMap, true);
						} else {
							// select new
							this.select(itemMap, true);
							
							// remove old selected
							var rItemMap = {};
							for(var nodeId in this.diagram.nodes){
								var node = this.diagram.nodes[nodeId];
								if(itemMap[nodeId]){
									continue;
								}
								rItemMap[nodeId] = node;
							}
							for(var linkId in this.diagram.links){
								var link = this.diagram.links[linkId];
								if(itemMap[linkId]){
									continue;
								}
								rItemMap[linkId] = link;
							}
							this.select(rItemMap, false);
							
						}
						this.isSelecting = false;
						this.selectorToolPt = null;
						this.preventClick = true;
						params.event.stopPropagation();
					}
					
					if(this.isNodeMoving){
						this.isNodeMoving = false;
						this.diagram.options.autoLayout = this.storedAutoLayoutEnabled;
						this.nodeMovePt = null;
						this.preventClick = true;
						params.event.stopPropagation();
						this.diagram.updateLayout(this.diagram.getSelected());
					}
					
					if(this.isNodeResizing){
						this.isNodeResizing = false;
					}
					
				} else if(params.event.which == 3){
					this.panStartPt = null;
					this.diagram.removeClass('panning');
				}
				break;
			case 'mousemove':
				if(this.wiringStartPt){
//					params.event.stopPropagation();
					var curPt = this.diagram.pageToSheetCoords({x: params.event.pageX, y: params.event.pageY});
					if(Math.abs(curPt.x - this.wiringStartPt.x) > this.diagram.getOption('cellSize')
						|| Math.abs(curPt.y - this.wiringStartPt.y) > this.diagram.getOption('cellSize')){
						// change controller to wiring
						this.diagram.pushController('wiring');
						this.diagram.getCurrentController().enter(this.wiringConnector, curPt);
						this.wiringStartPt = null;
						this.wiringConnector = null;
					}
				}
				if(this.panStartPt){
//					params.event.stopPropagation();
					var curPt = {x: params.event.pageX, y: params.event.pageY};
					var offset = {x: curPt.x - this.panStartPt.x, y: curPt.y - this.panStartPt.y};
					this.panStartPt = curPt;
					var panPt = this.diagram.getPan();
					this.diagram.setPan({x: panPt.x + offset.x / this.diagram.getOption('zoom'), y: panPt.y + offset.y / this.diagram.getOption('zoom')});
				}
				if(this.isSelecting || this.selectorToolPt){
					
					var pt = self.diagram.pageToSheetCoords({x:params.event.pageX, y:params.event.pageY});
					
					if(Math.abs(pt.x - this.selectorToolPt.x) < this.diagram.getOption('cellSize')
							&& Math.abs(pt.y - this.selectorToolPt.y) < this.diagram.getOption('cellSize')){
						return;
					}
					this.isSelecting = true;
					var minPt = {x: Math.min(pt.x, self.selectorToolPt.x), y: Math.min(pt.y, self.selectorToolPt.y)};
					var maxPt = {x: Math.max(pt.x, self.selectorToolPt.x), y: Math.max(pt.y, self.selectorToolPt.y)};
					self.diagram.selectorTool.css({
						'display': 'block',
						left: minPt.x,
						top: minPt.y,
						width: maxPt.x - minPt.x,
						height: maxPt.y - minPt.y
					});
					
					if(self.diagram.options.highlightSelecting){
						var itemMap = self.diagram.getItemsUnderSelection();
						
						// highlight new
						this.highlight(itemMap, true);
						
						// remove highlight old
						var rItemMap = {};
						for(var nodeId in this.diagram.nodes){
							var node = this.diagram.nodes[nodeId];
							if(itemMap[nodeId]){
								continue;
							}
							rItemMap[nodeId] = node;
						}
						for(var linkId in this.diagram.links){
							var link = this.diagram.links[linkId];
							if(itemMap[linkId]){
								continue;
							}
							rItemMap[linkId] = link;
						}
						this.highlight(rItemMap, false);
					}
				}
				
				if(this.nodeMovePt || this.isNodeMoving){
					var pt = self.diagram.pageToSheetCoords({x:params.event.pageX, y:params.event.pageY});
					if(!this.isNodeMoving && Math.abs(pt.x - this.nodeMovePt.x) < this.diagram.getOption('cellSize')
							&& Math.abs(pt.y - this.nodeMovePt.y) < this.diagram.getOption('cellSize')){
						return;
					}
					var sMap = this.diagram.getSelected();
					var selMap = {};
					// filter nodes
					for(var i in sMap){
						if(JSB().isInstanceOf(sMap[i], 'JSB.Widgets.Diagram.Node')){
							if(sMap[i].options && sMap[i].options.fixed){
								continue;
							}
							selMap[i] = sMap[i];
						}
					}
					if(!this.isNodeMoving){
						this.isNodeMoving = true;
						this.storedAutoLayoutEnabled = this.diagram.options.autoLayout;
						this.diagram.options.autoLayout = false;
						if(!selMap[self.nodeMove.getId()]){
							this.select(this.diagram.nodes, false);
							this.select(this.diagram.links, false);
							self.nodeMove.select(true);
							selMap = {};
							selMap[self.nodeMove.getId()] = self.nodeMove;
						}
						// store positions
						this.storedPositions = {};
						for(var nodeId in selMap){
							var node = selMap[nodeId];
							this.storedPositions[nodeId] = node.getPosition();
						}
					}
					
					// move selected
					var offset = {x: pt.x - this.nodeMovePt.x, y: pt.y - this.nodeMovePt.y};
					for(var nodeId in selMap){
						var node = selMap[nodeId];
						node.setPosition({x: this.storedPositions[nodeId].x + offset.x, y: this.storedPositions[nodeId].y + offset.y});
					}
				}
				
				if(this.isNodeResizing){
					var pt = self.diagram.pageToSheetCoords({x:params.event.pageX, y:params.event.pageY});
					
					// generate diff
					var diff = {x: pt.x - this.nodeResizePt.x, y: pt.y - this.nodeResizePt.y};
					var nodeRect = JSB.clone(this.nodeRect);
					
					if(this.nodeResizeHandle.resize.top){
						nodeRect.y += diff.y;
						nodeRect.h -= diff.y;
					}

					if(this.nodeResizeHandle.resize.bottom){
						nodeRect.h += diff.y;
					}

					if(this.nodeResizeHandle.resize.left){
						nodeRect.x += diff.x;
						nodeRect.w -= diff.x;
					}

					if(this.nodeResizeHandle.resize.right){
						nodeRect.w += diff.x;
					}

					this.nodeResize.setRect(nodeRect);
				}
				
				break;
			case 'mousewheel':
				var currentZoom = this.diagram.getZoom();
				currentZoom += /*Math.exp(currentZoom) */ params.delta * this.diagram.getOption('zoomStep') * currentZoom;
				this.diagram.setZoom(currentZoom);
				break;
			}
		},
		
		highlight: function(objMap, bEnable){
			for(var objId in objMap){
				var obj = objMap[objId];
				obj.highlight(bEnable);
			}
		},
		
		select: function(objMap, bEnable){
			for(var objId in objMap){
				var obj = objMap[objId];
				obj.select(bEnable);
			}
		}
		

	}
}