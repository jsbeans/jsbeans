{
	$name: 'DataCube.Renderers.HttpMethodRenderer',
	$parent: 'JSB.Workspace.EntryRenderer',
	$require: ['JSB.Widgets.RendererRepository',
	           'css:HttpMethodRenderer.css'],
	$client: {
		$constructor: function(entry, opts){
			var self = this;
			opts = opts || {};
			opts.editable = false;
			$base(entry, opts);
			this.addClass('httpMethodRenderer');
			entry.ensureSynchronized(function(){
				var e = $this.getEntry();
				
				if(opts.showParent && e.getParentId()){
					$this.addClass('showParent');
					$this.server().getParent(e, function(serviceEntry){
						$this.append('<div class="leftParen">(</div>');
						$this.append(RendererRepository.createRendererFor(serviceEntry).getElement());
						$this.append('<div class="rightParen">)</div>');
					});
				} else {
					$this.removeClass('showParent');
				}
			});
		},
		
		update: function(){
			$base();
			
		}
		
	},
	
	$server: {
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'DataCube.Model.HttpMethod');
		}
		
	}
}