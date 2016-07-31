JSB({
	name:'Ontoed.Main',
	parent: 'JSB.Widgets.Widget',
	require: {
		'JSB.Widgets.SplitLayoutManager': 'SplitLayoutManager'
	},
	client: {
		constructor: function(opts){
			this.base(opts);
			this.loadCss('main.css');
			this.init();
		},
		
		init: function(){
			var self = this;
			this.addClass('ontoedContainer');
			this.layoutManager = new self.SplitLayoutManager({
				defaultLayout: 'main',
				layouts: {
					main: {
						split: 'vertical',
						panes: [{
							size: 0.25,
							widgets: 'workspace',
							caption: true
						},{
							split: 'horizontal',
							panes: [{
								size: 0.7,
								widgets: 'welcomeForm'
							},{
								widgets: ['logView','console'],
								caption: true,
								defaultWidget: 'logView'
							}]
						}]
					},
					ontology: {
						split: 'vertical',
						panes: [{
							split: 'horizontal',
							size: 0.25,
							panes:[{
								size: 0.6,
								widgets: ['classesView','propsView'],
								caption: true,
								defaultWidget: 'classesView'
							},{
								widgets: 'workspace',
								caption: true
							}]
						},{
							split: 'horizontal',
							panes: [{
								key: 'ontoViews',
								size: 0.7,
								caption: true,
								widgets: ['ontologyView', 'diagramView', 'axiomView', 'entityView']
							},{
								widgets: ['logView','instanceView', 'console'],
								caption: true,
								defaultWidget: 'logView'
							}]
						}]
					},
					spinontology: {
						split: 'vertical',
						panes: [{
							split: 'horizontal',
							size: 0.25,
							panes:[{
								size: 0.6,
								widgets: ['classesView', 'propsView', 'functionsView'],
								caption: true,
								defaultWidget: 'classesView'
							},{
								widgets: 'workspace',
								caption: true
							}]
						},{
							split: 'horizontal',
							panes: [{
								key: 'ontoViews',
								size: 0.7,
								caption: true,
								widgets: ['ontologyView', 'diagramView', 'axiomView', 'entityView']
							},{
								widgets: ['logView','instanceView', 'console'],
								caption: true,
								defaultWidget: 'logView'
							}]
						}]
					}
				},
				
				widgets: {
					workspace: {
						jsb: 'Ontoed.WorkspaceView',
						title: 'Навигатор'
					},
					ontologyView: {
						jsb: 'Ontoed.OntologyView',
						title: 'Свойства'
					},
					entityView: {
						jsb: 'Ontoed.EntityView'
					},
					tools: {
						jsb: 'JSB.Widgets.SplitLayoutManager',
						options: {
							
						}
					},
					console: {
						jsb: 'Console',
						title: 'Консоль'
					},
					test: {
						jsb: 'testwidget',
						title: 'Просто виджет'
					},
					classesView: {
						jsb: 'Ontoed.ClassHierarchyView',
						title: 'Классы'
					},
					propsView: {
						jsb: 'Ontoed.PropertyHierarchyView',
						title: 'Свойства'
					},
					functionsView: {
						jsb: 'Ontoed.FunctionsView',
						title: 'Функции'
					},
					welcomeForm: {
						jsb: 'Ontoed.WelcomeForm'
					},
					
					diagramView: {
						jsb: 'Ontoed.DiagramView',
						title: 'Диаграмма'
					},

					axiomView: {
						jsb: 'Ontoed.AxiomView',
						title: 'Аксиомы'
					},
					
					logView: {
						jsb: 'Ontoed.LogView',
						title: 'Журнал'
					},
					
					instanceView: {
						jsb: 'Ontoed.InstanceView',
						title: 'Экземпляры'
					}


				}
			});
			
			this.append(this.layoutManager);
			
			// inject header
			var wc = this.layoutManager.getPaneContainer('ontoViews', 'ontology');
			var tabView = wc.wcView;
			tabView.prepend(#dot{{
				<div class="header">
					<div class="projectIcon"></div>
					<div class="projectInfo"></div>
				</div>
			}});

			var wc = this.layoutManager.getPaneContainer('ontoViews', 'spinontology');
			var tabView = wc.wcView;
			tabView.prepend(#dot{{
				<div class="header">
					<div class="projectIcon"></div>
					<div class="projectInfo"></div>
				</div>
			}});

			this.subscribe('changeWorkspaceElement', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Ontoed.Project')){
					return;
				}
				
				if(JSB().isInstanceOf(obj, 'Ontoed.Model.Ontology')){
					
					if(JSB().isInstanceOf(obj, 'Ontoed.Model.SpinOntology')){
						// switch to spinontology layout
						self.layoutManager.switchLayout('spinontology');
					} else {
						// switch to ontology layout
						self.layoutManager.switchLayout('ontology');
					}
					
					// switch to ontology view
					var ow = self.find('.ontologyOverview').jso();
					ow.container.switchWidget(ow.getId());
					
					// hide entity view
					var ew = self.find('.entityView').jso();
					var tab = ew.container.getTab(ew.getId());
					ew.container.wcView.showTab(tab, false);
				}
			});
			
			this.subscribe('changeCurrentEntity', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Ontoed.Model.Entity')){
					return;
				}
				
				// show entity view
				var ew = self.find('.entityView').jso();
				var tab = ew.container.getTab(ew.getId());
				ew.container.wcView.showTab(tab, true);
				
				// switch entity view
				ew.container.switchWidget(ew.getId());
			});
			
		},
		
		
	},
	
	server: {
	}
});