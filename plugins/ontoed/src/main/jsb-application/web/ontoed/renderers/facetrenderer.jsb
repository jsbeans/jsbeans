JSB({
	name: 'Ontoed.FacetRenderer',
	parent: 'Ontoed.Renderer',
	
	client: {
		constructor: function(opts){
			this.base(opts);
			this.addClass('facetRenderer');
			this.loadCss('facetrenderer.css');
			
			this.getElement().attr('title', opts.info.value);
			
			this.append(#dot{{
				<div class="icon"></div>
				<div class="facetName">{{=opts.info.name}}</div>
			}});
		}
	}
});