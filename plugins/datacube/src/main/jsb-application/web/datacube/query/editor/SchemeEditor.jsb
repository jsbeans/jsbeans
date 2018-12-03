{
	$name: 'DataCube.Query.SchemeEditor',
	$parent: 'JSB.Widgets.Control',
	$require: ['DataCube.Query.QuerySyntax',
	           'JSB.Widgets.Button',
	           'JSB.Controls.Select',
	           'JSB.Widgets.PrimitiveEditor',
	           'DataCube.Query.SchemeMenuTool',
	           'DataCube.Query.SchemePopupTool',
	           'JSB.Widgets.ToolManager',
	           'JSB.Widgets.RendererRepository'],
	
	$client: {
		options: {
			schemeName: null,
			expanded: false,
			measurements: {},
			
			onChange: function(){}
		},
		
		collapsible: false,
		handle: null,
		hoverEntries: {},
		hoverValues: {},
		sourceFields: null,

		sourceBeans: ['$from', '$provider', '$cube'],

		$constructor: function(opts){
			$base(opts);
			$jsb.loadCss('SchemeEditor.css')
			this.addClass('schemeEditor');

			this.parent = opts.parent;
			this.acceptedSchemes = opts.acceptedSchemes;
			this.schemeName = opts.schemeName;
			this.scope = opts.scope;
			this.scopeName = opts.scopeName;
			this.value = opts.value;
			this.sourceFieldsEditors = opts.sourceFieldsEditors;

			this.handle = $this.getElement();

			if(!this.parent){
			    this.sourceFieldsEditors = {};
			}

            if(this.sourceBeans.indexOf(this.schemeName) > -1){
                this.sourceFieldsEditors[this.getId()] = this;
            }

			// 'from' query
			this.fromLabel = this.$('<span class="fromLabel">Источник запроса</span>');
			this.append(this.fromLabel);
			this.fromContainer = this.$('<div class="container fromContainer"></div>');
			$this.append(this.fromContainer);

			$this.container = $this.$('<div class="container"></div>');
			$this.append($this.container);

			$this.btnAdd = new Button({
				cssClass: 'roundButton btn10 btnCreate',
				tooltip: 'Добавить поле',
				onClick: function(evt){
					evt.stopPropagation();
					$this.showPopupTool($this.combineAcceptedSchemes(), $this.$(evt.currentTarget), null, null, null, function(chosenObj){
					    $this.doAdd(chosenObj);
					});
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
			this.destroyNestedEditors();

			if(this.sourceBeans.indexOf(this.schemeName) > -1){
			    delete this.sourceFieldsEditors[this.getId()];
			}

			$base();
		},

		destroyNestedEditors: function(){
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
				if(($this.scheme.customKey == '#outputFieldName' || $this.scheme.customKey == '#value' || $this.scheme.customKey == '#viewName')
					&& $this.scheme.name != '$postFilter'
					&& JSB.isObject($this.scheme.values)
					&& !$this.scheme.values[entryKey] ){
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
						if($this.scheme.name == '$filter' || $this.scheme.name == '$postFilter' || $this.scheme.name == '$cubeFilter'){
							allowReplace = true;
							allowWrap = true;
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
							allowWrap = true;
						} else {
							ac = opts.acceptedSchemes[Object.keys(opts.acceptedSchemes)[0]];
							if(ac.length > 1 || (ac.length == 1 && (ac[0] == '$fieldName' || ac[0] == '$fieldExpr'))){
								allowReplace = true;
								allowWrap = true;
							}
						}
					} else {
						ac = opts.acceptedSchemes;
						if(ac.length > 1 || (ac.length == 1 && (ac[0] == '$fieldName' || ac[0] == '$fieldExpr'))){
							allowReplace = true;
							allowWrap = true;
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

			var handleOverProc = function(evt){
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
				}, 200, 'DataCube.Query.SchemeEditor.over:' + entryId);
			};

			var handleOutProc = function(evt){
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
				}, 200, 'DataCube.Query.SchemeEditor.out:' + entryId);
			};

			var handleClickProc = function(evt){
				if(!allowReplace){
					return;
				}
				evt.stopPropagation();

				var keyElt = elt;
				if(entryType == 'value'){
					keyElt = keyElt.parent();
				}
				var entryKey = keyElt.attr('key');
				var entryId = $this.getId() + '_' + entryType + '_' + entryKey;

				$this.doReplace($this.$(evt.currentTarget), entryType, entryKey);
			};

			handle.on({
				mouseover: handleOverProc,
				mouseout: handleOutProc,
				click: handleClickProc
			});

			elt.find('> .substrate').on({
				mouseover: handleOverProc,
				mouseout: handleOutProc,
				click: handleClickProc
			});

			if(allowWrap){
				elt.find('> .wrapSubstrate').on({
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
							$this.selectHover(entryType, entryKey, true, true);
						}, 200, 'DataCube.Query.SchemeEditor.over:' + entryId);
					},
					mouseout: handleOutProc,
					click: function(evt){
						evt.stopPropagation();

						var keyElt = elt;
						if(entryType == 'value'){
							keyElt = keyElt.parent();
						}
						var entryKey = keyElt.attr('key');
						var entryId = $this.getId() + '_' + entryType + '_' + entryKey;

						$this.doReplace(keyElt, entryType, entryKey, true);
					}
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
			prefix = (prefix || 'sub') + '_' + this.options.sliceId;
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

		combineViews: function(){
			return this.value['$views'];
		},

		getSourceSelectFields: function(callback){
		    var sourcesArr = [],
		        sources = {};

		    for(var i in this.sourceFieldsEditors){
		        sourcesArr.push(this.sourceFieldsEditors[i]);
		    }

		    JSB.chain(sourcesArr, function(source, c){
		        var sourceId = source.getValue(),
		            context = source.scope.$context;

                $this.server().getEntryFields(sourceId, function(res, fail){
                    if(!fail){
                        sources[sourceId] = {
                            context: context,
                            entry: res.entry,
                            fields: res.fields
                        };
                    }

                    c.call();
                });
		    }, function(){
		        callback.call($this, sources);
		    });
		},

		getSliceFields: function(callback){
		    function findSliceFields(item){
		        if(!item.parent){
		            var fieldsArr = item.value.$select ? Object.keys(item.value.$select) : [],
		                fields = {};

		            for(var i = 0; i < fieldsArr.length; i++){
		                fields[fieldsArr[i]] = fieldsArr[i];
		            }

		            return {
		                //context: item.value.$context,
		                fields: fields
		            }
		        }

		        return findSliceFields(item.parent);
            }

		    callback.call(this, findSliceFields(this));
		},

		getCubeSlices: function(callback){
		    // todo:
		    /*
			if($this.options.cube){
				$this.options.cube.server().getSlices(callback);
				return;
			}

			callback.call(this, $this.options.cubeSlices);
			*/
console.log('getCubeSlices');
			callback.call(this, {});
		},

		getValue: function(){
		    return this.value;
		},

		chooseBestCubeField: function(){
			var sourceFields = $this.options.cubeFields || {};
			return Object.keys(sourceFields)[0];
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

		getSliceForName: function(sliceName){
			for(var sId in this.options.cubeSlices){
				if(this.options.cubeSlices[sId].getName() == sliceName){
					return this.options.cubeSlices[sId];
				}
			}
			return null;
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

			function generateViewName(){
				var prefix = 'Вид';
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
					if(subValues && !JSB.isArray(subValues)){
						subValues = [subValues];
					}
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
						value[schemeDesc.name] = $this.constructEmptyValue(schemeVal[0], subValues);
					}
				} else {
					var bValueFilled = false;
					if(subValues && !JSB.isArray(subValues)){
						subValues = [subValues];
					}
					if(subValues && subValues.length > 0){
						var testValue = subValues[0];
						var testMatch = $this.resolve(schemeName, testValue);
						if(testMatch.w == 1){
							value = testValue;
							bValueFilled = true;
						}
					}

					if(!bValueFilled){
						var optMap = {};
						if(schemeDesc.optional && schemeDesc.optional.length > 0){
							for(var i = 0; i < schemeDesc.optional.length; i++){
								if(((schemeDesc.name == '$filter' || schemeDesc.name == '$cubeFilter') && schemeDesc.optional[i] == '#fieldName')
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
								if((schemeDesc.name == '$filter' || schemeDesc.name == '$cubeFilter') && vName == '#fieldName'){
									fName = $this.chooseBestCubeField();
								} else if(schemeDesc.name == '$sortField' && vName == '#anyFieldName'){
									fName = $this.chooseBestColumn();
								} else if((schemeDesc.name == '$select' || schemeDesc.name == '$sourceSelect') && vName == '#outputFieldName'){
									fName = generateColumnName();
								} else if(schemeDesc.name == '$views' && vName == '#viewName'){
									fName = generateViewName();
								} else if((schemeDesc.name == '$postFilter' && vName == '#outputFieldName')||(schemeDesc.name == '$finalizeFields' && vName == '#field')){
									fName = $this.chooseBestColumn();
								} else if(vName == '#value') {
									fName = $this.chooseBestValue();
								} else {
									debugger;
								}
							}

							var choosenValue = undefined;
							if(subValues && !JSB.isArray(subValues)){
								subValues = [subValues];
							}
							if(subValues && subValues.length > 0 && JSB.isObject(schemeDesc.values) && JSB.isDefined(schemeDesc.values[vName])){
								for(var i = 0; i < subValues.length; i++){
									var testMatch = $this.resolve(schemeDesc.values[vName], subValues[i]);
									if(testMatch.w == 1){
										choosenValue = subValues[i];
										break;
									}
								}
							}

							if(JSB.isDefined(choosenValue)){
								value[fName] = choosenValue;
							} else {
								value[fName] = $this.constructEmptyValue(schemeVal[vName][0]);
							}
						}
					}
				}

			} else if(schemeDesc.expressionType == 'EArray') {
				var schemeVal = null;
				var resolvedSubs = [];
				var bResolved = false;
				if(subValues && !JSB.isArray(subValues)){
					subValues = [subValues];
				}
				if(subValues && subValues.length > 0){
					for(var i = 0; i < subValues.length; i++){
						var testMatch = $this.resolve(schemeDesc.name, [subValues[i]]);
						if(testMatch.w == 1){
							bResolved = true;
							resolvedSubs[i] = true;
						} else {
							resolvedSubs[i] = false;
						}
					}
				}
				schemeVal = $this.combineAcceptedSchemes(schemeDesc)[0];

				value = [];

				switch(schemeDesc.name){
				case '$mulValues':
				case '$divValues':
				case '$divzValues':
				case '$modValues':
					if(resolvedSubs.length > 0 && resolvedSubs[0]){
						value.push(subValues[0]);
					} else {
						value.push($this.constructEmptyValue(schemeVal));
					}
					if(resolvedSubs.length > 1 && resolvedSubs[1]){
						value.push(subValues[1]);
					} else {
						value.push({$const:1});
					}
					break;
				case '$groupBy':
					if(bResolved){
						for(var i = 0; i < resolvedSubs.length; i++){
							if(resolvedSubs[i]){
								value.push(subValues[i]);
							}
						}
					} else {
						value.push($this.chooseBestCubeField());
					}
					break;
				default:
					for(var i = 0; i < schemeDesc.minOperands; i++){
						if(resolvedSubs.length > i && resolvedSubs[i]){
							value.push(subValues[i]);
						} else {
							value.push($this.constructEmptyValue(schemeVal));
						}
					}
				}
			} else if(schemeDesc.expressionType == 'EConstBoolean'){
				var bResolved = false;
				if(subValues && !JSB.isArray(subValues)){
					subValues = [subValues];
				}
				if(subValues && subValues.length > 0){
					var testMatch = $this.resolve(schemeDesc.name, subValues[0]);
					if(testMatch.w == 1){
						bResolved = true;
					}
				}

				if(bResolved){
					value = subValues[0];
				} else {
					if(JSB.isDefined(schemeDesc.value)){
						value = schemeDesc.value;
					} else {
						value = false;
					}
				}
			} else if(schemeDesc.expressionType == 'EConstString'){
				var bResolved = false;
				if(subValues && !JSB.isArray(subValues)){
					subValues = [subValues];
				}
				if(subValues && subValues.length > 0){
					var testMatch = $this.resolve(schemeDesc.name, subValues[0]);
					if(testMatch.w == 1){
						bResolved = true;
					}
				}
				if(bResolved){
					value = subValues[0];
				} else {
					if(schemeDesc.name == '$fieldName'){
						value = $this.chooseBestCubeField();
					} else if(JSB.isDefined(schemeDesc.value)){
						value = schemeDesc.value;
					} else {
						value = "";
					}
				}

			} else if(schemeDesc.expressionType == 'EConstNumber'){
				var bResolved = false;
				if(subValues && !JSB.isArray(subValues)){
					subValues = [subValues];
				}
				if(subValues && subValues.length > 0){
					var testMatch = $this.resolve(schemeDesc.name, subValues[0]);
					if(testMatch.w == 1){
						bResolved = true;
					}
				}
				if(bResolved){
					value = subValues[0];
				} else {
					if(JSB.isDefined(schemeDesc.value)){
						value = schemeDesc.value;
					} else {
						value = 0;
					}
				}
			} else if(schemeDesc.expressionType == 'EConstNull'){
				value = null;
			} else if(schemeDesc.expressionType == 'Group'){
				return $this.constructEmptyValue(schemeDesc.values[0], subValues);
			} else if(schemeDesc.expressionType == 'DropContainer'){
			    value = null;
			} else {
				throw new Error('Unexpected empty value type: ' + schemeDesc.expressionType);
			}

			return value;
		},

		getDefaultAggregateForCubeField: function(cubeField){
		    // todo
		    /*
			var fType = $this.options.cubeFields[cubeField].type;
			if(fType){
				fType = fType.toLowerCase();
				if(fType == 'string' || fType == 'varchar' || fType == 'nvarchar' || fType == 'text'){
					return '$any';
				} else if(fType == 'decimal' || fType == 'integer'|| fType == 'float'|| fType == 'double'){
					return '$sum';
				}
			}
			*/
			return null;
		},

		doAdd: function(chosenObj){
		    var child;

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

                function generateViewName(prefix){
                    if(prefix && !$this.value[prefix]){
                        return prefix;
                    }
                    prefix = prefix || 'Вид';
                    for(var idx = 2;; idx++){
                        var suggestedName = prefix + '_' + idx;
                        if(!$this.value[suggestedName]){
                            return suggestedName;
                        }
                    }
                }

                var colName = null;
                var value = undefined;
                var schemeName = null;
                var context = null;
                var askRename = false;
                var bGroupByChanged = false;

                // detect key
                if(JSB.isString(chosenObj.key)){
                    if(($this.scheme.name == '$select' || $this.scheme.name === '$sourceSelect') && chosenObj.key == '#outputFieldName'){
                        // autogenerate column name
                        var prefix = null;
                        if(chosenObj.value && (chosenObj.value.scheme == '$fieldName' || chosenObj.value.scheme == '$fieldExpr')){
                            prefix = chosenObj.value.value;
                        }
                        colName = generateColumnName(prefix);
                        askRename = true;
                    } else if($this.scheme.name == '$views' && chosenObj.key == '#viewName') {
                        // autogenerate view name
                        var prefix = null;
                        colName = generateViewName(prefix);
                        askRename = true;
                    } else {
                        throw new Error('Unexpected key: ' + chosenObj.key);
                    }
                } else if(JSB.isObject(chosenObj.key)) {
                    if(chosenObj.key.scheme == '$viewName' && $this.scheme.name == '$query'){
                        colName = '$from';
                        schemeName = chosenObj.key.scheme;
                        value = chosenObj.key.value;
                    } else  {
                        colName = chosenObj.key.value;

                        if($this.scheme.name == '$query' && colName == '$groupBy'){
                            bGroupByChanged = true;
                        }
                    }
                }

                // detect value
                if(!JSB.isDefined(value)){
                    if(chosenObj.value){
                        // resolve via value scheme
                        schemeName = chosenObj.value.scheme;
                        value = chosenObj.value.value;
                        context = chosenObj.value.context;
                        if(schemeName == '#fieldName' || schemeName == '$fieldName') {
                            if($this.scheme.name == '$select'){
                                // check for field is not existed in groupBy section
                                if($this.parent.value.$groupBy && $this.parent.value.$groupBy.length > 0){
                                    var bGroupExisted = false;
                                    for(var i = 0; i < $this.parent.value.$groupBy.length; i++){
                                        var groupByField = $this.parent.value.$groupBy[i];
                                        if(groupByField == value){
                                            bGroupExisted = true;
                                            break;
                                        }
                                    }
                                    if(!bGroupExisted){
                                        // setup default aggregate function for field
                                        var aggFunc = $this.getDefaultAggregateForCubeField(value);
                                        if(aggFunc){
                                            var val = {};
                                            val[aggFunc] = value;
                                            value = val;
                                            schemeName = aggFunc;
                                        }
                                    }
                                }
                            }
                        } else if(schemeName == '$fieldExpr') {
                            value = {
                                $field: value,
                                $context: context
                            };
                        } else {
                            value = $this.constructEmptyValue(schemeName);
                        }
                    } else if(chosenObj) {
                        // detect via key scheme
                        schemeName = $this.combineAcceptedSchemes(chosenObj.key.scheme)[0];
                        context = chosenObj.key.context;
                        if(this.scheme.optional && this.scheme.optional.indexOf(chosenObj.key.scheme) === -1){
                            value = $this.constructEmptyValue(schemeName);
                        }
                    }
                }

                $this.value[colName] = value;
                // draw entry
                child = $this.drawObjectEntry(colName, schemeName, {expanded: true});
                if(askRename){
                    $this.doEdit('entry', colName);
                }
                if(bGroupByChanged && $this.scheme.name == '$query'){
                    var selectEditor = $this.find('> .container > .entry[key="$select"] > .schemeEditor').jsb();
                    if(selectEditor){
                        selectEditor.updateSelectFieldsUsingGroup();
                    }
                }
                $this.updateButtons();
                $this.notifyChanged();
            } else if($this.scheme.expressionType == 'EArray') {
                var value = chosenObj.value.value;
                var context = chosenObj.value.context;
                var schemeName = chosenObj.value.scheme;
                if(schemeName == '#fieldName') {
                } else if(schemeName == '$fieldExpr' || schemeName == '$fieldName') {
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
                child = $this.drawArrayEntry($this.value.length - 1, schemeName, {expanded: true});
                if($this.scheme.name == '$groupBy'){
                    var selectEditor = $this.parent.find('> .container > .entry[key="$select"] > .schemeEditor').jsb();
                    if(selectEditor){
                        selectEditor.updateSelectFieldsUsingGroup();
                    }
                }
                $this.updateButtons();
                $this.notifyChanged();
            } else {
                throw new Error('Unable to add something in ' + $this.scheme.expressionType);
            }

            return child;
		},

		doReplace: function(targetElt, entryType, entryKey, bWrap){
			if(entryType == 'entry' && $this.scheme.name != '$filter' && $this.scheme.name != '$cubeFilter' && $this.scheme.name != '$postFilter'){
				return;
			}

			var acceptedSchemes = null;
			var existedSchemeDesc = null;
			var existedObj = null;
			if(entryType == 'entry'){
				acceptedSchemes = $this.combineAcceptedSchemes();
				if(JSB.isObject($this.scheme.values) && JSB.isDefined($this.scheme.values[entryKey])){
					existedObj = {scheme: entryKey, value: entryKey};
				} else if(JSB.isObject($this.scheme.values) && $this.scheme.customKey){
					existedObj = {scheme: $this.scheme.customKey, value: entryKey};
				} else {
					throw new Error('Internal scheme error');
				}
			} else {
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

				existedObj = {scheme: existedSchemeDesc.scheme, value: $this.value[entryKey]};
				if(existedObj.scheme == '$fieldName'){

				} else if(existedObj.scheme == '$sortField'){
					existedObj.context = $this.scope.$context;
					existedObj.value = Object.keys($this.value[entryKey])[0];
				} else if(existedObj.scheme == '$fieldExpr'){
					existedObj.context = $this.value[entryKey].$context;
					existedObj.value = $this.value[entryKey].$field;
				} else if(existedObj.scheme == '$viewName') {
				}
			}

			$this.showPopupTool(acceptedSchemes, targetElt, entryType, entryKey, existedObj, function(chosenObj){
				if(chosenObj.key){
					var newKey = chosenObj.key.value;
					if(newKey == entryKey){
						return;
					}
					if(existedObj.scheme == chosenObj.key.scheme){
						if(bWrap){
							var oldValue = {};
							oldValue[entryKey] = $this.value[entryKey];
							$this.value[newKey] = $this.constructEmptyValue(acceptedSchemes[chosenObj.key.scheme][0], [oldValue]);
						} else {
							// just replace key
							$this.value[newKey] = $this.value[entryKey];
						}
					} else {
						if(bWrap){
							var oldValue = {};
							oldValue[entryKey] = $this.value[entryKey];
							$this.value[newKey] = $this.constructEmptyValue(acceptedSchemes[chosenObj.key.scheme][0], [oldValue]);
						} else {
							$this.value[newKey] = $this.constructEmptyValue(acceptedSchemes[chosenObj.key.scheme][0], $this.value[entryKey]);
						}
					}
					delete $this.value[entryKey];

					// detect new key value scheme
					var newValDesc = null;
					if(JSB.isObject($this.scheme.values) && JSB.isDefined($this.scheme.values[newKey])){
						newValDesc = $this.resolve($this.scheme.values[newKey], $this.value[newKey]);
					} else if(JSB.isObject($this.scheme.values) && $this.scheme.customKey){
						newValDesc = $this.resolve($this.scheme.values[$this.scheme.customKey], $this.value[newKey]);
					} else {
						throw new Error('Internal scheme error');
					}

					if(JSB.isArray($this.value)){
						$this.drawArrayEntry(newKey, newValDesc.scheme, {expanded: true});
					} else {
						$this.drawObjectEntry(newKey, newValDesc.scheme, {expanded: true});
					}
					$this.removeEntry(entryKey);
					$this.notifyChanged();
				} else {
					var value = chosenObj.value.value;
					var context = chosenObj.value.context;
					var schemeName = chosenObj.value.scheme;
					if(schemeName == '#fieldName' || schemeName == '$fieldName' || schemeName == '$fieldExpr') {
						value = {
							$field: value,
							$context: context
						};
					} else if(schemeName == '$sortField'){
						var v = {};
						v[value] = 1;
						value = v;
					} else if(schemeName == '$viewName') {

					} else {
						var oldValue = $this.value[entryKey];

						if(bWrap){
							value = $this.constructEmptyValue(schemeName, [oldValue]);
						} else {
							var subValues = [];
							if(JSB.isObject(oldValue)){ //single object
								if(Object.keys(oldValue).length == 1){
                                    for(var sKey in oldValue){
                                        subValues.push(oldValue[sKey]);
                                    }
								}

								if(Object.keys(oldValue).length == 2 && oldValue['$context'] && oldValue['$field']){
								    subValues.push(oldValue);
								}
							}

							value = $this.constructEmptyValue(schemeName, subValues);
						}
					}

					$this.value[entryKey] = value;
					if(JSB.isArray($this.value)){
						$this.drawArrayEntry(entryKey, schemeName, {expanded: true});
					} else {
						$this.drawObjectEntry(entryKey, schemeName, {expanded: true});
					}
					if($this.scheme.name == '$groupBy'){
						var selectEditor = $this.parent.find('> .container > .entry[key="$select"] > .schemeEditor').jsb();
						if(selectEditor){
							selectEditor.updateSelectFieldsUsingGroup();
						}
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
				var valueEditorElt = entryElt.find('> .schemeEditor'),
				    fromContext = QuerySyntax.getFromContext();

				if(valueEditorElt.jsb()){
					valueEditorElt.jsb().destroy();
				}

				entryElt.remove();

				if(fromContext.indexOf(entryKey) > -1 && this.fromContainer.is(':empty')){
				    this.removeClass('hasFrom');
				}
			}

			// fixup array keys
			if(JSB.isArray($this.value)){
				var entries = $this.find('> .container > .entry');
				for(var i = 0; i < entries.length; i++){
					$this.$(entries.get(i)).attr('key', i);
				}
			}

			if($this.scheme.name == '$query' && entryKey == '$groupBy'){
				var selectEditor = $this.find('> .container > .entry[key="$select"] > .schemeEditor').jsb();
				if(selectEditor){
					selectEditor.updateSelectFieldsUsingGroup();
				}
			} else if($this.scheme.name == '$groupBy'){
				var selectEditor = $this.parent.find('> .container > .entry[key="$select"] > .schemeEditor').jsb();
				if(selectEditor){
					selectEditor.updateSelectFieldsUsingGroup();
				}
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

		updateSelectFieldsUsingGroup: function(){
			var groupFields = {};
			if($this.parent.value.$groupBy && $this.parent.value.$groupBy.length > 0){
				var r = $this.resolve($this.scheme, $this.value);
				for(var i = 0; i < $this.parent.value.$groupBy.length; i++){
					var gVal = $this.parent.value.$groupBy[i];
					var cubeField = null;
					if(JSB.isString(gVal)){
						cubeField = gVal;
					} else if(JSB.isObject(gVal) && gVal.$field){
						// lookup cube field corresponded to alias
						if($this.value[gVal.$field]){
							// extract cube name from alias
							var aliasScheme = r.obj[gVal.$field].scheme;
							if(aliasScheme == '$fieldName' && JSB.isString($this.value[gVal.$field])){
								cubeField = $this.value[gVal.$field];
							} else if(QuerySyntax.getSchema()[aliasScheme].aggregate){
								// try to get nested field
								if(r.obj[gVal.$field].obj[aliasScheme].scheme == '$fieldName' && JSB.isString($this.value[gVal.$field][aliasScheme])){
									cubeField = $this.value[gVal.$field][aliasScheme];
								}
							}
						}
					}
					if(cubeField && JSB.isString(cubeField)){
						groupFields[cubeField] = true;
					}
				}
			}

			// iterate over all select fields
			var bChanged = false;
			var r = $this.resolve($this.scheme, $this.value);
			for(var alias in $this.value){
				var fVal = $this.value[alias];
				var fScheme = r.obj[alias].scheme;
				if(!fScheme){
					continue;
				}
				if(Object.keys(groupFields).length > 0){
					if(fScheme == '$fieldName' || fScheme == '$fieldExpr'){
						// direct field - check existence in groupBy
						if(!groupFields[fVal]){
							// wrap aggregate
							var aggFunc = $this.getDefaultAggregateForCubeField(fVal);
							if(aggFunc){
								var val = {};
								val[aggFunc] = fVal;
								$this.value[alias] = val;
								bChanged = true;
							}
						}
					} else {
						var sDesc = QuerySyntax.getSchema()[fScheme];
						if(sDesc && sDesc.aggregate){
							var nestedScheme = r.obj[alias].obj[fScheme].scheme;
							if(nestedScheme == '$fieldName' || nestedScheme == '$fieldExpr'){
								var aggField = fVal[fScheme];
								if(aggField && JSB.isString(aggField) && groupFields[aggField]){
									// unwrap aggregate
									$this.value[alias] = aggField;
									bChanged = true;
								}
							}
						}
					}
				} else {
					// disable all aggregates
					var sDesc = QuerySyntax.getSchema()[fScheme];
					if(sDesc && sDesc.aggregate){
						var aggVal = fVal[fScheme];
						if(aggVal){
							// unwrap aggregate
							$this.value[alias] = aggVal;
							bChanged = true;
						}
					}
				}
			}
			if(bChanged){
				$this.refresh();
			}
		},

		renameEntry: function(oldKey, newKey){
			if(!JSB.isDefined($this.value[oldKey])){
				throw new Error('Missing value in key: ' + oldKey);
			}
			if(oldKey == newKey){
				return;
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

		hasAscendantScheme: function(schemeName){
			var curEditor = this;
			while(curEditor){
				if(curEditor.scheme.name == schemeName){
					return true;
				}
				curEditor = curEditor.parent;
			}
			return false;
		},

		combineCategoryMap: function(schemes){
			var itemMap = {},
			    chosenObjectKey = null,
			    chooseType = 'key';

			if(JSB.isArray(schemes)){
				for(var i = 0; i < schemes.length; i++){
					itemMap[schemes[i]] = schemes[i];
				}
				chooseType = 'value';
			} else if(JSB.isObject(schemes)){
				if(Object.keys(schemes).length == 1 && ($this.scheme.name == '$select' || $this.scheme.name == '$views' || $this.scheme.name == '$sourceSelect')){
					chooseType = 'value';
					// pass first
					chosenObjectKey = Object.keys(schemes)[0];
					for(var i = 0; i < schemes[chosenObjectKey].length; i++){
						itemMap[schemes[chosenObjectKey][i]] = schemes[chosenObjectKey][i];
					}
				} else {
					for(sName in schemes){
						if($this.scheme.name == '$query'){
							itemMap[sName] = schemes[sName][0];
						} else {
							itemMap[sName] = sName;
						}
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
			var bHasSlices = false;
			for(var item in itemMap){
				var category = 'Разное';
				var valObj = null;

				if(item == '#fieldName' || item == '$fieldName'){
					if(bHasFields){
						continue;
					}
					category = this.hasAscendantScheme('$cubeFilter') ? 'Поля куба': 'Поля источника';
					valObj = item;
					bHasFields = true;
				} else if(item == '#outputFieldName' || item == '$fieldExpr' || item == '$sortField') {
					if(bHasColumns){
						continue;
					}
					category = 'Столбцы среза';
					valObj = item;
					bHasColumns = true;
				} else if(item == '$viewName') { // || item == '$from'
					if(bHasSlices){
						continue;
					}
					category = 'Источник запроса';
					valObj = '$viewName';
					bHasSlices = true;
				} else {
					if(item && item[0] == '#'){
						// custom field
					} else {
						if(skipMap[item]){
							continue;
						}
						valObj = {item: item, desc: $this.scheme.valueDesc && $this.scheme.valueDesc[item]};
						var itemDesc = QuerySyntax.getSchema()[itemMap[item]];
						if(itemDesc){
							if(itemDesc.disabled){
								continue;
							}
							if(itemDesc.category){
								category = itemDesc.category;
							}
							valObj.desc = valObj.desc || itemDesc.desc;
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
					selectedObj: existedObj,
					editor: $this,
					items: itemMap,
					entryType: entryType,
					entryKey: entryKey
				},
				scope: null,
				target: {
					selector: targetElt,
					dock: 'bottom',
					offsetVert: -1
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

		selectHover: function(entryType, entryKey, bSelect, bWrap){
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


			if(bSelect){
				if(bWrap && hoverElt.hasClass('hover') && hoverElt.hasClass('wrap')){
					return;
				}
				if(!bWrap && hoverElt.hasClass('hover') && !hoverElt.hasClass('wrap')){
					return;
				}
			} else {
				if(!hoverElt.hasClass('hover')){
					return;
				}
			}

			if(bSelect){
				hoverElt.addClass('hover');
				if(bWrap){
					hoverElt.addClass('wrap');
				} else {
					hoverElt.removeClass('wrap');
				}
			} else {
				hoverElt.removeClass('hover');
				hoverElt.removeClass('wrap');
			}

			var allowEdit = false,
			    allowRemove = false,
			    allowSetStruct = false;

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

			if(this.scopeName === '$select' && this.parent && !this.parent.parent){
			    allowSetStruct = true;
			}

			$this.publish('DataCube.Query.SchemeEditor.selected', {entryType: entryType, entryKey:entryKey, selected: bSelect});

			// show popup menu
			if(bSelect && (allowEdit || allowRemove)){
				$this.menuTool = ToolManager.activate({
					id: 'schemeMenuTool',
					cmd: 'show',
					data: {
						editor: $this,
						entryType: entryType,
						entryKey: entryKey,
						isStruct: $this.options.measurements ? $this.options.measurements[entryKey] : false,
						actions: {
							allowEdit: allowEdit,
							allowRemove: allowRemove,
							allowSetStruct: allowSetStruct
						}
					},
					scope: null,
					target: {
						selector: hoverElt,
						dock: 'top',
						offsetVert: 1
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
						} else if(cmd == 'setStruct'){
						    $this.setStructField(hoverElt, entryKey);
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

		setStructField: function(elt, entryKey){
		    var isStruct = this.options.measurements[entryKey];

		    elt.toggleClass('struct');

		    if(isStruct){
		        if(this.options.measurements[entryKey]){
		            delete this.options.measurements[entryKey];
		        }
		    } else {
		        this.options.measurements[entryKey] = true;
		    }
		},

		refresh: function(){
			if(!QuerySyntax.isSynchronized()){
				QuerySyntax.ensureSynchronized(function(){
					$this.refresh();
				});
				return;
			}

			this.destroyNestedEditors();
			$this.container.empty();

			$this.fromContainer.empty();
			this.removeClass('hasFrom');

			$this.scheme = QuerySyntax.getSchema()[$this.schemeName];
			$this.construct();
		},

		removeEntry: function(entryKey){
			var entryElt = $this.container.find('> .entry[key="'+entryKey+'"]');

			var valueEditors = entryElt.find('> .schemeEditor');
			valueEditors.each(function(){
				var inst = $this.$(this).jsb();
				if(inst){
					inst.destroy();
				}
			});

			entryElt.remove();
		},

		drawObjectEntry: function(valName, valScheme, opts){
			opts = opts || {};

			var container = this.container,
			    fromContext = QuerySyntax.getFromContext();

			if(fromContext.indexOf(valName) > -1 && this.schemeName === "$query"){ // && !this.scopeName
			    container = this.fromContainer;
			    this.addClass('hasFrom');
			}

			// draw value entry
			var entryElt = container.find('> .entry[key="'+valName+'"]');
			if(entryElt.length == 0){
				entryElt = $this.$('<div class="entry"></div>');
				entryElt.attr('key', valName);
				container.append(entryElt);

				if(this.scopeName === '$select' && this.options.measurements[valName]){
				    entryElt.addClass('struct');
                }
			}

			// add key
			var keyName = valName;
			var keyComment = $this.scheme.valueDesc && $this.scheme.valueDesc[valName];
			var keyElt = entryElt.find('> .key');
			if(keyElt.length == 0){
				keyElt = $this.$('<div class="key"></div>');
				entryElt.append(keyElt);
			}
			var keyDecl = QuerySyntax.getSchema()[valName];
			if(keyDecl && keyDecl.desc){
				keyComment = keyComment || keyDecl.desc;
			}
			if(keyDecl && keyDecl.displayName){
				keyElt.empty();
				keyElt.append(keyDecl.displayName);
			} else {
				if($this.scheme.customKey == '#outputFieldName' || $this.scheme.customKey == '#value' || $this.scheme.customKey == '#viewName'){
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
					keyComment = 'Поле';
				} else if($this.scheme.customKey == '#viewName'){
					keyElt.addClass('view');
					keyComment = 'Вид';
				}

			}
			var keyTooltip = keyName;
			if(keyComment){
				keyTooltip += '\n' + keyComment;
			}
			keyElt.get(0).setAttribute('title', keyTooltip);

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
				if($this.scheme.name == '$filter' || $this.scheme.name == '$cubeFilter'){
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
					entryElt.prepend('<div class="substrate"></div>');
					entryElt.prepend('<div class="wrapSubstrate"></div>');
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
				sourceFieldsEditors: this.sourceFieldsEditors,
				expanded: false
			}));
			valueEditor.setOption('measurements', this.options.measurements || {});

			valueEditor.addClass('value');
			entryElt.append(valueEditor.getElement());

			// inject value substrate
			valueEditor.prepend('<div class="substrate"></div>');
			valueEditor.prepend('<div class="wrapSubstrate"></div>');

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

			return valueEditor;
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
			entryElt.prepend('<div class="substrate"></div>');
			$this.installHoverHandlers('entry', i, keyElt);

			var valueEditor = new $class(JSB.merge({}, $this.options, {
				parent: $this,
				acceptedSchemes: acceptedSchemes,
				schemeName: valScheme,
				scopeName: i,
				scope: $this.value,
				value: curVal,
				sourceFieldsEditors: this.sourceFieldsEditors,
				expanded: false
			}));
			valueEditor.setOption('measurements', this.options.measurements || {});

			valueEditor.addClass('value');
			entryElt.append(valueEditor.getElement());

			// inject value substrate
			valueEditor.prepend('<div class="substrate"></div>');
			valueEditor.prepend('<div class="wrapSubstrate"></div>');

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

			return valueEditor;
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
			if($this.scheme.name == '$fieldName' || $this.scheme.name == '$fieldExpr'){
                $this.container.append($this.$('<div class="value"></div>').text($this.value['$field']).attr('title', $this.value['$field']));
                $this.container.append($this.$('<div class="context"></div>').text($this.value['$context']));
				return true;
			} else if($this.scheme.name == '$sortTypeAsc') {
				$this.container.append($this.$('<div class="value fixed">По возрастанию</div>'));
				return true;
			} else if($this.scheme.name == '$sortTypeDesc') {
				$this.container.append($this.$('<div class="value fixed">По убыванию</div>'));
				return true;
			} else if($this.scheme.name == '$viewName') {
				var slice = $this.getSliceForName($this.value);
				if(slice){
					$this.container.append(RendererRepository.createRendererFor(slice, {showCube: true}).getElement());
					return true;
				}
			}
			return false;
		},

		construct: function(){
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
					var schemeValues = Object.keys($this.scheme.values),
					    usedFields = {};

					if($this.scheme.name == '$query'){
						// perform $context
						var ctxName = $this.value['$context'];
						if(!JSB.isDefined(ctxName)){
							if(!$this.parent){
								ctxName = $this.value['$context'] = $this.generateQueryContextName('main');
							} else {
								ctxName = $this.value['$context'] = $this.generateQueryContextName();
							}
						}

						var ctxElt = $this.$('<div class="context"></div>').text(ctxName);
						$this.container.append(ctxElt);
						usedFields['$context'] = true;
					}

					if($this.scheme.name == '$fromProvider'){
					    $this.value['$context'] = $this.generateQueryContextName(this.scopeName.replace('$', ''));
					    usedFields['$context'] = true;
					}

					for(var i = 0; i < schemeValues.length; i++){
					    var vName = schemeValues[i];

						if(JSB.isDefined($this.scheme.customKey) && vName == $this.scheme.customKey){
							for(var fName in $this.value){
								// skip non-customs 
								if($this.scheme.values[fName]){
									continue;
								}
								usedFields[fName] = true;
								$this.drawObjectEntry(fName, valSchemes.obj[fName].scheme);
							}
						} else {
							if(JSB.isDefined($this.value[vName]) || !optionalMap[vName]){
								var vScheme = $this.scheme.values[vName];
								if(!JSB.isDefined($this.value[vName])){
									$this.value[vName] = $this.constructEmptyValue(vScheme);
									valSchemes = $this.value ? $this.resolve($this.scheme, $this.value) : {};
								}
								if(valSchemes && valSchemes.obj && valSchemes.obj[vName]){
									vScheme = valSchemes.obj[vName].scheme;
								}
								usedFields[vName] = true;
								$this.drawObjectEntry(vName, vScheme);
							}
						}
					}
					
					// remove non-used fields
					var rArr = [];
					for(var fName in $this.value){
						if(!usedFields[fName]){
							rArr.push(fName);
						}
					}
					for(var i = 0; i < rArr.length; i++){
						delete $this.value[rArr[i]];
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
				
				$this.container.sortable({
					handle: '> .handle',
	                update: function(){
	                	// reorder
	                	var values = JSB.clone($this.value);
	                	var entries = $this.container.find('> .entry');
	                	for(var i = 0; i < entries.length; i++){
	                		var entryElt = $this.$(entries.get(i));
	                		var oldKey = parseInt(entryElt.attr('key'));
	                		$this.value[i] = values[oldKey];
	                		entryElt.attr('key', i);
	                	}
	                	
	                	$this.notifyChanged();
	                }
				});
				
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
			}  else if(this.scheme.expressionType == 'DropContainer'){
			    if(this.options.mode === 'diagram'){
			        var select = new Select({
                        clearBtn: true,
                        cloneOptions: true,
                        options: this.scheme.name === '$from' ? this.options.sliceSelectOptions : this.options.sourceSelectOptions,
                        value: this.value,
                        onchange: function(val){
                            $this.changeConstValue(val.key);

                            if(!$this.scope.$select || Object.keys($this.scope.$select).length === 0){
                                val.options.entry.server().extractFields(function(fields, fail){
                                    if(fail){
                                        return;
                                    }

                                    $this.parent.addSelectFromSource(val, fields);
                                });
                            }
                        }
			        });
			        this.container.append(select.getElement());
			    } else {
                    this.dropContainer = this.$('<div class="dropContainer"></div>');
                    this.container.append(this.dropContainer);

                    function createValue(value, entry){
                        $this.dropContainer.empty();

                        function drawValue(entry){
                            if(entry){
                                $this.dropContainer.append(RendererRepository.createRendererFor(entry).getElement());
                            }
                        }

                        if(!entry){
                            $this.server().getDataSourceEntry(value, function(entry){
                                drawValue(entry);
                            })
                        } else {
                            drawValue(entry);
                        }
                    }

                    this.dropContainer.droppable({
                        accept: function(d){
                            if(d && d.length > 0 && d.get(0).draggingItems){
                                for(var i in d.get(0).draggingItems){
                                    var obj = d.get(0).draggingItems[i].obj;

                                    if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
                                        continue;
                                    }

                                    for(var j = 0; j < $this.scheme.allowValues.length; j++){
                                        if(JSB.isInstanceOf(obj.getTargetEntry(), $this.scheme.allowValues[j])){
                                            return true;
                                        }
                                    }
                                }
                            }
                            return false;
                        },
                        tolerance: 'pointer',
                        greedy: true,
                        activeClass : 'acceptDraggable',
                        hoverClass: 'hoverDraggable',
                        drop: function(evt, ui){
                            var d = ui.draggable;

                            for(var i in d.get(0).draggingItems){
                                var entry = d.get(0).draggingItems[i].obj.getEntry(),
                                    newVal = entry.getWorkspace().getId() + '/' + entry.getId();

                                createValue(newVal, entry);

                                $this.changeConstValue(newVal);
                                break;
                            }
                        }
                    });

                    if(this.value){
                        createValue(this.value);
                    }
                }
			} else {
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
					    var isAdd = true;

					    if(scheme.incompatible){
                            for(var i = 0; i < scheme.incompatible.length; i++){
                                for(var j in this.value){
                                    if(scheme.incompatible[i].indexOf(j) > -1 && scheme.incompatible[i].indexOf(vName) > -1){
                                        isAdd = false;
                                        break;
                                    }
                                }
                            }
                        }

                        if(isAdd){
						    schemes[vName] = $this.combineSchemes(scheme.values[vName]);
                        }
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
				var w = 0;
				var sCnt = 0;
				if(!desc){
					return 0;
				}
				if(forceArray){
					for(var v in desc){
						sCnt++;
						var curW = extractIntegratedWeight(desc[v]);
						if(JSB.isDefined(curW)){
							w += curW;
						}
					}
					if(sCnt > 0){
						w /= sCnt;
					} else {
						w = 1;
					}
				} else {
					if(JSB.isDefined(desc.w)){
						w = desc.w;
					} else if(JSB.isDefined(desc.obj)){
						for(var v in desc.obj){
							sCnt++;
							var curW = extractIntegratedWeight(desc.obj[v]);
							if(JSB.isDefined(curW)){
								w += curW;
							}
						}
						if(sCnt > 0){
							w /= sCnt;
						} else {
							w = 1;
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
			//case 'DropContainer':
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
				if(res.length === 0 && value.length > 0){
					return {w: 0};
				}
				return {obj:res, w: extractIntegratedWeight(res, true), scheme: schemeName};
			case 'Group':
				var curDesc = {w: 0},
				    wDesc;

				for(var i = 0; i < scheme.values.length; i++){
					var curScheme = scheme.values[i];

					if(!curScheme){
						continue;
					}

					wDesc = this.resolve(curScheme, value);

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

				if(!curDesc.scheme){
				    curDesc = wDesc;
				}

				return curDesc;
            case 'DropContainer':
                return {w: 1, scheme: schemeName};
			default:
				throw new Error('Unexpected expression type: ' + scheme.expressionType);
			}
		},

		addSelectFromSource: function(value, fields){
		    var child;

		    if(!$this.scope.$select){
		        child = this.doAdd({"key":{"scheme":"$select","value":"$select"},"value":null});
            } else {
debugger;
            }

		    for(var i in fields){
		        child.doAdd({
		            key: '#outputFieldName',
		            value: {
		                scheme: '$fieldExpr',
		                value: i,
		                context: value.options.entry.getMainContext() //this.scope.context
                    }
                });
		    }
		}
	},

	$server: {
	    $require: ['JSB.Workspace.WorkspaceController'],

	    getDataSourceEntry: function(value){
	        value = value.split('/');

	        return WorkspaceController.getWorkspace(value[0]).entry(value[1]);
	    },

	    getEntryFields: function(pDesc){
	        pDesc = pDesc.split('/');

	        var entry = WorkspaceController.getWorkspace(pDesc[0]).entry(pDesc[1]);

	        if(!entry){
	            return;
	        }

	        return {
	            fields: entry.extractFields(),
	            entry: entry
	        }
	    }
    }
}