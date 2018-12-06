{
	$name: 'JSB.Workspace.FolderRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$require: ['css:FolderRenderer.css'],
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('folderRenderer');
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'JSB.Workspace.FolderEntry');
		}
	}
}