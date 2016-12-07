JSB({
	name:'Antiplag.DocumentsView',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.TabView', 'Antiplag.DocAreaView'],
	
	client: {
		tabs: {},
		
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('documentsView');
			this.loadCss('documentsview.css');
			
			this.tabView = new JSB.Widgets.TabView({
				allowNewTab: false
			});
			
			this.append(this.tabView);
			
			this.subscribe('changeWorkspaceElement', function(sender, msg, docDesc){
				if(!JSB().isInstanceOf(docDesc.document, 'Antiplag.Model.Document')){
					return;
				}
				self.openDocument(docDesc);
			});
		},
		
		openDocument: function(docDesc){
			var doc = docDesc.document;
			var id = doc.getId();
			if(this.tabView.containsTab(id)){
				this.tabView.switchTab(id);
			} else {
				var ctrl = new Antiplag.DocAreaView(docDesc);
				var tabDesc = this.tabView.addTab(doc.getTitle(), ctrl, {id: id});
				tabDesc.tab.attr('type', doc.getType());
			}
		}
	},
	
	server: {
		
	}
});