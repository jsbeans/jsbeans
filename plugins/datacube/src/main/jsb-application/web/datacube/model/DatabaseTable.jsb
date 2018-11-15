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

		extractFieldsForDisplay: function(){
            var fields = this.extractFields(),
                fieldsArr = [];

            for(var j in fields){
                fieldsArr.push({
                    key: j,
                    name: fields[j].name,
                    type: fields[j].type
                });
            }

            return fieldsArr;
		},

		getStore: function(){
			return this.getWorkspace().entry(this.getParentId()).getStore();
		},

		setMissing: function(bMissing){
			this.missing = bMissing;
			this.property('missing', this.missing);
		}
	}
}