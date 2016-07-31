JSB({
	name: 'Ontoed.SpinOntologyNode',
	parent: 'Ontoed.OntologyNode',
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('spinOntologyNode');
			
		}
	}
});
