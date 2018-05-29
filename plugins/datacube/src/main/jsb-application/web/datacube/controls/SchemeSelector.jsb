{
	$name: 'DataCube.Controls.SchemeSelector',
	$parent: 'JSB.Widgets.ComboBox',
	
	$client: {
		options: {
			tree: true,
			key: 'schemeSelector',
			selectNodes: true
		},
		
		dontNotify: false,
		
		$constructor: function(opts){
			var items = opts.items;
			var value = opts.value;
			if(JSB.isDefined(opts.items)){
				delete opts.items;
			}
			if(JSB.isDefined(opts.value)){
				delete opts.value;
			}
			
			$base(opts);
			
			this.addClass('schemeSelector');
			this.loadCss('SchemeSelector.css');
			
			if(JSB.isDefined(items)){
				$this.setItems(items);
			}
			if(JSB.isDefined(value)){
				this.dontNotify = true;
				$this.setData(value);
				this.dontNotify = false;
			}
		},
		
		setOptions: function(items, isClear, isCloneElements){
			this.setItems(items);
		},
		
		setItems: function(items){
			$this.schemeItems = items;
			$this.schemeMap = {};
			var nItems = $this.translateItems();
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
		},
		
		setValue: function(val){
			this.setData(val);
		},
		
		getValue: function(){
			return this.selectedObject;
		},
		
		translateItems: function(){
			if(!$this.schemeItems || $this.schemeItems.length == 0){
				return $this.schemeItems;
			}
			
			function _translateItem(item, pKey){
				var fieldElt = $this.$('<div class="schemeField" type="'+item.scheme.type+'"></div>').append('<div class="icon"></div>').append($this.$('<div class="field" type="'+item.scheme.type+'"></div>').text(item.scheme.field)).append($this.$('<div class="type"></div>').text(item.scheme.type));
				var isNode = item.scheme.type == 'array' || item.scheme.type == 'object';
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
					children: [],
					allowSelect: allowSelect,
					allowHover: allowSelect
				};
				if(item.child && item.child.length > 0){
					for(var i = 0; i < item.child.length; i++){
						nItem.children.push(_translateItem(item.child[i], item.key));
					}
				}
				return nItem;
			}
			var items = [];
			for(var i = 0; i < $this.schemeItems.length; i++){
				items.push(_translateItem($this.schemeItems[i], null));
			}
			
			return items;
		}
	}
}