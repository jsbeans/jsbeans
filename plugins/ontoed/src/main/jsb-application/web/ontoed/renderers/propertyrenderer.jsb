JSB({
	name: 'Ontoed.PropertyRenderer',
	parent: 'Ontoed.EntityRenderer',
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('propertyRenderer');
		},
		
		constructNode: function(){
			
			this.title.text(this.entity.getLabel()).attr('title', this.entity.info.iri);
			
			if(JSB().isInstanceOf(this.entity, 'Ontoed.Model.AnnotationProperty')){
				this.addClass('annotationProperty');
			} else if(JSB().isInstanceOf(this.entity, 'Ontoed.Model.DataProperty')){
				this.addClass('dataProperty');
			} else if(JSB().isInstanceOf(this.entity, 'Ontoed.Model.ObjectProperty')){
				this.addClass('objectProperty');
			}
			
			if(this.options.displayRange && this.entity.info.range){
				var rangeRenderer = Ontoed.RendererRepository.createRendererFor(this.entity.info.range);
				var rangeElt = this.$('<div class="range"></div>')
					.append('<span class="colon">:</span>')
					.append(rangeRenderer.getElement())
				this.append(rangeElt);
			}
			
			/*			
			this.title = this.$('<span class="title"></span>').text(this.descriptor.name).attr('title',this.descriptor.name);
			this.append(this.title);
*/			

		}
	}
});
