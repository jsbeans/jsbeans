{
	$name: 'DataCube.ExcelFileNode',
	$parent: 'JSB.Workspace.FileNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('ExcelFileNode.css');
			this.addClass('excelFileNode');
			
			this.append(`#dot
				<div class="status">
					Записей: <span class="count">{{=this.descriptor.entry.getRecordsCount()}}</span>
				</div>
			`);
			
		},
		
	}
	
}