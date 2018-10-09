{
	$name: 'DataCube.Renderers.SliceRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$require: 'JSB.Widgets.RendererRepository',
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			opts = opts || {};
			//opts.editable = false;
			$base(entry, opts);
			this.addClass('sliceRenderer');
			$jsb.loadCss('SliceRenderer.css');
			
			if(opts.showCube){
				this.addClass('showCube');
				this.server().getCube(entry, function(cubeEntry){
					$this.append('<div class="leftParen">(</div>');
					$this.append(RendererRepository.createRendererFor(cubeEntry).getElement());
					$this.append('<div class="rightParen">)</div>');
				});
			}
		}
	},
	
	$server: {
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.Slice');
		},
		
		getCube: function(entry){
			return entry.getWorkspace().entry(entry.getParentId());
		}
	}
}