{
	$name: 'DataCube.Renderers.SqlTableRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$require: 'JSB.Widgets.RendererRepository',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			opts = opts || {};
			opts.editable = false;
			$base(entry, opts);
			this.addClass('sqlTableRenderer');
			this.loadCss('SqlTableRenderer.css');
			entry.ensureSynchronized(function(){
				var e = $this.getEntry();
/*				
				if(e.descriptor.isView){
					$this.addClass('view');
				}
*/				
				if(opts.showSource && e.getParentId()){
					$this.addClass('showSource');
					$this.server().getSource(e, function(sourceEntry){
						$this.append('<div class="leftParen">(</div>');
						$this.append(RendererRepository.createRendererFor(sourceEntry).getElement());
						$this.append('<div class="rightParen">)</div>');
					});
				} else {
					$this.removeClass('showSource');
				}
			});
		}
	},
	
	$server: {
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.SqlTable');
		},
		
		getSource: function(entry){
			return entry.getWorkspace().entry(entry.getParentId());
		}
	}
}