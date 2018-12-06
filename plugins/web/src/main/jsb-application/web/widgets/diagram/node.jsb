{
	$name: 'JSB.Widgets.Diagram.Node',
	$parent: 'JSB.Widgets.Control',
	$require: {
		Connector: 'JSB.Widgets.Diagram.Connector'
	},
	
	$client: {
		connectors: {},
		diagram: null,
		dragHandles: {},
		resizeHandles: {},
		position: {x: 0, y: 0},
		options: {
			checkSize: true,
			userSelect: true
		},
		
		$constructor: function(diagram, key, opts){
			var self = this;
			this.diagram = diagram;
			this.key = key;
			$base();

			this.options = JSB().merge(this.options, this.diagram.nodeDescs[key].options, opts);

			this.addClass('_jsb_diagramNode');
			
			this.getElement().css({
				'position': 'absolute'
			});
			
			// install drag handles
			/*
			for(var dhKey in this.dragHandles){
				if(!JSB().isNull(this.dragHandles[dhKey].installed) && !this.dragHandles[dhKey].installed){
					this._installDragHandle(dhKey, this.dragHandles[dhKey]);
				}
			}
			*/
			// install connector
			for(var cKey in $this.connectors){
				if(!JSB().isNull($this.connectors[cKey].installed) && !$this.connectors[cKey].installed){
					$this.connectors[cKey].install();
				}
			}

			if(this.options.position){
			    this.setPosition(this.options.position, true);
			}
			
			if($this.options.checkSize){
				$this.getElement().on({
					resize: function(){
                        if(!$this.getElement().is(':visible')){
                            return;
                        }
                        $this.updateLinks();
                        $this.diagram.updateLayout($this);
					}
				});
			} else {
				$this.updateLinks();
				$this.diagram.updateLayout($this);
			}

			this.getElement().click(function(evt){
			    $this.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {
			        name: 'click',
			        event: evt,
			        handle: this
			    });
			});
		},

		createLink: function(){
		    //
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

		ensureInitialize: function(callback){
		    this.ensureTrigger('_initialized', callback);
		},

		getDiagram: function(){
		    return this.diagram;
		},

		getPosition: function(){
			return {x: this.position.x, y: this.position.y};
		},
		/*
		* types: 'drag', 'resize'
		*/
		installHandle: function(handleDesc){
		    if(!handleDesc.key || !handleDesc.type){
		        throw new Error('JSB.Widgets.DiagramNode: handle description must contains key & type fields.');
		    }

		    var selectors = handleDesc.selector;

			if(!JSB().isArray(selectors)){
				selectors = [selectors];
			}

			for(var i = 0; i < selectors.length; i++){
			    // set event handlers
			    selectors[i].on({
					click: function(evt){
					    $this.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'click', event: evt, handle: handleDesc});
					},

					mouseover: function(evt){
					    $this.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mouseover', event: evt, handle: handleDesc});
					},

					mouseout: function(evt){
					    $this.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mouseout', event: evt, handle: handleDesc});
					},

					mousedown: function(evt){
					    $this.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mousedown', event: evt, handle: handleDesc});
					},

					mouseup: function(evt){
					    $this.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mouseup', event: evt, handle: handleDesc});
					},

					mousemove: function(evt){
					    $this.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mousemove', event: evt, handle: handleDesc});
					},

					mousewheel: function(evt, delta){
					    $this.diagram.onMouseEvent($this, '_jsb_diagramMouseEvent', {name: 'mousewheel', event: evt, delta: delta, handle: handleDesc});
					}
			    })
			}
		},

		setInitialize: function(){
		    this.setTrigger('_initialized');

		    if(this.options.onCreate){
		        this.options.onCreate.call(this);
		    }
		},

		setPosition: function(position, hideEvent){
			var cellSize = this.diagram.getOption('cellSize');

			this.position.x = Math.round(position.x / cellSize) * cellSize;
			this.position.y = Math.round(position.y / cellSize) * cellSize;

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
		},
		/*****/
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
		
		select: function(bEnable, isUserSelect){
		    if(!this.options.userSelect && isUserSelect){
		        return;
		    }

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
	}
}