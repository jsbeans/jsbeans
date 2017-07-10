{
	$name: 'JSB.DataCube.Renderers.SqlTableRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			opts = opts || {};
			opts.editable = false;
			$base(entry, opts);
			this.addClass('sqlTableRenderer');
			this.loadCss('SqlTableRenderer.css');
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'JSB.DataCube.Model.SqlTable');
		}
	}
}