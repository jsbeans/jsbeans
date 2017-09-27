{
	$name: 'DataCube.Query.SchemeEditor',
	$parent: 'JSB.Widgets.Control',
	$require: ['DataCube.Query.QuerySyntax', 
	           'JSB.Widgets.Button', 
	           'JSB.Widgets.PrimitiveEditor', 
	           'DataCube.Query.SchemeMenuTool',
	           'DataCube.Query.SchemePopupTool',
	           'JSB.Widgets.ToolManager'],
	
	$client: {
		options: {
			onChange: function(){}
		},
		
		$constructor: function(opts){
			$base(opts);
			this.loadCss('SchemeEditor.css')
			this.addClass('schemeEditor');
			
			$this.parent = opts.parent;
			$this.acceptedSchemes = opts.acceptedSchemes;
			$this.schemeName = opts.schemeName;
			$this.scope = opts.scope;
			$this.scopeName = opts.scopeName;
			$this.value = opts.value;
			
			$this.container = $this.$('<div class="container"></div>');
			$this.append($this.container);
			
			$this.btnAdd = new Button({
				cssClass: 'roundButton btn10 btnCreate',
				tooltip: 'Добавить поле',
				onClick: function(evt){
					evt.stopPropagation();
					$this.doAdd($this.$(evt.currentTarget));
				}
			});
			$this.append($this.btnAdd);
			
			if(JSB.isDefined($this.value)){
				$this.refresh();
			}
			
			$this.subscribe('DataCube.Query.SchemeEditor.selected', function(sender, msg, hoverDesc){
				if(!hoverDesc.selected){
					return;
				}
				
				// deselect entry hovers
				var entries = $this.find('> .container > .entry');
				entries.each(function(){
					var entryElt = $this.$(this);
					var key = entryElt.attr('key');
					
					var keyHovers = entryElt.filter('.hover');
					keyHovers.each(function(){
						if(sender != $this || key != hoverDesc.entryKey || hoverDesc.entryType != 'entry'){
							$this.selectHover('entry', key, false);
						}
					});
					
					var valueHovers = entryElt.find('> .value.hover');
					valueHovers.each(function(){
						if(sender != $this || key != hoverDesc.entryKey || hoverDesc.entryType != 'value'){
							$this.selectHover('value', key, false);
						}
					});
					
				});
					
			});
		},
		
		notifyChanged: function(){
			if($this.options.onChange){
				$this.options.onChange.call($this);
			}
		},
		
		installHoverHandlers: function(entryType, entryKey, handle, opts){
			if(!entryType || !JSB.isDefined(entryKey)){
				throw new Error('Missing entryType or entryKey');
			}
			var entryId = $this.getId() + '_' + entryType + '_' + entryKey;
			var elt = null;
			if(entryType == 'entry'){
				elt = $this.find('> .container > .entry[key="'+entryKey+'"]');
			} else {
				elt = $this.find('> .container > .entry[key="'+entryKey+'"] > .value');
			}
			
			elt.addClass('selectable');
			
			if(!handle){
				handle = elt;
			}
			
			handle.on({
				mouseover: function(evt){
					evt.stopPropagation();
					JSB.cancelDefer('DataCube.Query.SchemeEditor.out:' + entryId);
					JSB.defer(function(){
						$this.selectHover(entryType, entryKey, true);
					}, 300, 'DataCube.Query.SchemeEditor.over:' + entryId);
				},
				mouseout: function(evt){
					evt.stopPropagation();
					JSB.cancelDefer('DataCube.Query.SchemeEditor.over:' + entryId);
					JSB.defer(function(){
						$this.selectHover(entryType, entryKey, false);
					}, 300, 'DataCube.Query.SchemeEditor.out:' + entryId);

				},
				click: function(evt){
					evt.stopPropagation();
					$this.doReplace($this.$(evt.currentTarget), entryType, entryKey);
					//$this.showHoverMenu(entryType, entryKey);
				}
			});
		},
/*		
		showHoverMenu: function(entryType, entryKey, opts){
			if(entryType == 'entry'){
				return;
			}
			var hoverElt = null;
			if(entryType == 'entry'){
				hoverElt = $this.find('> .container > .entry[key="'+entryKey+'"]');
			} else {
				hoverElt = $this.find('> .container > .entry[key="'+entryKey+'"] > .value');
			}
			$this.showPopupTool(opts.acceptedSchemes, hoverElt, entryType, entryKey);
		},
*/		
		combineQueries: function(){
			// search for root query
			var queryMap = {};
			var curEditor = $this;
			while(curEditor){
				if(!curEditor.parent){
					break;
				}
				curEditor = curEditor.parent;
			}
			function proceedQuery(e){
				if(e.scheme && e.scheme.name == '$query'){
					if(e.value['$context']){
						queryMap[e.value['$context']] = e;
					}
				}
				
				// proceed children
				var editors = e.find('> .container > .entry > .schemeEditor');
				editors.each(function(){
					proceedQuery($this.$(this).jsb());
				});
			}
			
			proceedQuery(curEditor);
			
			return queryMap;
		},
		
		generateQueryContextName: function(prefix){
			prefix = prefix || 'sub';
			var queryMap = $this.combineQueries();
			if(!queryMap[prefix]){
				return prefix;
			}
			for(var idx = 2; ; idx++){
				var ctxSuggestName = prefix + idx;
				if(!queryMap[ctxSuggestName]){
					return ctxSuggestName;
				}
			}
		},
		
		combineColumns: function(){
			var queryMap = $this.combineQueries();
			var colMap = {};
			for(var qName in queryMap){
				var e = queryMap[qName];
				colMap[qName] = [];
				if(e.value && e.value['$select']){
					for(var fName in e.value['$select']){
						colMap[qName].push(fName);
					}
				}
			}
			
			return colMap;
		},
		
		constructEmptyValue: function(schemeName){
			var value = null;
			var schemeDesc = QuerySyntax.getSchema()[schemeName];
			if(schemeDesc.expressionType == 'ComplexObject'){
				value = {};
			} else if(schemeDesc.expressionType == 'SingleObject'){
				value = {};
				
				// take first allowed scheme values
				var schemeVal = schemeDesc.values[0];
				value[schemeDesc.name] = $this.constructEmptyValue(schemeVal);
			} else if(schemeDesc.expressionType == 'EArray') {
				value = [];
				switch(schemeDesc.name){
				case '$addValues':
				case '$subValues':
					value.push({$const:0});
					value.push({$const:0});
					break;
				case '$mulValues':
				case '$divValues':
				case '$divzValues':
				case '$modValues':
					value.push({$const:0});
					value.push({$const:1});
					break;
				default:
					for(var i = 0; i < schemeDesc.minOperands; i++){
						value.push({$const:0});
					}
				}
			} else if(schemeDesc.expressionType == 'EConstBoolean'){
				value = false;
				debugger;
			} else if(schemeDesc.expressionType == 'EConstString'){
				value = "";
				debugger;
			} else if(schemeDesc.expressionType == 'EConstNumber'){
				value = 0;
				debugger;
			} else {
				throw new Error('Unexpected empty value type: ' + schemeDesc.expressionType);
			}
			
			return value;
		},
		
		doAdd: function(targetElt){
			$this.showPopupTool($this.combineAcceptedSchemes(), targetElt, null, null, function(chosenObj){
				if($this.scheme.expressionType == 'ComplexObject'){
					
					function generateColumnName(){
						var prefix = 'Столбец';
						for(var idx = 1;; idx++){
							var suggestedName = prefix + '_' + idx;
							if(!$this.value[suggestedName]){
								return suggestedName;
							}
						}
					}
					
					var colName = null;
					var value = null;
					var schemeName = null;
					var context = null;
					// detect key
					if(JSB.isString(chosenObj.key)){
						if($this.scheme.name == '$select' && chosenObj.key == '#outputFieldName'){
							// autogenerate column name
							colName = generateColumnName();
						} else {
							throw new Error('Unexpected key: ' + chosenObj.key);
						}
					} else {
						colName = chosenObj.key.value;
					}
					
					// detect value
					if(chosenObj.value){
						// resolve via value scheme
						schemeName = chosenObj.value.scheme;
						value = chosenObj.value.value;
						context = chosenObj.value.context;
					} else {
						// detect via key scheme
						schemeName = chosenObj.key.scheme;
						value = chosenObj.key.value;
						context = chosenObj.key.context;
					}
					
					if(schemeName == '#fieldName' || schemeName == '$fieldName') {
						
					} else if(schemeName == '$fieldExpr') {
						value = {
							$field: value,
							$context: context
						};
					} else {
						value = $this.constructEmptyValue(schemeName);
					}
					
					$this.value[colName] = value;
					// draw entry
					$this.drawObjectEntry(colName, schemeName, {expanded: true});
					$this.notifyChanged();
				} else if($this.scheme.expressionType == 'EArray') {
					var value = chosenObj.key.value;
					var context = chosenObj.key.context;
					var schemeName = chosenObj.key.scheme;
					if(schemeName == '#fieldName' || schemeName == '$fieldName') {
						
					} else if(schemeName == '$fieldExpr') {
						value = {
							$field: value,
							$context: context
						};
					} else {
						value = $this.constructEmptyValue(schemeName);
					}
					
					$this.value.push(value);
					// draw entry
					$this.drawArrayEntry($this.value.length - 1, schemeName, {expanded: true});
					$this.notifyChanged();
				} else {
					throw new Error('Unable to add something in ' + $this.scheme.expressionType);
				}
			});
		},
		
		doReplace: function(targetElt, entryType, entryKey){
			if(entryType == 'entry'){
				return;
			}
			var acceptedSchemes = null;
			if(JSB.isObject($this.scheme.values) && JSB.isDefined($this.scheme.values[entryKey])){
				acceptedSchemes = $this.combineAcceptedSchemes(entryKey);
			} else if(JSB.isObject($this.scheme.values) && $this.scheme.customKey){
				acceptedSchemes = $this.combineAcceptedSchemes($this.scheme.customKey);
			} else {
				acceptedSchemes = $this.combineAcceptedSchemes();
			}
			$this.showPopupTool(acceptedSchemes, targetElt, entryType, entryKey, function(chosenObj){
				debugger;
				var value = chosenObj.key.value;
				var context = chosenObj.key.context;
				var schemeName = chosenObj.key.scheme;
				if(schemeName == '#fieldName' || schemeName == '$fieldName') {
					
				} else if(schemeName == '$fieldExpr') {
					value = {
						$field: value,
						$context: context
					};
				} else {
					value = $this.constructEmptyValue(schemeName);
				}
				$this.value[entryKey] = value;
				if(JSB.isArray($this.value)){
					$this.drawArrayEntry(entryKey, schemeName, {expanded: true});
				} else {
					$this.drawObjectEntry(entryKey, schemeName, {expanded: true});
				}
				$this.notifyChanged();
			});
		},
		
		showPopupTool: function(schemes, targetElt, entryType, entryKey, callback){
			// prepare list for dialog
			var itemMap = {};
			var chosenObjectKey = null;
			if(JSB.isArray(schemes)){
				for(var i = 0; i < schemes.length; i++){
					itemMap[schemes[i]] = true;
				}
			} else if(JSB.isObject(schemes)){
				if(Object.keys(schemes).length == 1){
					// pass first
					chosenObjectKey = Object.keys(schemes)[0];
					for(var i = 0; i < schemes[chosenObjectKey].length; i++){
						itemMap[schemes[chosenObjectKey][i]] = true;
					}
				} else {
					for(sName in schemes){
						itemMap[sName] = true;
					}
				}
			} else {
				throw new Error('Invalid scheme object');
			}

			// insert existed values in skipMap
			var skipMap = {
				'$context': true
			};
			if(JSB.isDefined($this.value) && JSB.isObject($this.value)){
				for(var vName in $this.value){
					skipMap[vName] = true;
				}
			}
			
			// prepare categories
			var catMap = {};
			var bHasFields = false;
			var bHasColumns = false;
			for(var item in itemMap){
				var category = 'Разное';
				var valObj = null;
				
				if(item == '#fieldName' || item == '$fieldName'){
					if(bHasFields){
						continue;
					}
					category = 'Поля куба';
					valObj = item;
					bHasFields = true;
				} else if(item == '$fieldExpr') {
					if(bHasColumns){
						continue;
					}
					category = 'Столбцы среза';
					valObj = item;
					bHasColumns = true;
				} else {
					if(item && item[0] == '#'){
						// custom field
					} else {
						if(skipMap[item]){
							continue;
						}
						var itemDesc = QuerySyntax.getSchema()[item];
						if(!itemDesc){
							throw new Error('Unable to find scheme declaration: ' + item);
						}
						if(itemDesc.category){
							category = itemDesc.category;
						}
						valObj = {
							item: item,
							desc: itemDesc.desc,
							title: itemDesc.displayName
						};
					}
				}
				if(!catMap[category]){
					catMap[category] = [];
				}
				catMap[category].push(valObj);
			}
			
			var itemMap = {};
			if(Object.keys(catMap).length === 0 ){
				return;
			}
			if(Object.keys(catMap).length > 1){
				itemMap = catMap;
			} else {
				itemMap = catMap[Object.keys(catMap)[0]];
			}
			
			var popupTool = ToolManager.activate({
				id: 'schemePopupTool',
				cmd: 'show',
				data: {
					editor: $this,
					items: itemMap,
					entryType: entryType,
					entryKey: entryKey
				},
				scope: null,
				target: {
					selector: targetElt,
					dock: 'bottom'
				},
				constraints: [{
					selector: targetElt,
					weight: 10.0
				}],
				callback: function(desc){
					var retObj = {
						key: null,
						value: null
					};
					if(chosenObjectKey){
						retObj.key = chosenObjectKey;
						retObj.value = desc;
					} else {
						retObj.key = desc;
					}
					if(callback){
						callback.call($this, retObj);
					}
				}
			});
		},
		
		selectHover: function(entryType, entryKey, bSelect){
			var hoverElt = null;
			if(!entryType || !JSB.isDefined(entryKey)){
				throw new Error('Missing entryType or entryKey');
			}
			
			var hoverElt = null;
			if(entryType == 'entry'){
				hoverElt = $this.find('> .container > .entry[key="'+entryKey+'"]');
			} else {
				hoverElt = $this.find('> .container > .entry[key="'+entryKey+'"] > .value');
			}

			if((bSelect && hoverElt.hasClass('hover')) || (!bSelect && !hoverElt.hasClass('hover'))){
				return;
			}
			
			$this.publish('DataCube.Query.SchemeEditor.selected', {entryType: entryType, entryKey:entryKey, selected: bSelect});
			if(bSelect){
				hoverElt.addClass('hover');
			} else {
				hoverElt.removeClass('hover');
			}
			
			// show popup menu
			if(bSelect){
				$this.menuTool = ToolManager.activate({
					id: 'schemeMenuTool',
					cmd: 'show',
					data: {
						editor: $this,
						entryType: entryType,
						entryKey: entryKey
					},
					scope: null,
					target: {
						selector: hoverElt,
						dock: 'top',
						offsetVert: -1
					},
					constraints: [{
						selector: hoverElt,
						weight: 10.0
					}],
					callback: function(desc){
					}
				});
			} else {
				if($this.menuTool){
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
		
		drawObjectEntry: function(valName, valScheme, opts){
			opts = opts || {};
			// draw value entry
			var entryElt = $this.container.find('> .entry[key="'+valName+'"]');
			if(entryElt.length == 0){
				entryElt = $this.$('<div class="entry"></div>');
				entryElt.attr('key', valName);
				$this.container.append(entryElt);
			} else {
				entryElt.empty();
			}
			
			// add key
			var keyElt = $this.$('<div class="key"></div>').attr('title', valName);
			entryElt.append(keyElt);
			var keyDecl = QuerySyntax.getSchema()[valName];
			if(keyDecl && keyDecl.displayName){
				keyElt.append(keyDecl.displayName);
			} else {
				keyElt.text(valName);
			}
			
			// generate replacement schemes
			var acceptedSchemes = null;
			
			
			// check if it's keyword
			var bKeyword = false;
			if($this.scheme.expressionType == 'SingleObject'){
				acceptedSchemes = $this.combineAcceptedSchemes();
				if($this.scheme.name == valName){
					bKeyword = true;
				}
			} else if($this.scheme.expressionType == 'ComplexObject'){
				if($this.scheme.values[valName]){
					acceptedSchemes = $this.combineAcceptedSchemes(valName);
					bKeyword = true;
				} else {
					if($this.scheme.customKey){
						acceptedSchemes = $this.combineAcceptedSchemes($this.scheme.customKey);
					} else {
						acceptedSchemes = [];
					}
				}
			}
			
			if(bKeyword){
				keyElt.addClass('keyword');
			}
			
			// check if it's output field
			if($this.scheme.name == '$select'){
				keyElt.addClass('selectField');
			}
			
			
			// inject entry substrate if it's not a SingleObject
			if($this.scheme.expressionType != 'SingleObject'){
				entryElt.append('<div class="substrate"></div>');
				$this.installHoverHandlers('entry', valName, keyElt);
			}

			
			// add separator
			var sepElt = $this.$('<div class="separator"><div class="icon"></div></div>');
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
				parent: $this,
				acceptedSchemes: acceptedSchemes,
				schemeName: valScheme,
				scopeName: valName,
				scope: $this.value,
				value: $this.value[valName],
				expanded: false,
			}));
			valueEditor.addClass('value');
			entryElt.append(valueEditor.getElement());
			
			// inject value substrate
			valueEditor.append('<div class="substrate"></div>');
			
			// if value is a ComplexObject - inject handle
			var valScheme = QuerySyntax.getSchema()[valScheme];
			if(valScheme.expressionType == 'ComplexObject' || valScheme.expressionType == 'EArray'){
				var handle = $this.$('<div class="handle"></div>');
				valueEditor.append(handle);
				valueEditor.addClass('hasHandle');
				$this.installHoverHandlers('value', valName, handle, {acceptedSchemes: acceptedSchemes});
				
				entryElt.addClass('collapsible');
				if(!$this.options.expanded && !opts.expanded && $this.scheme.name != '$query'){
					entryElt.addClass('collapsed');
				}
				
				var cBox = $this.$('<div class="collapsedBox">...</div>');
				cBox.insertBefore(valueEditor.getElement());
				cBox.click(function(evt){
					evt.stopPropagation();
					entryElt.removeClass('collapsed');
				});
				sepElt.click(function(evt){
					evt.stopPropagation();
					entryElt.toggleClass('collapsed');
				});
			} else if(valScheme.expressionType == 'SingleObject'){
				var handle = valueEditor.find('> .container > .entry > .key');
				$this.installHoverHandlers('value', valName, handle, {acceptedSchemes: acceptedSchemes});
			} else {
				$this.installHoverHandlers('value', valName, null, {acceptedSchemes: acceptedSchemes});
			}
		},
		
		drawArrayEntry: function(i, valScheme, opts){
			opts = opts || {};
			var curVal = $this.value[i];
			
			var acceptedSchemes = $this.combineAcceptedSchemes();
			var entryElt = $this.container.find('> .entry[key="'+i+'"]');
			if(entryElt.length == 0){
				entryElt = $this.$('<div class="entry"></div>');
				entryElt.attr('key', i);
				$this.container.append(entryElt);
			} else {
				entryElt.empty();
			}
			
			var keyElt = $this.$('<div class="handle key"><div class="icon"></div></div>');
			
			entryElt.append(keyElt);
			
			// inject entry substrate
			entryElt.append('<div class="substrate"></div>');
			$this.installHoverHandlers('entry', i, keyElt);
			
			var valueEditor = new $class(JSB.merge({}, $this.options, {
				parent: $this,
				acceptedSchemes: acceptedSchemes,
				schemeName: valScheme,
				scopeName: i,
				scope: $this.value,
				value: curVal,
				expanded: false
			}));
			valueEditor.addClass('value');
			entryElt.append(valueEditor.getElement());

			// inject value substrate
			valueEditor.append('<div class="substrate"></div>');
			
			var valScheme = QuerySyntax.getSchema()[valScheme];
			if(valScheme.expressionType == 'ComplexObject' || valScheme.expressionType == 'EArray'){
				var handle = $this.$('<div class="handle"></div>');
				valueEditor.append(handle);
				valueEditor.addClass('hasHandle');
				$this.installHoverHandlers('value', i, handle, {acceptedSchemes: acceptedSchemes});
			} else if(valScheme.expressionType == 'SingleObject'){
				var handle = valueEditor.find('> .container > .entry > .key');
				$this.installHoverHandlers('value', i, handle, {acceptedSchemes: acceptedSchemes});
			} else {
				$this.installHoverHandlers('value', i, null, {acceptedSchemes: acceptedSchemes});
			}

		},
		
		
		constructHeuristic: function(){
			if($this.scheme.name == '$fieldName'){
				var valElt = $this.$('<div class="value"></div>').text($this.value);
				$this.container.append(valElt);
				return true;
			} else if($this.scheme.name == '$fieldExpr'){
				$this.container.append($this.$('<div class="value"></div>').text($this.value['$field']));
				$this.container.append($this.$('<div class="context"></div>').text($this.value['$context']));
				return true;
			}
			return false;
		},

		
		construct: function(){
			if($this.scheme == 1){
				$this.attr('etype', '1');
				$this.attr('sname', '1');
			} else {
				$this.attr('etype', $this.scheme.expressionType);
				$this.attr('sname', $this.scheme.name);
				
				if($this.constructHeuristic()){
					$this.attr('heuristic', true);
					return;
				} else {
					$this.attr('heuristic', false);
				}
				
				if($this.scheme.expressionType == 'ComplexObject' 
					|| $this.scheme.expressionType == 'SingleObject'){
					
					var valSchemes = $this.value ? $this.resolve($this.scheme, $this.value) : {};
					
										
					// draw values
					if(JSB.isArray($this.scheme.values)){
						// draw simple object
						$this.drawObjectEntry($this.scheme.name, valSchemes.obj[$this.scheme.name].scheme);
					} else {
						// construct optional map
						var optionalMap = {};
						if($this.scheme.optional && $this.scheme.optional.length > 0){
							for(var i = 0; i < $this.scheme.optional.length; i++){
								optionalMap[$this.scheme.optional[i]] = true;
							}
						}

						// draw complex object
/*						if($this.scheme.customKey){
							debugger;
						}*/
						
						var schemeValues = Object.keys($this.scheme.values);
						
						if($this.scheme.name == '$query'){
							schemeValues = ['$select', '$groupBy', '$from', '$filter', '$distinct', '$postFilter', '$sort', '$finalize', '$limit', '$sql'];
							
							var ctxName = $this.value['$context'];
							if(!JSB.isDefined(ctxName)){
								if(!$this.parent){
									ctxName = $this.value['$context'] = $this.generateQueryContextName('main');
								} else {
									ctxName = $this.value['$context'] = $this.generateQueryContextName();
								}
							} 
							var ctxElt = $this.$('<div class="context"></div>').text(ctxName);
							$this.append(ctxElt);

						}
						
						for(var i = 0; i < schemeValues.length; i++){
							var vName = schemeValues[i];
							if(JSB.isDefined($this.scheme.customKey) && vName == $this.scheme.customKey){
								for(var fName in $this.value){
									// skip non-customs 
									if($this.scheme.values[fName]){
										continue;
									}
									$this.drawObjectEntry(fName, valSchemes.obj[fName].scheme);
								}
							} else {
								if(JSB.isDefined($this.value[vName]) || !optionalMap[vName]){
									var vScheme = $this.scheme.values[vName];
									if(valSchemes && valSchemes.obj && valSchemes.obj[vName]){
										vScheme = valSchemes.obj[vName].scheme;
									}
									$this.drawObjectEntry(vName, vScheme);
								}
							}
						}
					}
				} else if($this.scheme.expressionType == 'EArray'){
					if($this.value && !JSB.isArray($this.value)){
						$this.value = $this.scope[$this.scopeName] = [$this.value];
					}
					
					if(JSB.isDefined($this.value)){
						var valSchemes = $this.resolve($this.scheme, $this.value);
						for(var i = 0; i < $this.value.length; i++){
							$this.drawArrayEntry(i, valSchemes.obj[i].scheme);
						}
					}
				} else if($this.scheme.expressionType == 'Group'){
					throw new Error('Unable to render Group');
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
					if(JSB.isDefined($this.value)){
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
					if(JSB.isDefined($this.value)){
						$this.valueEditor.setData($this.value);
					} else {
						$this.valueEditor.beginEdit();
					}
				}  else {
					throw new Error('Unknown expression type: ' + $this.scheme.expressionType);
				}
			}
			
		},
		
		combineAcceptedSchemes: function(key){
			function _combineSchemes(schemeName){
				var scheme = QuerySyntax.getSchema()[schemeName];
				if(!scheme){
					return [];
				}
				if(scheme.expressionType == 'Group'){
					var schemeMap = {};
					for(var i = 0; i < scheme.values.length; i++){
						var schemes = _combineSchemes(scheme.values[i]);
						for(var j = 0; j < schemes.length; j++){
							schemeMap[schemes[j]] = true;
						}
					}
					
					return Object.keys(schemeMap);
				} else {
					return [schemeName];
				}
			}
			if(key){
				return _combineSchemes($this.scheme.values[key]);
			} else {
				if(JSB.isObject($this.scheme.values)){
					var schemes = {};
					for(var vName in $this.scheme.values){
						schemes[vName] = _combineSchemes($this.scheme.values[vName]);
					}
					return schemes;
				} else if(JSB.isArray($this.scheme.values)){
					var schemeMap = {};
					for(var i = 0; i < $this.scheme.values.length; i++){
						var schemes = _combineSchemes($this.scheme.values[i]);
						for(var j = 0; j < schemes.length; j++){
							schemeMap[schemes[j]] = true;
						}
					}
					
					return Object.keys(schemeMap);
				} else {
					throw new Error('Invalid scheme values format');
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