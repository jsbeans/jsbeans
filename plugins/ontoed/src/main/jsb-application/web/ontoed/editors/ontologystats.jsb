JSB({
	name:'Ontoed.OntologyStats',
	parent: 'JSB.Widgets.Widget',
	require: [],
	
	client: {
		currentOntology: null,
		stats: {},
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('ontologyStats');
			this.loadCss('ontologystats.css');
			
			this.subscribe('ontologyUpdate', function(sender, msg, params){
				if(sender == self.currentOntology){
					self.refresh();
				}
			});
		},
		
		setOntology: function(onto){
			if(this.currentOntology == onto){
				return;
			}
			if(!JSB().isInstanceOf(onto, 'Ontoed.Model.Ontology')){
				return;
			}
			this.currentOntology = onto;
			this.refresh();
		},
		
		refresh: function(){
			var self = this;
			this.getElement().loader();
			this.currentOntology.server.getStats(function(stats){
				self.getElement().loader('hide');
				self.stats = stats;
				self.draw();
			});
		},
		
		draw: function(){
			var stats = this.stats;
			var statsDesc = [{
				category: 'Сводка',
				items: [{title: 'Объекты', self:stats.self.signatureEntities, withImports:stats.withImports.signatureEntities},
			         {title: 'Классы', self:stats.self.classes, withImports:stats.withImports.classes},
			         {title: 'Объектные свойства', self:stats.self.objectProperties, withImports:stats.withImports.objectProperties},
			         {title: 'Свойства с данными', self:stats.self.dataProperties, withImports:stats.withImports.dataProperties},
			         {title: 'Аннотационные свойства', self:stats.self.annotationProperties, withImports:stats.withImports.annotationProperties},
			         {title: 'Аксиомы', self:stats.self.axioms.total, withImports:stats.withImports.axioms.total},
			         {title: 'Декларативные аксиомы', self:stats.self.axioms.declaration, withImports:stats.withImports.axioms.declaration},
			         {title: 'Логические аксиомы', self:stats.self.axioms.logical, withImports:stats.withImports.axioms.logical},
			         {title: 'Экземпляры', self:stats.self.individuals, withImports:stats.withImports.individuals}]
			},{
				category: 'Аксиомы классов',
				items:[{title: 'SubClassOf', self:stats.self.axioms.byType.SubClassOf, withImports:stats.withImports.axioms.byType.SubClassOf},
				       {title: 'EquivalentClasses', self:stats.self.axioms.byType.EquivalentClasses, withImports:stats.withImports.axioms.byType.EquivalentClasses},
				       {title: 'DisjointClasses', self:stats.self.axioms.byType.DisjointClasses, withImports:stats.withImports.axioms.byType.DisjointClasses}]
			},{
				category: 'Аксиомы свойств объектов',
				items:[{title: 'SubObjectPropertyOf', self:stats.self.axioms.byType.SubObjectPropertyOf, withImports:stats.withImports.axioms.byType.SubObjectPropertyOf},
				       {title: 'EquivalentObjectProperties', self:stats.self.axioms.byType.EquivalentObjectProperties, withImports:stats.withImports.axioms.byType.EquivalentObjectProperties},
				       {title: 'InverseObjectProperties', self:stats.self.axioms.byType.InverseObjectProperties, withImports:stats.withImports.axioms.byType.InverseObjectProperties},
				       {title: 'DisjointObjectProperties', self:stats.self.axioms.byType.DisjointObjectProperties, withImports:stats.withImports.axioms.byType.DisjointObjectProperties},
				       {title: 'FunctionalObjectProperty', self:stats.self.axioms.byType.FunctionalObjectProperty, withImports:stats.withImports.axioms.byType.FunctionalObjectProperty},
				       {title: 'InverseFunctionalObjectProperty', self:stats.self.axioms.byType.InverseFunctionalObjectProperty, withImports:stats.withImports.axioms.byType.InverseFunctionalObjectProperty},
				       {title: 'TransitiveObjectProperty', self:stats.self.axioms.byType.TransitiveObjectProperty, withImports:stats.withImports.axioms.byType.TransitiveObjectProperty},
				       {title: 'SymmetricObjectProperty', self:stats.self.axioms.byType.SymmetricObjectProperty, withImports:stats.withImports.axioms.byType.SymmetricObjectProperty},
				       {title: 'AsymmetricObjectProperty', self:stats.self.axioms.byType.AsymmetricObjectProperty, withImports:stats.withImports.axioms.byType.AsymmetricObjectProperty},
				       {title: 'ReflexiveObjectProperty', self:stats.self.axioms.byType.ReflexiveObjectProperty, withImports:stats.withImports.axioms.byType.ReflexiveObjectProperty},
				       {title: 'IrrefexiveObjectProperty', self:stats.self.axioms.byType.IrrefexiveObjectProperty, withImports:stats.withImports.axioms.byType.IrrefexiveObjectProperty},
				       {title: 'ObjectPropertyDomain', self:stats.self.axioms.byType.ObjectPropertyDomain, withImports:stats.withImports.axioms.byType.ObjectPropertyDomain},
				       {title: 'ObjectPropertyRange', self:stats.self.axioms.byType.ObjectPropertyRange, withImports:stats.withImports.axioms.byType.ObjectPropertyRange},
				       {title: 'SubPropertyChainOf', self:stats.self.axioms.byType.SubPropertyChainOf, withImports:stats.withImports.axioms.byType.SubPropertyChainOf}]
			},{
				category: 'Аксиомы свойств данных',
				items:[{title: 'SubDataPropertyOf', self:stats.self.axioms.byType.SubDataPropertyOf, withImports:stats.withImports.axioms.byType.SubDataPropertyOf},
				       {title: 'EquivalentDataProperties', self:stats.self.axioms.byType.EquivalentDataProperties, withImports:stats.withImports.axioms.byType.EquivalentDataProperties},
				       {title: 'DisjointDataProperties', self:stats.self.axioms.byType.DisjointDataProperties, withImports:stats.withImports.axioms.byType.DisjointDataProperties},
				       {title: 'FunctionalDataProperty', self:stats.self.axioms.byType.FunctionalDataProperty, withImports:stats.withImports.axioms.byType.FunctionalDataProperty},
				       {title: 'DataPropertyDomain', self:stats.self.axioms.byType.DataPropertyDomain, withImports:stats.withImports.axioms.byType.DataPropertyDomain},
				       {title: 'DataPropertyRange', self:stats.self.axioms.byType.DataPropertyRange, withImports:stats.withImports.axioms.byType.DataPropertyRange}]
			},{
				category: 'Аксиомы аннотаций',
				items:[{title: 'SubAnnotationPropertyOf', self:stats.self.axioms.byType.SubAnnotationPropertyOf, withImports:stats.withImports.axioms.byType.SubAnnotationPropertyOf},
				       {title: 'AnnotationAssertion', self:stats.self.axioms.byType.AnnotationAssertion, withImports:stats.withImports.axioms.byType.AnnotationAssertion},
				       {title: 'AnnotationPropertyDomain', self:stats.self.axioms.byType.AnnotationPropertyDomain, withImports:stats.withImports.axioms.byType.AnnotationPropertyDomain},
				       {title: 'AnnotationPropertyRangeOf', self:stats.self.axioms.byType.AnnotationPropertyRangeOf, withImports:stats.withImports.axioms.byType.AnnotationPropertyRangeOf}]
			},{
				category: 'Аксиомы экземпляров',
				items:[{title: 'ClassAssertion', self:stats.self.axioms.byType.ClassAssertion, withImports:stats.withImports.axioms.byType.ClassAssertion},
				       {title: 'ObjectPropertyAssertion', self:stats.self.axioms.byType.ObjectPropertyAssertion, withImports:stats.withImports.axioms.byType.ObjectPropertyAssertion},
				       {title: 'DataPropertyAssertion', self:stats.self.axioms.byType.DataPropertyAssertion, withImports:stats.withImports.axioms.byType.DataPropertyAssertion},
				       {title: 'NegativeObjectPropertyAssertion', self:stats.self.axioms.byType.NegativeObjectPropertyAssertion, withImports:stats.withImports.axioms.byType.NegativeObjectPropertyAssertion},
				       {title: 'NegativeDataPropertyAssertion', self:stats.self.axioms.byType.NegativeDataPropertyAssertion, withImports:stats.withImports.axioms.byType.NegativeDataPropertyAssertion},
				       {title: 'SameIndividual', self:stats.self.axioms.byType.SameIndividual, withImports:stats.withImports.axioms.byType.SameIndividual},
				       {title: 'DifferentIndividuals', self:stats.self.axioms.byType.DifferentIndividuals, withImports:stats.withImports.axioms.byType.DifferentIndividuals}]
			}];
			
			this.getElement().empty();
			
			for(var i in statsDesc){
				var statObj = statsDesc[i];
				this.append(#dot{{
					<h1>{{=statObj.category}}</h1>
					<table>
					{{ for(var j in statObj.items ) { }}
						<tr count="{{=statObj.items[j].withImports}}"><td class="key">{{=statObj.items[j].title}}</td><td class="value">{{=statObj.items[j].self}} <span class="imports">/ {{=statObj.items[j].withImports}}</span></td></tr>
					{{ } }}
					</table>
				}});
			}
		}
	},
	
	server: {
		
	}
});