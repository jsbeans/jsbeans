{
	$name: 'JSB.DataCube.Renderers.SqlSourceRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('sqlSourceRenderer');
			this.loadCss('SqlSourceRenderer.css');
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'JSB.DataCube.Model.SqlSource');
		}
	}
}