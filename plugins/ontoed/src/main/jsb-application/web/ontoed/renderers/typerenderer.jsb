JSB({
	name: 'Ontoed.TypeRenderer',
	parent: 'Ontoed.Renderer',
	
	client: {
		constructor: function(opts){
			this.base(opts);
			this.addClass('typeRenderer');
			this.loadCss('typerenderer.css');
			
			this.type = opts.type;
			this.getElement().attr('type', this.type);
			
			if(opts.string){
				this.getElement().attr('string', opts.string);
			}
			
			if(opts.cssClass){
				this.addClass(opts.cssClass);
			}
			
			this.append(#dot{{
				<div class="icon"></div>
				<div class="typeName">{{=this.type}}</div>
			}});
			
			
		}
	}
});