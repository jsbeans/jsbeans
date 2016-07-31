JSB({
	name: 'Ontoed.Model.ObjectProperty',
	parent: 'Ontoed.Model.Property',
	
	common: {
		getEntityType: function(){
			return 'ObjectProperty';
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