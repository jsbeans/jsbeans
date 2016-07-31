JSB({
	name: 'Ontoed.Model.DataProperty',
	parent: 'Ontoed.Model.Property',
	
	common: {
		getEntityType: function(){
			return 'DataProperty';
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
		}
		
	}
});