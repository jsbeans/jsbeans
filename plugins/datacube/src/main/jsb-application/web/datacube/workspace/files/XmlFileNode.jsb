{
	$name: 'DataCube.XmlFileNode',
	$parent: 'JSB.Workspace.FileNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('XmlFileNode.css');
			this.addClass('xmlFileNode');
			
			this.append(`#dot
				<div class="status">
					Записей: <span class="count">{{=this.descriptor.entry.getRecordsCount()}}</span>
				</div>
			`);
			
		},
		
	}
	
}