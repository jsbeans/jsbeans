{
	$name: 'JSB.DataCube.DatabaseSourceNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('DatabaseSourceNode.css');
			this.addClass('databaseSourceNode');
			
			this.append(`#dot
				<div class="status">
					<div class="item tables">Таблиц: <span class="count">{{=this.descriptor.entry.getTableCount()}}</span></div>
				</div>
			`);
			
			this.subscribe('Workspace.Entry.updated', function(){
				$this.update();
			});
		},
		
		update: function(){
			this.find('.status > .tables > .count').text(this.descriptor.entry.getTableCount());
		}
		
	}
	
}