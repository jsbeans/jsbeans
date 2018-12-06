{
	$name: 'DataCube.Renderers.HttpServerRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$require: ['css:HttpServerRenderer.css'],
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('httpServerRenderer');
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.HttpServer');
		}
	}
}