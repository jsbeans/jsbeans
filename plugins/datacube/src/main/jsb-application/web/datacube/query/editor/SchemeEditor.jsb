{
	$name: 'DataCube.Query.SchemeEditor',
	$parent: 'JSB.Widgets.Control',
	$require: ['DataCube.Query.QuerySyntax', 'JSB.Widgets.Button', 'JSB.Widgets.PrimitiveEditor'],
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('SchemeEditor.css')
			this.addClass('schemeEditor');
			
			$this.schemeName = opts.schemeName;
			$this.scope = opts.scope;
			$this.scopeName = opts.scopeName;
			$this.value = opts.value;
			
			$this.container = $this.$('<div class="container"></div>');
			$this.append($this.container);
			
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

			if($this.value){
				$this.refresh();
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
					
					function drawEntry(valName, valScheme){
						// draw value entry
						var entryElt = $this.$('<div class="entry"></div>');
						var keyElt = $this.$('<div class="key"></div>').text(valName);
						entryElt.append(keyElt);
						$this.container.append(entryElt);
						
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
						drawEntry($this.scheme.name, valSchemes.obj[$this.scheme.name].scheme);
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
							if(JSB.isDefined($this.scheme.customKey) && vName == $this.scheme.customKey){
								for(var fName in $this.value){
									// skip non-customs 
									if($this.scheme.values[fName]){
										continue;
									}
									drawEntry(fName, valSchemes.obj[fName].scheme);
								}
							} else {
								if(JSB.isDefined($this.value[vName]) || !optionalMap[vName]){
									if(!valSchemes.obj[vName]){
										debugger;
									}
									drawEntry(vName, valSchemes.obj[vName].scheme);
								}
							}
						}
					}
				} else if($this.scheme.expressionType == 'EArray'){
					if($this.value && !JSB.isArray($this.value)){
						$this.value = $this.scope[$this.scopeName] = [$this.value];
					}
					
					if($this.value){
						var valSchemes = $this.resolve($this.scheme, $this.value);
						
						for(var i = 0; i < $this.value.length; i++){
							var curVal = $this.value[i];
							var valScheme = valSchemes.obj[i].scheme;
							var entryElt = $this.$('<div class="entry"></div>');
							$this.container.append(entryElt);
							
							var valueEditor = new $class(JSB.merge({}, $this.options, {
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