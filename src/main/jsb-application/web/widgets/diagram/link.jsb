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
	$name: 'JSB.Widgets.Diagram.Link',
	$client: {
		diagram: null,
		
		// pt or connector
		source: null,
		target: null,
		path: null,
		joints: [],
		_attrs: {},
		
		options: {
			cellRoundMax: 2,
			wiringClass: '_jsb_diagramWiringLinkMode',
			userSelect: true,
			
			onHighlight: function(bEnable){
				this.group.classed('highlighted', bEnable);
				if(bEnable){
					this.group && this.group.attr('filter', 'url(#' + this.diagram.getShapeId('highlightFilter') + ')');
				} else if(!this.isSelected()){
					this.group && this.group.attr('filter', null);
				}
			},
			onSelect: function(bEnable){
				this.group.classed('selected', bEnable);
				if(bEnable){
					this.group && this.group.attr('filter', 'url(#' + this.diagram.getShapeId('highlightFilter') + ')');
				} else if(!this.isHighlighted()){
					this.group && this.group.attr('filter', null);
				}
			}
		},
		
		$constructor: function(diagram, key, opts){
			var self = this;
			$base();
			this.diagram = diagram;
			this.key = key;
			JSB().merge(true, this.options, this.diagram.linkDescs[key].options, opts);
			
			var isNeedRedraw = false;

			if(this.options.sourceConnector){
			    this.setSource(this.options.sourceConnector, true);
			    isNeedRedraw = true;
			}

			if(this.options.targetConnector){
			    this.setTarget(this.options.targetConnector, true);
			    isNeedRedraw = true;
			}

			if(isNeedRedraw){
			    this.updateConnectors();
			    this.redraw();
			}
			
			this.subscribe('_jsb_diagramConnectorInstalled', function(sender, msg, params){
				if(sender == self.source || sender == self.target){
					self.redraw();
				}
			});
			
		},
		
		setAttribute: function(a, val){
			if(JSB.isNull(val)){
				delete this._attrs[a];
				this.group && this.group.attr(a, null);
			}
			this._attrs[a] = val;
			this.group && this.group.attr(a, val);
		},
		
		destroy: function(){
			if(this.diagram && this.diagram.hasLink(this)){
				this.diagram.removeLink(this);
				return;
			}
			
			// unbind connectors
			if(JSB().isInstanceOf(this.source, 'JSB.Widgets.Diagram.Connector') && this.source.links[this.getId()]){
				this.source.removeLink(this);
				this.source.notifyChangeConnection(this);
			}
			
			if(JSB().isInstanceOf(this.target, 'JSB.Widgets.Diagram.Connector') && this.target.links[this.getId()]){
				this.target.removeLink(this);
				this.target.notifyChangeConnection(this);
			}

			// remove from svg
			if(this.group){
				this.group.remove();
			}
			
			$base();
		},
		
		_checkFixed: function(){
			if(this.source 
				&& JSB().isInstanceOf(this.source, 'JSB.Widgets.Diagram.Connector')
				&& this.source.getNode().isFixed()){
				this.diagram._addFixedLink(this);
			} else if(this.target 
				&& JSB().isInstanceOf(this.target, 'JSB.Widgets.Diagram.Connector')
				&& this.target.getNode().isFixed()){
				this.diagram._addFixedLink(this);
			} else {
				this.diagram._removeFixedLink(this);
			}
		},
		
		setSource: function(obj){
			if(this.source && JSB.isInstanceOf(this.source, 'JSB.Widgets.Diagram.Connector') && this.source != obj){
				// unbind source
				this.source.removeLink(this);
			}
			if(JSB().isInstanceOf(obj, 'JSB.Widgets.Diagram.Connector')){
				this.source = obj;
			} else if(obj && !JSB().isNull(obj.x) && !JSB().isNull(obj.y)){
				this.source = obj;
			} else {
				throw 'Invalid source specified: ' + JSON.stringify(obj);
			}
			this._checkFixed();
			this.updateConnectors();
			this.redraw();
		},

		setTarget: function(obj){
			if(this.target && JSB.isInstanceOf(this.target, 'JSB.Widgets.Diagram.Connector') && this.target != obj){
				// unbind source
				this.target.removeLink(this);
			}
			if(JSB().isInstanceOf(obj, 'JSB.Widgets.Diagram.Connector')){
				this.target = obj;
			} else if(obj && !JSB().isNull(obj.x) && !JSB().isNull(obj.y)){
				this.target = obj;
			} else {
				throw 'Invalid target specified: ' + JSON.stringify(obj);
			}
			this._checkFixed();
			this.updateConnectors();
			this.redraw();
		},
		
		updateConnectors: function(){
			if(!JSB().isInstanceOf(this.source, 'JSB.Widgets.Diagram.Connector') || !JSB().isInstanceOf(this.target, 'JSB.Widgets.Diagram.Connector')){
				return;
			}
			this.source.addLink(this);
			this.target.addLink(this);
			this.source.notifyChangeConnection(this);
			this.target.notifyChangeConnection(this);
		},

		getSourcePosition: function(){
			if(this.source && JSB().isInstanceOf(this.source, 'JSB.Widgets.Diagram.Connector')){
				return this.source.getPoint();
			} else {
				return this.source;
			}
		},
		
		getTargetPosition: function(){
			if(this.target && JSB().isInstanceOf(this.target, 'JSB.Widgets.Diagram.Connector')){
				return this.target.getPoint();
			} else {
				return this.target;
			}
		},
		
		getSource: function(){
			return this.source;
		},

		getTarget: function(){
			return this.target;
		},
		
		getSourceNode: function(){
			if(this.source && JSB().isInstanceOf(this.source, 'JSB.Widgets.Diagram.Connector')){
				return this.source.getNode();
			}
			return null;
		},
		
		getTargetNode: function(){
			if(this.target && JSB().isInstanceOf(this.target, 'JSB.Widgets.Diagram.Connector')){
				return this.target.getNode();
			}
			return null;
		},
		
		constructJoints: function(){
			var joints = [];
			// construct joints
			var jOpts = this.options.joints;
			if(JSB.isFunction(jOpts)){
				jOpts = jOpts.call(this);
			}
			if(JSB.isArray(jOpts)){
				for(var i = 0; i < jOpts.length; i++){
					var jDesc = jOpts[i];
					var joint = new this.diagram.Joint(this, jDesc);
					joints.push(joint);
				}
			}
			
			return joints;
		},
		
		createPathFromPoints: function(pts){
			var pathStr = '';
			for(var i = 0; i < pts.length; i++ ){
				if(i == 0){
					// first point
					pathStr += 'M' + pts[i].x + ',' + pts[i].y;
				} else if(i == pts.length - 1) {
					// last point
					pathStr += 'T' + pts[i].x + ',' + pts[i].y;
				} else {
					// angle point
					var segments = [{
						from: pts[i - 1],
						to: pts[i]
					},{
						from: pts[i + 1],
						to: pts[i]
					}];
					
					for(var j in segments){
						var seg = segments[j];
						var vec = {
							x: seg.to.x - seg.from.x,
							y: seg.to.y - seg.from.y
						};
						var vecLen = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
						if(vecLen > 0){
							vec.x /= vecLen;
							vec.y /= vecLen;
						}
						var vecOffs = vecLen / 2;
						if(vecOffs > this.diagram.getOption('cellSize') * this.options.cellRoundMax){
							vecOffs = this.diagram.getOption('cellSize') * this.options.cellRoundMax;
						}
						segments[j].med = {
							x: seg.to.x - vecOffs * vec.x,
							y: seg.to.y - vecOffs * vec.y
						};
					}
					
					pathStr += 'L' + segments[0].med.x + ',' + segments[0].med.y;
					pathStr += 'Q' + segments[0].to.x + ',' + segments[0].to.y + ' ' + segments[1].med.x + ',' + segments[1].med.y;
				}
			}
			return pathStr;
		},
		
		redraw: function(){
			if(JSB().isNull(this.source) || JSB().isNull(this.target)){
				return;
			}
			
			if(JSB().isInstanceOf(this.source, 'JSB.Widgets.Diagram.Connector') && !this.source.isInstalled()){
				this.source.ensureTrigger('_jsb_diagramConnectorInstalled', ()=>{
					this.redraw();
				});
				return;
			}
			
			if(JSB().isInstanceOf(this.target, 'JSB.Widgets.Diagram.Connector') && !this.target.isInstalled()){
				this.target.ensureTrigger('_jsb_diagramConnectorInstalled', ()=>{
					this.redraw();
				});
				return;
			}
			
			var self = this;
			
			if(!this.group){
				this.group = this.diagram.svg.append('g')
					.classed('link', true)
					.attr('key', this.key);
				if($this._attrs){
					for(var a in $this._attrs){
						this.group.attr(a, $this._attrs[a]);
					}
				}
				this.path = this.group.append('path');
				this.sourceHead = null;
				this.targetHead = null;
				
				// create heads
				if(this.options.heads){
					if(this.options.heads.source && this.options.heads.source.shape){
						var sourceId = this.diagram.useShape(this.options.heads.source.shape);
						this.sourceHead = this.group.append('g')
							.classed('head', true)
							.classed('source', true);
						this.sourceHead.append('use')
							.attr('xlink:href', '#' + sourceId)
							.classed('shape', true);

					}
					if(this.options.heads.target && this.options.heads.target.shape){
						var targetId = this.diagram.useShape(this.options.heads.target.shape);
						this.targetHead = this.group.append('g')
							.classed('head', true)
							.classed('target', true);
						this.targetHead.append('use')
							.attr('xlink:href', '#' + targetId)
							.classed('shape', true);
					}
				}
				
				// add event handler
				this.group.on('click', function(evt){
					self.publish('_jsb_diagramMouseEvent', {name: 'click', event: d3.event});
				});
			}
			
			var ptSource = this.getSourcePosition();
			var ptTarget = this.getTargetPosition();
			
			if(!ptSource || !ptTarget){
				return;
			}
			
			// construct points
			var pts = [ptSource];
			
			var joints = this.constructJoints();
			
			for(var i = 0; i < joints.length; i++){
				var joint = joints[i];
				var pt = joint.getPosition();
				if(pt){
					pts.push(pt);
				}
			}
			
			pts.push(ptTarget);
			
			this.path.attr('d', this.createPathFromPoints(pts));
			
			var bRebuildPath = false;
			
			// place & direct heads
			if(this.sourceHead || this.targetHead){
				var pathNode = this.path.node();
				var pathLength = pathNode.getTotalLength();
				
				function _getOrientation(pt1, pathPos){
					var pt2 = pathNode.getPointAtLength(pathPos);
					var vec = {x: pt1.x - pt2.x, y: pt1.y - pt2.y};
					var vecLength = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
					vec.x /= vecLength;
					vec.y /= vecLength;
					var vec2 = {x: 1, y: 0};
					var val = Math.acos(vec.x * vec2.x + vec.y * vec2.y) * 180 / Math.PI;
					return vec.y < 0 ? -val: val;
				}
				
				if(this.sourceHead){
					var odd = '';
					var sourceOffset = this.options.heads.source.offset || 0;
					var srcPoint = pathNode.getPointAtLength(sourceOffset + 1);
					if(pathLength > 1){
						var o = _getOrientation(ptSource, sourceOffset + 1);
						odd = ' rotate(' + o + ')';
					}
					this.sourceHead.attr('transform', 'translate(' + srcPoint.x + ' ' + srcPoint.y + ')' + odd);
					
					// strip source
					if(this.options.heads.source.strip && pathLength > this.options.heads.source.strip){
						var ptFirst = pathNode.getPointAtLength(this.options.heads.source.strip);
						pts.splice(0, 1, ptFirst);
						bRebuildPath = true;
					}

				}
				if(this.targetHead){
					var odd = '';
					var targetOffset = this.options.heads.target.offset || 0;
					var tgtPoint = pathNode.getPointAtLength(pathLength - 1 - targetOffset);
					if(pathLength > 1){
						var o = _getOrientation(ptTarget, pathLength - 1 - targetOffset);
						odd = ' rotate(' + o + ')';
					}
					this.targetHead.attr('transform', 'translate(' + tgtPoint.x + ' ' + tgtPoint.y + ')' + odd);
					
					// strip target
					if(this.options.heads.target.strip && pathLength > this.options.heads.target.strip){
						var ptLast = pathNode.getPointAtLength(pathLength - this.options.heads.target.strip);
						pts.splice(pts.length - 1, 1, ptLast);
						bRebuildPath = true;
					}
				}
			}
			
			if(bRebuildPath){
				this.path.attr('d', this.createPathFromPoints(pts));
			}
		},
		
		setWiringModeStyle: function(bEnable){
			if(!this.group){
				return;
			}
			this.group.classed(this.options.wiringClass, bEnable);
		},
		
		select: function(bEnable){
		    if(!this.options.userSelect){
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
		},
		
		getPathPoints: function(){
			var pArr = [];
			var pathNode = this.path.node();
			var pathLength = pathNode.getTotalLength();
			for(var i = 0; i < pathLength; i++){
				pArr.push(pathNode.getPointAtLength(i));
			}
			return pArr;
		}
	}
}