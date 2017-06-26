{
	$name: 'JSB.DataCube.Model.Slice',
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},
	
	cube: null,
	name: null,
	query: {
		test: 1
	},
	
	getName: function(){
		return this.name;
	},
	
	getQuery: function(){
		return this.query;
	},
	
	$client: {},
	
	$server: {
		$constructor: function(id, cube, name){
			this.id = id;
			this.cube = cube;
			this.name = name;
			$base();
		},
		
		setQuery: function(q){
			this.query = q;
			this.cube.store();
			this.doSync();
		},
		
		updateSettings: function(desc){
			this.name = desc.name;
			this.query = desc.query;
			this.cube.store();
			this.doSync();
		}
		
	}
}