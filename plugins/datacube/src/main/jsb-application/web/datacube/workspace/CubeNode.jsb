{
	$name: 'JSB.DataCube.CubeNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('CubeNode.css');
			this.addClass('cubeNode');
			
			this.append(`#dot
				<div class="status">
					<div class="item">Источников: <span class="count">{{=this.descriptor.entry.getSourceCount()}}</span>;</div>
					<div class="item">полей: <span class="count">{{=this.descriptor.entry.getFieldCount()}}</span>;</div>
					<div class="item">срезов: <span class="count">{{=this.descriptor.entry.getSliceCount()}}</span></div>
				</div>
			`);
		},
		
	}
	
}