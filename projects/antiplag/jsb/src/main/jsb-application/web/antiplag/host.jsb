JSB({
	name:'Antiplag.Host',
	require: {},
	singleton:true,
	
	common: {
		sync: {
			updateCheckInterval: 0
		}, 
		
		axiomScheme: null,
		facetMap: {},
		
		getEntriesByEntityType: function(entityType){
			if(!this.entityTypeCache[entityType]){
				this.entityTypeCache[entityType] = [];
				for(var i in this.axiomScheme){
					if(this.axiomScheme[i].entityType == entityType){
						this.entityTypeCache[entityType].push(this.axiomScheme[i]);
					}
				}
			}
			return this.entityTypeCache[entityType];
		},
		
		getEntriesByReturnType: function(type){
			if(!this.returnTypeCache[type]){
				this.returnTypeCache[type] = [];
				for(var i in this.axiomScheme){
					if(this.axiomScheme[i].returnType == type){
						this.returnTypeCache[type].push(this.axiomScheme[i]);
					}
				}
			}
			return this.returnTypeCache[type];
		},
		
		getEntriesByName: function(name){
			if(!this.nameCache[name]){
				this.nameCache[name] = [];
				for(var i in this.axiomScheme){
					if(this.axiomScheme[i].name == name){
						this.nameCache[name].push(this.axiomScheme[i]);
					}
				}
			}
			return this.nameCache[name];
		},
		
		getArgTypes: function(e){
			var argTypes = {};
			
			function collectArgTypes(entry){
				if(!entry.arguments){
					return;
				}
				for(var j = 0; j < entry.arguments.length; j++ ){
					var arg = entry.arguments[j];
					if(arg.argumentTypes && arg.argumentTypes.length > 0){
						for(var i = 0; i < arg.argumentTypes.length; i++ ){
							argTypes[arg.argumentTypes[i]] = true;
						}
					} else {
						if(arg.entityType){
							argTypes[arg.entityType] = true;
						}
						
					}
					
				}
				
			}
			
			if(e){
				collectArgTypes(e);
			} else {
				for(var i in this.axiomScheme){
					collectArgTypes(this.axiomScheme[i]);
				}
			}
			
			return argTypes;
		},
		
		getFacet: function(shortIRI){
			return this.facetMap[shortIRI];
		}

	},
	
	client: {
		entityTypeCache: {},
		returnTypeCache: {},
		nameCache: {},
	},
	
	server: {
		
		entityTypeCache: {},
		returnTypeCache: {},
		nameCache: {},
		
		constructor: function(){
			$base();
			
			// run code in global scope
			this.loadScript('/antiplag/utils.js');
//			this.loadScript('/antiplag/wrappers.js');
//			this.loadScript('/antiplag/workspace.js');
/*			
			this.loadScript('/ontoed/owlapi.js');
			this.loadScript('/ontoed/spinjs.js');
*/			
//			this.loadScript('/d2rq-model.js');
/*			
			var fs = OwlApiOntology.functionalSyntax();
			this.axiomScheme = fs.syntax;

			for(var i = 0; i < this.axiomScheme.length; i++ ){
				this.axiomScheme[i].idx = i;
			}

			for(var i = 0; i < fs.Facet.length; i++ ){
				var f = fs.Facet[i];
				this.facetMap[f.shortIRI] = f;
			}
*/			
		},
		
		loadScript: function(path){
			var scriptBody = '' + Packages.org.jsbeans.helpers.FileHelper.readStringFromResource(path);
			Kernel.ask('JsHub', 'ExecuteScriptMessage', {
				scriptBody: scriptBody,
				async: false,
				token: path
			});
		}
	}
});