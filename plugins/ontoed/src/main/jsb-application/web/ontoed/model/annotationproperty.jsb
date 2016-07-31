JSB({
	name: 'Ontoed.Model.AnnotationProperty',
	parent: 'Ontoed.Model.Property',
	
	common: {
		getEntityType: function(){
			return 'AnnotationProperty';
		}
	},
	
	client: {
		constructor: function(desc){
			this.base(desc);
		}
	},
	
	server: {
		constructor: function(id, desc, onto){
			this.base(id, desc, onto);
		},
	}
});