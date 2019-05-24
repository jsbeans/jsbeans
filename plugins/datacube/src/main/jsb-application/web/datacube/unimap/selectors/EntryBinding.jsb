/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
    $name: 'Datacube.Selectors.EntryBinding',
    $parent: 'Unimap.Selectors.Basic',

    $alias: 'entryBinding',
    
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
    	},
    	
    	getEntries: function(){
    		var eDescArr = this.values(true);
    		var eArr = [];
    		if(eDescArr && eDescArr.length > 0){
	    		for(var i = 0; i < eDescArr.length; i++){
	    			eArr.push(this.getEntry(eDescArr[i]));
	    		}
    		}
    		
    		return eArr;
    	}
    }
}