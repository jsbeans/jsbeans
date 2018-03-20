{
	$name: 'JSB.Workspace.FileRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('fileRenderer');
			this.loadCss('FileRenderer.css');
		}
		
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'JSB.Workspace.FileEntry');
		}
	}
}