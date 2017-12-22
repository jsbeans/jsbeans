{
	$name: 'DataCube.Providers.DataProvider',
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},
	
	entry: null,
	cube: null,
	name: null,
	options: {
		mode: 'union'
	},
	
	getName: function(){
		return this.name;
	},
	
	getMode: function(){
		return this.options.mode || 'union';
	},
	
	getCube: function(){
		return this.cube;
	},
	
	getOption: function(opt){
		return this.options[opt];
	},
	
	$server: {
		$disableRpcInstance: true,
		
		$constructor: function(id, pEntry, cube, opts){
			this.entry = pEntry;
			this.cube = cube;
			this.id = id;
			if(opts){
				this.setOptions(opts)
			}
			$base();
		},
		
		extractFields: function(opts){
			throw new Error('Method "extractFields" should be overriden');
		},
		
		find: function(q){
			throw new Error('Method "find" should be overriden');
		},
		
		getOptions: function(){
			return JSB.clone(this.options);
		},
		
		setOptions: function(opts){
			this.options = opts;
		}
	}
}