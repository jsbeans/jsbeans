{
	$name: 'JSB.DataCube.Renderers.JsonFileRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('jsonFileRenderer');
			this.loadCss('JsonFileRenderer.css');
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'JSB.DataCube.Model.JsonFile');
		}
	}
}