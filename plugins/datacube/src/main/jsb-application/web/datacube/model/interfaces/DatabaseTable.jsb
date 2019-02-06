{
	$name: 'DataCube.Model.DatabaseTable',
	$parent: 'DataCube.Model.SettingsEntry',

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

	    createQuerySelect: function(selectedFields, useContext){
            var fields = this.extractFields(),
                context = this.getFullId(),
                select = {};

            for(var i in fields){
                if(selectedFields && !selectedFields[i]){
                    continue;
                }

                if(useContext){
                    select[i] = {
                        $context: context,
                        $field: i
                    };
                } else {
                    select[i] = {
                        $field: i
                    };
                }
            }

            return select;
	    },

		extractFields: function(){
		    throw new Error('Method "extractFields" should be overridden');
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