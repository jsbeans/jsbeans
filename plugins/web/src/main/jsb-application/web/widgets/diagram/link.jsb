JSB({
	name: 'JSB.Widgets.Diagram.Link',
	parent: 'JSB.Widgets.Actor',
	require: {
		'JSB.Widgets.Diagram.Joint': 'Joint'
	},
	
	client: {
		diagram: null,
		
		// pt or connector
		source: null,
		target: null,
		path: null,
		joints: [],
		
		options: {
			cellRoundMax: 2,
			wiringClass: '_jsb_diagramWiringLinkMode'
		},
		
		constructor: function(diagram, key, opts){
			var self = this;
			this.base();
			this.diagram = diagram;
			this.key = key;
			JSB().merge(true, this.options, this.diagram.linkDescs[key].options, opts);
			
			// construct joints
			if(this.options.joints){
				for(var i = 0; i < this.options.joints.length; i++){
					var jDesc = this.options.joints[i];
					var jClass = self.Joint;
					if(jDesc.jsb){
						jClass = jDesc.jsb.getClass();
					}
					var joint = new jClass(this, jDesc);
					this.joints.push(joint);
				}
			}
			
		},
		
		installJoint: function(){},
		
		destroy: function(){
			if(this.diagram && this.diagram.hasLink(this)){
				this.diagram.removeLink(this);
				return;
			}
			
			// TODO: unbind connectors
			
			// remove from svg
			if(this.group){
				this.group.remove();
			}
			
			this.getSuperClass('JSB.Widgets.Actor').destroy.call(this);
		},
		
		setSource: function(obj){
			if(JSB().isInstanceOf(obj, 'JSB.Widgets.Diagram.Connector')){
				this.source = obj;
			} else if(obj && !JSB().isNull(obj.x) && !JSB().isNull(obj.y)){
				this.source = obj;
			} else {
				throw 'Invalid source specified: ' + JSON.stringify(obj);
			}
			this.updateConnectors();
			this.redraw();
		},

		setTarget: function(obj){
			if(JSB().isInstanceOf(obj, 'JSB.Widgets.Diagram.Connector')){
				this.target = obj;
			} else if(obj && !JSB().isNull(obj.x) && !JSB().isNull(obj.y)){
				this.target = obj;
			} else {
				throw 'Invalid target specified: ' + JSON.stringify(obj);
			}
			this.updateConnectors();
			this.redraw();
		},
		
		updateConnectors: function(){
			if(!JSB().isInstanceOf(this.source, 'JSB.Widgets.Diagram.Connector') || !JSB().isInstanceOf(this.target, 'JSB.Widgets.Diagram.Connector')){
				return;
			}
			this.source.addLink(this);
			this.target.addLink(this);
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
						vec.x /= vecLen;
						vec.y /= vecLen;
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
			
			if(!this.group){
				this.group = this.diagram.svg.append('g')
					.classed('link', true)
					.attr('key', this.key);
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
			}
			
			var ptSource = this.getSourcePosition();
			var ptTarget = this.getTargetPosition();
			
			// construct points
			var pts = [ptSource];
			
			for(var i = 0; i < this.joints.length; i++){
				var joint = this.joints[i];
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
					if(pathLength > 1){
						var o = _getOrientation(ptSource, 1);
						odd = ' rotate(' + o + ')';
					}
					this.sourceHead.attr('transform', 'translate(' + ptSource.x + ' ' + ptSource.y + ')' + odd);
					
					// strip source
					if(this.options.heads.source.strip && pathLength > this.options.heads.source.strip){
						var ptFirst = pathNode.getPointAtLength(this.options.heads.source.strip);
						pts.splice(0, 1, ptFirst);
						bRebuildPath = true;
					}

				}
				if(this.targetHead){
					var odd = '';
					if(pathLength > 1){
						var o = _getOrientation(ptTarget, pathLength - 1);
						odd = ' rotate(' + o + ')';
					}
					this.targetHead.attr('transform', 'translate(' + ptTarget.x + ' ' + ptTarget.y + ')' + odd);
					
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
		}
		

	},
	
	server: {}
});