{
    $name: 'Datacube.ValueSelectors.EntryBinding',
    $parent: 'Unimap.ValueSelectors.Basic',
    
    $client: {
    	getEntry: function(callback){
    		$this.server().getEntry(this.value(), callback);
    	}	
    },
    
    $server: {
    	$require: 'JSB.Workspace.WorkspaceController',
    	
    	getEntry: function(eDesc){
    		if(!eDesc){
    			eDesc = this.value();
    		}
    		if(!eDesc || !eDesc.workspaceId || !eDesc.entryId){
    			return null;
    		}
    		return WorkspaceController.getEntry(eDesc.workspaceId, eDesc.entryId);
    	}
    }

}