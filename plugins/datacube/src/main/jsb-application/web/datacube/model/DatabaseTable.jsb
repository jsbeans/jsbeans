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

		extractFields: function(){
		    throw new Error('Method "extractFields" should be overriden');
		},

		getStore: function(){
			var sourceEntry = this.getWorkspace().entry(this.getParentId());
			return sourceEntry.getStore();
		},

		setMissing: function(bMissing){
			this.missing = bMissing;
			this.property('missing', this.missing);
		}
	}
}