JSB({
	name:'Antiplag.Main',
	parent: 'JSB.Widgets.Widget',
	require: {
		'JSB.Widgets.SplitLayoutManager': 'SplitLayoutManager'
	},
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('main.css');
			this.init();
		},
		
		init: function(){
			var self = this;
			this.addClass('antiplagContainer');
			this.layoutManager = new self.SplitLayoutManager({
				defaultLayout: 'main',
				layouts: {
					main: {
						split: 'vertical',
						panes: [{
							minSize: 300,
							size: 0.25,
							widgets: 'workspace',
							caption: true
						},{
							split: 'horizontal',
							minSize: '60%',
							widgets: 'documents'
						}]
					}
				},
				
				widgets: {
					workspace: {
						jsb: 'Antiplag.WorkspaceView',
						title: 'Навигатор'
					},
					welcomeForm: {
						jsb: 'Antiplag.WelcomeForm'
					},
					
					documents: {
						jsb: 'Antiplag.DocumentsView'
					}
				}
			});
			
			this.append(this.layoutManager);
/*			
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
*/
			this.subscribe('changeWorkspaceElement', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Antiplag.Model.Project')){
					return;
				}
/*				
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
*/				
			});
		}
		
		
	},
	
	server: {
	}
});