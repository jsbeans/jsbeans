({
	$name: 'JSB.Store.DataStore',
	$session: false,
	$server: {
		$require: [
		],

		$constructor: function(config, storeManager){
			$base();
			this.config = config;
			this.storeManager = storeManager;
		},

		getName: function(){
		    return this.config.name;
		},

		asSQL: function() {
            throw new Error('SQL query not supported for store ' + this.config.name);
		},

		asMongo: function() {
            throw new Error('MongoDB query not supported for store ' + this.config.name);
		},
		
		getType: function(){
			return this.config.type;
		},

		close: function() {
			this.storeManager._removeStore(this);
		    this.destroy();
		},
    }
})