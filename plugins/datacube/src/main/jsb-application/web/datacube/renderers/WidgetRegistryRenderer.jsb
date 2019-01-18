{
	$name: 'DataCube.Renderers.WidgetRegistryRenderer',
	$parent: 'JSB.Widgets.Renderer',
	$require: ['JSB.Widgets.RendererRepository',
	           'css:WidgetRegistryRenderer.css'],
	$client: {
		$constructor: function(wDesc, opts){
			var self = this;
			opts = opts || {};
			//opts.editable = false;
			$base(wDesc, opts);
			this.addClass('widgetRegistryRenderer');
			
			this.icon = $this.$('<div class="icon"></div>');
			this.append(this.icon);
			
			this.title = $this.$('<div class="title"></div>');
			this.append(this.title); 
			
			$this.title.text(wDesc.name);
			$this.icon.css('background-image', 'url(' + wDesc.icon + ')');
			
			if(wDesc.description){
				$this.attr('title', wDesc.description);
			}
		}
	},
	
	$server: {
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'WidgetRegistryRenderer');
		}
	}
}