JSB({
	name: 'Ontoed.InstanceRenderer',
	parent: 'Ontoed.EntityRenderer',
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('instanceRenderer');
		},
		
		constructNode: function(){
			var self = this;
			this.title.text(this.entity.getLabel()).attr('title', this.entity.info.iri);
/*			
			if(this.options.showClasses){
				var classesElt = self.$('<div class="instanceOf hidden"><span class="colon">:</span></div>');
				self.append(classesElt);

				// load type of instance
				this.entity.server.getInstanceClasses(function(classes){
					var cnt = 0;
					for(var i in classes ){
						if(cnt > 0){ classesElt.append('<span class="comma">,</span>'); }
						classesElt.append(Ontoed.RendererRepository.createRendererForEntity(classes[i]).getElement());
						cnt++;
					}
					if(Object.keys(classes).length > 0){
						classesElt.removeClass('hidden');
					}
					
				});
				
			}
*/			
		}
		
	}
	
});
