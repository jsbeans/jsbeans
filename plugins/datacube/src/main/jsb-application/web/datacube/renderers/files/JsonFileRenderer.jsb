{
	$name: 'DataCube.Renderers.JsonFileRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$require: ['css:JsonFileRenderer.css'],
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('jsonFileRenderer');
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.JsonFile');
		}
	}
}