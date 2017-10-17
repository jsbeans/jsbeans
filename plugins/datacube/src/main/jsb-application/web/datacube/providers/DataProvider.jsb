{
	$name: 'DataCube.Providers.DataProvider',
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},
	
	entry: null,
	cube: null,
	name: null,
	mode: null,
	
	getName: function(){
		return this.name;
	},
	
	$server: {
		$disableRpcInstance: true,
		
		$constructor: function(id, pEntry, cube, opts){
			this.entry = pEntry;
			this.cube = cube;
			this.id = id;
			this.mode = opts.mode;
			$base();
		},
		
		extractFields: function(){
			throw new Error('Method "extractFields" should be overriden');
		},
		
		find: function(q){
			throw new Error('Method "find" should be overriden');
		}
	}
}