JSB({
	name: 'JSB.Widgets.Diagram.LayoutManager',
	parent: 'JSB.Widgets.Actor',
	require: {},
	
	client: {
		busy: false,

		options: {
		},
		
		constructor: function(diagram, opts){
			var self = this;
			this.base();
			this.diagram = diagram;
			JSB().merge(true, this.options, opts);
		},
		
		getOption: function(node, optName){
			if(!node.options.layout){
				return null;
			}
			var layoutOpts = node.options.layout[this.key];
			if(!layoutOpts){
				return null;
			}

			var optVal = layoutOpts[optName];
			if(JSB().isFunction(optVal)){
				return optVal.call(node);
			}
			return optVal;
		},
		
		execute: function(items){
			var self = this;
			if(this.busy){
				if(!this.waitBatch){
					this.waitBatch = JSB().merge({}, items);
					JSB().deferUntil(function(){
						var items = self.waitBatch;
						self.waitBatch = null;
						self.execute(items);
					}, function(){
						return !self.busy;
					});
				} else {
					JSB().merge(this.waitBatch, items);
				}
				return;
			}
			this.busy = true;
			
			var rChanged = this.layout(items);
			
			if(Object.keys(rChanged).length === 0){
				this.busy = false;
				return;
			}
			
			this.translateNodes(rChanged);

		},
		
		layout: function(items){
			throw 'JSB.Widgets.Diagram.LayoutManager.layout should be overriden';
		},
		
		getStyleProperty: function( propName ) {
			if ( !propName ) {
				return;
			}
			var prefixes = 'Webkit Moz ms Ms O'.split(' ');
			var docElemStyle = document.documentElement.style;

			// test standard property first
			if ( typeof docElemStyle[ propName ] === 'string' ) {
				return propName;
			}

			// capitalize
			propName = propName.charAt(0).toUpperCase() + propName.slice(1);

			// test vendor specific properties
			var prefixed;
			for ( var i=0, len = prefixes.length; i < len; i++ ) {
				prefixed = prefixes[i] + propName;
				if ( typeof docElemStyle[ prefixed ] === 'string' ) {
					return prefixed;
				}
			}
		},
		
		translateNodes: function(rects){
			var self = this;
			var waitMap = {};
			for(var nId in rects){
				var r = rects[nId];
				var newPt = {x: r.x, y: r.y};
				var node = this.diagram.nodes[nId];
				var oldPos = node.getPosition();
				if(oldPos.x == newPt.x && oldPos.y == newPt.y){
					continue;
				}
				var expandOpt = this.getOption(node, 'nodeExpand');
				if(expandOpt){
					if(JSB().isNumber(expandOpt)){
						newPt.x += expandOpt;
						newPt.y += expandOpt;
					} else if(JSB().isPlainObject(expandOpt)){
						newPt.x += expandOpt.left || 0;
						newPt.y += expandOpt.top || 0;
					}
				}
				var animOpt = this.getOption(node, 'animate');
				if(!animOpt){
					node.setPosition(newPt.x, newPt.y);
				} else {
					// do animation
					(function(node, newPt){
						waitMap[node.getId()] = node;
						var elt = node.getElement();
						var transEndProp = 'transitionend';

						var transitionHandler = function(){
							elt.get(0).removeEventListener(transEndProp, arguments.callee);
							
							// update dimenstions
							var cssObj = {};
							cssObj[self.getStyleProperty('transition-property')] = '';
							cssObj[self.getStyleProperty('transition-duration')] = '';
							cssObj[self.getStyleProperty('transform')] = '';
							
							elt.css(cssObj);
							node.setPosition(newPt.x, newPt.y);
							delete waitMap[node.getId()];
							if(Object.keys(waitMap).length === 0){
								self.busy = false;
							}
						}
						elt.get(0).addEventListener(transEndProp, transitionHandler);

						var cssObj = {};
						
						var oldPos = node.getPosition();
						cssObj[self.getStyleProperty('transition-property')] = 'transform';
						cssObj[self.getStyleProperty('transition-duration')] = '0.4s';
						cssObj[self.getStyleProperty('transform')] = 'translate('+(newPt.x - oldPos.x)+'px,'+(newPt.y - oldPos.y)+'px)';
						
						elt.css(cssObj);
						
					})(node, newPt);

				}
				if(Object.keys(waitMap).length === 0){
					this.busy = false;
				}
			}
		}

	}
	
});

JSB({
	name: 'JSB.Widgets.Diagram.DefaultLayoutManager',
	parent: 'JSB.Widgets.Diagram.LayoutManager',
	require: {},
	
	client: {
		options: {
		},
		
		constructor: function(diagram, opts){
			var self = this;
			this.base(diagram, opts);
		},
		
		layout: function(items){
			var self = this;
			
			var rects = {};
			var rChanged = {};
			for(var nId in this.diagram.nodes){
				var node = this.diagram.nodes[nId];
				var nodeRect = node.getRect();
				if(nodeRect.w === 0 || nodeRect.h === 0){
					continue;
				}
				rects[nId] = nodeRect;
				var expandOpt = this.getOption(node, 'nodeExpand');
				if(expandOpt){
					if(JSB().isNumber(expandOpt)){
						rects[nId].x -= expandOpt;
						rects[nId].y -= expandOpt;
						rects[nId].w += expandOpt * 2;
						rects[nId].h += expandOpt * 2;
					} else if(JSB().isPlainObject(expandOpt)){
						if(!expandOpt.left) expandOpt.left = 0;
						if(!expandOpt.top) expandOpt.top = 0;
						if(!expandOpt.right) expandOpt.right = 0;
						if(!expandOpt.bottom) expandOpt.bottom = 0;
						rects[nId].x -= expandOpt.left;
						rects[nId].y -= expandOpt.top;
						rects[nId].w += expandOpt.right + expandOpt.left;
						rects[nId].h += expandOpt.bottom + expandOpt.top;
					}
				}
			}
			
			if(Object.keys(rects).length === 0){
				return rChanged;
			}

			// prepare items to layout
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

			// do layout
			for(var nId in items){
				var node = items[nId];
				if(this.layoutNode(node, rects)){
					rChanged[node.getId()] = rects[node.getId()];
				}
			}
			
			return rChanged;
		},
		
		layoutNode: function(node, rects){
			var self = this;
			var nodeRect = rects[node.getId()];
			if(this.evalNodeIntersection(node.getId(), nodeRect, rects) == 0){
				return false;
			}
			var cx = nodeRect.x + nodeRect.w / 2;
			var cy = nodeRect.y + nodeRect.h / 2;
			var startTurn = null;
			var minDist = null;
			var newPos = null;
			this.whirl(cx, cy, function(x, y, turn){
				var nr = {x: x - nodeRect.w / 2, y: y - nodeRect.h / 2, w: nodeRect.w, h: nodeRect.h};
				var w = self.evalNodeIntersection(node.getId(), nr, rects);
				if(!w){
					var dist = (cx - x) * (cx - x) + (cy - y) * (cy - y);
					if(minDist === null || dist < minDist){
						minDist = dist;
						newPos = {x: x, y: y};
					}
					if(startTurn === null){
						startTurn = turn;
					} else if(turn - startTurn > 2){
						return false;
					}
				}
				return true;
			});
			var newRect = {x: newPos.x - nodeRect.w / 2, y: newPos.y - nodeRect.h / 2, w: nodeRect.w, h: nodeRect.h};
			rects[node.getId()] = newRect;
			return true;
		},
		
		evalNodeIntersection: function(nId, nodeRect, rects){
			var w = 0;
			
			for(var id in rects){
				if(id == nId){
					continue;
				}
				var r = rects[id];
				w += this.getIntersectionArea(nodeRect, r);
			}
			
			return w;
		},
		
		getIntersectionArea: function(r1, r2){
			var lx1 = r1.x;
			var ly1 = r1.y;
			var rx1 = r1.x + r1.w;
			var ry1 = r1.y + r1.h;

			var lx2 = r2.x;
			var ly2 = r2.y;
			var rx2 = r2.x + r2.w;
			var ry2 = r2.y + r2.h;
			
			var iRect = {
				left: Math.max(lx1, lx2),
				top: Math.max(ly1, ly2),
				right: Math.min(rx1, rx2),
				bottom: Math.min(ry1, ry2)
			};
			
			if(iRect.left >= iRect.right || iRect.top >= iRect.bottom){
				return 0;
			}
			
			return (iRect.right - iRect.left) * (iRect.bottom - iRect.top);
		},
		
		whirl: function(x, y, iteratorCallback){
			this.whirlAgg = [];
			var step = this.diagram.options.cellSize;
			var curPos = {
				x: x,
				y: y
			};
			var r = iteratorCallback.call(this, curPos.x, curPos.y, curVal );
			if(!r){
				return curPos;
			}
			var dirVec = {
				x: step,
				y: 0
			};
			for(var curVal = 1; ; curVal++ ){
				for(var j = 0; j < 2; j++ ){
					for(var i = 0; i < curVal; i++ ){
						curPos.x += dirVec.x;
						curPos.y += dirVec.y;
						var r = iteratorCallback.call(this, curPos.x, curPos.y, curVal );
						if(!r){
							return curPos;
						}
					}
					if(dirVec.x > 0){
						dirVec.x = 0;
						dirVec.y = step;
					} else if(dirVec.y > 0){
						dirVec.y = 0;
						dirVec.x = -step;
					} else if(dirVec.x < 0){
						dirVec.x = 0;
						dirVec.y = -step;
					} else {
						dirVec.y = 0;
						dirVec.x = step;
					}
				}
			}
		}
	}
	
});