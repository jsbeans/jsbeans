{
	$name: 'JSB.Widgets.MenuActionRenderer',
	$parent: 'JSB.Widgets.Renderer',
	$client: {
		$require: ['css:MenuActionRenderer.css'],
		$constructor: function(obj, opts){
			$base(obj, opts);
			this.addClass('menuActionRenderer');
			
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			
			this.title = this.$('<div class="title"></div>');
			this.append(this.title);
			
			this.description = this.$('<div class="description"></div>');
			this.append(this.description);
			
			if(opts && opts.fixed){
				this.addClass('fixed');
			}

			this.update();
		},
		
		update: function(){
			var obj = this.getObject();
			var expose = obj.getJsb().getDescriptor().$expose;
			this.title.text(expose.title);
			this.description.text(expose.description);
			if(this.options.fixed){
				this.attr('title', expose.description);
			}
			if(expose.icon){
				$this.icon.css('background-image', 'url(' + expose.icon + ')');
			}
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'JSB.Widgets.MenuAction');
		}
	}
}