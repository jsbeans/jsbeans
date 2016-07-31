JSB({
	name: 'Ontoed.Model.Entity',
	parent: 'JSB.Widgets.Actor',
	fixedId: true,
	
	common: {
		sync: {
			updateCheckInterval: 0
		},
		
		info: {},
		ontology: null,
		
		getLabel: function(){
			var label = null;//this.info.label;
			if(!label || label.length === 0){
				label = this.info.shortIRI;
			}
			if(!label || label.length === 0){
				label = this.info.functionalExpression;
			}
			if(!label || label.length === 0){
				debugger;
			}
			return label;
		},
		
		getEntityType: function(){
			throw 'getEntityType: Method should be overriden';
		}

	},
	
	client: {
		constructor: function(desc){
			this.base(desc);
		},
		
		onAfterSync: function(syncInfo){
			this.publish('entityUpdated');
		}
	},
	
	server: {
		disableRpcInstance: true,
		
		axioms: {},
		infoString: '',
		
		constructor: function(id, desc, ontology){
			this.id = id;
			this.base();
			this.ontology = ontology;
			if(desc){
				this.info = desc;
			}
			
		},
		
		update: function(desc){
			JSB().merge(this.info, desc);
		},
		
		postUpdate: function(bFirstCall){
			var compareFunc = function(scope){
				if(JSB().isFunction(scope)){
					return null;
				} else if(JSB().isBean(scope)){
					return scope.getId();
				}
			};
			curVal = JSB().stringify(this.info, compareFunc);

			if(!bFirstCall){
				if(this.infoString != curVal){
					this.doSync();
				}
			}
			
			this.infoString = curVal;
		},
		
		getAxioms: function(){
			return this.axioms;
		}

	}
});