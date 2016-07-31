JSB({
	name: 'JSB.Widgets.Diagram.Link',
	parent: 'JSB.Widgets.Actor',
	require: {},
	
	client: {
		diagram: null,
		
		// pt or connector
		source: null,
		target: null,
		path: null,
		
		options: {
			cellRoundMax: 2,
			wiringClass: '_jsb_diagramWiringLinkMode'
		},
		
		constructor: function(diagram, key, opts){
			var self = this;
			this.base();
			this.diagram = diagram;
			this.key = key;
			JSB().merge(this.options, this.diagram.linkDescs[key].options, opts);
			
			// construct link
			
		},
		
		destroy: function(){
			if(this.diagram && this.diagram.hasLink(this)){
				this.diagram.removeLink(this);
				return;
			}
			
			// TODO: unbind connectors
			
			// remove from svg
			if(this.path){
				this.path.remove();
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
							left: seg.to.x - vecOffs * vec.x,
							top: seg.to.y - vecOffs * vec.y
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
			if(!this.path){
				this.path = this.diagram.svg.append('path')
					.classed('link', true)
					.attr('key', this.key);
			}
			
			var ptSource = this.getSourcePosition();
			var ptTarget = this.getTargetPosition();
			
			var pts = [ptSource, ptTarget];
			var path = this.createPathFromPoints(pts);
			
			
			this.path.attr('d', path);
		},
		
		setWiringModeStyle: function(bEnable){
			if(!this.path){
				return;
			}
			this.path.classed(this.options.wiringClass, bEnable);
		}
		

	},
	
	server: {}
});