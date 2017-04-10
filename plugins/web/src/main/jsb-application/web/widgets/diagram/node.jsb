{
	$name: 'JSB.Widgets.Diagram.Node',
	$parent: 'JSB.Widgets.Control',
	$require: {
		Connector: 'JSB.Widgets.Diagram.Connector'
	},
	
	$client: {
		connectors: {},
		dragHandles: {},
		resizeHandles: {},
		
		$constructor: function(diagram, key, opts){
			var self = this;
			this.diagram = diagram;
			this.key = key;
			$base();
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
			
			this.getElement().resize(function(){
				self.updateLinks();
				self.diagram.updateLayout(self);
			});
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
			
			$base();
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
			this.diagram.updateLayout(this);
		},
		
		getPosition: function(){
			var sheetRc = this.diagram.sheet.get(0).getBoundingClientRect();
			var nodePos = this.getElement().get(0).getBoundingClientRect();
			return {x: (nodePos.left - sheetRc.left) / this.diagram.options.zoom, y: (nodePos.top - sheetRc.top) / this.diagram.options.zoom};
		},
		
		setRect: function(r){
			this.getElement().css({
				'left': r.x,
				'top': r.y,
				'width': r.w,
				'height': r.h
			});
			
			this.updateLinks();
			this.diagram.updateLayout(this);
		},
		
		getRect: function(){
			var sheetRc = this.diagram.sheet.get(0).getBoundingClientRect();
			var nodePos = this.getElement().get(0).getBoundingClientRect();
			return {x: (nodePos.left - sheetRc.left) / this.diagram.options.zoom, y: (nodePos.top - sheetRc.top) / this.diagram.options.zoom, w: nodePos.width / this.diagram.options.zoom, h: nodePos.height / this.diagram.options.zoom};
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
		_installHandle: function(key, handleDesc){
			var self = this;
			if(handleDesc.installed){
				return;
			}
			if(!this.diagram){
				handleDesc.installed = false;
				return;
			}
			var selector = handleDesc.selector;
			if(!JSB().isArray(selector)){
				selector = [selector];
			}
			for(var i = 0; i < selector.length; i++){
				selector[i].on({
					click: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'click', event: evt, handle: handleDesc});
					},

					mouseover: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'mouseover', event: evt, handle: handleDesc});
					},
					
					mouseout: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'mouseout', event: evt, handle: handleDesc});
					},
					
					mousedown: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'mousedown', event: evt, handle: handleDesc});
					},

					mouseup: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'mouseup', event: evt, handle: handleDesc});
					},

					mousemove: function(evt){
						self.publish('_jsb_diagramMouseEvent', {name: 'mousemove', event: evt, handle: handleDesc});
					},
					
					mousewheel: function(evt, delta){
						self.publish('_jsb_diagramMouseEvent', {name: 'mousewheel', event: evt, delta: delta, handle: handleDesc});
					}
				});
			}
			
			handleDesc.installed = true;
		},
		
		installDragHandle: function(key, opts){
			var self = this;
			this.resolveSelector(opts.selector, function(sel){
				self.dragHandles[key] = JSB.merge({}, opts, {
					selector: sel,
					key: key,
					type: 'drag'
				});
				self._installHandle(key, self.dragHandles[key]);
			});
		},
		
		installResizeHandle: function(key, opts){
			var self = this;
			this.resolveSelector(opts.selector, function(sel){
				self.resizeHandles[key] = JSB.merge({}, opts,{
					selector: sel,
					key: key,
					type: 'resize'
				});
				self._installHandle(key, self.resizeHandles[key]);
			});

		},
		
		installConnector: function(cKey, opts){
			var self = this;
			
			var handle = opts.handle;
			var origin = opts.origin;
			if(!origin && handle){
				origin = handle;
			}
			if(!origin){
				throw 'Invalid connector descriptor specified - either origin or handle should existed';
			}
			opts.origin = origin;
			opts.handle = handle;
			
			var connectorClass = this.diagram.connectorDescs[cKey].connectorClass;
			if(!connectorClass){
				connectorClass = Connector;
			}
			
			var connector = new connectorClass(this, cKey, opts);
			this.connectors[connector.getId()] = connector;
			
			return connector;
		},
		
		removeConnector: function(conn){
			if(JSB.isString(conn)){
				conn = this.connectors[conn];
			}
			delete this.connectors[conn.getId()];
			conn.destroy();
		},
		
		getConnectors: function(cKey){
			var cMap = {};
			for(var cId in this.connectors){
				var conn = this.connectors[cId];
				if(!cKey || conn.key == cKey){
					cMap[cId] = conn;
				}
			}
			
			return cMap;
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
				if(!this.diagram.selected[this.getId()]){
					this.diagram.selected[this.getId()] = this;
					if(this.options.onSelect){
						this.options.onSelect.call(this, bEnable);
					}
					this.notifyUpdateSelected();
				}
			} else {
				if(this.diagram.selected[this.getId()]){
					delete this.diagram.selected[this.getId()];
					if(this.options.onSelect){
						this.options.onSelect.call(this, bEnable);
					}
					this.notifyUpdateSelected();
				}
			}
		},
		
		notifyUpdateSelected: function(){
			var self = this;
			JSB().defer(function(){
				self.diagram.publish('_jsb_diagramSelectionChanged', self.diagram.getSelected());
			}, 100, '_jsb_notifyUpdateSelected');
		},
		
		highlight: function(bEnable){
			if(bEnable){
				if(!this.diagram.highlighted[this.getId()]){
					this.diagram.highlighted[this.getId()] = this;
					if(this.options.onHighlight){
						this.options.onHighlight.call(this, bEnable);
					}
					this.notifyUpdateHighlighted();
				}
			} else {
				if(this.diagram.highlighted[this.getId()]){
					delete this.diagram.highlighted[this.getId()];
					if(this.options.onHighlight){
						this.options.onHighlight.call(this, bEnable);
					}
					this.notifyUpdateHighlighted();
				}
			}
		},
		
		notifyUpdateHighlighted: function(){
			var self = this;
			JSB().defer(function(){
				self.diagram.publish('_jsb_diagramHighlightChanged', self.diagram.getHighlighted());
			}, 100, '_jsb_notifyUpdateHighlighted');
		},

		
		isSelected: function(){
			if(this.diagram.selected[this.getId()]){
				return true;
			}
			return false;
		},
		
		isHighlighted: function(){
			if(this.diagram.highlighted[this.getId()]){
				return true;
			}
			return false;
		}
	},
	
	$server: {}
}