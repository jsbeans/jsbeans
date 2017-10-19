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
		
		collapsible: false,
		handle: null,
		hoverEntries: {},
		hoverValues: {},
		
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
			
			$this.handle = $this.getElement();
			
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
		
		destroy: function(){
			// remove child if any
			var valueEditors = $this.find('> .container > .entry > .schemeEditor');
			valueEditors.each(function(){
				var inst = $this.$(this).jsb();
				if(inst){
					inst.destroy();
				}
			});
			
			var pEditors = $this.find('> .container > ._dwp_primitiveEditor');
			if(pEditors.jsb()){
				pEditors.jsb().destroy();
			}
			
			$base();
		},
		
		notifyChanged: function(){
			if($this.options.onChange){
				$this.options.onChange.call($this);
			}
		},
		
		isCollapsible: function(){
			return this.collapsible;
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
			
			if(!handle){
				handle = elt;
			}
			
			// figure out actions with hover
			var hoverDesc = $this.hoverValues;
			var allowEdit = false;
			var allowRemove = false;
			var allowReplace = false;
			var allowWrap = false;
			if(entryType == 'entry'){
				hoverDesc = $this.hoverEntries;
				if(($this.scheme.customKey == '#outputFieldName' || $this.scheme.customKey == '#value')&& JSB.isObject($this.scheme.values) && !$this.scheme.values[entryKey] ){
					allowEdit = true;
					allowRemove = true;
				} else {
					if($this.scheme.expressionType == 'EArray'){
						allowRemove = true;
					} else if($this.scheme.expressionType == 'ComplexObject'){
						
						if($this.scheme.optional){
							for(var i = 0; i < $this.scheme.optional.length; i++){
								if(($this.scheme.values[entryKey] && $this.scheme.optional[i] == entryKey) || (!$this.scheme.values[entryKey] && $this.scheme.optional[i] == $this.scheme.customKey)){
									allowRemove = true;
									break;
								}
							}
						}
					}
				}
				
			} else {
				var valSchemeDesc = $this.resolve($this.scheme, $this.value).obj[entryKey].scheme;
				var valScheme = QuerySyntax.getSchema()[valSchemeDesc];
				if(valScheme.editable){
					allowEdit = true;
				}
/*				if(valSchemeDesc == '$constString' || valSchemeDesc == '$constNumber' || valSchemeDesc == '$constBoolean'){
					allowEdit = true;
				}*/
				
				if(opts){
					var ac = null;
					if(JSB.isObject(opts.acceptedSchemes)){
						if(Object.keys(opts.acceptedSchemes).length > 1){
							allowReplace = true;
						} else {
							ac = opts.acceptedSchemes[Object.keys(opts.acceptedSchemes)[0]];
							if(ac.length > 1 || (ac.length == 1 && (ac[0] == '$fieldName' || ac[0] == '$fieldExpr'))){
								allowReplace = true;	
							}
						}
					} else {
						ac = opts.acceptedSchemes;
						if(ac.length > 1 || (ac.length == 1 && (ac[0] == '$fieldName' || ac[0] == '$fieldExpr'))){
							allowReplace = true;	
						}
					}
				}
			}
			
			if(allowReplace){
				elt.addClass('allowReplace');
			} else {
				elt.removeClass('allowReplace');
			}

			if(allowEdit){
				elt.addClass('allowEdit');
			} else {
				elt.removeClass('allowEdit');
			}

			
			if(allowRemove){
				elt.addClass('allowRemove');
			} else {
				elt.removeClass('allowRemove');
			}

			if(allowWrap){
				elt.addClass('allowWrap');
			} else {
				elt.removeClass('allowWrap');
			}

			hoverDesc[entryKey] = {
				allowEdit: allowEdit,
				allowRemove: allowRemove,
				allowReplace: allowReplace,
				allowWrap: allowWrap
			};
			
				
			if(!allowEdit && !allowRemove && !allowReplace && !allowWrap){
				return;
			}
			
			handle.on({
				mouseover: function(evt){
					evt.stopPropagation();
					
					var keyElt = elt;
					if(entryType == 'value'){
						keyElt = keyElt.parent();
					}
					var entryKey = keyElt.attr('key');
					var entryId = $this.getId() + '_' + entryType + '_' + entryKey;

					JSB.cancelDefer('DataCube.Query.SchemeEditor.out:' + entryId);
					JSB.defer(function(){
						$this.selectHover(entryType, entryKey, true);
					}, 300, 'DataCube.Query.SchemeEditor.over:' + entryId);
				},
				mouseout: function(evt){
					evt.stopPropagation();
					
					var keyElt = elt;
					if(entryType == 'value'){
						keyElt = keyElt.parent();
					}
					var entryKey = keyElt.attr('key');
					var entryId = $this.getId() + '_' + entryType + '_' + entryKey;
					
					JSB.cancelDefer('DataCube.Query.SchemeEditor.over:' + entryId);
					JSB.defer(function(){
						$this.selectHover(entryType, entryKey, false);
					}, 300, 'DataCube.Query.SchemeEditor.out:' + entryId);

				}
			});
			
			if(allowReplace){
				handle.click(function(evt){
					evt.stopPropagation();
					
					var keyElt = elt;
					if(entryType == 'value'){
						keyElt = keyElt.parent();
					}
					var entryKey = keyElt.attr('key');
					var entryId = $this.getId() + '_' + entryType + '_' + entryKey;
					
					$this.doReplace($this.$(evt.currentTarget), entryType, entryKey);
				});
			}
		},
		
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
		
		chooseBestCubeField: function(){
			return Object.keys($this.options.cubeFields)[0];
		},
		
		chooseBestColumn: function(){
			var colMap = $this.combineColumns();
			for(var qName in colMap){
				if(colMap[qName].length > 0){
					return colMap[qName][0];
				}
			} 
			return $this.chooseBestCubeField();
		},
		
		chooseBestValue: function(){
			return null;
		},
		
		constructEmptyValue: function(schemeName, subValues){
			var value = null;
			
			function generateColumnName(){
				var prefix = 'Столбец';
				for(var idx = 1;; idx++){
					var suggestedName = prefix + '_' + idx;
					if(!$this.value[suggestedName]){
						return suggestedName;
					}
				}
			}
			
			var schemeDesc = QuerySyntax.getSchema()[schemeName];
			if(schemeDesc.expressionType == 'ComplexObject' || schemeDesc.expressionType == 'SingleObject'){
				value = {};
				
				var schemeVal = $this.combineAcceptedSchemes(schemeDesc);
				if(JSB.isArray(schemeVal)){
					var subFound = false;
					if(subValues && subValues.length > 0){
						for(var i = 0; i < subValues.length; i++){
							var subVal = subValues[i];
							value[schemeDesc.name] = subVal;
							var testMatch = $this.resolve(schemeName, value);
							if(testMatch.w == 1){
								subFound = true;
								break;
							}
						}	
					}
					
					if(!subFound){
						value[schemeDesc.name] = $this.constructEmptyValue(schemeVal[0]);
					}
				} else {
					var optMap = {};
					if(schemeDesc.optional && schemeDesc.optional.length > 0){
						for(var i = 0; i < schemeDesc.optional.length; i++){
							if((schemeDesc.name == '$filter' && schemeDesc.optional[i] == '#fieldName')
								||(schemeDesc.name == '$postFilter' && schemeDesc.optional[i] == '#outputFieldName')){
								continue;	// use field name always
							}
							optMap[schemeDesc.optional[i]] = true;
						}	
					}
					
					for(var vName in schemeVal){
						if(optMap[vName]){
							continue;
						}
						
						var fName = vName;
						
						if(schemeDesc.customKey && schemeDesc.customKey == vName){
							if(schemeDesc.name == '$filter' && vName == '#fieldName'){
								fName = $this.chooseBestCubeField();
							} else if(schemeDesc.name == '$sortField' && vName == '#anyFieldName'){
								fName = $this.chooseBestColumn();
							} else if(schemeDesc.name == '$select' && vName == '#outputFieldName'){
								fName = generateColumnName();
							} else if((schemeDesc.name == '$postFilter' && vName == '#outputFieldName')||(schemeDesc.name == '$finalizeFields' && vName == '#field')){
								fName = $this.chooseBestColumn();
							} else if(vName == '#value') {
								fName = $this.chooseBestValue();
							} else {
								debugger;	
							}
						} 
						
						value[fName] = $this.constructEmptyValue(schemeVal[vName][0]);
					}
				}
				
			} else if(schemeDesc.expressionType == 'EArray') {
				var schemeVal = $this.combineAcceptedSchemes(schemeDesc)[0];
				value = [];
				switch(schemeDesc.name){
				case '$mulValues':
				case '$divValues':
				case '$divzValues':
				case '$modValues':
					value.push($this.constructEmptyValue(schemeVal));
					value.push({$const:1});
					break;
				case '$groupBy':
					value.push($this.chooseBestCubeField());
					break;
				default:
					for(var i = 0; i < schemeDesc.minOperands; i++){
						value.push($this.constructEmptyValue(schemeVal));
					}
				}
			} else if(schemeDesc.expressionType == 'EConstBoolean'){
				if(JSB.isDefined(schemeDesc.value)){
					value = schemeDesc.value;
				} else {
					value = false;
				}
			} else if(schemeDesc.expressionType == 'EConstString'){
				if(schemeDesc.name == '$fieldName'){
					value = $this.chooseBestCubeField();
				} else if(JSB.isDefined(schemeDesc.value)){
					value = schemeDesc.value;
				} else {
					value = "";
				}
				
			} else if(schemeDesc.expressionType == 'EConstNumber'){
				if(JSB.isDefined(schemeDesc.value)){
					value = schemeDesc.value;
				} else {
					value = 0;
				}
			} else if(schemeDesc.expressionType == 'EConstNull'){
				value = null;
			} else {
				throw new Error('Unexpected empty value type: ' + schemeDesc.expressionType);
			}
			
			return value;
		},
		
		doAdd: function(targetElt){
			$this.showPopupTool($this.combineAcceptedSchemes(), targetElt, null, null, null, function(chosenObj){
				if($this.scheme.expressionType == 'ComplexObject'){
					
					function generateColumnName(prefix){
						if(prefix && !$this.value[prefix]){
							return prefix;
						}
						prefix = prefix || 'Столбец';
						for(var idx = 2;; idx++){
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
					var askRename = false;
					// detect key
					if(JSB.isString(chosenObj.key)){
						if($this.scheme.name == '$select' && chosenObj.key == '#outputFieldName'){
							// autogenerate column name
							var prefix = null;
							if(chosenObj.value && (chosenObj.value.scheme == '$fieldName' || chosenObj.value.scheme == '$fieldExpr')){
								prefix = chosenObj.value.value;
							}
							colName = generateColumnName(prefix);
							askRename = true;
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
						if(schemeName == '#fieldName' || schemeName == '$fieldName') {
							
						} else if(schemeName == '$fieldExpr') {
							value = {
								$field: value,
								$context: context
							};
						} else {
							value = $this.constructEmptyValue(schemeName);
						}
					} else {
						// detect via key scheme
						schemeName = $this.combineAcceptedSchemes(chosenObj.key.scheme)[0];
						context = chosenObj.key.context;
						value = $this.constructEmptyValue(schemeName);
					}
					
					
					$this.value[colName] = value;
					// draw entry
					$this.drawObjectEntry(colName, schemeName, {expanded: true});
					if(askRename){
						$this.doEdit('entry', colName);
					}
					$this.updateButtons();
					$this.notifyChanged();
				} else if($this.scheme.expressionType == 'EArray') {
					var value = chosenObj.value.value;
					var context = chosenObj.value.context;
					var schemeName = chosenObj.value.scheme;
					if(schemeName == '#fieldName' || schemeName == '$fieldName') {
						
					} else if(schemeName == '$fieldExpr') {
						value = {
							$field: value,
							$context: context
						};
					} else if(schemeName == '$sortField'){
						var v = {};
						v[value] = 1;
						value = v;
					} else {
						value = $this.constructEmptyValue(schemeName);
					}
					
					$this.value.push(value);
					// draw entry
					$this.drawArrayEntry($this.value.length - 1, schemeName, {expanded: true});
					$this.updateButtons();
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
			var existedSchemeDesc = null;
			
			if(JSB.isObject($this.scheme.values) && JSB.isDefined($this.scheme.values[entryKey])){
				acceptedSchemes = $this.combineAcceptedSchemes(entryKey);
				existedSchemeDesc = $this.resolve($this.scheme.values[entryKey], $this.value[entryKey]);
			} else if(JSB.isObject($this.scheme.values) && $this.scheme.customKey){
				acceptedSchemes = $this.combineAcceptedSchemes($this.scheme.customKey);
				existedSchemeDesc = $this.resolve($this.scheme.values[$this.scheme.customKey], $this.value[entryKey]);
			} else {
				acceptedSchemes = $this.combineAcceptedSchemes();
				existedSchemeDesc = $this.resolve($this.scheme, $this.value).obj[entryKey];
			}
			
			var existedObj = {scheme: existedSchemeDesc.scheme, value: $this.value[entryKey]};
			if(existedObj.scheme == '$fieldName'){
				
			} else if(existedObj.scheme == '$sortField'){
				existedObj.context = $this.scope.$context;
				existedObj.value = Object.keys($this.value[entryKey])[0];
			} else if(existedObj.scheme == '$fieldExpr'){
				existedObj.context = $this.value[entryKey].$context;
				existedObj.value = $this.value[entryKey].$field;
			}
			
			$this.showPopupTool(acceptedSchemes, targetElt, entryType, entryKey, existedObj, function(chosenObj){
				if(chosenObj.key){
					debugger;
				} else {
					var value = chosenObj.value.value;
					var context = chosenObj.value.context;
					var schemeName = chosenObj.value.scheme;
					if(schemeName == '#fieldName' || schemeName == '$fieldName') {
						
					} else if(schemeName == '$fieldExpr') {
						value = {
							$field: value,
							$context: context
						};
					} else if(schemeName == '$sortField'){
						var v = {};
						v[value] = 1;
						value = v;
					} else {
						var oldValue = $this.value[entryKey];
						var subValues = [];
						if(JSB.isObject(oldValue) && Object.keys(oldValue).length == 1 /* single object */){
							for(var sKey in oldValue){
								subValues.push(oldValue[sKey]);
							}
						}
						value = $this.constructEmptyValue(schemeName, subValues);
					}
					$this.value[entryKey] = value;
					if(JSB.isArray($this.value)){
						$this.drawArrayEntry(entryKey, schemeName, {expanded: true});
					} else {
						$this.drawObjectEntry(entryKey, schemeName, {expanded: true});
					}
					$this.notifyChanged();
					
				}
			});
		},
		
		doRemove: function(targetElt, entryType, entryKey){
			if(entryType != 'entry'){
				return;
			}
			
			// remove in query
			if(JSB.isDefined($this.value[entryKey])){
				if(JSB.isArray($this.value)){
					$this.value.splice(entryKey, 1);
				} else {
					delete $this.value[entryKey];
				}
			}
			
			// remove entry
			var entryElt = $this.find('> .container > .entry[key="'+entryKey+'"]');
			if(entryElt.length > 0){
				var valueEditorElt = entryElt.find('> .schemeEditor');
				if(valueEditorElt.jsb()){
					valueEditorElt.jsb().destroy();
				}
				
				entryElt.remove();
			}
			
			$this.updateButtons();
			$this.notifyChanged();
		},
		
		doEdit: function(entryType, entryKey){
			var editor = null;
			if(entryType == 'entry'){
				editor = $this.find('> .container > .entry[key="'+entryKey+'"] > .key > .keyEditor').jsb();
			} else {
				editor = $this.find('> .container > .entry[key="'+entryKey+'"] > .value > .container > .value._dwp_primitiveEditor').jsb();
			}
			if(editor){
				JSB.defer(function(){
					editor.beginEdit();	
				});
			}
		},
		
		renameEntry: function(oldKey, newKey){
			if(!JSB.isDefined($this.value[oldKey])){
				throw new Error('Missing value in key: ' + oldKey);
			}
			$this.value[newKey] = $this.value[oldKey];
			delete $this.value[oldKey];
			
			$this.hoverEntries[newKey] = $this.hoverEntries[oldKey];
			delete $this.hoverEntries[oldKey];
			
			$this.hoverValues[newKey] = $this.hoverValues[oldKey];
			delete $this.hoverValues[oldKey];
			
			var entryElt = $this.find('> .container > .entry[key="'+oldKey+'"]');
			var keyElt = entryElt.find('> .key');
			entryElt.attr('key', newKey);
			keyElt.attr('title', newKey);
			
			$this.notifyChanged();
		},
		
		changeConstValue: function(newVal){
			$this.value = newVal;
			$this.scope[$this.scopeName] = $this.value;
			
			$this.notifyChanged();
		},
		
		combineCategoryMap: function(schemes){
			var itemMap = {};
			var chosenObjectKey = null;
			var chooseType = 'key';
			if(JSB.isArray(schemes)){
				for(var i = 0; i < schemes.length; i++){
					itemMap[schemes[i]] = true;
				}
				chooseType = 'value';
			} else if(JSB.isObject(schemes)){
				if(Object.keys(schemes).length == 1 && $this.scheme.name == '$select'){
					chooseType = 'value';
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
			if(JSB.isDefined($this.value) && JSB.isObject($this.value) && chooseType == 'key'){
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
				} else if(item == '#outputFieldName' || item == '$fieldExpr' || item == '$sortField') {
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
						valObj = {item: item};
						var itemDesc = QuerySyntax.getSchema()[item];
						if(itemDesc){
							if(itemDesc.category){
								category = itemDesc.category;
							}
							valObj.desc = itemDesc.desc;
							valObj.title = itemDesc.displayName;
						}
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
			
			return {
				itemMap: itemMap,
				chosenObjectKey: chosenObjectKey,
				chooseType: chooseType
			};
		},
		
		showPopupTool: function(schemes, targetElt, entryType, entryKey, existedObj, callback){
			// prepare list for dialog
			var acceptedDesc = $this.combineCategoryMap(schemes);
			if(!acceptedDesc){
				return;
			}
			var itemMap = acceptedDesc.itemMap;
			var chosenObjectKey = acceptedDesc.chosenObjectKey;
			var chooseType = acceptedDesc.chooseType;
			
			var popupTool = ToolManager.activate({
				id: 'schemePopupTool',
				cmd: 'show',
				data: {
					cubeFields: $this.options.cubeFields,
					selectedObj: existedObj,
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
					if(chooseType == 'key'){
						retObj.key = desc;
					} else {
						retObj.key = chosenObjectKey;
						retObj.value = desc;
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
			
			var allowEdit = false;
			var allowRemove = false;
			
			if(bSelect){
				var hoverDesc = $this.hoverValues[entryKey];
				if(entryType == 'entry'){
					hoverDesc = $this.hoverEntries[entryKey];
				}
				if(hoverDesc){
					allowEdit = hoverDesc.allowEdit;
					allowRemove = hoverDesc.allowRemove;
				}
			}
			
			$this.publish('DataCube.Query.SchemeEditor.selected', {entryType: entryType, entryKey:entryKey, selected: bSelect});
			if(bSelect){
				hoverElt.addClass('hover');
			} else {
				hoverElt.removeClass('hover');
			}
			
			// show popup menu
			if(bSelect && (allowEdit || allowRemove)){
				$this.menuTool = ToolManager.activate({
					id: 'schemeMenuTool',
					cmd: 'show',
					data: {
						editor: $this,
						entryType: entryType,
						entryKey: entryKey,
						actions: {
							allowEdit: allowEdit,
							allowRemove: allowRemove
						}
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
					callback: function(cmd){
						if(cmd == 'edit'){
							$this.doEdit(entryType, entryKey);
						} else if(cmd == 'delete'){
							$this.doRemove(hoverElt, entryType, entryKey);
						} else {
							throw new Error('Unexpected menu command: ' + cmd);
						}
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
			if(!QuerySyntax.isSynchronized()){
				QuerySyntax.ensureSynchronized(function(){
					$this.refresh();
				});
				return;
			}
			$this.container.empty();
			$this.scheme = QuerySyntax.getSchema()[$this.schemeName];
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
			} 
			
			// add key
			var keyElt = entryElt.find('> .key');
			if(keyElt.length == 0){
				keyElt = $this.$('<div class="key"></div>').attr('title', valName);
				entryElt.append(keyElt);
			} 
			var keyDecl = QuerySyntax.getSchema()[valName];
			if(keyDecl && keyDecl.displayName){
				keyElt.empty();
				keyElt.append(keyDecl.displayName);
			} else {
				if($this.scheme.customKey == '#outputFieldName' || $this.scheme.customKey == '#value'){
					var keyEditor = keyElt.find('> .keyEditor').jsb();
					if(!keyEditor){
						keyEditor = new PrimitiveEditor({
							mode: 'inplace',
							onChange: function(newVal){
								$this.renameEntry(entryElt.attr('key'), newVal);
							}
						});
						keyEditor.addClass('keyEditor');
						keyElt.append(keyEditor.getElement());
					}
					keyEditor.setData(valName);
					
				} else {
					keyElt.empty();
					keyElt.text(valName);
				}
				
				if($this.scheme.customKey == '#outputFieldName' || $this.scheme.customKey == '#field'){
					keyElt.addClass('outputField');
				}

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
			
			if(!keyDecl){
				// check if it's output field
				if($this.scheme.name == '$select' || $this.scheme.name == '$sortField'){
					keyElt.addClass('selectField');
				}
	
				// check if it's filter field
				if($this.scheme.name == '$filter'){
					keyElt.addClass('filterField');
				}
				
				// check if it's postfilter field
				if($this.scheme.name == '$postFilter'){
					keyElt.addClass('postFilterField');
				}
			}
			
			// inject entry substrate if it's not a SingleObject
			if($this.scheme.expressionType != 'SingleObject'){
				if(entryElt.find('> .substrate').length == 0){
					entryElt.append('<div class="substrate"></div>');
					$this.installHoverHandlers('entry', valName, keyElt);
				}
			}

			
			// add separator
			var sepElt = entryElt.find('> .separator');
			if(sepElt.length == 0){
				sepElt = $this.$('<div class="separator"><div class="icon"></div></div>');
				entryElt.append(sepElt);
			}
			
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
			
			// remove previously created value
			entryElt.find('> .value').remove();
			entryElt.find('> .collapsedBox').remove();
			
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
			
			if(valueEditor.isCollapsible()){
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

			} else {
				entryElt.removeClass('collapsible');
				entryElt.removeClass('collapsed');
			}
			
			// if value is a ComplexObject - inject handle
			var valScheme = QuerySyntax.getSchema()[valScheme];
			if(valScheme.expressionType == 'ComplexObject' || valScheme.expressionType == 'EArray'){
				var handle = valueEditor.getHandle();
				$this.installHoverHandlers('value', valName, handle, {acceptedSchemes: acceptedSchemes});
				
			} else if(valScheme.expressionType == 'SingleObject'){
				var handle = valueEditor.getHandle();
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
				var handle = valueEditor.getHandle();
				$this.installHoverHandlers('value', i, handle, {acceptedSchemes: acceptedSchemes});
			} else if(valScheme.expressionType == 'SingleObject'){
				var handle = valueEditor.getHandle();
				$this.installHoverHandlers('value', i, handle, {acceptedSchemes: acceptedSchemes});
			} else {
				$this.installHoverHandlers('value', i, null, {acceptedSchemes: acceptedSchemes});
			}

		},
		
		getHandle: function(){
			return $this.handle;
		},
		
		updateButtons: function(){
			var catDesc = $this.combineCategoryMap($this.combineAcceptedSchemes());
			
			var bCanAdd = catDesc && ((JSB.isObject(catDesc.itemMap) && Object.keys(catDesc.itemMap).length > 0)||(JSB.isArray(catDesc.itemMap) && catDesc.itemMap.length > 0));
			
			if(JSB.isArray($this.value) && JSB.isDefined($this.scheme.maxOperands) && $this.scheme.maxOperands >= 0){
				if($this.value.length >= $this.scheme.maxOperands){
					bCanAdd = false;
				}
			}
			
			$this.attr('canadd', bCanAdd);
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
			} else if($this.scheme.name == '$sortTypeAsc') {
				$this.container.append($this.$('<div class="value fixed">По возрастанию</div>'));
				return true;
			} else if($this.scheme.name == '$sortTypeDesc') {
				$this.container.append($this.$('<div class="value fixed">По убыванию</div>'));
				return true;
			}
			return false;
		},

		
		construct: function(){
/*			if($this.scheme.name == '$select'){
				debugger;
			}*/
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
				
				if($this.scheme.expressionType == 'ComplexObject'){
					$this.collapsible = true;
				}
									
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
				
				if($this.scheme.expressionType == 'ComplexObject'){
					$this.handle = $this.$('<div class="handle"></div>');
					$this.append($this.handle);
					$this.addClass('hasHandle');
				} else {
					$this.handle = $this.find('> .container > .entry > .key');
				}

				$this.updateButtons();
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
				
				$this.handle = $this.$('<div class="handle"></div>');
				$this.append($this.handle);
				$this.addClass('hasHandle');
				$this.collapsible = true;
				$this.updateButtons();
			} else if($this.scheme.expressionType == 'Group'){
				throw new Error('Unable to render Group');
			} else if($this.scheme.expressionType == 'EConstBoolean'){
				var valElt = $this.$('<div class="value boolean"></div>');
				valElt.text($this.value);
				valElt.attr('key', $this.value)
				$this.container.append(valElt);
			} else if($this.scheme.expressionType == 'EConstNull'){
				$this.container.append('<div class="value null">null</div>');
			} else if($this.scheme.expressionType == 'EConstString'){
				if($this.scheme.editable){
					$this.valueEditor = new PrimitiveEditor({
						valueType: 'string',
						mode: 'inplace',
						onChange: function(newVal){
							$this.changeConstValue(newVal);
						}
					});
					$this.valueEditor.addClass('value string');
					$this.container.append($this.valueEditor.getElement());
					if(JSB.isDefined($this.value)){
						$this.valueEditor.setData($this.value);
					} else {
						$this.valueEditor.beginEdit();
					}
				} else {
					var valElt = $this.$('<div class="value string fixed"></div>');
					valElt.text($this.value);
					$this.container.append(valElt);
				}
			} else if($this.scheme.expressionType == 'EConstNumber'){
				if($this.scheme.editable){
					$this.valueEditor = new PrimitiveEditor({
						valueType: 'double',
						mode: 'inplace',
						onChange: function(newVal){
							$this.changeConstValue(newVal);
						}
					});
					$this.valueEditor.addClass('value number');
					$this.container.append($this.valueEditor.getElement());
					if(JSB.isDefined($this.value)){
						$this.valueEditor.setData($this.value);
					} else {
						$this.valueEditor.beginEdit();
					}
				} else {
					var valElt = $this.$('<div class="value number fixed"></div>');
					valElt.text($this.value);
					$this.container.append(valElt);
				}
			}  else {
				throw new Error('Unknown expression type: ' + $this.scheme.expressionType);
			}
			
		},

		combineSchemes: function(schemeName){
			var scheme = QuerySyntax.getSchema()[schemeName];
			if(!scheme){
				return [];
			}
			if(scheme.expressionType == 'Group'){
				var schemeMap = {};
				for(var i = 0; i < scheme.values.length; i++){
					var schemes = $this.combineSchemes(scheme.values[i]);
					for(var j = 0; j < schemes.length; j++){
						schemeMap[schemes[j]] = true;
					}
				}
				
				return Object.keys(schemeMap);
			} else {
				return [schemeName];
			}
		},

		combineAcceptedSchemes: function(key, arg2){
			var scheme = $this.scheme;
			if(JSB.isObject(key)){
				scheme = key;
				key = arg2;
			}
			if(key){
				return $this.combineSchemes(scheme.values[key]);
			} else {
				if(JSB.isObject(scheme.values)){
					var schemes = {};
					for(var vName in scheme.values){
						schemes[vName] = $this.combineSchemes(scheme.values[vName]);
					}
					return schemes;
				} else if(JSB.isArray(scheme.values)){
					var schemeMap = {};
					for(var i = 0; i < scheme.values.length; i++){
						var schemes = $this.combineSchemes(scheme.values[i]);
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
			case 'EConstNull':
				if(JSB.isNull(value)){
					return {w: 1, scheme: schemeName};
				}
				return {w: 0, scheme: schemeName};
				break;
			case 'EConstBoolean':
				if(JSB.isObject(value) || JSB.isArray(value)){
					return {w: 0, scheme: schemeName};
				}
				if(JSB.isBoolean(value)){
					if(JSB.isDefined(scheme.value)){
						if(value == scheme.value){
							return {w: 1, scheme: schemeName};
						} else {
							return {w: 0.5, scheme: schemeName};
						}
					} else {
						return {w: 1, scheme: schemeName};
					}
				}
				return {w: 0.5, scheme: schemeName};
				break;
			case 'EConstString':
				if(JSB.isObject(value) || JSB.isArray(value)){
					return {w: 0, scheme: schemeName};
				}
				if(JSB.isString(value)){
					if(JSB.isDefined(scheme.value)){
						if(value == scheme.value){
							return {w: 1, scheme: schemeName};
						} else {
							return {w: 0.5, scheme: schemeName};
						}
					} else {
						return {w: 1, scheme: schemeName};
					}
				} 
				return {w: 0.5, scheme: schemeName};
			case 'EConstNumber':
				if(JSB.isObject(value) || JSB.isArray(value)){
					return {w: 0, scheme: schemeName};
				}
				if(JSB.isNumber(value)){
					if(JSB.isDefined(scheme.value)){
						if(value == scheme.value){
							return {w: 1, scheme: schemeName};
						} else {
							return {w: 0.5, scheme: schemeName};
						}
					} else {
						return {w: 1, scheme: schemeName};
					}
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
					if(scheme.expressionType == 'ComplexObject'){
						return {obj:{}, w:1, scheme: schemeName};
					}
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