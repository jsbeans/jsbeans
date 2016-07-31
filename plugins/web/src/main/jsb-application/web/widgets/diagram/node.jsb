JSB({
	name: 'JSB.Widgets.Diagram.Node',
	parent: 'JSB.Widgets.Control',
	require: {
		'JSB.Widgets.Diagram.Connector': 'Connector'
	},
	
	client: {
		connectors: {},
		dragHandles: {},
		
		constructor: function(diagram, key, opts){
			var self = this;
			this.diagram = diagram;
			this.key = key;
			this.base();
			JSB().merge(this.options, this.diagram.nodeDescs[key].options, opts);
			this.addClass('_jsb_diagramNode');
			
			this.getElement().css({
				'position': 'absolute'
			});
			
			// install drag handles
			for(var dhKey in this.dragHandles){
				if(!JSB().isNull(this.dragHandles[dhKey].installed) && !this.dragHandles[dhKey].installed){
					this._installDragHandle(dhKey, this.dragHandles[dhKey]);
				}
			}
			
			// install connector
			for(var cKey in this.connectors){
				if(!JSB().isNull(this.connectors[cKey].installed) && !this.connectors[cKey].installed){
					this.connectors[cKey].install();
				}
			}

		},
		
		destroy: function(){
			if(this.diagram && this.diagram.hasNode(this)){
				this.diagram.removeNode(this);
				return;
			}
			
			// destroy connectors
			for(var cId in this.connectors){
				this.connectors[cId].destroy();
			}
			this.connectors = {};
			
			this.getSuperClass('JSB.Widgets.Control').destroy.call(this);
		},
		
		setPosition: function(x, y){
			if(JSB().isPlainObject(x)){
				y = x.y;
				x = x.x;
			}
			var cellSize = this.diagram.getOption('cellSize');
			this.getElement().css({
				'left': Math.round(x / cellSize) * cellSize,
				'top': Math.round(y / cellSize) * cellSize
			});
			
			this.updateLinks();
		},
		
		getPosition: function(){
			var sheetRc = this.diagram.sheet.get(0).getBoundingClientRect();
			var nodePos = this.getElement().get(0).getBoundingClientRect();
			return {x: (nodePos.left - sheetRc.left) / this.diagram.options.zoom, y: (nodePos.top - sheetRc.top) / this.diagram.options.zoom};
		},
		
		resolveSelector: function(sel, callback){
			var self = this;
			
			var selArr = sel;
			if(!JSB().isArray(selArr)){
				selArr = [sel];
			}
			
			JSB().chain(selArr, function(sel, c){
				if(JSB().isString(sel)){
					var elt = this.$(sel);
					if(elt.length > 0){
						c.call(self, elt);
					} else {
						JSB().deferUntil(function(){
							c.call(self, self.$(sel));
						}, function(){
							return self.$(sel).length > 0;
						});
					}
				} else if(sel instanceof self.$ || JSB().isBean(sel)){
					c.call(self, sel);
				} else {
					throw 'JSB.Widgets.DiagramNode.resolveSelector: Wrong selector passed: ' + JSON.stringify(sel);
				}
				
			}, function(res){
				if(JSB().isArray(sel)){
					callback.call(self, res);
				} else {
					callback.call(self, res[0]);
				}
			});
			
		},
/*		
		onAppend: function(){
			// install drag handles
			for(var dhKey in this.dragHandles){
				if(!JSB().isNull(this.dragHandles[dhKey].installed) && !this.dragHandles[dhKey].installed){
					this._installDragHandle(dhKey, this.dragHandles[dhKey]);
				}
			}
			
			// install connector
			for(var cKey in this.connectors){
				if(!JSB().isNull(this.connectors[cKey].installed) && !this.connectors[cKey].installed){
					this.connectors[cKey].install();
				}
			}
		},
*/		
		_installDragHandle: function(key, handleDesc){
			var self = this;
			if(handleDesc.installed){
				return;
			}
			if(!this.diagram){
				handleDesc.installed = false;
				return;
			}
/*			
			self.getElement().draggable({
				handle: handleDesc.selector,
				distance: self.diagram.getOption('cellSize'),
				grid: [self.diagram.getOption('cellSize'), self.diagram.getOption('cellSize')],

				start: function(evt, data){
					var bElt = data.helper;
					bElt.css('z-index', 10);
				},
				
				drag: function(evt, data){
					self.updateLinks();
				},
				
				stop: function(evt, data){
					var x = data.position.left;
					var y = data.position.top;

					self.setPosition(x, y);
					self.getElement().css({
						height: 'auto',
						width: 'auto'
					});
					self.updateLinks();
				}
			});
*/			
			var selector = handleDesc.selector;
			if(!JSB().isArray(selector)){
				selector = [selector];
			}
			for(var i = 0; i < selector.length; i++){
				selector[i].on({
					click: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'click', event: evt});
					},

					mouseover: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'mouseover', event: evt});
					},
					
					mouseout: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'mouseout', event: evt});
					},
					
					click: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'click', event: evt});
					},
					
					mousedown: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'mousedown', event: evt});
					},

					mouseup: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'mouseup', event: evt});
					},

					mousemove: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'mousemove', event: evt});
					},
					
					mousewheel: function(evt, delta){
						self.publish('_jsb_diagramMouseEvent', {name: 'mousewheel', event: evt, delta: delta});
					}
				});
			}
			
			handleDesc.installed = true;
		},
		
		installDragHandle: function(key, opts){
			var self = this;
			this.resolveSelector(opts.selector, function(sel){
				self.dragHandles[key] = {
					selector: sel
				};
				self._installDragHandle(key, self.dragHandles[key]);
			});
		},
		
		installConnector: function(cKey, opts){
			var self = this;
			
			var handle = opts.handle;
			var origin = opts.origin;
			if(!handle && origin){
				handle = origin;
			} else if(!origin && handle){
				origin = handle;
			}
			if(!origin || !handle){
				throw 'Invalid connector descriptor specified - either origin or handle should existed';
			}
			opts.origin = origin;
			opts.handle = handle;
			
			var connector = new self.Connector(this, cKey, opts);
			this.connectors[connector.getId()] = connector;
			
			return connector;
		},
		
		getLinks: function(){
			var lMap = {};
			for(var i in this.connectors){
				var cObj = this.connectors[i];
				JSB().merge(lMap, cObj.links);
			}
			return lMap;
		},
		
		updateLinks: function(){
			var links = this.getLinks();
			for(var i in links){
				links[i].redraw();
			}
		},
		
		select: function(bEnable){
			if(bEnable){
				if(!this.diagram.selectedNodes[this.getId()]){
					this.diagram.selectedNodes[this.getId()] = this;
					if(this.options.onSelect){
						this.options.onSelect.call(this, bEnable);
					}
				}
			} else {
				if(this.diagram.selectedNodes[this.getId()]){
					delete this.diagram.selectedNodes[this.getId()];
					if(this.options.onSelect){
						this.options.onSelect.call(this, bEnable);
					}
				}
			}
		},
		
		highlight: function(bEnable){
			if(bEnable){
				if(!this.diagram.highlightedNodes[this.getId()]){
					this.diagram.highlightedNodes[this.getId()] = this;
					if(this.options.onHighlight){
						this.options.onHighlight.call(this, bEnable);
					}
				}
			} else {
				if(this.diagram.highlightedNodes[this.getId()]){
					delete this.diagram.highlightedNodes[this.getId()];
					if(this.options.onHighlight){
						this.options.onHighlight.call(this, bEnable);
					}
				}
			}
		},
		
		isSelected: function(){
			if(this.diagram.selectedNodes[this.getId()]){
				return true;
			}
			return false;
		},
		
		isHighlighted: function(){
			if(this.diagram.highlightedNodes[this.getId()]){
				return true;
			}
			return false;
		}

		
	},
	
	server: {}
});