{
	$name: 'DataCube.SettingsNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$require: ['css:SettingsNode.css'],
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('settingsNode');
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.getTargetEntry()){
					return;
				}
				$this.update();
			});
			
			$this.update();
		},
		
		update: function(){
		}
	}
}