{
	$name: 'DataCube.Renderers.CubeRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$require: ['css:CubeRenderer.css'],
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('cubeRenderer');
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.Cube');
		}
	}
}