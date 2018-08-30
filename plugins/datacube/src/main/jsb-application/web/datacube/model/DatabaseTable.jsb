{
	$name: 'DataCube.Model.DatabaseTable',
	$parent: 'JSB.Workspace.Entry',
	
	missing: false,
	
	isMissing: function(){
		return this.missing;
	},
	
	$server: {
		
		$constructor: function(id, workspace){
			$base(id, workspace);
		},
		
		setMissing: function(bMissing){
			this.missing = bMissing;
			this.property('missing', this.missing);
		}		
	}
}