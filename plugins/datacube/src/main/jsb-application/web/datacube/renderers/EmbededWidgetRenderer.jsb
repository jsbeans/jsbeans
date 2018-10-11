{
	$name: 'DataCube.Renderers.EmbededWidgetRenderer',
	$parent: 'JSB.Widgets.Renderer',
	$client: {
		$constructor: function(wDesc, opts){
			opts = opts || {};
			$base(wDesc, opts);
			this.addClass('embededWidgetRenderer');
			$jsb.loadCss('EmbededWidgetRenderer.css');
			
			this.icon = this.$('<img class="icon"></img>');
			this.append(this.icon);
			
			this.title = this.$('<div class="title"></div>');
			this.append(this.title);
	
			JSB.lookup(wDesc.jsb, function(wCls){
				var expose = wCls.jsb.getDescriptor().$expose;
				var icon = expose.icon || expose.thumb;
				$this.icon.attr('src', icon);
				$this.title.text(expose.name);
			});
			
		}
	}
}