{
	$name: 'JSB.DataCube.Model.Slice',
	$parent: 'JSB.Workspace.Entry',
	
	cube: null,
	name: null,
	query: {},
	
	getName: function(){
		return this.name;
	},
	
	getQuery: function(){
		return this.query;
	},
	
	$client: {},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.SliceNode');
		},
		
		$constructor: function(id, workspace, cube, name){
			$base(id, workspace);
			if(cube && name){
				this.cube = cube;
				this.name = name;
				this.property('cube', this.cube.getLocalId());
				this.title(this.name);
				this.property('query', this.query);
			} else {
				if(this.property('cube')){
					this.cube = this.workspace.entry(this.property('cube'));
				}
				this.name = this.title();
				if(this.property('query')){
					this.query = this.property('query');
				}
			}
		},
		
		setQuery: function(q){
			this.query = q;
			this.property('query', this.query);
			this.doSync();
		},
		
		updateSettings: function(desc){
			this.name = desc.name;
			this.query = desc.query;
			this.title(this.name);
			this.property('query', this.query);
			this.cube.store();
			this.doSync();
		},
		
		executeQuery: function(){
			var preparedQuery = this.query;
            if(!preparedQuery || Object.keys(preparedQuery).length == 0){
            	preparedQuery = { $select: {}};
            }
            this.cube.load();
            return this.cube.queryEngine.query(preparedQuery);
		}
		
	}
}