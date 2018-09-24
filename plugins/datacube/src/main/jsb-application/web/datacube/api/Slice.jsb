{
	$name: 'DataCube.Api.Slice',
	$parent: 'JSB.Widgets.Page',
	$html: {
		title: 'DataCube Slice API',
		favicon: '/datacube/images/datacube.png'
	},
	
	$client: {
		
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController', 'JSB.Web'],
		
		destroy: function(){
			$base();
		},
		
		post: function(params){
			return this.get(params);
		},
		
		get: function(params){
			if(Object.keys(params).length == 0){
				return $base(params);
			}
			
			if(!params.wsid){
				throw new Error('Missing parameter: "wsid" (workspace Id)');
			}

			if(!params.sid){
				throw new Error('Missing parameter: "sid" (slice Id)');
			}
			
			if(!params.query){
				throw new Error('Missing parameter: "query"');
			}

			var w = WorkspaceController.getWorkspace(params.wsid);
			if(!w){
				throw new Error('Unable to find workspace with id: ' + params.wsid);
			}
			
			var slice = w.entry(params.sid);
			if(!slice || !JSB.isInstanceOf(slice, 'DataCube.Model.Slice')){
				throw new Error('Unable to find slice with id: ' + params.sid);
			}
			
			
			var dataset = [];
			var limit = 0;
			if(params.limit){
				if(!JSB.isNumber(params.limit)){
					throw new Error('Invalid "limit" parameter passed: ' + JSON.stringify(params.limit));
				}
				limit = params.limit;
			}
			var skip = 0;
			if(params.skip){
				if(!JSB.isNumber(params.skip)){
					throw new Error('Invalid "skip" parameter passed: ' + JSON.stringify(params.skip));
				}
				skip = params.skip;
			}
			
			// read
			var it = null;
			try {
				it = slice.executeQuery({extQuery: params.query, useCache: true});
				if(!it){
					throw new Error('Failed to execute query: ' + JSON.stringify(params.query));
				}
				
				var cnt = 0;
				while(true){
					var el = it.next();
					cnt++;
					if(!el){
						break;
					}
					if(skip >= cnt){
						continue;
					}
					dataset.push(el);
					if(limit && dataset.length >= limit){
						break;
					}
				}
			} finally {
				if(it){
					try {it.close();} catch(e){}
				}
			}
			
			return Web.response(dataset, {mode:'json'});
			
		}
		
	}
}