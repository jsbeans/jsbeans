{
	$name: 'JSB.Widgets.Diagram',
	$parent: 'JSB.Widgets.Widget',
	$require: {
		UiEffects: 'JQuery.UI.Effects',
		Node: 'JSB.Widgets.Diagram.Node',
		Link: 'JSB.Widgets.Diagram.Link',
		Joint: 'JSB.Widgets.Diagram.Joint',
		Connector: 'JSB.Widgets.Diagram.Connector',
		Controller: 'JSB.Widgets.Diagram.Controller',
		WiringController: 'JSB.Widgets.Diagram.WiringController',
		DefaultLayoutManager: 'JSB.Widgets.Diagram.DefaultLayoutManager'
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
		
		options: {
			zoom: 1,
			zoomStep: 0.05,
			minZoom: 0.1,
			maxZoom: 1,
			panX: 0,
			panY: 0,
			cellSize: 10,
			autoLayout: true,
			
			links: {
				'_jsb_diagramUserWiringLink': {
					
				}
			},
			layouts: {
				'default': {
					jsb: 'JSB.Widgets.Diagram.DefaultLayoutManager'
				}
			}
		},
		
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('diagram.css');
			this.addClass('_jsb_diagram');
			
			JSO().loadScript('tpl/d3/d3.min.js', function(){
				self.init();
			});
			
		},
		
		init: function(){
			var self = this;
			
			var elt = this.getElement();
			this.canvas = self.$('<div class="_jsb_diagramCanvas"></div>');
			this.canvas.css({
				'position': 'relative',
				'width': '100%',
				'height': '100%'
			});
			elt.append(this.canvas);
			this.svg = d3.select(this.canvas.get(0)).append('svg')
			    .attr('width', elt.width())
			    .attr('height', elt.height());
			
			this.defs = this.svg.append('defs');
			    
			self.sheet = self.$('<div class="_jsb_diagramSheet"></div>');
			this.canvas.append(self.sheet);
			self.sheet.css({
				'position': 'absolute',
				'z-index': 1,
				'left': '50%',
				'top': '50%'
			});
			
			self.toolContainer = self.$('<div class="_jsb_diagramToolContainer"></div>');
			self.toolContainer.css({
				'position': 'absolute',
				'left': '50%',
				'top': '50%'
			});
			elt.prepend(self.toolContainer);

			self.grid = self.$('<div class="_jsb_diagramGrid"></div>');
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
				for(var i = self.controllerStack.length - 1; i >= 0; i--){
					var res = self.controllerStack[i].onMessage(sender, msg, params);
					if(res){
						return;
					}
				}
				self.controllers.normal.onMessage(sender, msg, params);
			});
			
			// setup layouts
			if(this.options.layouts){
				for(var lId in this.options.layouts){
					this.setupLayout(lId, this.options.layouts[lId]);
				}
			}
			
			// setup nodes
			if(this.options.nodes){
				for(var nId in this.options.nodes){
					this.setupNode(nId, this.options.nodes[nId]);
				}
			}
			
			// setup connectors
			if(this.options.connectors){
				for(var cId in this.options.connectors){
					this.setupConnector(cId, this.options.connectors[cId]);
				}
			}
			
			// setup links
			if(this.options.links){
				for(var lId in this.options.links){
					this.setupLink(lId, this.options.links[lId]);
				}
			}
			
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
			
			// add highlight filter
			this.registerShape('highlightFilter', function(){
				var filter = this.defs.append('filter');
				filter.append('feMorphology')
					.attr('in', 'SourceGraphic')
					.attr('operator', 'dilate')
					.attr('radius', 2);
				
				var fc = filter.append('feComponentTransfer');
				fc.append('feFuncR')
					.attr('type', 'linear')
					.attr('slope', 2);
				fc.append('feFuncG')
					.attr('type', 'linear')
					.attr('slope', 2);
				fc.append('feFuncB')
					.attr('type', 'linear')
					.attr('slope', 2);
				
				filter.append('feGaussianBlur')
					.attr('stdDeviation', 1)
					.attr('result', 'blur');
				
				var feMerge = filter.append('feMerge');
				feMerge.append('feMergeNode')
					.attr('in', 'blur');
				feMerge.append('feMergeNode')
					.attr('in', 'SourceGraphic');
				
				return filter;
			});

			
			this.setupEventHandlers();
			
			this.getElement().resize(function(){
				self.updateViewport();
			});
			
			this.updateViewport();
			this.useShape('highlightFilter');
		},
		
		registerShape: function(key, createCallback){
			var desc = {
				id: key/* + '_' + this.getId()*/,
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
		
		getPan: function(){
			return {x: this.options.panX, y: this.options.panY};
		},
		
		setPan: function(pt){
			this.options.panX = pt.x;
			this.options.panY = pt.y;
			this.updateViewport();
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
			this.updateViewport();
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
			
		},
		
		pageToSheetCoords: function(pt){
			var sheetRc = this.sheet.get(0).getBoundingClientRect();
			return {
				x: (pt.x - sheetRc.left) / this.options.zoom,
				y: (pt.y - sheetRc.top) / this.options.zoom
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
		
		updateViewport: function(){
			var self = this;
			var dRect = self.getElement().get(0).getBoundingClientRect();
			var w = dRect.right - dRect.left;
			var h = dRect.bottom - dRect.top;
			self.svg.attr('width', w);
			self.svg.attr('height', h);
			
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
			
			self.svg.attr('viewBox', '' + viewBox.x + ' ' + viewBox.y + ' ' + viewBox.w + ' ' + viewBox.h);
			self.sheet.css({
				'transform': 'scale('+this.options.zoom+') translate('+panOffset.x+'px, '+panOffset.y+'px)'
			});
			
			var gridSideX = Math.ceil((w / 2 + Math.abs(this.options.panX)) / this.options.zoom / 50 ) * 50;
			var gridSideY = Math.ceil((h / 2 + Math.abs(this.options.panY)) / this.options.zoom / 50 ) * 50;
			self.toolContainer.css({
				'transform': 'scale('+this.options.zoom+') translate('+panOffset.x+'px, '+panOffset.y+'px)'
			});
			self.grid.css({
				left: -gridSideX,
				top: -gridSideY,
				width: gridSideX * 2,
				height: gridSideY * 2
			})
		},
		
		setupLayout: function(key, opts){
			var self = this;

			function _setupLayout(LayoutClass){
				var lmInst = new LayoutClass(self, opts);
				self.layoutManagers[key] = lmInst;
				lmInst.key = key;
			}
			
			if(opts.jsb){
				JSB().lookup(opts.jsb, function(cls){
					if(!cls.jsb.isSubclassOf('JSB.Widgets.Diagram.LayoutManager')){
						throw 'Unable to setup layout "' + key + '": wrong class - ' + cls.jsb.$name;
					}
					_setupLayout(cls);
				});
			} else {
				_setupLayout(DefaultLayoutManager);
			}
		},
		
		setupNode: function(key, opts){
			var self = this;

			function _setupNode(){
				if(!self.nodeDescs[key]){
					self.nodeDescs[key] = {};
				}
				self.nodeDescs[key].options = opts;
			}
			
			if(opts.jsb){
				JSB().lookup(opts.jsb, function(cls){
					if(!cls.jsb.isSubclassOf('JSB.Widgets.Diagram.Node')){
						throw 'Unable to setup node "' + key + '": wrong class - ' + cls.jsb.$name;
					}
					_setupNode();
					self.nodeDescs[key].nodeClass = cls;
				});
			} else {
				_setupNode();
			}
		},
		
		setupConnector: function(key, opts){
			var self = this;
			
			function _setupConnector(){
				if(!self.connectorDescs[key]){
					self.connectorDescs[key] = {};
				}
				self.connectorDescs[key].options = opts;
				
			}
			if(opts.jsb){
				JSB().lookup(opts.jsb, function(cls){
					if(!cls.jsb.isSubclassOf('JSB.Widgets.Diagram.Connector')){
						throw 'Unable to setup connector "' + key + '": wrong class - ' + cls.jsb.$name;
					}
					_setupConnector();
					self.connectorDescs[key].connectorClass = cls;
				});
			} else {
				_setupConnector();
				self.connectorDescs[key].connectorClass = Connector;
			}
		},
		
		setupLink: function(key, opts){
			var self = this;
			
			function _setupLink(){
				if(!self.linkDescs[key]){
					self.linkDescs[key] = {};
				}
				self.linkDescs[key].options = opts;
				self.updateScheme();
			}
			
			if(opts.jsb){
				JSB().lookup(opts.jsb, function(cls){
					if(!cls.jsb.isSubclassOf('JSB.Widgets.Diagram.Link')){
						throw 'Unable to setup link "' + key + '": wrong class - ' + cls.jsb.$name;
					}
					_setupLink();
					self.linkDescs[key].linkClass = cls;
				});
			} else {
				_setupLink();
			}
			
			// check joints classes
			if(opts.joints && JSB().isArray(opts.joints) && opts.joints.length > 0){
				for(var i = 0; i < opts.joints.length; i++){
					var jDesc = opts.joints[i];
					if(jDesc.jsb && JSB().isString(jDesc.jsb)){
						JSB().lookup(opts.jsb, function(cls){
							jDesc.jsb = cls.jsb;
						});
					}
				}	
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
			this.sheet.append(node.getElement());
			
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
			
			return link;
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
			
			// unselect & unhighlight
			link.select(false);
			link.highlight(false);

			delete this.links[link.getId()];
			link.destroy();
		},
		
		clear: function(){
			var oldLinks = this.links;
			this.links = {};
			for(var id in oldLinks){
				var link = oldLinks[id];
				link.destroy();
			}
			
			var oldNodes = this.nodes;
			this.nodes = {};
			for(var id in oldNodes){
				var node = oldNodes[id];
				node.getElement().remove();
				node.destroy();
			}
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
								cDesc.remoteConnectors[target][lId] = 'source';
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
								cDesc.remoteConnectors[source][lId] = 'target';
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
		
		getNodesUnderCursor: function(pt){
			var selMap = {};
			var sheetRc = this.sheet.get(0).getBoundingClientRect();
			for(var nodeId in this.nodes){
				var node = this.nodes[nodeId];
				var nodeRc = node.getElement().get(0).getBoundingClientRect();
				
				var nodeMinPt = {x: (nodeRc.left - sheetRc.left) / this.options.zoom, y: (nodeRc.top - sheetRc.top)/ this.options.zoom};
				var nodeMaxPt = {x: (nodeRc.right - sheetRc.left)/ this.options.zoom, y: (nodeRc.bottom - sheetRc.top)/ this.options.zoom};
				
				if(nodeMinPt.x <= pt.x && nodeMinPt.y <= pt.y && nodeMaxPt.x >= pt.x && nodeMaxPt.y >= pt.y){
					selMap[nodeId] = node;
				}
			}
			
			return selMap;
		},
		
		getItemsUnderSelection: function(){
			var selMap = {};
			var toolRc = this.selectorTool.get(0).getBoundingClientRect();
			var sheetRc = this.sheet.get(0).getBoundingClientRect();
			
			var selMinPt = {x: (toolRc.left - sheetRc.left) / this.options.zoom, y: (toolRc.top - sheetRc.top) / this.options.zoom};
			var selMaxPt = {x: (toolRc.right - sheetRc.left) / this.options.zoom, y: (toolRc.bottom - sheetRc.top) / this.options.zoom};
			
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
		}
	},
	
	$server: {}
}