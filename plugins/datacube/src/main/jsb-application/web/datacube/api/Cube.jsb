{
	$name: 'DataCube.Api.Cube',
	$parent: 'JSB.Widgets.Page',
	$html: {
		title: 'DataCube Cube API',
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

			if(!params.cid){
				throw new Error('Missing parameter: "cid" (cube Id)');
			}
			
			var w = WorkspaceController.getWorkspace(params.wsid);
			if(!w){
				throw new Error('Unable to find workspace with id: ' + params.wsid);
			}
			
			var cube = w.entry(params.cid);
			if(!cube || !JSB.isInstanceOf(cube, 'DataCube.Model.Cube')){
				throw new Error('Unable to find cube with id: ' + params.cid);
			}
			cube.load();

			if(params.query){
				return this.executeQuery(cube, params);
			} else if(params.list){
				return this.executeList(cube, params);
			} else {
				throw new Error('Missing parameter: "query"');
			}
			
			
		},
		
		executeList: function(cube, params){
			var list = params.list;
			var resp = {};
			switch(list){
			case 'fields':
				var fields = cube.getFields();
				resp = [];
				for(var fName in fields){
					var fDesc = {
						field: fName,
						type: fields[fName].type,
						link: fields[fName].link,
						order: fields[fName].order,
						binding: []
					};
					for(var i = 0; i < fields[fName].binding.length; i++){
						var b = fields[fName].binding[i];
						fDesc.binding.push({
							provider: b.provider.getId(),
							field: b.field,
							type: b.type
						});
					}
					resp.push(fDesc);
				}
				break;
			default:
				throw new Error('Unsupported list parameter: ' + list);
			}
			
			return Web.response(resp, {mode:'json'});
		},
		
		executeQuery: function(cube, params){
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
			
			var q = params.query;
			if(Object.keys(q.$select).length == 0){
				// insert all cube fields
				var fields = cube.getManagedFields();
				for(var fName in fields){
					q.$select[fName] = fName;
				}
			}
			
			// read
			var qDesc = cube.parametrizeQuery(q);
			var it = null;
			try {
				it = cube.executeQuery(qDesc.query, qDesc.params, null, true);
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
			} finally {
				if(it){
					try {it.close();}catch(e){}
				}
			}
			
			
			return Web.response(dataset, {mode:'json'});
		}
		
	}
}