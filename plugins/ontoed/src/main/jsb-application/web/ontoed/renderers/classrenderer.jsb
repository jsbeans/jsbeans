JSB({
	name: 'Ontoed.ClassRenderer',
	parent: 'Ontoed.EntityRenderer',
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('classRenderer');
		},
		
		constructNode: function(){
			this.title.text(this.entity.getLabel()).attr('title', this.entity.info.iri);
			
			
			/*			
			this.title = this.$('<span class="title"></span>').text(this.descriptor.name).attr('title',this.descriptor.name);
			this.append(this.title);
*/			

		}
		
	}
});
