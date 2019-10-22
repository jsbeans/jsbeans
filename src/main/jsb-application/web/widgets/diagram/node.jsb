/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Widgets.Diagram.Node',
	$parent: 'JSB.Widgets.Control',
	$require: {
		Connector: 'JSB.Widgets.Diagram.Connector'
	},
	
	$client: {
		_connectors: {},
		dragHandles: {},
		resizeHandles: {},
		selectHandles: {},
		handles: {},
		position: {x: 0, y: 0},
		options: {
			checkSize: true,
			
			onPositionChanged: function(){},
			onSizeChanged: function(){},
			onCreate: function(){},
			onSelect: function(){},
			onHighlight: function(){}
		},
		
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
			
			if(this.options.position){
			    this.setPosition(this.options.position, true);
			}

			if(this.options.size) {
			    this.setSize(this.options.size);
			}
			
			// install drag handles
			for(var dhKey in this.dragHandles){
				if(!JSB().isNull(this.dragHandles[dhKey].installed) && !this.dragHandles[dhKey].installed){
					this._installDragHandle(dhKey, this.dragHandles[dhKey]);
				}
			}
			
			// install connector
			for(var cKey in $this._connectors){
				if(!JSB().isNull($this._connectors[cKey].installed) && !$this._connectors[cKey].installed){
					$this._connectors[cKey].install();
				}
			}
			
			var resizeProc = function(){
				if(!$this.getElement().is(':visible')){
					return;
				}
				$this.updateConnectors();
				$this.updateLinks();
				$this.diagram.updateLayout($this);
				if($this.options.onSizeChanged){
					$this.options.onSizeChanged.call($this, $this.getRect());
				}
			};
			
			if($this.options.checkSize){
				$this.getElement().on({
					resize: resizeProc
				});
			} else {
				$this.updateLinks();
				$this.diagram.updateLayout($this);
			}
		},
		
		_setInitialized: function(){
		    this.setTrigger('_initialized');

		    if(this.options.onCreate){
		        this.options.onCreate.call(this);
		    }
		},
		
		ensureInitialized: function(callback){
		    this.ensureTrigger('_initialized', callback);
		},
		
		destroy: function(){
			if(this.diagram && this.diagram.hasNode(this)){
				this.diagram.removeNode(this);
				return;
			}
			
			// destroy connectors
			for(var cId in this._connectors){
				this._connectors[cId].destroy();
			}
			this._connectors = {};
			
			$base();
		},
		
		setPosition: function(x, y, hideEvent){
			if(JSB().isObject(x)){
				hideEvent = y;
				y = x.y;
				x = x.x;
			}
			var cellSize = this.diagram.getOption('cellSize');
			this.position.x = Math.round(x / cellSize) * cellSize;
			this.position.y = Math.round(y / cellSize) * cellSize;
			this.getElement().css({
				'left': this.position.x,
				'top': this.position.y,
				'position': 'absolute'
			});
			
			this.updateLinks();
			this.diagram.updateLayout(this);
			if(this.options.onPositionChanged && !hideEvent){
				this.options.onPositionChanged.call(this, this.position.x, this.position.y);
			}
//			console.log('setPosition X:' + this.position.x + '; Y:' + this.position.y);
		},

		setSize: function(size) {
		    var element = this.getElement();

		    if(JSB.isDefined(size.width)) {
		        element.width(size.width);
            }

		    if(JSB.isDefined(size.height)) {
		        element.height(size.height);
            }
		},

		isFixed: function(){
			return this.options.fixed;
		},
		
		getPosition: function(){
			if(this.isFixed()){
				var sheetRc = this.diagram.sheetRc;//.get(0).getBoundingClientRect();
				var nodePos = this.getElement().get(0).getBoundingClientRect();
				var x = (nodePos.left - sheetRc.left) / this.diagram.options.zoom;
				var y = (nodePos.top - sheetRc.top) / this.diagram.options.zoom;
				return {x: x, y: y};
			}
/*			var sheetRc = this.diagram.sheetRc;//.get(0).getBoundingClientRect();
			var nodePos = this.getElement().get(0).getBoundingClientRect();
			var x = (nodePos.left - sheetRc.left) / this.diagram.options.zoom;
			var y = (nodePos.top - sheetRc.top) / this.diagram.options.zoom;
			console.log('getPosition X:' + x + '; Y:' + y + '; oX:' + this.position.x + '; oY:' + this.position.y);
*/			
			return {x: this.position.x, y: this.position.y};
		},
		
		setRect: function(r){
			var curR = this.getRect();
			var cssObj = {};
			if(r.x != curR.x){
				this.position.x = cssObj.left = r.x;
			}
			if(r.y != curR.y){
				this.position.y = cssObj.top = r.y;
			}
			if(r.w != curR.w){
				cssObj.width = r.w;
			}
			if(r.h != curR.h){
				cssObj.height = r.h;
			}
			this.getElement().css(cssObj);
			
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
			for(var cKey in this._connectors){
				if(!JSB().isNull(this._connectors[cKey].installed) && !this._connectors[cKey].installed){
					this._connectors[cKey].install();
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
		
		installHandle: function(hDesc){
			this.resolveSelector(hDesc.selector, function(sel){
				$this.handles[hDesc.key] = hDesc;
				$this.handles[hDesc.key].selector = sel;
				$this._installHandle(hDesc.key, $this.handles[hDesc.key]);
			});
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
		
		installSelectHandle: function(key, opts){
			this.resolveSelector(opts.selector, function(sel){
				$this.selectHandles[key] = JSB.merge({}, opts,{
					selector: sel,
					key: key,
					type: 'select'
				});
				$this._installHandle(key, $this.selectHandles[key]);
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
				throw new Error('Invalid connector descriptor specified - either origin or handle should existed');
			}
			opts.origin = origin;
			opts.handle = handle;
			
			var connectorClass = this.diagram.connectorDescs[cKey].connectorClass;
			if(!connectorClass){
				connectorClass = Connector;
			}
			
			var connector = new connectorClass(this, cKey, opts);
			this._connectors[connector.getId()] = connector;
			
			return connector;
		},
		
		removeConnector: function(conn){
			if(JSB.isString(conn)){
				conn = this._connectors[conn];
			}
			delete this._connectors[conn.getId()];
			conn.destroy();
		},
		
		getConnectors: function(cKey){
			var cMap = {};
			for(var cId in this._connectors){
				var conn = this._connectors[cId];
				if(!cKey || conn.key == cKey){
					cMap[cId] = conn;
				}
			}
			
			return cMap;
		},
		
		getLinks: function(){
			var lMap = {};
			for(var i in this._connectors){
				var cObj = this._connectors[i];
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
		
		updateConnectors: function(){
			var conns = this.getConnectors();
			for(var cId in conns){
				conns[cId].updateOrigin();
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
		},

		getDiagram: function() {
		    return this.diagram;
		}
	}
}