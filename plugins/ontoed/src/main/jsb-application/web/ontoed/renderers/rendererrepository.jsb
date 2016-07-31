JSB({
	name: 'Ontoed.RendererRepository',
	singleton: true,
	require: ['Ontoed.PropertyRenderer',
	          'Ontoed.InstanceRenderer',
	          'Ontoed.ClassRenderer',
	          'Ontoed.AxiomRenderer', 
	          'Ontoed.LiteralRenderer',
	          'Ontoed.TypeRenderer',
	          'Ontoed.FacetRenderer',
	          'Ontoed.MessageRenderer'],
	
	client: {
		createRendererFor: function(obj, opts){
			if(JSB().isBean(obj)){
				return this.createRendererForEntity(obj, opts);
			} else if(JSB().isString(obj)){
				return new Ontoed.TypeRenderer({type:obj});
			} else if(obj.type && (obj.type.toLowerCase() == 'literal' || obj.type.toLowerCase() == 'typename' || obj.type.toLowerCase() == 'iri' || obj.type.toLowerCase() == 'facet')){
				return this.createRendererForLiteral(obj, opts);
			} else if(obj.type && obj.type.toLowerCase() != 'literal' && obj.type.toLowerCase() != 'typename'){
				return new Ontoed.DefaultExpressionRenderer({resolver: obj, full: true});
			} else {
				throw 'createRendererFor: Invalid object specified';
			}
		},
		
		createRendererForEntity: function(entity, opts){
			var renderer = null;
			if(JSB().isInstanceOf(entity, 'Ontoed.Model.Axiom')){
				renderer = this.createRendererForAxiom(entity, opts);
			} else if(JSB().isInstanceOf(entity, 'Ontoed.Model.Class')){
				renderer = this.createRendererForClass(entity, opts);
			} else if(JSB().isInstanceOf(entity, 'Ontoed.Model.Property')){
				renderer = this.createRendererForProperty(entity, opts);
			} else if(JSB().isInstanceOf(entity, 'Ontoed.Model.Instance')){
				renderer = this.createRendererForInstance(entity, opts);
			} else if(entity.type){
				renderer = this.createRendererForLiteral(entity, opts);
			}
			
			return renderer;
		},
		
		createRendererForClass: function(entity, opts){
			return new Ontoed.ClassRenderer(JSB().merge(opts, {entity: entity}));
		},

		createRendererForProperty: function(entity, opts){
			return new Ontoed.PropertyRenderer(JSB().merge(opts, {entity: entity}));
		},
		
		createRendererForInstance: function(entity, opts){
			return new Ontoed.InstanceRenderer(JSB().merge(opts, {entity: entity}));
		},
		
		createRendererForLiteral: function(literal, opts){
			var renderer = null;
			switch(literal.type.toLowerCase()){
			case 'literal':
				renderer = new Ontoed.LiteralRenderer(JSB().merge(opts, {info: literal}));
				break;
			case 'iri':
				renderer = new Ontoed.LiteralRenderer(JSB().merge(opts, {info: JSB().merge({}, literal, {value: literal.iri || literal.value})}));
				break;
			case 'typename':
				renderer = new Ontoed.TypeRenderer(JSB().merge(opts, {type:literal.value, string: literal.string}));
				break;
			case 'facet':
				renderer = new Ontoed.FacetRenderer(JSB().merge(opts, {info:literal}));
				break;
			default:
				renderer = new Ontoed.MessageRenderer({message: 'ERROR: Unknown annotation type: ' + literal.type});
			}

			return renderer;
		},
		
		createRendererForAxiom: function(axiom, opts){
			var axType = axiom.info.axiomType;
			JSB().merge(opts, {axiom: axiom});
			
			return new Ontoed.AxiomRenderer(opts);
		}
	}
});
