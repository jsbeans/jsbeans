{
	$name: 'DataCube.Controls.SchemeSelector',
	$parent: 'JSB.Widgets.ComboBox',
	$require: ['Unimap.Render.DataBindingCache',
	           'css:SchemeSelector.css'],
	$client: {
		options: {
		    clearBtn: false,
			tree: true,
			key: 'schemeSelector',
			selectNodes: true
		},
		
		dontNotify: false,
		
		$constructor: function(opts){
			var items = opts.items;
			var cubeItems = opts.cubeItems;
			var paramItems = opts.paramItems;
			var value = opts.value;
			this.context = opts.context;
			this.sourceKey = opts.sourceKey;
			if(JSB.isDefined(opts.items)){
				delete opts.items;
			}
			if(JSB.isDefined(opts.cubeItems)){
				delete opts.cubeItems;
			}
			if(JSB.isDefined(opts.paramItems)){
				delete opts.paramItems;
			}
			if(JSB.isDefined(opts.value)){
				delete opts.value;
			}
			
			$base(opts);
			
			this.addClass('schemeSelector');
			
			if(JSB.isDefined(items)){
				$this.setItems(items, cubeItems, paramItems, opts.updateId);
			}
			if(JSB.isDefined(value)){
				this.dontNotify = true;
				$this.setData(value);
				this.dontNotify = false;
			}
		},
		
		setOptions: function(items, cubeItems, paramItems, updateId){
			this.setItems(items, cubeItems, paramItems, updateId);
		},
		
		setItems: function(items, cubeItems, paramItems, updateId){
			var sourceKey = this.sourceKey + '.' + updateId;
			if(this.options.cubeFields){
				sourceKey += '.withCubeFields';
			}
			
			var nItems = DataBindingCache.get(this.context, sourceKey, 'SchemeSelectorItems');
			$this.schemeMap = DataBindingCache.get(this.context, sourceKey, 'SchemeSelectorMap');
			if(!nItems || !$this.schemeMap){
				$this.schemeMap = {};
				nItems = $this.translateItems(items, cubeItems, paramItems);
				DataBindingCache.put(this.context, sourceKey, 'SchemeSelectorItems', nItems);
				DataBindingCache.put(this.context, sourceKey, 'SchemeSelectorMap', $this.schemeMap);
			}
			
			return $base(nItems);
		},
		
		setData: function(val){
			if(!val){
				this.selectedObject = null;
				this.find('> ._dwp_cbContainer').empty();
				this.getElement().removeAttr('value');
				if(!JSB().isNull(this.options.onChange) && this.initialized && !this.dontNotify){
					this.options.onChange(null, null);
				}
				return;
			}
			var valObj = this.resolveItem(val);
			if(JSB().isNull(this.selectedObject) || this.selectedObject.key != valObj.key){
				if(this.itemMap[valObj.key]){
					valObj = this.itemMap[valObj.key];
					var fieldElt = $this.$('<div class="schemeField"></div>');
					if($this.schemeMap[valObj.key].cubeField){
						fieldElt.addClass('cubeField');
					}
					var curObj = valObj;
					var bFirst = true;
					while(curObj){
						var curScheme = $this.schemeMap[curObj.key];
						if(!curScheme){
							break;
						}
						if(!bFirst){
							fieldElt.prepend('<div class="separator">&rsaquo;</div>');
						}
						fieldElt.prepend($this.$('<div class="field" type="'+curScheme.type+'"></div>').text(curScheme.field));
						curObj = $this.itemMap[curObj.pKey];
						bFirst = false;
					}
					
					fieldElt.prepend('<div class="icon"></div>');
					fieldElt.append('<div class="type">'+$this.schemeMap[valObj.key].type+'</div>');
					fieldElt.attr('type', $this.schemeMap[valObj.key].type);
					fieldElt.attr('title', $this.schemeMap[valObj.key].field);
					
					this.find('> ._dwp_cbContainer').empty().append(fieldElt);
					this.selectedObject = valObj;
					this.getElement().attr('value', valObj.key);
				} else {
					this.find('> ._dwp_cbContainer').empty();
					this.selectedObject = null;
					this.getElement().removeAttr('value');
				}
				if(!JSB().isNull(this.options.onChange) && this.initialized && !this.dontNotify){
					this.options.onChange(valObj ? valObj.key : null, valObj);
				}
			}

            if(this.options.clearBtn){
                this.addClass('hasClearBtn');

                var clearBtn = this.$('<i class="clearBtn fas fa-times"></i>');
                clearBtn.click(function(evt){
                    evt.stopPropagation();
                    $this.setData();
                    clearBtn.remove();
                });
                this.getElement().append(clearBtn);
            }
		},
		
		setValue: function(val){
			this.setData(val);
		},
		
		getValue: function(){
			return this.selectedObject;
		},
		
		translateItems: function(sliceItems, cubeItems, paramItems){
			function _translateItem(item, pKey, bCubeField, bParam){
				var fieldElt = $this.$('<div class="schemeField" type="'+item.scheme.type+'"></div>').append('<div class="icon"></div>').append($this.$('<div class="field" type="'+item.scheme.type+'"></div>').text(item.scheme.field)).append($this.$('<div class="type"></div>').text(item.scheme.type));
				if(bCubeField){
					fieldElt.addClass('cubeField');
				}
				if(bParam){
					fieldElt.addClass('param');
				}
				var isNode = item.child && item.child.length > 0; //item.scheme.type == 'array' || item.scheme.type == 'object';
				var allowSelect = true;
				if(isNode){
					fieldElt.addClass('schemeNode');
					if(!$this.options.selectNodes){
						allowSelect = false;
					}
				}
				
				if(!allowSelect){
					fieldElt.addClass('dontSelect');
				}
				
				$this.schemeMap[item.key] = item.scheme;
				
				var nItem = {
					key: item.key,
					pKey: pKey,
					element: fieldElt,
					field: item.scheme.field,
					children: [],
					allowSelect: allowSelect,
					allowHover: allowSelect,
					options: item
				};
				if(item.child && item.child.length > 0){
					for(var i = 0; i < item.child.length; i++){
						nItem.children.push(_translateItem(item.child[i], item.key, bCubeField, bParam));
					}
					nItem.children.sort(function(a, b){
						return a.field.localeCompare(b.field);
					});
				}
				return nItem;
			}
			
			var items = [];
			if(this.options.cubeFields || this.options.showParams){
				if(this.options.showParams){
					// add params
					var paramsNode = {
						key: JSB.generateUid(),
						pKey: null,
						element: '<div class="schemeHeader param"><div class="icon"></div>Параметры</div>',
						children: [],
						allowSelect: false,
						allowHover: false,
					};
					items.push(paramsNode);
					for(var i = 0; i < paramItems.length; i++){
						paramsNode.children.push(_translateItem(paramItems[i], paramsNode.key, false, true));
					}
					paramsNode.children.sort(function(a, b){
						return a.field.localeCompare(b.field);
					});
				}
				
				if(this.options.cubeFields){
					// add cube fields
					var cubeFieldsNode = {
						key: JSB.generateUid(),
						pKey: null,
						element: '<div class="schemeHeader cube"><div class="icon"></div>Поля куба</div>',
						children: [],
						allowSelect: false,
						allowHover: false,
					};
					items.push(cubeFieldsNode);
					for(var i = 0; i < cubeItems.length; i++){
						cubeFieldsNode.children.push(_translateItem(cubeItems[i], cubeFieldsNode.key, true, false));
					}
					cubeFieldsNode.children.sort(function(a, b){
						return a.field.localeCompare(b.field);
					});
				}
				
				// add slice fields
				var sliceFieldsNode = {
					key: JSB.generateUid(),
					pKey: null,
					element: '<div class="schemeHeader slice"><div class="icon"></div>Поля среза</div>',
					children: [],
					allowSelect: false,
					allowHover: false,
				};
				items.push(sliceFieldsNode);
				for(var i = 0; i < sliceItems.length; i++){
					sliceFieldsNode.children.push(_translateItem(sliceItems[i], sliceFieldsNode.key, false, false));
				}
				sliceFieldsNode.children.sort(function(a, b){
					return a.field.localeCompare(b.field);
				});
			} else {
				for(var i = 0; i < sliceItems.length; i++){
					items.push(_translateItem(sliceItems[i], null, false, false));
				}
				items.sort(function(a, b){
					return a.field.localeCompare(b.field);
				});
			}
			
			
			return items;
		}
	}
}