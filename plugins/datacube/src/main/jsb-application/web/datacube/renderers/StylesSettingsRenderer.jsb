{
	$name: 'DataCube.Renderers.StylesSettingsRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$require: 'JSB.Widgets.RendererRepository',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			opts = opts || {};

			$base(entry, opts);
			this.addClass('styleSettingsRenderer');
			$jsb.loadCss('StyleSettingsRenderer.css');
		}
	},

	$server: {
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.StyleSettings');
		}
	}
}