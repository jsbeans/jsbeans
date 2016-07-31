JSB({
	name:'Ontoed.Model.SpinOntology',
	parent: 'Ontoed.Model.Ontology',
	require: [],
	
	common: {
		sync: {
			updateCheckInterval: 0
		}
	},

	client: {
		
		constructor: function(opts){
			this.base(opts);
		}
	},
	
	server: {
		spinModel: null,
		
		constructor: function(ontoId, onto, w){
			this.base(ontoId, onto, w);
			this.spinModel = onto.spinModel();
		}

	}
});