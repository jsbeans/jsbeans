{
	$name: 'DataCube.CubeNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('CubeNode.css');
			this.addClass('cubeNode');
			
			this.append(`#dot
				<div class="status">
					<div class="item sources">Источников: <span class="count">{{=this.descriptor.entry.getSourceCount()}}</span>;</div>
					<div class="item fields">полей: <span class="count">{{=this.descriptor.entry.getFieldCount()}}</span>;</div>
					<div class="item slices">срезов: <span class="count">{{=this.descriptor.entry.getSliceCount()}}</span></div>
				</div>
			`);
			
			this.subscribe('Workspace.Entry.updated', function(sender){
				if(sender != $this.descriptor.entry){
					return;
				}
				$this.update();
			});
		},
		
		update: function(){
			this.find('.status > .sources > .count').text(this.descriptor.entry.getSourceCount());
			this.find('.status > .fields > .count').text(this.descriptor.entry.getFieldCount());
			this.find('.status > .slices > .count').text(this.descriptor.entry.getSliceCount());
		}
		
	}
	
}