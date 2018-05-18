{
	$name: 'DataCube.Renderers.CsvFileRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('csvFileRenderer');
			this.loadCss('CsvFileRenderer.css');
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.CsvFile');
		}
	}
}