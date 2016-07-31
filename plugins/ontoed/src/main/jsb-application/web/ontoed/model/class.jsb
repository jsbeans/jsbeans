JSB({
	name: 'Ontoed.Model.Class',
	parent: 'Ontoed.Model.Entity',
	
	common: {
		getEntityType: function(){
			return 'Class';
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
		
		postUpdate: function(bFirstCall){
			// update metrics
			for(var i in this.info.annotations){
				var annot = this.info.annotations[i];
				if(annot.property.shortIRI == 'owl:deprecated' && annot.value.value == 'true'){
					this.info.isDeprecated = true;
				}
			}
			
			var bEq = false;
			var axioms = this.getAxioms();
			
			for(var i in axioms){
				var axiom = axioms[i];
				if(axiom.info.resolver.type == 'EquivalentClasses' ) {
					if(axiom.info.resolver.items[0] == this || axiom.info.resolver.items[1] == this){
						bEq = true;
						break;
					}
				}
			}
			this.info.isEquivalent = bEq;
			
			this.getSuperClass('Ontoed.Model.Entity').postUpdate.call(this, bFirstCall);
			
		}
	}
});