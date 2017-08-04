{
	$name: 'DataCube.Model.JsonFile',
	$parent: 'JSB.Workspace.FileEntry',
	
	records: null,
	
	getRecordsCount: function(){
		return this.records;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.IO.Decoder'],
		
		$bootstrap: function(){
			WorkspaceController.registerFileUploadCallback('datacube', this, 0.5, function(name, data){
				if(/\.json$/i.test(name)){
					return true;
				}
				return false;
			});
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'DataCube.JsonFileNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(opts){
				if(opts.fileName){
					this.title(opts.fileName);
				}
				if(opts.fileData){
					// try to parse JSON
					var charsets = ['UTF-8','Windows-1251'];
					var json = null;
					for(var i = 0; i < charsets.length; i++){
						var charset = charsets[i];
						var decoder = new Decoder(charset);
						try {
							var jsonStr = decoder.decode(opts.fileData);
							json = JSON.parse(jsonStr);
							break;
						} catch(e){
							continue;
						} finally {
							decoder.close();	
						}
					}
					if(!json){
						throw new Error('Wrong file specified: ' + opts.fileName);
					}
					this.records = 1;
					if($jsb.isArray(json)){
						this.records = json.length;
					}
					this.property('records', this.records);
					// store artifact
					this.workspace.writeArtifactAsJson(this.getLocalId() + '.data', json);
				}
			} else {
				this.records = this.property('records');
			}
		},
		
		read: function(){
			return this.workspace.readArtifactAsJson(this.getLocalId() + '.data');
		}

	}
}