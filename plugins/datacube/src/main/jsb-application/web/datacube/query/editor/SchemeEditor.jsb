{
	$name: 'DataCube.Query.SchemeEditor',
	$parent: 'JSB.Widgets.Control',
	$require: ['DataCube.Query.QuerySyntax', 
	           'JSB.Widgets.Button', 
	           'JSB.Widgets.PrimitiveEditor', 
	           'DataCube.Query.SchemeMenuTool',
	           'JSB.Widgets.ToolManager'],
	
	$client: {
		selected: false,
		
		$constructor: function(opts){
			$base(opts);
			this.loadCss('SchemeEditor.css')
			this.addClass('schemeEditor');
			
			$this.acceptedSchemes = opts.acceptedSchemes;
			$this.schemeName = opts.schemeName;
			$this.scope = opts.scope;
			$this.scopeName = opts.scopeName;
			$this.value = opts.value;
			
			$this.substrate = $this.$(`
				<div class="substrate"></div>
			`);
			$this.append($this.substrate);
			
			$this.container = $this.$('<div class="container"></div>');
			$this.append($this.container);
/*			
			$this.btnAdd = new Button({
				cssClass: 'roundButton btn10 btnCreate',
				tooltip: 'Добавить поле',
				onClick: function(){
					debugger;
				}
			});
			$this.append($this.btnAdd);

			$this.btnEdit = new Button({
				cssClass: 'roundButton btn10 btnEdit',
				tooltip: 'Редактировать',
				onClick: function(){
					if($this.scheme.expressionType == 'EConstString' || $this.scheme.expressionType == 'EConstNumber'){
						if($this.valueEditor){
							JSB.defer(function(){
								$this.valueEditor.beginEdit();	
							});
							
						}
					}
				}
			});
			$this.append($this.btnEdit);
*/
			if($this.value){
				$this.refresh();
			}
			
			$this.getElement().on({
				mouseover: function(evt){
					evt.stopPropagation();
					JSB.cancelDefer('DataCube.Query.SchemeEditor.out');
					JSB.defer(function(){
						$this.select(true);
					}, 300, 'DataCube.Query.SchemeEditor.over');
				},
				mouseout: function(evt){
					evt.stopPropagation();
					JSB.defer(function(){
						$this.select(false);
					}, 300, 'DataCube.Query.SchemeEditor.out');

				}
			});
			
			$this.subscribe('DataCube.Query.SchemeEditor.selected', function(sender, msg, bSelect){
				if(sender == $this){
					return;
				} else {
					if(bSelect){
						// remove current selection
						$this.select(false);
					}
				}
			});
		},
		
		select: function(bSelect){
			if($this.selected === bSelect){
				return;
			}
			
			$this.publish('DataCube.Query.SchemeEditor.selected', bSelect);
			$this.selected = bSelect;
			$this.classed('hover', bSelect);
			
			// show popup menu
			if(bSelect){
				console.log('activate');
				$this.menuTool = ToolManager.activate({
					id: 'schemeMenuTool',
					cmd: 'show',
					data: {
						editor: $this,
					},
					scope: null,
					target: {
						selector: $this.getElement(),
						dock: 'top',
						offsetVert: -1
					},
					constraints: [{
						selector: $this.getElement(),
						weight: 10.0
					}],
					callback: function(desc){
					}
				});
			} else {
				if($this.menuTool){
					console.log('deactivate');
					$this.menuTool.close();
					$this.menuTool = null;
				}
			}
		},
		
		set: function(value, scope, scopeName){
			$this.value = value;
			if(!scope){
				scope = value;
			}
			$this.scope = scope;
			if(scopeName){
				$this.scopeName = scopeName;
			}
			$this.refresh();
		},
		
		refresh: function(){
			$this.container.empty();
			
			if($this.schemeName == 1){
				$this.scheme = 1;
			} else {
				$this.scheme = QuerySyntax.getSchema()[$this.schemeName];
			}
			$this.construct();
		},
		
		construct: function(){
			if($this.scheme == 1){
				$this.attr('etype', '1');
				$this.attr('sname', '1');
			} else {
				$this.attr('etype', $this.scheme.expressionType);
				$this.attr('sname', $this.scheme.name);
				
				if($this.scheme.expressionType == 'ComplexObject' 
					|| $this.scheme.expressionType == 'SingleObject'){
					
					var valSchemes = $this.value ? $this.resolve($this.scheme, $this.value) : {};
					
					function drawEntry(valName, valScheme, opts){
						// draw value entry
						var entryElt = $this.$('<div class="entry"></div>');
						$this.container.append(entryElt);
						
						// add key
						var keyElt = $this.$('<div class="key"></div>').text(valName).attr('title', valName);
						if(opts && opts.keyword){
							keyElt.addClass('keyword');
						}
						entryElt.append(keyElt);
						
						// add separator
						var sepElt = $this.$('<div class="separator"><div class="icon"></div></div>');
						sepElt.addClass('selectable');
						entryElt.append(sepElt);
						
						// add value
						if(!JSB.isDefined($this.value[valName])){
							// create scope entry
							var entryScheme = QuerySyntax.getSchema()[valScheme];
							if(entryScheme.type == 'object'){
								$this.value[valName] = {};
							} else if(entryScheme.type == 'array'){
								$this.value[valName] = [];
							} else {
								throw new Error('Unsupported entry type: ' + entryScheme.type);
							}
						}
						
						var valueEditor = new $class(JSB.merge({}, $this.options, {
							acceptedSchemes: opts.acceptedSchemes,
							schemeName: valScheme,
							scopeName: valName,
							scope: $this.value,
							value: $this.value[valName]
						}));
						valueEditor.addClass('value');
						entryElt.append(valueEditor.getElement());
					}
					
					// draw values
					if(JSB.isArray($this.scheme.values)){
						// draw simple object
						var acceptedSchemes = $this.combineAccepted($this.scheme.name);
						drawEntry($this.scheme.name, valSchemes.obj[$this.scheme.name].scheme, {keyword: true, acceptedSchemes: acceptedSchemes});
					} else {
						// construct optional map
						var optionalMap = {};
						if($this.scheme.optional && $this.scheme.optional.length > 0){
							for(var i = 0; i < $this.scheme.optional.length; i++){
								optionalMap[$this.scheme.optional[i]] = true;
							}
						}

						// draw complex object
						for(var vName in $this.scheme.values){
							var acceptedSchemes = $this.combineAccepted($this.scheme.values[vName]);
							if(JSB.isDefined($this.scheme.customKey) && vName == $this.scheme.customKey){
								for(var fName in $this.value){
									// skip non-customs 
									if($this.scheme.values[fName]){
										continue;
									}
									drawEntry(fName, valSchemes.obj[fName].scheme, {acceptedSchemes: acceptedSchemes});
								}
							} else {
								if(JSB.isDefined($this.value[vName]) || !optionalMap[vName]){
									if(!valSchemes.obj[vName]){
										debugger;
									}
									drawEntry(vName, valSchemes.obj[vName].scheme, {keyword: true, acceptedSchemes: acceptedSchemes});
								}
							}
						}
					}
				} else if($this.scheme.expressionType == 'EArray'){
					if($this.value && !JSB.isArray($this.value)){
						$this.value = $this.scope[$this.scopeName] = [$this.value];
					}
					
					if($this.value){
						var acceptedSchemes = $this.combineAccepted($this.scheme.name);
						var valSchemes = $this.resolve($this.scheme, $this.value);
						for(var i = 0; i < $this.value.length; i++){
							var curVal = $this.value[i];
							var valScheme = valSchemes.obj[i].scheme;
							var entryElt = $this.$(`
								<div class="entry">
									<div class="handle">
										<div></div>
										<div></div>
										<div></div>
									</div>
								</div>`);
							$this.container.append(entryElt);
							
							var valueEditor = new $class(JSB.merge({}, $this.options, {
								acceptedSchemes: acceptedSchemes,
								schemeName: valScheme,
								scopeName: i,
								scope: $this.value,
								value: curVal
							}));
							valueEditor.addClass('value');
							entryElt.append(valueEditor.getElement());
						}
					}
				} else if($this.scheme.expressionType == 'Group'){
					throw new Error('Unable to render Group');
/*					if($this.value){
						var valScheme = $this.resolve($this.scheme, $this.value).scheme;
						var entryElt = $this.$('<div class="entry"></div>');
						$this.container.append(entryElt);
						
						var valueEditor = new $class(JSB.merge({}, $this.options, {
							schemeName: valScheme,
							scopeName: $this.scopeName,
							scope: $this.scope,
							value: $this.value
						}));
						valueEditor.addClass('value');
						entryElt.append(valueEditor.getElement());
					} */
				} else if($this.scheme.expressionType == 'EConstBoolean'){
					debugger;
				} else if($this.scheme.expressionType == 'EConstString'){
					$this.valueEditor = new PrimitiveEditor({
						valueType: 'string',
						mode: 'inplace',
						onChange: function(){
							debugger;
						}
					});
					$this.container.append($this.valueEditor.getElement());
					if($this.value){
						$this.valueEditor.setData($this.value);
					} else {
						$this.valueEditor.beginEdit();
					}
				} else if($this.scheme.expressionType == 'EConstNumber'){
					$this.valueEditor = new PrimitiveEditor({
						valueType: 'double',
						mode: 'inplace',
						onChange: function(){
							debugger;
						}
					});
					$this.container.append($this.valueEditor.getElement());
					if($this.value){
						$this.valueEditor.setData($this.value);
					} else {
						$this.valueEditor.beginEdit();
					}
				}  else {
					throw new Error('Unknown expression type: ' + $this.scheme.expressionType);
				}
			}
			
		},
		
		combineAccepted: function(schemeName){},
		
		resolve: function(schemeName, value){
			var scheme = schemeName;
			if(JSB.isString(scheme)){
				scheme = QuerySyntax.getSchema()[scheme];
			}
			if(!JSB.isString(schemeName)){
				schemeName = schemeName.name;
			}
			if(scheme == 1 && scheme == value){
				return {w: 1, scheme: schemeName};
			}
			if(!scheme || !scheme.expressionType){
				return {w: 0, scheme: schemeName};
			}
			
			function extractIntegratedWeight(desc, forceArray){
				var w = 1;
				if(!desc){
					return 0;
				}
				if(forceArray){
					for(var v in desc){
						var curW = extractIntegratedWeight(desc[v]);
						if(JSB.isDefined(curW)){
							w *= curW;
						} else {
							w = 0;
						}
					}
				} else {
					if(JSB.isDefined(desc.w)){
						w = desc.w;
					} else if(JSB.isDefined(desc.obj)){
						for(var v in desc.obj){
							var curW = extractIntegratedWeight(desc.obj[v]);
							if(JSB.isDefined(curW)){
								w *= curW;
							} else {
								w = 0;
							}
						}
					}
				}
				return w;
			}
			
			switch(scheme.expressionType){
			case 'EConstBoolean':
				if(JSB.isObject(value) || JSB.isArray(value)){
					return {w: 0, scheme: schemeName};
				}
				if(JSB.isBoolean(value)){
					return {w: 1, scheme: schemeName};
				}
				return {w: 0.5, scheme: schemeName};
				break;
			case 'EConstString':
				if(JSB.isObject(value) || JSB.isArray(value)){
					return {w: 0, scheme: schemeName};
				}
				if(JSB.isString(value)){
					return {w: 1, scheme: schemeName};
				} 
				return {w: 0.5, scheme: schemeName};
			case 'EConstNumber':
				if(JSB.isObject(value) || JSB.isArray(value)){
					return {w: 0, scheme: schemeName};
				}
				if(JSB.isNumber(value)){
					return {w: 1, scheme: schemeName};
				} 
				return {w: 0.5, scheme: schemeName};
				break;
			case 'SingleObject':
			case 'ComplexObject':
				if(!JSB.isObject(value)){
					return {w: 0};
				}
				var res = {};
				for(var vName in value){
					var curDesc = {w: 0};
					if(JSB.isArray(scheme.values)){
						if(scheme.expressionType != 'SingleObject'){
							throw new Error('Invalid scheme values for SingleObject: ' + JSON.stringify(scheme.values));
						}
						if(JSB.isDefined(value[scheme.name])){
							var minW = null;
							for(var i = 0; i < scheme.values.length; i++){
								var curScheme = scheme.values[i];
								if(!curScheme){
									continue;
								}
	
								var wDesc = this.resolve(curScheme, value[vName]);
								if(wDesc.w > curDesc.w){
									if(!wDesc.scheme){
										wDesc.scheme = curScheme;
									}

									curDesc = wDesc;
									if(curDesc.w >= 1){
										break;
									}

								}
							}
						}
					} else {
						if(scheme.values[vName]){
//							curDesc = {w: 1, scheme: scheme.values[vName]};
							curDesc = this.resolve(scheme.values[vName], value[vName]);
						} else if(scheme.customKey){
							curDesc = this.resolve(scheme.values[scheme.customKey], value[vName]);
						} else {
							curDesc = {w: 0};
						}
					}
					res[vName] = curDesc;
				}
				if(Object.keys(res).length === 0){
					return {w: 0};
				}
				return {obj:res, w: extractIntegratedWeight(res, true), scheme: schemeName};
			case 'EArray':
				if(!JSB.isArray(value)){
					return {w: 0};
				}
				var res = [];
				for(var j = 0; j < value.length; j++){
					var curDesc = {w: 0};
					for(var i = 0; i < scheme.values.length; i++){
						var curScheme = scheme.values[i];
						if(!curScheme){
							continue;
						}

						var wDesc = this.resolve(curScheme, value[j]);
						if(wDesc.w > curDesc.w){
							if(!wDesc.scheme){
								wDesc.scheme = curScheme;
							}
							curDesc = wDesc;
							if(curDesc.w >= 1){
								break;
							}
						}
					}
					res.push(curDesc);
				}
				if(res.length === 0){
					return {w: 0};
				}
				return {obj:res, w: extractIntegratedWeight(res, true), scheme: schemeName};
			case 'Group':
				var curDesc = {w: 0};
				for(var i = 0; i < scheme.values.length; i++){
					var curScheme = scheme.values[i];
					if(!curScheme){
						continue;
					}
					var wDesc = this.resolve(curScheme, value);
					if(wDesc.w > curDesc.w){
						if(!wDesc.scheme){
							wDesc.scheme = curScheme;
						}
						curDesc = wDesc;
						if(curDesc.w >= 1){
							break;
						}
					}
				}
				
				return curDesc;
			default:
				throw new Error('Unexpected expression type: ' + scheme.expressionType);
			}
		}
	},
	
	$server: {
		
	}
}