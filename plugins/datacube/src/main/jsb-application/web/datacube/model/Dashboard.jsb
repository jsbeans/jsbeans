{
	$name: 'JSB.DataCube.Model.Dashboard',
	$parent: 'JSB.Workspace.Entry',
	
	getWidgetCount: function(){
		return 0;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.DashboardNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
		}
	}
}