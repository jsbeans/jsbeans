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
	$name: 'JSB.Widgets.Diagram',
	$parent: 'JSB.Widgets.Widget',
	$require: {
		UiEffects: 'jQuery.UI.Effects',
		Node: 'JSB.Widgets.Diagram.Node',
		Link: 'JSB.Widgets.Diagram.Link',
		Connector: 'JSB.Widgets.Diagram.Connector',
		Controller: 'JSB.Widgets.Diagram.Controller',
		WiringController: 'JSB.Widgets.Diagram.WiringController',
		LayoutManager: 'JSB.Widgets.Diagram.LayoutManager',
		DefaultLayoutManager: 'JSB.Widgets.Diagram.DefaultLayoutManager',
		D3: 'D3',
		css: 'css:diagram.css'
	},
	
	$client: {
		connectorDescs: {},
		linkDescs: {},
		nodeDescs: {},
		shapeDescs: {},
		
		layoutManagers: {},
		
		controllers: {},
		controllerStack: [],
		selected: {},
		highlighted: {},
		
		nodes: {},
		links: {},
		fixedLinks: {},
		sheetRc: null,
		
		options: {
			zoom: 1,
			zoomStep: 0.1,
			minZoom: 0.1,
			maxZoom: 1,
			panX: 0,
			panY: 0,
			cellSize: 10,
			autoLayout: true,
			highlightSelecting: false,	// highlight elements while selecting
			background: null,

			links: {
				'_jsb_diagramUserWiringLink': {
					
				}
			},
			layouts: {
				'default': {
					jsb: 'JSB.Widgets.Diagram.DefaultLayoutManager'
				}
			},
			
			// event handlers
			onInit: function(){},
			onChange: function(){},
			onCreate: function(item){},
			onRemove: function(item){},
			onSelectionChanged: function(selected){},
			onPositionChanged: function(type, pt){}
		},
		
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('_jsb_diagram');
			
			this.Joint = function(link, opts){
				this.link = link;
				this.options = {};
				JSB.merge(true, this.options, opts);
			};
			
			this.Joint.prototype = {
				getLink: function(){
					return this.link;
				},
		
				getPosition: function(){
					if(!this.options.position){
						return null;
					}
					if(JSB.isFunction(this.options.position)){
						return this.options.position.call(this);
					} else if(JSB.isObject(this.options.position)){
						if(!JSB.isDefined(this.options.position.x) || !JSB.isDefined(this.options.position.y)){
							throw new Error('Missing joint position');
						}
						return this.options.position;
					}
				}
			};

/*			
			JSB().loadScript('tpl/d3/d3.min.js', function(){
				$this.init();
			});
*/			
			$this.init();
			
		},
		
		init: function(){
			var self = this;
			
			var elt = this.getElement();
			this.canvas = self.$('<div class="_jsb_diagramCanvas"></div>');
			elt.append(this.canvas);
			this.svg = d3.select(this.canvas.get(0)).append('svg')
			    .attr('width', elt.width())
			    .attr('height', elt.height());
			
			this.defs = this.svg.append('defs');
			    
			self.sheet = self.$('<div class="_jsb_diagramSheet"></div>');
			this.canvas.append(self.sheet);
			$this.sheetRc = self.sheet.get(0).getBoundingClientRect();
			
			self.toolContainer = self.$('<div class="_jsb_diagramToolContainer"></div>');
			elt.prepend(self.toolContainer);

			self.grid = self.$('<div class="_jsb_diagramGrid"></div>');
			if(this.options.background){
			    self.grid.css({
			        'background': this.options.background
			    });
			}
			self.grid.css({
				'position': 'absolute'
			});
			self.toolContainer.append(self.grid);
			
			this.selectorTool = this.$('<div class="_jsb_diagramSelectorTool"></div>');
			self.toolContainer.append(this.selectorTool);
			this.selectorTool.css({
				'position': 'absolute',
				'display': 'none'
			});
			
			
			// setup controllers
			this.controllers.normal = new Controller(this);
			this.controllers.wiring = new WiringController(this);
			
			this.subscribe('_jsb_diagramMouseEvent', function(sender, msg, params){
				// check sender
				var owning = false;
				if(JSB.isInstanceOf(sender, 'JSB.Widgets.Diagram')){
					if(sender == $this){
						owning = true;
					}
				} else if(JSB.isInstanceOf(sender, 'JSB.Widgets.Diagram.Node') || JSB.isInstanceOf(sender, 'JSB.Widgets.Diagram.Link')){
					if(sender.diagram == $this){
						owning = true;
					}
				} else if(JSB.isInstanceOf(sender, 'JSB.Widgets.Diagram.Connector')){
					if(sender.getNode().diagram == $this){
						owning = true;
					}
				}
				
				if(!owning){
					return;
				}
				for(var i = self.controllerStack.length - 1; i >= 0; i--){
					var res = self.controllerStack[i].onMessage(sender, msg, params);
					if(res){
						return;
					}
				}
				self.controllers.normal.onMessage(sender, msg, params);
			});
			
			// register predefined shapes
			this.registerShape('arrow', function(){
				return this.defs.append('path')
					.attr('d', 'M-20,-10 L0,0 L-20,10');
			});

			this.registerShape('arrowTriangle', function(){
				return this.defs.append('path')
					.attr('d', 'M0,0 L-20,-10 L-20,10 z');
			});
			
			this.registerShape('arrowSharp', function(){
				return this.defs.append('path')
					.attr('d', 'M0,0 L-20,-10 L-15,0 L-20,10 z');
			});
			
			this.registerShape('circle', function(){
				return this.defs.append('circle')
					.attr('r', '5');
			});
			
			this.registerShape('diamond', function(){
				return this.defs.append('path')
					.attr('d', 'M0,0 L-20,-10 L-40,0 L-20,10 z');
			});
			
			this.registerShape('pentagon', function(){
				return this.defs.append('path')
					.attr('d', 'M0,0 L-10,-12 L-24,-8 L-24,8 L-10,12 z');
			});
			
			if(this.options.shapes){
				for(var shapeKey in this.options.shapes){
					this.registerShape(shapeKey, this.options.shapes[shapeKey]);
				}
			}
			
			// add highlight filter
			this.registerShape('highlightFilter', function(){
				var filter = this.defs.append('filter');
				filter.attr('filterUnits', 'userSpaceOnUse')

				filter.append('feMorphology')
					.attr('in', 'SourceGraphic')
					.attr('operator', 'dilate')
					.attr('radius', 2);
				
				var fc = filter.append('feComponentTransfer');
				fc.append('feFuncR')
					.attr('type', 'linear')
					.attr('slope', 0);
				fc.append('feFuncG')
					.attr('type', 'linear')
					.attr('slope', 1);
				fc.append('feFuncB')
					.attr('type', 'linear')
					.attr('slope', 2);
				
				filter.append('feGaussianBlur')
					.attr('stdDeviation', 0)
					.attr('result', 'blur');
				
				var feMerge = filter.append('feMerge');
				feMerge.append('feMergeNode')
					.attr('in', 'blur');
				feMerge.append('feMergeNode')
					.attr('in', 'SourceGraphic');
				
				return filter;
			});

			
			this.setupEventHandlers();
			
			this.getElement().resize(function(x, y){
				if(!$this.getElement().is(':visible')){
					return;
				}
				self.updateViewport();
			});
			
			this.updateViewport();
			this.useShape('highlightFilter');
			
			function _setupLayouts(callback){
				// setup layouts
				if($this.options.layouts){
					var idArr = Object.keys($this.options.layouts);
					JSB.chain(idArr, function(lId, c){
						$this.setupLayout(lId, $this.options.layouts[lId], c);
					}, callback);
				} else {
					callback.call($this);
				}
			}
			
			function _setupNodes(callback){
				// setup nodes
				if($this.options.nodes){
					var idArr = Object.keys($this.options.nodes);
					JSB.chain(idArr, function(nId, c){
						$this.setupNode(nId, $this.options.nodes[nId], c);
					}, callback);
				} else {
					callback.call($this);
				}
			}

			function _setupConnectors(callback){
				// setup connectors
				if($this.options.connectors){
					var idArr = Object.keys($this.options.connectors);
					JSB.chain(idArr, function(cId, c){
						$this.setupConnector(cId, $this.options.connectors[cId], c);
					}, callback);
				} else {
					callback.call($this);
				}
			}
			
			function _setupLinks(callback){
				// setup links
				if($this.options.links){
					var idArr = Object.keys($this.options.links);
					JSB.chain(idArr, function(lId, c){
						$this.setupLink(lId, $this.options.links[lId], c);
					}, callback);
				} else {
					callback.call($this);
				}
			}
			
			JSB.chain([_setupLayouts, _setupNodes, _setupConnectors, _setupLinks], function(_setupFunc, c){
				_setupFunc.call($this, c);
			}, function(){
				if($this.options.onInit){
					$this.options.onInit.call($this);
				}
			})
		},
		
		registerShape: function(key, createCallback){
			var desc = {
				id: key + '_' + this.getId(),
				createCallback: createCallback,
				element: null
			};
			this.shapeDescs[key] = desc;
		},
		
		useShape: function(key){
			if(!this.shapeDescs[key]){
				throw 'No shape has been registered with key: ' + key;
			}
			if(!this.shapeDescs[key].element){
				this.shapeDescs[key].element = this.shapeDescs[key].createCallback.call(this);
				this.shapeDescs[key].element.attr('id', this.shapeDescs[key].id);
			}
			return this.shapeDescs[key].id;
		},
		
		getShapeId: function(key){
			if(!this.shapeDescs[key]){
				return null;
			}
			return this.shapeDescs[key].id;
		},
		
		getPan: function(){
			return {x: this.options.panX, y: this.options.panY};
		},
		
		setPan: function(pt){
			this.options.panX = pt.x;
			this.options.panY = pt.y;
			this.updateViewport({dontUpdateDimensions:true});
		},
		
		getZoom: function(){
			return this.options.zoom;
		},
		
		setZoom: function(zoom){
			if(zoom < this.options.minZoom){
				zoom = this.options.minZoom;
			}
			if(zoom > this.options.maxZoom){
				zoom = this.options.maxZoom;
			}
			this.options.zoom = zoom;
			this.updateViewport({dontUpdateDimensions:true});
			JSB.defer(()=>{
				this.updateViewport({dontUpdateDimensions:true});
			}, 0, 'setZoom_' + $this.getId());
		},
		
		setupEventHandlers: function(){
			var self = this;
			this.getElement().on({
				click: function(evt){
					self.publish('_jsb_diagramMouseEvent', {name: 'click', event: evt});
				},

				mouseover: function(evt){
					self.publish('_jsb_diagramMouseEvent', {name: 'mouseover', event: evt});
				},
				
				mouseout: function(evt){
					self.publish('_jsb_diagramMouseEvent', {name: 'mouseout', event: evt});
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
			
			this.subscribe('_jsb_diagramSelectionChanged', function(sender, msg, params){
				if(sender != $this){
					return;
				}
				if($this.options.onSelectionChanged){
					$this.options.onSelectionChanged.call($this, params);
				}
			});
		},
		
		pageToSheetCoords: function(pt){
			//var sheetRc = this.sheet.get(0).getBoundingClientRect();
			return {
				x: (pt.x - this.sheetRc.left) / this.options.zoom,
				y: (pt.y - this.sheetRc.top) / this.options.zoom
			};
		},
		
		pushController: function(name){
			var ctrl = this.controllers[name];
			this.controllerStack.push(ctrl);
			this.getElement().attr('controller', ctrl.jsb.$name);
		},
		
		popController: function(){
			this.controllerStack.pop();
			var ctrl = this.getCurrentController();
			this.getElement().attr('controller', ctrl.jsb.$name);
		},
		
		getCurrentController: function(){
			var ctrl = this.controllers.normal;
			if(this.controllerStack.length > 0){
				ctrl = this.controllerStack[this.controllerStack.length - 1];
			}
			if(!this.getElement().attr('controller')){
				this.getElement().attr('controller', ctrl.jsb.$name);
			}
			return ctrl;
		},
		
		updateViewport: function(opts){
			var w, h;
			if(!opts || !opts.dontUpdateDimensions){
				var dRect = this.getElement().get(0).getBoundingClientRect();
				w = dRect.right - dRect.left;
				h = dRect.bottom - dRect.top;
				if(h&1){
					h--;
					this.addClass('odd_vert');
				} else {
					this.removeClass('odd_vert');
				}
				
				this.svg.attr('width', w);
				this.svg.attr('height', h);
				$this.lastWidth = w;
				$this.lastHeight = h;
			} else {
				w = $this.lastWidth;
				h = $this.lastHeight;
			}
			$this.sheetRc = this.sheet.get(0).getBoundingClientRect();
			var panOffset = {
				x: Math.round((this.options.panX - this.options.panX * (1 - this.options.zoom)) / this.options.zoom),
				y: Math.round((this.options.panY - this.options.panY * (1 - this.options.zoom)) / this.options.zoom)
			};
			
			var viewBox = {
				x: Math.round(-panOffset.x - (w / 2) / this.options.zoom),
				y: Math.round(-panOffset.y - (h / 2) / this.options.zoom),
				w: Math.round(w / this.options.zoom),
				h: Math.round(h / this.options.zoom)
			}

			this.getElement().find('[id*="highlightFilter"]').attr('x', viewBox.x + '')
			    .attr('y', viewBox.y + '');
			this.svg.attr('viewBox', '' + viewBox.x + ' ' + viewBox.y + ' ' + viewBox.w + ' ' + viewBox.h);
			this.sheet.css({
				'transform': 'scale('+this.options.zoom+') translate('+panOffset.x+'px, '+panOffset.y+'px)'
			});
			
			var gridSideX = Math.ceil((w / 2 + Math.abs(this.options.panX)) / this.options.zoom / 50 ) * 50;
			var gridSideY = Math.ceil((h / 2 + Math.abs(this.options.panY)) / this.options.zoom / 50 ) * 50;
			this.toolContainer.css({
				'transform': 'scale('+this.options.zoom+') translate('+panOffset.x+'px, '+panOffset.y+'px)'
			});
			this.grid.css({
				left: -gridSideX,
				top: -gridSideY,
				width: gridSideX * 2,
				height: gridSideY * 2
			});
			
			this._updateFixedLinks();	
		},
		
		setupLayout: function(key, opts, callback){
			var self = this;

			function _setupLayout(LayoutClass){
				var lmInst = new LayoutClass(self, opts);
				self.layoutManagers[key] = lmInst;
				lmInst.key = key;
			}
			
			if(opts.jsb){
				JSB().lookup(opts.jsb, function(cls){
					if(!cls.jsb.isSubclassOf(LayoutManager)){
						throw 'Unable to setup layout "' + key + '": wrong class - ' + cls.jsb.$name;
					}
					_setupLayout(cls);
					if(callback){
						callback.call($this);
					}
				});
			} else {
				_setupLayout(DefaultLayoutManager);
				if(callback){
					callback.call($this);
				}
			}
		},
		
		setupNode: function(key, opts, callback){
			var self = this;

			function _setupNode(){
				if(!self.nodeDescs[key]){
					self.nodeDescs[key] = {};
				}
				self.nodeDescs[key].options = opts;
			}
			
			if(opts.jsb){
				JSB().lookup(opts.jsb, function(cls){
					if(!cls.jsb.isSubclassOf(Node)){
						throw 'Unable to setup node "' + key + '": wrong class - ' + cls.jsb.$name;
					}
					_setupNode();
					self.nodeDescs[key].nodeClass = cls;
					if(callback){
						callback.call($this);
					}
				});
			} else {
				_setupNode();
				if(callback){
					callback.call($this);
				}
			}
		},
		
		setupConnector: function(key, opts, callback){
			var self = this;
			
			function _setupConnector(){
				if(!self.connectorDescs[key]){
					self.connectorDescs[key] = {};
				}
				self.connectorDescs[key].options = opts;
				
			}
			if(opts.jsb){
				JSB().lookup(opts.jsb, function(cls){
					if(!cls.jsb.isSubclassOf(Connector)){
						throw 'Unable to setup connector "' + key + '": wrong class - ' + cls.jsb.$name;
					}
					_setupConnector();
					self.connectorDescs[key].connectorClass = cls;
					if(callback){
						callback.call($this);
					}
				});
			} else {
				_setupConnector();
				self.connectorDescs[key].connectorClass = Connector;
				if(callback){
					callback.call($this);
				}
			}
		},
		
		setupLink: function(key, opts, callback){
			var self = this;
			
			function _setupLink(){
				if(!self.linkDescs[key]){
					self.linkDescs[key] = {};
				}
				self.linkDescs[key].options = opts;
				self.updateScheme();
			}
			
			function _setupJoints(){
				// check joints classes
				if(opts.joints && JSB().isArray(opts.joints) && opts.joints.length > 0){
					JSB.chain(opts.joints, function(jDesc, c){
						if(jDesc.jsb && JSB().isString(jDesc.jsb)){
							JSB().lookup(opts.jsb, function(cls){
								jDesc.jsb = cls.jsb;
								if(c){
									c.call($this);
								}
							});
						} else {
							if(c){
								c.call($this);
							}
						}
					}, function(){
						if(callback){
							callback.call($this);
						}
					});
/*					
					for(var i = 0; i < opts.joints.length; i++){
						var jDesc = opts.joints[i];
						if(jDesc.jsb && JSB().isString(jDesc.jsb)){
							JSB().lookup(opts.jsb, function(cls){
								jDesc.jsb = cls.jsb;
							});
						}
					}
*/						
				} else {
					if(callback){
						callback.call($this);
					}
				}
			}
			
			if(opts.jsb){
				JSB().lookup(opts.jsb, function(cls){
					if(!cls.jsb.isSubclassOf(Link)){
						throw 'Unable to setup link "' + key + '": wrong class - ' + cls.jsb.$name;
					}
					_setupLink();
					self.linkDescs[key].linkClass = cls;
					_setupJoints();
				});
			} else {
				_setupLink();
				_setupJoints();
			}
			
			
		},
		
		destroy: function(){
			$base();
		},
		
		getNode: function(id){
			if(this.nodes[id]){
				return this.nodes[id];
			}
			return null;
		},
		
		getNodes: function(){
			return this.nodes;
		},
		
		hasNode: function(nodeVal){
			if(JSB().isString(nodeVal) && this.nodes[nodeVal]){
				return true;
			} else if(JSB().isInstanceOf(nodeVal, 'JSB.Widgets.Diagram.Node') && this.nodes[nodeVal.getId()]){
				return true;
			}
			return false;
		},
		
		hasLink: function(linkVal){
			if(JSB().isString(linkVal) && this.links[linkVal]){
				return true;
			} else if(JSB().isInstanceOf(linkVal, 'JSB.Widgets.Diagram.Link') && this.links[linkVal.getId()]){
				return true;
			}
			return false;
		},
		
		isNodeRegistered: function(key){
			if(this.nodeDescs[key]){
				return true;
			}
			return false;
		},
		
		isConnectorRegistered: function(key){
			if(this.connectorDescs[key]){
				return true;
			}
			return false;
		},
		
		isLinkRegistered: function(key){
			if(this.linkDescs[key]){
				return true;
			}
			return false;
		},
		
		createNode: function(key, opts){
			var nodeDesc = this.nodeDescs[key];
			if(!nodeDesc){
				throw 'Unable to create node due to unknown node key: ' + key;
			}
			var nodeClass = Node;
			if(nodeDesc.nodeClass){
				nodeClass = nodeDesc.nodeClass;
			}
			var node = new nodeClass(this, key, opts);
			this.nodes[node.getId()] = node;
			if(node.options.fixed){
				this.canvas.append(node.getElement());
			} else {
				this.sheet.append(node.getElement());
			}

            node._setInitialized();

            if(this.options.onChange){
                this.options.onChange.call(this);
            }
            if(this.options.onCreate){
                this.options.onCreate.call(this, node);
            }

			return node;
		},
		
		removeNode: function(nodeVal){
			var node = null;
			if(JSB().isString(nodeVal)){
				node = this.nodes[nodeVal];
				if(!node){
					throw 'ERROR(removeNode): Unable to find diagram node with id ' + nodeVal;
				}
			} else if(JSB().isInstanceOf(nodeVal, 'JSB.Widgets.Diagram.Node')){
				node = nodeVal;
				if(!this.nodes[node.getId()]){
					throw 'ERROR(removeNode): No node found with id: ' + node.getId();
				}
			} else {
				if(JSB().isBean(nodeVal)){
					throw 'ERROR(removeNode): Invalid bean node passed: ' + nodeVal.jsb.$name;
				} else {
					throw 'ERROR(removeNode): Unknown node argument passed: ' + JSON.stringify(nodeVal);
				}
			}
			
			if(node.options.onRemove){
				node.options.onRemove.call(node);
			}
			
			if(this.options.onChange){
				this.options.onChange.call(this);
			}
			if(this.options.onRemove){
				this.options.onRemove.call(this, node);
			}
			
			// remove all links
			var links = node.getLinks();
			for(var lId in links){
				var link = links[lId];
				this.removeLink(link);
			}
			
			// unselect & unhighlight
			node.select(false);
			node.highlight(false);
			
			// remove node from the sheet
			node.getElement().remove();
			delete this.nodes[node.getId()];
			node.destroy();
		},
		
		createLink: function(linkKey, opts){
			var self = this;
			var linkDesc = this.linkDescs[linkKey];
			var linkClass = Link;
			if(linkDesc.linkClass){
				linkClass = linkDesc.linkClass;
			}
			var link = new linkClass(this, linkKey, opts);
			this.links[link.getId()] = link;
			
			if(this.options.onChange){
				this.options.onChange.call(this);
			}
			if(this.options.onCreate){
				this.options.onCreate.call(this, link);
			}
			
			return link;
		},
		
		_addFixedLink: function(link){
			if(!this.links[link.getId()]){
				return;
			}
			this.fixedLinks[link.getId()] = link;
		},
		
		_removeFixedLink: function(linkId){
			if(this.fixedLinks[linkId]){
				delete this.fixedLinks[linkId];
			}
		},
		
		_updateFixedConnectors: function(){
			for(var nId in this.nodes){
				if(this.nodes[nId].isFixed()){
					this.nodes[nId].updateConnectors();
				}
			}
		},
		
		_updateFixedLinks: function(){
			for(var i in this.fixedLinks){
				this.fixedLinks[i].redraw();
			}
		},
		
		removeLink: function(linkVal){
			var link = null;
			if(JSB().isString(linkVal)){
				link = this.links[linkVal];
				if(!node){
					throw 'ERROR(removeLink): Unable to find diagram link with id ' + linkVal;
				}
			} else if(JSB().isInstanceOf(linkVal, 'JSB.Widgets.Diagram.Link')){
				link = linkVal;
				if(!this.links[link.getId()]){
					throw 'ERROR(removeLink): No link found with id: ' + link.getId();
				}
			} else {
				if(JSB().isBean(linkVal)){
					throw 'ERROR(removeLink): Invalid bean link passed: ' + linkVal.jsb.$name;
				} else {
					throw 'ERROR(removeLink): Unknown link argument passed: ' + JSON.stringify(linkVal);
				}
			}
			
			if(link.options.onRemove){
				link.options.onRemove.call(link);
			}
			if(this.options.onChange){
				this.options.onChange.call(this);
			}
			if(this.options.onRemove){
				this.options.onRemove.call(this, link);
			}
			
			// unselect & unhighlight
			link.select(false);
			link.highlight(false);

			delete this.links[link.getId()];
			if(this.fixedLinks[link.getId()]){
				delete this.fixedLinks[link.getId()];
			}
			link.destroy();
		},
		
		getLinks: function(){
			return this.links;
		},
		
		clear: function(){
			var oldLinks = this.links;
			for(var id in oldLinks){
				var link = oldLinks[id];
				link.destroy();
			}
			this.links = {};
			
			var oldNodes = this.nodes;
			for(var id in oldNodes){
				var node = oldNodes[id];
				node.destroy();
			}
			this.nodes = {};
		},
		
		resetViewport: function(){
			this.options.panX = 0;
			this.options.panY = 0;
			this.options.zoom = 1;
			this.updateViewport({dontUpdateDimensions:true});
		},
		
		removeSelected: function(){
			var sel = this.getSelected();
			for(var itemId in sel){
				var item = sel[itemId];
				this.remove(item);
			}
		},
		
		remove: function(item){
			if(JSB().isInstanceOf(item, 'JSB.Widgets.Diagram.Node')){
				if(this.nodes[item.getId()]){
					this.removeNode(item);
				}
			} else if(JSB().isInstanceOf(item, 'JSB.Widgets.Diagram.Link')){
				if(this.links[item.getId()]){
					this.removeLink(item);
				}
			}
		},
		
		updateScheme: function(){
			for(var cId in this.connectorDescs){
				var cDesc = this.connectorDescs[cId];
				cDesc.remoteConnectors = {};
				
				var allLinkDescs = this.linkDescs;
				for(var lId in allLinkDescs){
					var lDesc = allLinkDescs[lId].options;
					
					if(!lDesc.source || !lDesc.target){
						continue;
					}
					var sourceArr = lDesc.source;
					if(!JSB().isArray(sourceArr)){
						sourceArr = [sourceArr];
					}
					var targetArr = lDesc.target;
					if(!JSB().isArray(targetArr)){
						targetArr = [targetArr];
					}

					// fill sourceLinkDescs
					for(var i = 0; i < sourceArr.length; i++){
						var source = sourceArr[i];
						if(source == cId){
							for(var j = 0; j < targetArr.length; j++){
								var target = targetArr[j];
								if(!cDesc.remoteConnectors[target]){
									cDesc.remoteConnectors[target] = {};
								}
								if(!cDesc.remoteConnectors[target][lId]){
									cDesc.remoteConnectors[target][lId] = 'source';
								}
							}
							break;
						}
					}
					
					// fill targetLinkDescs
					for(var i = 0; i < targetArr.length; i++){
						var target = targetArr[i];
						if(target == cId){
							for(var j = 0; j < sourceArr.length; j++){
								var source = sourceArr[j];
								if(!cDesc.remoteConnectors[source]){
									cDesc.remoteConnectors[source] = {};
								}
								if(!cDesc.remoteConnectors[source][lId]){
									cDesc.remoteConnectors[source][lId] = 'target';
								}
							}
							break;
						}
					}
				}
			}
		},
		
		lookupAppropriateLinks: function(c1, c2, callback){
			// obtain suitable links by scheme
			var lMap = this.connectorDescs[c1.key].remoteConnectors[c2.key];
			if(!lMap || !Object.keys(lMap).length === 0){
				callback.call(this, null);
				return;
			}
			var lArr = [];
			for(var lId in lMap){
				if(c1.remoteConnectors[c2.getId()]){
					var linkMap = c1.remoteConnectors[c2.getId()];
					if(linkMap && linkMap[lId]){
						continue;
					}
				}
				
				lArr.push({key: lId, type:lMap[lId]});
			}
			if(lArr.length === 0){
				callback.call(this, null);
				return;
			}
			JSB().chain(lArr, function(lDesc, c){
				var scopeRes = {
					val1: null,
					val2: null,
					cCalled: false
				};
				var val1 = c1.options.allowLinkCallback.call(c1, c2, lDesc.key, function(val){
					scopeRes.val1 = val;
					if(!JSB().isNull(scopeRes.val1) && !JSB().isNull(scopeRes.val2) && !scopeRes.cCalled){
						scopeRes.cCalled = true;
						c({key: lDesc.key, allow: scopeRes.val1 && scopeRes.val2});
					}
				});
				if(val1 !== undefined){
					scopeRes.val1 = val1;
				}
				var val2 = c2.options.allowLinkCallback.call(c2, c1, lDesc.key, function(val){
					scopeRes.val2 = val;
					if(!JSB().isNull(scopeRes.val1) && !JSB().isNull(scopeRes.val2) && !scopeRes.cCalled){
						scopeRes.cCalled = true;
						c({key: lDesc.key, allow: scopeRes.val1 && scopeRes.val2});
					}
				});
				if(val2 !== undefined){
					scopeRes.val2 = val2;
				}
				if(!JSB().isNull(scopeRes.val1) && !JSB().isNull(scopeRes.val2) && !scopeRes.cCalled){
					scopeRes.cCalled = true;
					c({key: lDesc.key, allow: scopeRes.val1 && scopeRes.val2});
				}
			}, function(rArr){
				var rMap = {};
				for(var i = 0; i < rArr.length; i++){
					if(rArr[i].allow){
						rMap[rArr[i].key] = lMap[rArr[i].key];
					}
				}
				callback(rMap);
			});
		},
		
		getSelected: function(){
			return this.selected;
		},
		
		getHighlighted: function(){
			return this.highlighted;
		},
		
		select: function(node, bSelect){
			if(!JSB.isDefined(bSelect)){
				bSelect = true;
			}

			if(JSB.isInstanceOf(node, 'JSB.Widgets.Diagram.Node') || JSB.isInstanceOf(node, 'JSB.Widgets.Diagram.Link')){
				node.select(bSelect);
			} else if(JSB.isObject(node)){
				for(var objId in node){
					var obj = node[objId];
					obj.select(bSelect);
				}
			}
		},
		
		getNodesUnderCursor: function(pt){
			var selMap = {};
			//var sheetRc = this.sheet.get(0).getBoundingClientRect();
			for(var nodeId in this.nodes){
				var node = this.nodes[nodeId];
				var nodeRc = node.getElement().get(0).getBoundingClientRect();
				
				var nodeMinPt = {x: (nodeRc.left - this.sheetRc.left) / this.options.zoom, y: (nodeRc.top - this.sheetRc.top)/ this.options.zoom};
				var nodeMaxPt = {x: (nodeRc.right - this.sheetRc.left)/ this.options.zoom, y: (nodeRc.bottom - this.sheetRc.top)/ this.options.zoom};
				
				if(nodeMinPt.x <= pt.x && nodeMinPt.y <= pt.y && nodeMaxPt.x >= pt.x && nodeMaxPt.y >= pt.y){
					selMap[nodeId] = node;
				}
			}
			
			return selMap;
		},
		
		getItemsUnderSelection: function(){
			var selMap = {};
			var toolRc = this.selectorTool.get(0).getBoundingClientRect();
			//var sheetRc = this.sheet.get(0).getBoundingClientRect();
			
			var selMinPt = {x: (toolRc.left - this.sheetRc.left) / this.options.zoom, y: (toolRc.top - this.sheetRc.top) / this.options.zoom};
			var selMaxPt = {x: (toolRc.right - this.sheetRc.left) / this.options.zoom, y: (toolRc.bottom - this.sheetRc.top) / this.options.zoom};
			
			// iterate over each node
			for(var nodeId in this.nodes){
				var node = this.nodes[nodeId];
				var nodeRc = node.getRect();
				
				var nodeMinPt = {x: nodeRc.x, y: nodeRc.y};
				var nodeMaxPt = {x: nodeRc.x + nodeRc.w, y: nodeRc.y + nodeRc.h};
				
				if(nodeMaxPt.x < selMinPt.x){
		        	continue;	// item is leftside from the selection
		        }
		        if(nodeMinPt.x > selMaxPt.x){
		        	continue;	// item is rightside from the selection
		        }
		        if(nodeMaxPt.y < selMinPt.y){
		        	continue;	// item is top from the selection
		        }
		        if(nodeMinPt.y > selMaxPt.y){
		        	continue;	// item is bottom from the selection
		        }
		        
		        selMap[nodeId] = node;
			}
			
			// iterate over each link
			for(var linkId in this.links){
				var link = this.links[linkId];
				var pArr = link.getPathPoints();
				for(var i = 0; i < pArr.length; i++){
					var p = pArr[i];
					if(p.x >= selMinPt.x && p.y >= selMinPt.y && p.x <= selMaxPt.x && p.y <= selMaxPt.y){
						selMap[linkId] = link;
						break;
					}
				}
			}
			
			return selMap;
		},

		/*
		* area.x1
		* area.x2
		* area.y1
		* area.y2
		*/
		getNodesInArea: function(area) {
		    let selMap = {};

			for(let nodeId in this.nodes) {
				let nodeRc = this.nodes[nodeId].getRect(),
				    nodeMinPt = {x: nodeRc.x, y: nodeRc.y},
				    nodeMaxPt = {x: nodeRc.x + nodeRc.w, y: nodeRc.y + nodeRc.h};

				if(nodeMaxPt.x < area.x1) {
		        	continue;	// item is leftside from the selection
		        }
		        if(nodeMinPt.x > area.x2) {
		        	continue;	// item is rightside from the selection
		        }
		        if(nodeMaxPt.y < area.y1) {
		        	continue;	// item is top from the selection
		        }
		        if(nodeMinPt.y > area.y2) {
		        	continue;	// item is bottom from the selection
		        }

		        selMap[nodeId] = this.nodes[nodeId];
			}

			return selMap;
		},
		
		updateLayout: function(items){
			if(!this.options.autoLayout){
				return;
			}
			var self = this;
			function _getManagersForNode(item){
				var lmans = [];
				if(!item.options.layout){
					return lmans;
				}
				var layout = item.options.layout;
				if(layout){
					if(!JSB().isPlainObject(layout)){
						throw 'Invalid layout descriptor for node: ' + item.jsb.$name;
					}
					var lmans = [];
					for(var ln in layout){
						if(layout[ln].auto){
							lmans.push(ln);
						}
					}
				}
				return lmans;
			}
			
			if(!items){
				items = this.diagram.nodes;
			}
			if(JSB().isBean(items)){
				var ni = {};
				ni[items.getId()] = items;
				items = ni;
			} else if(JSB().isArray(items)){
				var ni = {};
				for(var i = 0; i < items.length; i++){
					ni[items[i].getId()] = items[i];
				}
				items = ni;
			}
			
			var manNodeMap = {};
			for(var nId in items){
				var node = items[nId];
				var lmans = _getManagersForNode(node);
				for(var i = 0; i < lmans.length; i++){
					var lman = lmans[i];
					if(!manNodeMap[lman]){
						manNodeMap[lman] = {};
					}
					manNodeMap[lman][node.getId()] = node;
				}
			}
			
			// call managers
			for(var lman in manNodeMap){
				var lm = self.layoutManagers[lman];
				if(!lm){
					throw 'Unable to find layout manager: ' + lman;
				}
				lm.execute(manNodeMap[lman]);
			}
		},

		getFieldSize: function(){
		    return {
		        x: this.grid.width(),
		        y: this.grid.height()
		    };
		},

		getCenter: function() {
		    let element = this.getElement()
		        offset = element.offset(),
		        width = element.width(),
		        height = element.height();

            return this.pageToSheetCoords({
                x: offset.left + width / 2,
                y: offset.top + height / 2
            });
		}
	}
}