{
	$name: 'DataCube.Model.ExcelFile',
	$parent: 'JSB.Workspace.FileEntry',
	
	records: null,
	
	getRecordsCount: function(){
		return this.records;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.IO.Decoder'],
		
		$bootstrap: function(){
			WorkspaceController.registerFileUploadCallback(null, this, 0.5, function(name, data){
				if(/\.xlsx?$/i.test(name)){
					return true;
				}
				return false;
			});
			WorkspaceController.registerExplorerNode(null, this, {
				priority: 0.5, 
				nodeType:'DataCube.ExcelFileNode',
				create: false,
				move: true,
				remove: true
			});
			
		},
		
		$constructor: function(id, workspace, opts){
			$base(id, workspace, opts);
			if(opts){
/*				if(opts.fileName){
					this.setName(opts.fileName);
				}
				if(opts.fileData){
					// try to parse JSON
					var charsets = ['UTF-8','Windows-1251','UTF-16LE','UTF-16BE'];
					var json = null;
					for(var i = 0; i < charsets.length; i++){
						var charset = charsets[i];
						var decoder = new Decoder(charset);
						try {
							var jsonStr = decoder.decode(opts.fileData);
							var chrx = /[\{\[]/i;
							var j = 0;
							for(; j < jsonStr.length; j++){
								if(chrx.test(jsonStr[j])){
									break;
								}
							}
							if(j > 0 && j < jsonStr.length){
								jsonStr = jsonStr.substr(j);
							}
							if(j >= jsonStr.length){
								continue;
							}
							json = eval('(' + jsonStr + ')');
							break;
						} catch(e){
							JSB.getLogger().warn(e);
							continue;
						} finally {
							decoder.close();	
						}
					}
					if(!json){
						throw new Error('Wrong file specified: ' + opts.fileName);
					}
					this.records = 1;
					if(JSB.isArray(json)){
						this.records = json.length;
					}
					this.property('records', this.records);
					// store artifact
					this.storeArtifact('.data', json);
				} */
			} else {
				this.records = this.property('records');
			}
		}
	}
}