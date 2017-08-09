{
	$name: 'DataCube.DashboardEditorView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: ['DataCube.DashboardEditor'],
		
		editor: null,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('DashboardEditorView.css');
			this.addClass('dashboardEditorView');
		},
		
		refresh: function(){
			if(!this.editor){
				this.editor = new DashboardEditor();
				this.append(this.editor);
			}
			this.editor.setCurrentEntry(this.node.getEntry());
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 1,
				acceptNode: 'DataCube.DashboardNode',
				caption: 'Редактирование'
			});
		},
	}
}