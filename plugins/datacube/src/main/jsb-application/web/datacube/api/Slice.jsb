{
	$name: 'JSB.DataCube.Api.Slice',
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
			
			if(!params.wid){
				throw new Error('Missing parameter: "wid" (workspace Id)');
			}

			if(!params.sid){
				throw new Error('Missing parameter: "sid" (slice Id)');
			}
			
			if(!params.query){
				throw new Error('Missing parameter: "query"');
			}

			var wm = WorkspaceController.ensureManager('datacube');
			if(!wm){
				throw new Error('Internal error: missing WorkspaceManager for datacube');
			}
			var w = wm.workspace(params.wid);
			if(!w){
				throw new Error('Unable to find workspace with id: ' + params.wid);
			}
			
			var slice = w.entry(params.sid);
			if(!slice || !JSB.isInstanceOf(slice, 'JSB.DataCube.Model.Slice')){
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
			var it = slice.executeQuery(params.query);
			if(!it){
				throw new Error('Failed to execute query: ' + JSON.stringify(params.query));
			}
			
			var cnt = 0;
			while(true){
				var el = null;
				try {
					el = it.next();
					cnt++;
				}catch(e){
					el = null;
				}
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
			it.close();
			
			return Web.response(dataset, {mode:'json'});
			
		}
		
	}
}