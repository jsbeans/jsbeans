{
	$name: 'DataCube.ExcelFileNode',
	$parent: 'JSB.Workspace.FileNode',
	$client: {
		$require: ['css:ExcelFileNode.css'],
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('excelFileNode');
			
			this.append(`#dot
				<div class="status">
					Записей: <span class="count">{{=this.descriptor.entry.getRecordsCount()}}</span>
				</div>
			`);
			
		},
		
	}
	
}