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
			
			if(!params.wid){
				throw new Error('Missing parameter: "wid" (workspace Id)');
			}

			if(!params.cid){
				throw new Error('Missing parameter: "cid" (cube Id)');
			}
			
			var wm = WorkspaceController.ensureManager('datacube');
			if(!wm){
				throw new Error('Internal error: missing WorkspaceManager for datacube');
			}
			var w = wm.workspace(params.wid);
			if(!w){
				throw new Error('Unable to find workspace with id: ' + params.wid);
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
			
			// read
			var qDesc = cube.parametrizeQuery(params.query);
			
			var it = cube.queryEngine.query(qDesc.query, qDesc.params);
			if(!it){
				throw new Error('Failed to execute query: ' + JSON.stringify(query));
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