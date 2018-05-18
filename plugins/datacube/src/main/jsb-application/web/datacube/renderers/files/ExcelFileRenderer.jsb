{
	$name: 'DataCube.Renderers.ExcelFileRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			$base(entry, opts);
			this.addClass('excelFileRenderer');
			this.loadCss('ExcelFileRenderer.css');
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.ExcelFile');
		}
	}
}