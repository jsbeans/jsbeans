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
			
			this.append(#dot{{
				<div class="header">
					<div class="icon"></div>
					<div class="title">Антиплагиат</div>
				</div>
			}});
			this.append(this.layoutManager);

			this.subscribe('changeWorkspaceElement', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Antiplag.Model.Project')){
					return;
				}
			});
		}
		
		
	},
	
	server: {
	}
});