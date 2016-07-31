JSB({
	name: 'Ontoed.Model.Property',
	parent: 'Ontoed.Model.Entity',
	
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
			// extract some flags
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
				if(axiom.info.resolver.type == 'EquivalentObjectProperties'
					|| axiom.info.resolver.type == 'EquivalentDataProperties') {
					if(axiom.info.resolver.items[0] == this || axiom.info.resolver.items[1] == this){
						bEq = true;
						break;
					}
				}
			}
			this.info.isEquivalent = bEq;
			this.getSuperClass('Ontoed.Model.Entity').postUpdate.call(this, bFirstCall);
		},
		
		getDomainEntities: function(){
			var axioms = this.getAxioms();
			var domainEntities = [];
			var subObjectEntities = [];
			var domainMap = {};
			
			function extractSubEntities(obj){
				var eLst = [];
				if(obj.type && obj.items && obj.items.length > 0){
					for(var i in obj.items){
						eLst = eLst.concat(extractSubEntities(obj.items[i]));
					}
				} else {
					eLst.push(obj);
				}
				
				return eLst;
			}
			
			for(var i in axioms){
				var axiom = axioms[i];
				if(axiom.info.resolver.type == 'ObjectPropertyDomain' 
					|| axiom.info.resolver.type == 'DataPropertyDomain'
					|| axiom.info.resolver.type == 'AnnotationPropertyDomain') {
					
					var eLst = extractSubEntities(axiom.info.resolver.items[1]);
					
					for(var j in eLst){
						domainMap[eLst[j].info.md5] = eLst[j];
					}
				}
				if(axiom.info.resolver.type == 'SubObjectPropertyOf' && axiom.info.resolver.items[1] == this) {
					
					var eLst = extractSubEntities(axiom.info.resolver.items[0]);
					for(var j in eLst){
						subObjectEntities.push(eLst[j]);	
					}
				}
			}
			
			for(var i in subObjectEntities){
				var deLst = subObjectEntities[i].getDomainEntities();
				for(var j in deLst){
					domainMap[deLst[j].info.md5] = deLst[j];
				}
			}
			
			for(var i in domainMap){
				domainEntities.push(domainMap[i]);
			}
			
			return domainEntities;
		},
		
		getRangeEntities: function(){
			var axioms = this.getAxioms();
			var rangeEntities = [];
			for(var i in axioms){
				var axiom = axioms[i];
				if(axiom.info.resolver.type == 'ObjectPropertyRange' 
					|| axiom.info.resolver.type == 'DataPropertyRange'
					|| axiom.info.resolver.type == 'AnnotationPropertyRange') {
					
					rangeEntities.push(axiom.info.resolver.items[1]);
				}
			}
			
			return rangeEntities;

		}
	}
});