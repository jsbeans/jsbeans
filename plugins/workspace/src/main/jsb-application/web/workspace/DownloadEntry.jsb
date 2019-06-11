/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'JSB.Workspace.DownloadEntry',
	$http: true,
	$fixedId: true,
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController', 'JSB.Web', 'JSB.IO.Stream'],
		
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

			if(!params.eid){
				throw new Error('Missing parameter: "eid" (entry Id)');
			}
			
			var w = WorkspaceController.getWorkspace(params.wsid);
			if(!w){
				throw new Error('Unable to find workspace with id: ' + params.wsid);
			}
			
			var entry = w.entry(params.eid);
			if(!entry || !JSB.isInstanceOf(entry, 'JSB.Workspace.FileEntry')){
				throw new Error('Unable to find file entry with id: ' + params.eid);
			}

			//var request = Web.getRequest();
			var response = Web.getResponse();
			
			response.setCharacterEncoding('UTF-8');
			
			var outputStream = response.getOutputStream();
			var oStream = new Stream(outputStream);
			
			try {
				var iStream = entry.loadArtifact('.data', {stream: true});
				iStream.copy(oStream);
				iStream.close();
			} finally {
				oStream.close();
			}
		},
		
		
	}
}