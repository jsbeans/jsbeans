{
	$name: 'DataCube.Model.CsvFile',
	$parent: 'JSB.Workspace.FileEntry',
	
	lastTimestamp: null,
	records: null,
	tables: null,
	columns: null,
	
	getRecordsCount: function(){
		return this.records;
	},
	
	getLastTimestamp: function(){
		return this.lastTimestamp;
	},

	getTablesCount: function(){
		return this.tables;
	},

	getColumnsCount: function(){
		return this.columns;
	},

	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.IO.Decoder'],
		
		$bootstrap: function(){
			WorkspaceController.registerFileUploadCallback(null, this, 0.5, function(name, data){
				if(/\.csv$/i.test(name)){
					return true;
				}
				return false;
			});
			WorkspaceController.registerExplorerNode(null, this, {
				priority: 0.5, 
				nodeType:'DataCube.CsvFileNode',
				create: false,
				move: true,
				remove: true
			});
			
		},
		
		$constructor: function(id, workspace, opts){
			$base(id, workspace, opts);
			if(opts){
				
			} else {
				this.records = this.property('records');
				this.lastTimestamp = this.property('lastTimestamp');
				this.tables = this.property('tables');
				this.columns = this.property('columns');
			}
		}

	}
}