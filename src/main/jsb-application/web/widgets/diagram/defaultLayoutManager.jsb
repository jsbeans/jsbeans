/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Widgets.Diagram.DefaultLayoutManager',
	$parent: 'JSB.Widgets.Diagram.LayoutManager',
	
	$client: {
		options: {
		},
		
		$constructor: function(diagram, opts){
			var self = this;
			$base(diagram, opts);
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
			if(!nodeRect){
				return false;
			}
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
}