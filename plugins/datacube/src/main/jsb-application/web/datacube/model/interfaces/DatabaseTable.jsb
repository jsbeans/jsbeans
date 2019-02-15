{
	$name: 'DataCube.Model.DatabaseTable',
	$parent: 'DataCube.Model.QueryableEntry',

	missing: false,
	
	isMissing: function(){
		return this.missing;
	},
	
	$server: {
	    createQuery: function(useContext){
	        return {
	            $context: this.getName(),
	            $provider: this.getFullId(),
	            $select: this.createQuerySelect(null, useContext)
	        };
	    },

	    executeQuery: function(opts){
	    	var query = this.createQuery();
	    	var extendedQueryDesc = this.extendQuery(query, opts);
			return $this.getQueryableContainer().executeQuery(extendedQueryDesc.query, extendedQueryDesc.params);
	    },

		extractFields: function(){
		    throw new Error('Method "extractFields" should be overridden');
		},

		getStore: function(){
			return this.getWorkspace().entry(this.getParentId()).getStore();
		},
		
		getQueryableContainer: function(){
			return this.getWorkspace().entry(this.getParentId());
		},

		setMissing: function(bMissing){
			this.missing = bMissing;
			this.property('missing', this.missing);
		}
	}
}