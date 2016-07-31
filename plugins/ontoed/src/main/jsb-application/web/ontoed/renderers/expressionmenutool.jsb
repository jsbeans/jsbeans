JSB({
	name:'Ontoed.ExpressionMenuTool',
	parent: 'JSB.Widgets.Tool',
	require: ['Ontoed.Host','JSB.Widgets.ToolManager', 'JSB.Widgets.TreeView'],
	client: {
		bootstrap: function(){
			// register tooltip
			var self = this;
			JSB.Widgets.ToolManager.registerTool({
				id: 'expressionMenuTool',
				jso: self,
				wrapperOpts: {
					exclusive: true,
					modal: false,
					hideByOuterClick: true,
					hideInterval: 0,
					cssClass: 'expressionMenuToolWrapper'
				}
			});
		},
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('expressionmenutool.css');
			this.addClass('expressionMenuTool');
			
			this.tree = new JSB.Widgets.TreeView({
				collapsed: true,
				onSelectionChanged: function(key, item, evt){
					if(item && item.entry){
						self.close();
						if(self.data.callback){
							self.data.callback.call(self, item.entry);
						}
						
					}
				}
			});
			this.append(this.tree);
		},
			
		onMessage: function(sender, msg, params ){
		},
		
		update: function(){
			var self = this;
			this.ontology = this.data.data.ontology;
			this.scheme = this.data.data.scheme;
			this.group = this.data.data.group;
			this.prevEntry = this.data.data.prevEntry;
			this.prevKey = null;
			
			this.entries = this.resolveSchemeEntries(this.scheme);
			
			if(Object.keys(this.entries).length >= 5 
				&& this.entries['Class']
				&& this.entries['ObjectProperty']
				&& this.entries['DataProperty']
				&& this.entries['AnnotationProperty']
				&& this.entries['NamedIndividual']){
				this.isDeclaration = true;
			} else {
				this.isDeclaration = false;
			}
			
			// fill tree
			function addEntry(entry, parentKey){
				var key = JSB().generateUid();
				
				var nodeElt = self.$('<div class="expressionMenuLeaf"></div>');
				nodeElt.append(self.$('<span class="expressionName"></span>').text(entry.name));
				
				if(entry.arguments && entry.arguments.length > 0){
					nodeElt.append('<span class="paren open">(</span>');
					
					for(var j = 0; j < entry.arguments.length; j++ ){
						var arg = entry.arguments[j];
						var argTypes = self.getArgTypes(arg);
						
						var typeEntryArr = [];
						var argEntityTypes = {}
						for(var t in argTypes){
							var earr = Ontoed.Host.getEntriesByName(t);
							if(earr.length == 0){
								// primitive name
								argEntityTypes[t] = true;
							} else {
								typeEntryArr = typeEntryArr.concat(earr);
							}
						}
						if(typeEntryArr.length > 0){
							JSB().merge(argEntityTypes, self.resolveEntityTypes(typeEntryArr));
						}
						
						var argumentElt = self.$('<div class="argument"></div>');
						nodeElt.append(argumentElt);
						for(var k = 0; k < Object.keys(argEntityTypes).length; k++ ){
							var t = Object.keys(argEntityTypes)[k];
							if(k > 0){
								argumentElt.append('<span class="separator">|</span>');
							}
							argumentElt.addClass(t);
							argumentElt.append(self.$('<span class="type"></span>').text(t));
						}
						
						if(arg.multiple){
							argumentElt.append('<span class="multiple">+</span>');
						}
					}
					
					nodeElt.append('<span class="paren close">)</span>');
				}
				
				var treeNode = self.tree.addNode({
					key: key,
					element: nodeElt,
					entry: entry
				}, parentKey);
				
				return treeNode;
			}
			
			function isSpecialFill(name){
				var specialNames = {
					Class: true,
					ObjectProperty: true,
					DataProperty: true,
					AnnotationProperty: true,
					NamedIndividual: true,
					Datatype: true,
					Facet: true
				};
				
				return specialNames[name] && !self.isDeclaration;
			}
			
			function addSchemeEntries(arr, parentKey){
				var entries = self.resolveSchemeEntries(arr);

				var entryKeys = JSB().clone(Object.keys(entries));
				entryKeys.sort(function(a, b){
					if(!isSpecialFill(a) && isSpecialFill(b)){
						return -1;
					} else if(!isSpecialFill(b) && isSpecialFill(a)){
						return 1;
					}
					
					return a.localeCompare(b);
				});
				
				
				for(var i = 0; i < entryKeys.length; i++ ){
					if(entries[entryKeys[i]].length == 0){
						continue;
					}
					(function(i){
						var name = entryKeys[i];
						
						if(self.group || isSpecialFill(name)){
							var key = JSB().generateUid(); 
							
							var nodeElt = self.$('<div class="expressionMenuNode"></div>');
							nodeElt.append(self.$('<span class="name"></span>').text(name));
							
							if(!isSpecialFill(name)){
								nodeElt.append(self.$('<span class="count"></span>').text(entries[name].length));
							}
							
							var itemObj = self.tree.addNode({
								key: key,
								element: nodeElt,
								allowHover: false,
								allowSelect: false,
								collapsed: !isSpecialFill(name),
								cssClass: 'group'
							}, parentKey);
							
							itemObj.wrapper.click(function(){
								self.tree.toggleNode(key);
							});
	
							// sort by args count
							entries[name].sort(function(a, b){
								return a.arguments.length - b.arguments.length;
							});
							
							if(isSpecialFill(name)){
								self.fillSpecial(name, key);
							} else {
								for(var i = 0; i < entries[name].length; i++ ){
									var entry = entries[name][i];
									var treeNode = addEntry(entry, key);
									
									if(self.prevEntry && self.prevEntry == entry){
										treeNode.wrapper.addClass('selected');
										self.tree.expandNode(key);
										self.prevKey = treeNode.key;
									}

								}
							}
						} else {
							for(var i = 0; i < entries[name].length; i++ ){
								var entry = entries[name][i];
								var treeNode = addEntry(entry, parentKey);
								if(self.prevEntry && self.prevEntry == entry){
									treeNode.wrapper.addClass('selected');
									self.prevKey = treeNode.key;
								}
							}
						}
						
					})(i);
				}
				
			}

			this.tree.clear();
			addSchemeEntries(this.scheme, null);
			if(self.prevKey){
				this.tree.scrollTo(self.prevKey);
			} else {
				this.tree.scrollTo(0);
			}
		},
		
		fillSpecial: function(name, key){
			var self = this;
			if(name == 'Datatype'){
				self.drawTypes(key);
			} else if(name == 'Facet'){
				self.drawFacets(key);
			} else {
				// class or property
				this.server.getEntityTree(name, this.ontology, function(treeDesc){
					self.drawTree(treeDesc.etree, treeDesc.entities, key);
				});
			}
		},
		
		drawTypes: function(key){
			var self = this;
			var types = [{
				type: 'typename',
				value: 'rdfs:Literal'
			},{
				type: 'typename',
				value: 'xsd:string'
			},{
				type: 'typename',
				value: 'xsd:int'
			},{
				type: 'typename',
				value: 'xsd:float'
			},{
				type: 'typename',
				value: 'xsd:double'
			},{
				type: 'typename',
				value: 'xsd:boolean'
			},{
				type: 'typename',
				value: 'xsd:dateTime'
			}];
			
			for(var i in types){
				var node = Ontoed.RendererRepository.createRendererFor(types[i], {allowNavigate: false});
				
				var curTreeNode = self.tree.addNode({
					key: JSB().generateUid(),
					element: node,
					entry: types[i],
					collapsed: false
				}, key);
			}

		},
		
		drawFacets: function(key){
			var self = this;
			var facets = Ontoed.Host.facetMap;
			
			var facetArr = [];
			for(var i in facets){
				facetArr.push(facets[i]);
			}
			facetArr.sort(function(a, b){
				return a.name.localeCompare(b.name);
			});
			
			for(var i in facetArr){
				var facet = facetArr[i];
				var fObj = {
					type: 'facet',
					name: facet.name,
					value: facet.shortIRI,
					enum: facet.value
				};
				var node = Ontoed.RendererRepository.createRendererFor(fObj, {allowNavigate: false});
				
				var curTreeNode = self.tree.addNode({
					key: JSB().generateUid(),
					element: node,
					entry: fObj,
					collapsed: false
				}, key);
			}
		},
		
		drawTree: function(etree, entities, parentKey){
			var self = this;
			
			function addTreeItem(itemDesc, parent){
				var key = JSB().generateUid();
				var entity = entities[itemDesc.id];
				var cssClass = '';
				var node = Ontoed.RendererRepository.createRendererForEntity(entity, {allowNavigate: false});
				
				var curTreeNode = self.tree.addNode({
					key: key,
					element: node,
					entry: entity,
					collapsed: false
				}, parent);
				
				var idArr = [];
				for(var i in itemDesc.children){
					idArr.push({
						id: i,
						label: entities[i].getLabel()
					});
				}
				idArr.sort(function(a, b){
					return a.label.localeCompare(b.label);
				});
				
				
				for(var i in idArr){
					var id = idArr[i].id;
					var desc = itemDesc.children[id];
					addTreeItem(desc, key);
				}
				
				return node;
			}
			
			// sort
			var idArr = [];
			for(var i in etree){
				idArr.push({
					id: i,
					label: entities[i].getLabel()
				});
			}
			idArr.sort(function(a, b){
				return a.label.localeCompare(b.label);
			});
			
			for(var i in idArr){
				var id = idArr[i].id;
				var desc = etree[id];
				addTreeItem(desc, parentKey);
			}
		},
		
		getArgTypes: function(arg){
			var argTypes = {};
			if(arg.argumentTypes && arg.argumentTypes.length > 0){
				for(var j = 0; j < arg.argumentTypes.length; j++ ){
					argTypes[arg.argumentTypes[j]] = true;
				}
			} else {
				if(arg.entityType){
					argTypes[arg.entityType] = true;
				}
			}
			
			return argTypes;
		},
		
		resolveEntityTypes: function(arr){
			var entTypes = {};
			for(var i in arr){
				var entType = arr[i].entityType;
				if(!entTypes[entType]){
					entTypes[entType] = [];
				}
				entTypes[entType].push(arr[i]);
			}
			
			return entTypes;
		},
		
		resolveSchemeEntries: function(entries){
			var names = {};
			for(var i in entries){
				var name = entries[i].name;
				if(!names[name]){
					names[name] = [];
				}
				names[name].push(entries[i]);
			}
			
			return names;
		},
		
		setFocus: function(){
		}
	},
	
	server: {
		getEntityTree: function(name, onto){
			if(name == 'Class'){
				return {
					entities: onto.getClasses(),
					etree: onto.getClassTree()
				};
			} else {
				return {
					entities: onto.getProperties(),
					etree: onto.getPropertyTree(name)
				}
			}
			
			return null;
		}
	}
	
});