JSB({
	name: 'Ontoed.ExpressionPlaceholderRenderer',
	parent: 'Ontoed.Renderer',
	require: ['Ontoed.Host', 'Ontoed.ExpressionMenuTool'],
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('expressionPlaceholderRenderer');
			this.loadCss('expressionplaceholderrenderer.css');
			this.context = opts.context;
			this.resolver = opts.resolver;
			this.scheme = opts.scheme;
			this.ontology = opts.ontology,
			this.chosenSchemeEntry = null;
			this.acceptedTypes = this.resolveEntityTypes();
			
			if(this.resolver && this.resolver.idx){
				this.resolver.type = this.resolver.name;
				this.resolver.schemeIdx = this.resolver.idx;
			}
			
			if(this.options.onCreate){
				this.options.onCreate.call(this);
			}
			
			this.create();	
		},
		
		resolveEntityTypes: function(){
			var entTypes = {};
			for(var i in this.scheme){
				var entType = this.scheme[i].entityType;
				if(!entTypes[entType]){
					entTypes[entType] = [];
				}
				entTypes[entType].push(this.scheme[i]);
			}
			
			return entTypes;
		},
		
		allowDelete: function(b){
			this.options.allowDelete = b;
			if(b){
				this.addClass('allowDelete');
			} else {
				this.removeClass('allowDelete');
			}
		},
		
		setValue: function(value){
			if(JSB().isBean(value)){
				this.resolver = value;
			} else if(JSB().isPlainObject(value)){
				if(!JSB().isNull(value.idx)){
					// expression
					if(!this.resolver || JSB().isBean(this.resolver) || (this.resolver.type && (this.resolver.type == 'typename' || this.resolver.type == 'facet'))){
						var oldObj = this.resolver;
						this.resolver = {
							items: []
						};
						if(oldObj){
							this.resolver.items.push(oldObj);
						}
					}
					this.resolver.type = value.name;
					this.resolver.schemeIdx = value.idx;
				} else if(value.type && (value.type == 'typename' || value.type == 'facet' || value.type == 'Literal')){
					// dataType
					this.resolver = JSB().clone(value);
				} /* else if((value.name && value.name == 'Literal') 
						|| (value.type && value.type == 'Literal') 
						|| (value.entityType && value.entityType == 'Literal')){
					this.resolver = {
						type: 'Literal',
						datatype: value.datatype || 'xsd:string',
						plain: value.plain,
						value: null
					};
				} */ else {
					throw 'Unknown value type: ' + JSON.stringify(value, null, 2);
				}
			} else {
				throw 'Unknown value type: ' + JSON.stringify(value, null, 2);
			}
			this.create();
			if(this.options.onChange){
				this.options.onChange.call(this);
			}
		},
		
		create: function(){
			var self = this;
			this.getElement().empty();
			
			this.placeHolder = this.$('<div class="placeholder"></div>');
			this.append(this.placeHolder);
			
			
			if(this.options.allowDelete){
				this.addClass('allowDelete');
			}
			
			if(this.scheme.length > 1 || self.isSpecialFill(self.scheme[0].name)){
				this.placeHolder.addClass('changeable');
				this.placeHolder.addClass('selectable');
				this.placeHolder.click(function(evt){
					JSB.Widgets.ToolManager.activate({
						id: 'expressionMenuTool',
						cmd: 'show',
						data: {
							ontology: self.ontology,
							scheme: self.scheme,
							group: self.options.group,
							prevEntry: self.chosenEntry
						},
						scope: null,
						target: {
							selector: self.placeHolder,
							dock: 'bottom'
						},
						constraints: [{
							selector: self.placeHolder,
							weight: 10.0
						}],
	
						callback: function(res){
							self.setValue(res);
						}
					});
				});
			} else if(this.resolver == null){
				this.placeHolder.addClass('changeable');
				this.placeHolder.click(function(evt){
					self.setValue(self.scheme[0]);
				});
			}
			
			for(var et in this.acceptedTypes){
				this.placeHolder.addClass(et);
			}
			
			this.phMap = {};
			
			if(!this.resolver){
				// create empty placeholder
				this.placeHolder.addClass('empty');
				
				if(this.options.plusMarker){
					this.placeHolder.append(this.$('<span class="plus">+</span>'));
				}
				
				// append expression type
				for(var i = 0; i < Object.keys(this.acceptedTypes).length; i++ ){
					var et = Object.keys(this.acceptedTypes)[i];
					if(i > 0){
						this.placeHolder.append(this.$('<span class="separator">|</span>'));
					}
					this.placeHolder.append(this.$('<span class="type"></span>').text(et));
				}
				
				// append down arrow button
				this.placeHolder.append('<span class="menu">&#x25be;</span>');
				
				if(this.options.argName){
					this.append(this.$('<span class="comment"></span>').text(this.options.argName));
				}
			} else {
				var closeElt = this.$('<span class="close" title="Удалить"></span>');
				closeElt.click(function(evt){
					if(self.options.onDelete){
						self.options.onDelete.call(self);
					}
				});
				
				// create filled placeholder
				this.placeHolder.addClass('filled');
				if(!JSB().isBean(this.resolver) && this.resolver.type 
					&& this.resolver.type.toLowerCase() != 'literal' 
					&& this.resolver.type.toLowerCase() != 'typename' 
					&& this.resolver.type.toLowerCase() != 'facet' 
					&& this.resolver.type.toLowerCase() != 'iri'){

					var chosenMatch = null;
					var chosenSchemeEntry = null;
					if(!JSB().isNull(this.resolver.schemeIdx)){
						chosenSchemeEntry = Ontoed.Host.axiomScheme[this.resolver.schemeIdx];
					} else {
						// detect chosenSchemeEntry
						var acceptableEntries = Ontoed.Host.getEntriesByName(this.resolver.type);
						if(acceptableEntries.length == 0){
							throw 'Unable to find scheme name: ' + this.resolver.type;
						}
						
						if(this.resolver.items && this.resolver.items.length > 0){
							// narrow acceptableEntries by arguments count match
							var acceptableEntriesNarrowed = [];
							var minWeight = null, minIdx = null;
							for(var i = 0; i < acceptableEntries.length; i++ ){
								var entry = acceptableEntries[i];
								
								var matchResult = this.matchArguments(entry, this.resolver.items);
								
								if(JSB().isNull(minWeight) || matchResult.weight < minWeight){
									minWeight = matchResult.weight;
									chosenMatch = matchResult;
									minIdx = i;
								}
							}
							
							chosenSchemeEntry = acceptableEntries[minIdx];
						} else {
							chosenSchemeEntry = acceptableEntries[0];
						}
					}
					
					// place expression
					this.chosenEntry = chosenSchemeEntry;
					if(!chosenMatch){
						chosenMatch = this.matchArguments(chosenSchemeEntry, this.resolver.items);
					}
					
					// append expression type
					this.placeHolder.append(this.$('<span class="type"></span>').text(this.resolver.type));
					
					// append down arrow button
					this.placeHolder.append('<span class="menu">&#x25be;</span>')
					
					// append close
					this.placeHolder.append(closeElt);
					
					// add items
					this.append('<span class="paren open">(</span>');
					if(this.options.argName){
						this.append(this.$('<span class="comment"></span>').text(this.options.argName));
					}
					
					function addPlaceholder(argIdx, resolver, argScheme, itemIdx, afterElt, plusMarker){
						var arg = chosenSchemeEntry.arguments[argIdx];

						function updateDeleteState(){
							if(arg.multiple){
								var filledCount = 0;
								for(var i in self.phMap[argIdx]){
									var ph = self.phMap[argIdx][i];
									if(ph.resolver){
										filledCount++;
									}
								}
								for(var i in self.phMap[argIdx]){
									var ph = self.phMap[argIdx][i];
									ph.allowDelete(filledCount > 1);
								}	
							}
						}
						
						var itemPlaceholder = new Ontoed.ExpressionPlaceholderRenderer(JSB().merge({}, self.options, {
							resolver: resolver, 
							scheme: argScheme, 
							argName: arg.name,
							group: false,
							plusMarker: plusMarker,
							allowDelete: false,
							onCreate: function(){
								if(!self.phMap[argIdx]){
									self.phMap[argIdx] = [];
								}
								self.phMap[argIdx].push(this);
							},
							onChange: function(){
								if(arg.multiple && !self.resolver.items[this.itemIdx]){
									// create new empty placeholder
									if(self.resolver.items.length > this.itemIdx + 1){
										self.resolver.items.splice(this.itemIdx + 1, 0, null);
										
										// move indices in placeholders
										for(var i in self.phMap){
											var phArr = self.phMap[i];
											for(var j in phArr){
												var ph = phArr[j];
												if(ph.itemIdx > this.itemIdx){
													ph.itemIdx++;
												}
											}
										}
										
									} else {
										self.resolver.items.push(null);
									}
									addPlaceholder(argIdx, null, argScheme, this.itemIdx + 1, this.container, true);
								}
								self.resolver.items[this.itemIdx] = this.resolver;
							},
							onDelete: function(){
								for(var i in self.phMap){
									var phArr = self.phMap[i];
									for(var j = phArr.length - 1; j >= 0; j-- ){
										var ph = phArr[j];
										if(ph == this){
											phArr.splice(j, 1);
										} else if(ph.itemIdx > this.itemIdx){
											ph.itemIdx--;
										}
									}
								}
								self.resolver.items.splice(this.itemIdx, 1);
								updateDeleteState();
								this.container.remove();
								this.destroy();
								if(self.options.onChangeFilled){
									self.options.onChangeFilled.call(self);
								}
							},
							onChangeFilled: function(){
								if(self.options.onChangeFilled){
									self.options.onChangeFilled.call(self);
								}
							}
						}));
						
						var argContainer = self.$('<div class="argContainer"></div>').append(itemPlaceholder.getElement());
						itemPlaceholder.container = argContainer;
						itemPlaceholder.itemIdx = itemIdx;
						self.resolver.items[itemIdx] = itemPlaceholder.resolver;
						if(!afterElt){
							self.append(argContainer);
						} else {
							afterElt.after(argContainer);
						}
						
						// update delete state
						updateDeleteState();
					}

					this.resolver.items = [];
					for(var i = 0; i < chosenSchemeEntry.arguments.length; i++ ){
						var arg = chosenSchemeEntry.arguments[i];
						var argMatches = chosenMatch.matches[i];
						
						// construct scheme
						var argScheme = [];
						var argSchemeMap = {};
						var argTypes = this.getArgTypes(arg);
						for(var t in argTypes){
							
							// check for simple types
							var pl = self.getPlainLiteral(t);
							if(pl){
								argScheme.push({
									name: t,
									entityType: 'Literal',
									type: 'Literal',
									datatype: pl,
									plain: true,
									value: null
								});
							} else {
								var entries = Ontoed.Host.getEntriesByName(t);
								if(entries.length == 0 && t == 'Facet'){
									argScheme.push({
										name: t,
										entityType: t,
									});
								} else {
									for(var e = 0; e < entries.length; e++){
										argSchemeMap[entries[e].idx] = entries[e];
									}
								}
							}
						}
						for(var j in argSchemeMap){
							argScheme.push(argSchemeMap[j]);
						}
						
						argScheme = self.trasformScheme(argScheme);
						
						if(argMatches.length == 0){
							if(argScheme.length == 1 && argScheme[0].name && !self.isSpecialFill(argScheme[0].name)){
								// create placeholder with specified literal
								this.resolver.items.push(null);
								addPlaceholder(i, JSB().clone(argScheme[0]), argScheme, this.resolver.items.length - 1, null, false);
								
								if(arg.multiple){
									// create multiple empty placeholder
									this.resolver.items.push(null);
									addPlaceholder(i, null, argScheme, this.resolver.items.length - 1, null, true);
								}

							} else {
								// create empty placeholder
								this.resolver.items.push(null);
								addPlaceholder(i, null, argScheme, this.resolver.items.length - 1, null, false);
							}
							
							
						} else {
							for(var j = 0; j < argMatches.length; j++ ){
								this.resolver.items.push(argMatches[j]);
								addPlaceholder(i, argMatches[j], argScheme, this.resolver.items.length - 1, null, false);
							}
							
							if(arg.multiple){
								// create multiple empty placeholder
								this.resolver.items.push(null);
								addPlaceholder(i, null, argScheme, this.resolver.items.length - 1, null, true);
							}
						}
						
					}
					this.append('<span class="paren close">)</span>');
					this.append(this.$('<span class="comment"></span>').text(this.resolver.type));
				} else {
					var bEditMode = false;
					if(this.resolver.type && this.resolver.type == 'Literal' && JSB().isNull(this.resolver.value)){
						bEditMode = true;
						
						switch(this.resolver.datatype){
						case 'xsd:int':
							this.resolver.value = 0;
							break;
						case 'xsd:float':
						case 'xsd:double':
							this.resolver.value = 0.0;
							break;
						case 'xsd:boolean':
							this.resolver.value = false;
							break;
						default:
							this.resolver.value = '';
						}
						
					} else if(this.resolver.type && this.resolver.type == 'IRI' && JSB().isNull(this.resolver.value)){
						bEditMode = true;
						this.resolver.value = '';
					}
					
					var renderer = Ontoed.RendererRepository.createRendererFor(this.resolver, JSB().merge({}, this.options, {
						allowNavigate: false, 
						allowEdit: true,
						onChange: function(desc){
							self.resolver.value = desc.value;
							self.resolver.datatype = desc.datatype;
							
							if(self.options.onChangeFilled){
								self.options.onChangeFilled.call(self);
							}
						}
					}));
					if(this.context == this.resolver){
						renderer.addClass('context');
					}
					this.placeHolder.append(renderer.getElement());
					this.placeHolder.append('<span class="menu">&#x25be;</span>');
					
					// append close
					this.placeHolder.append(closeElt);

					if(this.options.argName){
						this.append(this.$('<span class="comment"></span>').text(this.options.argName));
					}
					
					if(bEditMode){
						renderer.beginEdit();
					}
				}
			}
			
			if(this.options.onChangeFilled){
				this.options.onChangeFilled.call(this);
			}

		},
		
		isFilled: function(){
			if(!this.resolver){
				return false;
			}
			if(this.resolver.type && this.resolver.type == 'IRI'){
				return this.resolver.value.trim().length > 0;
			}
			if(!this.chosenEntry){
				return true;
			}
			for(var i = 0; i < this.chosenEntry.arguments.length; i++ ){
				var arg = this.chosenEntry.arguments[i];
				var phLst = this.phMap[i];
				if(!phLst){
					return false;
				}
				var argFilledCount = 0;
				for(var j = 0; j < phLst.length; j++ ){
					var ph = phLst[j];
					if(!ph.resolver){
						if(!arg.multiple){
							return false;
						}
						continue;
					}
					if(!ph.isFilled()){
						return false;
					}
					argFilledCount++;
				}
				if(argFilledCount === 0){
					return false;
				}
			}
			return true;
		},
		
		isSpecialFill: function(name){
			var specialNames = {
				Class: true,
				ObjectProperty: true,
				DataProperty: true,
				AnnotationProperty: true,
				NamedIndividual: true,
				Datatype: true,
				Facet: true
			};
			
			return specialNames[name];
		},
		
		getPlainLiteral: function(type){
			var simpleTypes = {
				'int': 'xsd:int',
				'xsd:int': 'xsd:int',
				'float': 'xsd:float',
				'xsd:float': 'xsd:float',
				'double': 'xsd:double',
				'xsd:double': 'xsd:double',
				'string': 'xsd:string',
				'xsd:string': 'xsd:string',
				'boolean': 'xsd:boolean',
				'xsd:boolean': 'xsd:boolean'
			};
			return simpleTypes[type.toLowerCase()];
		},
		
		trasformScheme: function(scheme){
			var outScheme = [];
			
			// check literals
			var bAppendLiteral = false;
			var bAppendIri = false;
			for(var i = 0; i < scheme.length; i++ ){
				if(scheme[i].name == 'Literal'){
					bAppendLiteral = true;
					continue;
				}
				if(scheme[i].name == 'IRI'){
					bAppendIri = true;
					continue;
				}
				outScheme.push(scheme[i]);
			}
			
			if(bAppendLiteral){
				outScheme.push({
					name: 'Literal',
					entityType: 'Literal',
					type: 'Literal',
					datatype: 'xsd:string',
					value: null
				});
			}
			
			if(bAppendIri){
				outScheme.push({
					name: 'IRI',
					entityType: 'IRI',
					datatype: 'IRI',
					type: 'IRI'
				});
			}
			
			return outScheme;
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
		
		matchArguments: function(entry, items){
			if(!items){
				items = [];
			}
			var matchResult = {
				weight: 0,
				matches: []
			}
			var itemIdx = 0;
			var itemMarks = [];
			for(var i = 0; i < items.length; i++ ){
				itemMarks.push(false);
			}
			for(var i = 0; i < entry.arguments.length; i++ ){
				var arg = entry.arguments[i];
				var argTypes = this.getArgTypes(arg);
				var matchItems = [];
				matchResult.matches.push(matchItems);
				
				for(var itemIdx = 0; itemIdx < items.length; itemIdx++){
					if(itemMarks.length > itemIdx && itemMarks[itemIdx]){
						continue;
					}
					if(matchItems.length > 0 && !arg.multiple){
						break;
					}
					var itemObj = items[itemIdx];
					if(!itemObj){
						continue;
					}
					if(!JSB().isBean(itemObj) && itemObj.type 
							&& itemObj.type.toLowerCase() != 'literal' 
							&& itemObj.type.toLowerCase() != 'typename' 
							&& itemObj.type.toLowerCase() != 'facet' 
							&& itemObj.type.toLowerCase() != 'iri'){
						// expression
						if(argTypes[itemObj.type]){
							// matched
							matchItems.push(itemObj);
							itemMarks[itemIdx] = true;
						}
					} else if(JSB().isBean(itemObj)){
						var itemTypes = [];
						if(JSB().isInstanceOf(itemObj, 'Ontoed.Model.Class')){
							itemTypes = ['Class','IRI', 'String'];
						} else if(JSB().isInstanceOf(itemObj, 'Ontoed.Model.ObjectProperty')){
							itemTypes = ['ObjectProperty','IRI', 'String'];
						} else if(JSB().isInstanceOf(itemObj, 'Ontoed.Model.DataProperty')){
							itemTypes = ['DataProperty','IRI', 'String'];
						} else if(JSB().isInstanceOf(itemObj, 'Ontoed.Model.AnnotationProperty')){
							itemTypes = ['AnnotationProperty','IRI', 'String'];
						} else if(JSB().isInstanceOf(itemObj, 'Ontoed.Model.Instance')){
							itemTypes = ['Individual','IRI', 'String'];
							if(itemObj.info.isAnonymous){
								itemTypes.push('AnonymousIndividual');
							} else {
								itemTypes.push('NamedIndividual');
							}
						}
						for(var j in itemTypes){
							if(argTypes[itemTypes[j]]){
								
								if(itemTypes[j] == 'IRI'){
									matchItems.push({
										type: 'IRI',
										datatype: itemTypes[j],
										value: itemObj.info.shortIRI
									});
								} else if(itemTypes[j] == 'String'){
									matchItems.push({
										type: 'Literal',
										plain: true,
										datatype: 'xsd:string',
										value: itemObj.info.shortIRI
									});
								} else {
									matchItems.push(itemObj);
								}
								
								itemMarks[itemIdx] = true;
								break;
							}
						}
					} else {
						// literal or typename or iri or facet
						var itemTypes = [];
						if(!JSB().isPlainObject(itemObj) || !itemObj.type){
							throw 'Invalid resolver item: ' + JSB().stringify(itemObj);
						}
						if(itemObj.type.toLowerCase() == 'literal'){
							itemTypes = ['Literal', 'int', 'String', 'float', 'boolean', 'double'];
							switch(itemObj.datatype){
							case 'string':
							case 'xsd:string':
								itemTypes.push('IRI');
								break;
							default:
							}
						} else if(itemObj.type.toLowerCase() == 'typename'){
							itemTypes = ['Datatype'];
						} else if(itemObj.type.toLowerCase() == 'facet'){
							itemTypes = ['Facet'];
						}else if(itemObj.type.toLowerCase() == 'iri'){
							itemTypes = ['IRI', 'String'];
						} else {
							throw 'Unknown resolver type: ' + itemObj.type;
						}
						for(var j in itemTypes){
							if(argTypes[itemTypes[j]]){
								if(itemTypes[j] == 'IRI' && itemObj.type.toLowerCase() == 'literal'){
									// convert literal to IRI
									itemObj.type = 'IRI';
									itemObj.datatype = 'IRI';
									if(!JSB().isNull(itemObj.plain)){
										delete itemObj.plain;
									}
								} else {
									var pl = this.getPlainLiteral(itemTypes[j]);
									if(pl){
										itemObj.type = 'Literal';
										itemObj.plain = true;
										itemObj.datatype = pl;
									}
								}
								matchItems.push(itemObj);
								itemMarks[itemIdx] = true;
								break;
							}
						}
					}
				}
			}
			
			// calc missing args
			for(var i in matchResult.matches){
				if(matchResult.matches[i].length == 0){
					matchResult.weight++;
				}
			}
			
			var leftItems = 0;
			for(var i = 0; i < items.length; i++ ){
				if(!itemMarks[i]){
					leftItems++;
				}
			}
			
			matchResult.weight += leftItems;
			
			return matchResult;
		}
	}
});
