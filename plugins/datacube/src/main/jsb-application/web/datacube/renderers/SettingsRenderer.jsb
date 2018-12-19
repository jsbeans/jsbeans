{
	$name: 'DataCube.Renderers.SettingsRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$require: ['css:SettingsRenderer.css'],
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('settingsRenderer');
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.SettingsEntry');
		}
	}
}