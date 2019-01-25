{
	$name: 'DataCube.Model.DatabaseSource',
	$parent: 'JSB.Workspace.Entry',
	
	$server: {
		
		$constructor: function(id, workspace){
			$base(id, workspace);
		},
		
		getStore: function(){
			throw new Error('This method should be overriden');
		}
	}
}