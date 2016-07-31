JSB({
	name: 'Ontoed.Model.Instance',
	parent: 'Ontoed.Model.Entity',
	
	common: {
		getEntityType: function() {
			if(this.info.isAnonymous){
				return 'AnonymousIndividual';
			}
			return 'NamedIndividual';
		}
	},

	
	client: {
		constructor: function(desc){
			this.base(desc);
		}
	},
	
	server: {
		instanceOfClasses: {},
		
		constructor: function(id, desc, onto){
			this.base(id, desc, onto);
		},
		
		getInstanceClasses: function(){
			return this.instanceOfClasses;
		}
/*		
		onSyncRequest: function(){
			// update metrics
			if(JSB().isNull(this.info.isEquivalent)){
				this.info.isEquivalent = false;
				var axioms = this.getAxioms();
				
				for(var i in axioms){
					var axiom = axioms[i];
					if(axiom.info.resolver.type == 'EquivalentClasses' ) {
						if(axiom.info.resolver.items[0] == this || axiom.info.resolver.items[1] == this){
							this.info.isEquivalent = true;
						}
					}
				}
			}
		}
*/		
	}
});