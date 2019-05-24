/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Model.DatabaseTable',
	$parent: 'DataCube.Model.QueryableEntry',

	_missing: false,
	_source: null,
	
	isMissing: function(){
		return this._missing;
	},
	
	getQueryableContainer: function(){
		return this._source;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		$constructor: function(id, workspace, source){
			$base(id, workspace);
			if(source){
				this._source = source;
				this.property('source', {
					wId: this._source.getWorkspace().getId(),
					eId: this._source.getId()
				});
			} else {
				var propSrc = this.property('source');
				if(propSrc){
					this._source = WorkspaceController.getEntry(propSrc.wId, propSrc.eId);
				} else {
					this._source = this.getWorkspace().entry(this.getParentId());
					this.property('source', {
						wId: this._source.getWorkspace().getId(),
						eId: this._source.getId()
					});
				}
				
			}
		},
		
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

		isQuerySupport: function(){
		    return true;
		},

		extractFields: function(){
		    throw new Error('Method "extractFields" should be overridden');
		},
		
		extractParams: function(opts){
			return {};
		},

		getStore: function(){
			return this.getWorkspace().entry(this.getParentId()).getStore();
		},
		
		setMissing: function(bMissing){
			this._missing = bMissing;
			this.property('missing', this._missing);
		}
	}
}