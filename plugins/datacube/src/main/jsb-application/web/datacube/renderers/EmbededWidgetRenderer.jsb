/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Renderers.EmbededWidgetRenderer',
	$parent: 'JSB.Widgets.Renderer',
	$require: ['JSB.Widgets.RendererRepository'],
	
	$client: {
		
		$constructor: function(wDesc, opts){
			opts = opts || {};
			$base(wDesc, opts);
			
			this.addClass('embededWidgetRenderer');

/*			
			this.icon = this.$('<img class="icon"></img>');
			this.append(this.icon);
			
			this.title = this.$('<div class="title"></div>');
			this.append(this.title);
*/			
	
			JSB.lookup(wDesc.jsb, function(wCls){
				var expose = wCls.jsb.getDescriptor().$expose;
				var r = RendererRepository.createRendererFor(expose, opts, 'WidgetRegistryRenderer');
				$this.append(r);
/*				
				var icon = expose.icon || expose.thumb;
				$this.icon.attr('src', icon);
				$this.title.text(expose.name);
*/				
			});
			
		}
	}
}