({
	$name: 'JSB.Store.DataStore',

	$server: {
		$require: [
		],

		$constructor: function(config){
			$base();
			this.config = config;
		},

		getName: function(){
		    return this.config.name;
		},

		asSQL: function() {
            throw new Error('SQL query not supported for store ' + this.config.name);
		},

		asParametrizedSQL: function() {
            throw new Error('Parametrized SQL query not supported for store ' + this.config.name);
		},

		asMoSQL: function() {
            throw new Error('Mongo-sql query not supported for store ' + this.config.name);
		},

		asMongo: function() {
            throw new Error('MongoDB query not supported for store ' + this.config.name);
		},
    }
})