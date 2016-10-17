JSB({
	name:'Antiplag.DocumentsView',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.TabView', 'Antiplag.DocAreaView'],
	
	client: {
		tabs: {},
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('documentsView');
			this.loadCss('documentsview.css');
			
			this.tabView = new JSB.Widgets.TabView({
				allowNewTab: false
			});
			
			this.append(this.tabView);
			
			this.subscribe('changeWorkspaceElement', function(sender, msg, doc){
				if(!JSB().isInstanceOf(doc, 'Antiplag.Model.Document')){
					return;
				}
				self.openDocument(doc);
			});
		},
		
		openDocument: function(doc){
			var id = doc.getId();
			if(this.tabView.containsTab(id)){
				this.tabView.switchTab(id);
			} else {
				var ctrl = new Antiplag.DocAreaView({document:doc});
				var tabDesc = this.tabView.addTab(doc.getTitle(), ctrl, {id: id});
				tabDesc.tab.attr('type', doc.getType());
			}
		}
	},
	
	server: {
		
	}
});