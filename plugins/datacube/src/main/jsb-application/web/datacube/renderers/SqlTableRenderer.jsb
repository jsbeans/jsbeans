{
	$name: 'DataCube.Renderers.SqlTableRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			opts = opts || {};
			opts.editable = false;
			$base(entry, opts);
			this.addClass('sqlTableRenderer');
			this.loadCss('SqlTableRenderer.css');
			this.ensureSynchronized(function(){
				var e = $this.getEntry();
				if(e.descriptor.isView){
					$this.addClass('view');
				}
				
			});
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.SqlTable');
		}
	}
}