{
	$name: 'JSB.DataCube.JsonFileNode',
	$parent: 'JSB.Workspace.FileNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('JsonFileNode.css');
			this.addClass('jsonFileNode');
			
			this.append(`#dot
				<div class="records">
					Записей: <span class="count">{{=this.descriptor.entry.getRecordsCount()}}</span>
				</div>
			`);
			
		},
		
	}
	
}