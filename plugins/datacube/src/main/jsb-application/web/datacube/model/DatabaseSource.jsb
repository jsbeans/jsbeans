{
	$name: 'DataCube.Model.DatabaseSource',
	$parent: 'JSB.Workspace.Entry',

	$server: {
		getStore: function(){
			throw new Error('This method should be overriden');
		}
	}
}