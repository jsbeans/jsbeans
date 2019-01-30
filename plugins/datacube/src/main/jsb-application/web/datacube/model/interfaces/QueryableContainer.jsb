{
	$name: 'DataCube.Model.QueryableContainer',
	$parent: 'DataCube.Model.SettingsEntry',
	
	$server: {
		// check necessity
		parametrizeQuery: function(query){
			var newQuery = JSB.clone(query);
			var params = {};
			var filterOps = {
				'$eq': true,
				'$lt': true,
				'$lte': true,
				'$gt': true, 
				'$gte': true,
				'$ne': true,
				'$like': true,
				'$ilike': true
			};
			
			if(newQuery && Object.keys(newQuery).length > 0){
	        	// translate $filter
	        	if(newQuery.$filter || newQuery.$cubeFilter || newQuery.$postFilter){
	        		var c = {i: 1};
	        		function getNextParam(){
	        			return 'p' + (c.i++);
	        		}
	        		function prepareFilter(scope){
	        			for(var f in scope){
	        				if(filterOps[f] && !JSB.isObject(scope[f]) && !JSB.isArray(scope[f])){
/*	        					
	        					var pName = getNextParam();
	        					params[pName] = scope[f];
	        					scope[f] = '${'+pName+'}';
*/
	        					scope[f] = {$const:scope[f]};

	        				} else if(f == '$and' || f == '$or' || f == '$in' || f == '$nin'){
	        					var arr = scope[f];
	        					for(var i = 0; i < arr.length; i++){
	        						if(!JSB.isObject(arr[i]) && !JSB.isArray(arr[i])){
	        							arr[i] = {$const:arr[i]};
	        						} else {
	        							prepareFilter(arr[i]);
	        						}
	        					}
	        				} else {
	        					prepareFilter(scope[f]);
	        				}
	        			}
	        		}
	        		if(newQuery.$filter){
	        			prepareFilter(newQuery.$filter);
	        		}
	        		if(newQuery.$cubeFilter){
	        			prepareFilter(newQuery.$cubeFilter);
	        		}
	        		if(newQuery.$postFilter){
	        			prepareFilter(newQuery.$postFilter);
	        		}
	        	}
            }
			
			return {
				query: newQuery,
				params: params
			}
		}
		
	}
}