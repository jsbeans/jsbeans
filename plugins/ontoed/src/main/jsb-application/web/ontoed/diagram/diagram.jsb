JSB({
	name: 'Ontoed.Diagram',
	parent: 'JSB.Widgets.Diagram',
	require: {
		'Ontoed.Diagram.ClassNode': 'ClassNode'
	},
	
	common: {
		currentOntology: null,
	},
	
	client: {
		options: {
			minZoom: 0.25,
			nodes: {
				classNode: {
					jsb: 'Ontoed.Diagram.ClassNode'	
				}
				
			},
			connectors: {
				subClassOf_parent: {
					type: 'subClassOf',
					subType: 'parent',
					acceptLocalLinks: false,
					align: 'bottom',
					wiringLink: {
						key: 'subClassOf',
						type: 'target'
					}
				},
				
				subClassOf_child: {
					type: 'subClassOf',
					subType: 'child',
					acceptLocalLinks: false,
					wiringLink: {
						key: 'subClassOf',
						type: 'source'
					}
				},
				
				classMapping_target: {
					type: 'mapping',
					category: 'class',
					subType: 'target',
					acceptLocalLinks: false,
					align: 'left',
					offsetX: 1,
					wiringLink: {
						key: 'classMapping',
						type: 'target'
					}
				},
				
				classMapping_source: {
					type: 'mapping',
					category: 'class',
					subType: 'source',
					acceptLocalLinks: false,
					wiringLink: {
						key: 'classMapping',
						type: 'source'
					}
				},				
				
				propMapping_target: {
					type: 'mapping',
					category: 'prop',
					subType: 'target',
					align: 'left',
					offsetX: 2,
					acceptLocalLinks: false,
					wiringLink: {
						key: 'propMapping',
						type: 'target'
					}

				},

				propMapping_source: {
					type: 'mapping',
					category: 'prop',
					subType: 'source',
					acceptLocalLinks: false,
					wiringLink: {
						key: 'propMapping',
						type: 'source'
					}
				}
				
			},
			
			links: {
				subClassOf: {
					source: 'subClassOf_child',
					target: 'subClassOf_parent',
					joints: [{
						name: 'bottomOffset',
						position: function(){
							var pt = this.getLink().getSourcePosition();
							return {x: pt.x, y: pt.y - 20};
						}
					},{
						name: 'topOffset',
						position: function(){
							var pt = this.getLink().getTargetPosition();
							return {x: pt.x, y: pt.y + 30};
						}
					}],
					heads: {
						target: {
							shape: 'arrowTriangle',
							strip: 5
						}
					}
				},
				
				classMapping: {
					source: 'classMapping_source',
					target: 'classMapping_target',
					joints: [{
						name: 'leftOffset',
						position: function(){
							var pt = this.getLink().getSourcePosition();
							return {x: pt.x + 20, y: pt.y};
						}
					},{
						name: 'context',
						position: function(){}
					},{
						name: 'rightOffset',
						position: function(){
							var pt = this.getLink().getTargetPosition();
							return {x: pt.x - 30, y: pt.y};
						}
					}],
					heads: {
						target: {
							shape: 'arrowSharp',
							strip: 5
						}
					}
				},
				
				propMapping: {
					source: 'propMapping_source',
					target: 'propMapping_target',
					joints: [{
						name: 'leftOffset',
						position: function(){
							var pt = this.getLink().getSourcePosition();
							return {x: pt.x + 20, y: pt.y};
						}
					},{
						name: 'context',
						position: function(){}
					},{
						name: 'rightOffset',
						position: function(){
							var pt = this.getLink().getTargetPosition();
							return {x: pt.x - 20, y: pt.y};
						}
					}],
					heads: {
						target: {
							shape: 'arrowSharp',
							strip: 5
						}
					}

				}
				
			}
		},
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('ontologyDiagram');
			this.loadCss('diagram.css');
			
			this.getElement().droppable({
				accept: function(d){
					if(d && d.length > 0 && d.get(0).draggingItems){
						var nodes = [];
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i].obj;
							if(!JSB().isInstanceOf(obj, 'Ontoed.ClassRenderer')){
								continue;
							}
							nodes.push(obj);
						}
						// check for dragging items
						return nodes.length > 0;
					}
					return false;
				},
				tolerance: 'pointer',
				greedy: true,
				over: function(evt, ui){
					if( !ui.helper.hasClass('accepted') ){
						ui.helper.addClass('accepted');
					}
					self.addClass('acceptDraggable');
				},
				out: function(evt, ui){
					if( ui.helper.hasClass('accepted') ){
						ui.helper.removeClass('accepted');
					}
					self.removeClass('acceptDraggable');
				},
				drop: function(evt, ui){
					var posPt = self.pageToSheetCoords({x: ui.offset.left, y: ui.offset.top});
					self.removeClass('acceptDraggable');
					var d = ui.draggable;
					if(d && d.length > 0 && d.get(0).draggingItems){
						var nodes = [];
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i].obj;
							if(!JSB().isInstanceOf(obj, 'Ontoed.ClassRenderer')){
								continue;
							}
							nodes.push(obj);
						}
						if(nodes.length > 0){
							self.addClasses(nodes, posPt);
						}
					}
				}
			});
		},
/*		
		setOntology: function(onto){
			var self = this;
			if(this.currentOntology == onto){
				return;
			}
			this.currentOntology = onto;
			this.server.setOntology(onto, function(){
				self.refresh();
			});
			
		},
		
		refresh: function(){
			var self = this;
			this.clear();
			this.server.loadClassTree(function(desc){
				self.constructFromClassTree(desc);
			});
			
		},
		
		constructFromClassTree: function(desc){
			debugger;
		}
*/		
		addClasses: function(classNodes, pt){
			var self = this;
			for(var i = 0; i < classNodes.length; i++){
				var classEntity = classNodes[i].entity;
				
				// create class node descriptor
				var classNode = this.createNode('classNode', {entity:classEntity});
				classNode.setPosition(pt.x, pt.y);
			}
		}
	},
	
	server: {
/*		
		setOntology: function(onto){
			this.currentOntology = onto;
		},
		
		loadClassTree: function(){
			return {
				entities: this.currentOntology.classes,
				etree: this.currentOntology.classHierarchy
			}
		}
*/		
	}
});