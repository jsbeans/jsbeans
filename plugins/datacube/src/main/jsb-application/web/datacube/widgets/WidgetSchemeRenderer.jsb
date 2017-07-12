{
	$name: 'JSB.DataCube.Widgets.WidgetSchemeRenderer',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Widgets.PrimitiveEditor',
	           'JSB.Widgets.ComboBox',
	           'JSB.Widgets.Button',
	           'JSB.Widgets.ToolManager',
	           'JSB.DataCube.Widgets.DataBindingSelector'],
	
	$client: {
		options: {
			showHeader: true
		},
		
		renderers: [],
		
		$constructor: function(opts){
			$base(opts);
			this.scheme = opts.scheme;
			this.values = opts.values;
			this.wrapper = opts.wrapper;
			this.tool = opts.tool;
			this.binding = opts.binding;
			this.supply = opts.supply;
			this.addClass('widgetSchemeRenderer');
			this.loadCss('WidgetSchemeRenderer.css');
			this.update();
		},
		
		destroy: function(){
			this.destroyRenderers();
			$base();
		},
		
		destroyRenderers: function(){
			for(var i = 0; i < this.renderers.length; i++){
				this.renderers[i].destroy();
			}
			this.renderers = [];
		},
		
		update: function(){
			this.getElement().empty();
			this.destroyRenderers();
			
			switch(this.scheme.type){
			case 'group':
				this.constructGroup();
				break;
			case 'item':
				this.constructItem();
				break;
			case 'select':
				this.constructSelect();
				break;
			}
		},
		
		constructGroup: function(){
			this.attr('entry', 'group');
			if(this.scheme.binding){
				this.addClass('hasBinding');
			}

			if(this.options.showHeader && this.scheme.name){
				this.addClass('hasHeader');
				var header = this.$('<div class="header"></div>');
				this.append(header);
				
				if(this.scheme.optional){
					// show checkbox caption
					header.append(`#dot <div jsb="JSB.Widgets.CheckBox" onchange="{{=this.callbackAttr(function(){  })}}" label="{{=$this.scheme.name}}" checked="{{=$this.values.used}}"></div>`);
				} else {
					// show simple caption
					header.append(this.$('<div class="caption"></div>').text(this.scheme.name));
					this.values.used = true;
				}
				if((this.scheme.binding == 'array' || this.scheme.binding == 'record') && !this.binding){
					this.bindingSelector = new DataBindingSelector({
						scope: $this.binding,
						value: $this.values.binding,
						wrapper: this.wrapper,
						onChange: function(){
							$this.values.binding = this.getDataScheme();
							fillGroup(this.getDataScheme());
						}
					});
					header.append(this.bindingSelector.getElement());
				}
				if(this.scheme.multiple){
					this.addClass('hasMultiple');
					// create append button
					var btnAdd = new Button({
						cssClass: 'roundButton btn10 btnCreate',
						tooltip: 'Добавить значение',
						onClick: function(){
						}
					});
					header.append(btnAdd.getElement());
				}
			}
			
			this.bodyElt = this.$('<div class="body"></div>');
			this.append(this.bodyElt);
			if(this.scheme.multiple){
				this.bodyElt.sortable();
			}

			
			function fillGroupItems(groupIdx, binding, supply){
				var ul = $this.$('<div class="items"></div>');
				$this.bodyElt.append(ul);
				$this.values.used = true;
				if(!$this.values.groups){
					$this.values.groups = [];
				}
				if(!$this.values.groups[groupIdx]){
					$this.values.groups[groupIdx] = [];
				}
				var groupValues = $this.values.groups[groupIdx];
				
				function addItem(item, values){
					values.used = true;
					var liElt = $this.$('<div class="item"></div>');
					var itemRenderer = new $class({
						scheme: item,
						values: values,
						wrapper: $this.wrapper,
						tool: $this.tool,
						binding: binding || $this.binding,
						supply: supply || $this.supply,
						onChange: $this.options.onChange,
						onRemove: function(){
							values.used = false;
							liElt.remove();
							itemRenderer.destroy();
						}
					});
					$this.renderers.push(itemRenderer);
					liElt.append(itemRenderer.getElement());
					
					ul.append(liElt);
					return liElt;
				}


				for(var i = 0; i < $this.scheme.items.length; i++){
					var item = $this.scheme.items[i];
					if(!groupValues[i]){
						groupValues[i] = {};
					}
					addItem(item, groupValues[i]);
				}

			}
			
			function fillGroup(childBinding){
				if(!$this.values.binding && $this.scheme.binding){
					$this.values.binding = childBinding;
				}
				if($this.values && $this.values.groups && $this.values.groups.length > 0){
					for(var i = 0; i < $this.values.groups.length; i++){
						fillGroupItems(i, childBinding);
					}
				} else {
					if($this.scheme.multiple == 'auto'){
						var record = null;
						if(childBinding.type == 'array' && childBinding.arrayType.type == 'object'){
							record = childBinding.arrayType.record;
						} else if(childBinding.type == 'object'){
							record = childBinding.record;
						}
						if(record){
							var fieldArr = Object.keys(record);
							for(var i = 0; i < fieldArr.length; i++){
								fillGroupItems(i, childBinding, record[fieldArr[i]]);
							}
						}
					} else {
						fillGroupItems(0, childBinding);
					}
				}
			}
			
			if(!$this.scheme.binding){
				fillGroup($this.binding);
			} else if($this.bindingSelector && $this.bindingSelector.isFilled()){
				fillGroup($this.bindingSelector.getDataScheme());
			} else if($this.binding){
				fillGroup($this.binding);
			}
		},
		
		constructItem: function(){
			this.attr('entry', 'item');
			if(this.scheme.binding){
				this.addClass('hasBinding');
			}
			if(this.options.showHeader && this.scheme.name){
				var header = this.$('<div class="header"></div>');
				this.append(header);
				
				if(this.scheme.optional){
					// show checkbox caption
					header.append(`#dot <div jsb="JSB.Widgets.CheckBox" onchange="{{=this.callbackAttr(function(){  })}}" label="{{=$this.scheme.name}}"></div>`);
				} else {
					// show simple caption
					header.append(this.$('<div class="caption"></div>').text(this.scheme.name));
				}
				
				if(this.scheme.multiple){
					this.addClass('hasMultiple');
					// create append button
					var btnAdd = new Button({
						cssClass: 'roundButton btn10 btnCreate',
						tooltip: 'Добавить значение',
						onClick: function(){
						}
					});
					header.append(btnAdd.getElement());
				}
			}
			var valElt = this.$('<div class="value"></div>');
			this.append(valElt);
			
			function lookupItemEditor(callback){
				if($this.scheme.editor){
					if($this.scheme.editor == 'string'){
						callback(PrimitiveEditor, $this.scheme.options);
					} else if($jsb.isString($this.scheme.editor)){
						$jsb.lookup($this.scheme.editor, function(cls){
							callback(cls, $this.scheme.options);
						});
					} else if($jsb.isFunction($this.scheme.editor)){
						var cls = $this.scheme.editor;
						callback(cls, $this.scheme.options);
					}
				} else {
					callback(PrimitiveEditor, $this.scheme.options);
				}
			}
/*			
			function updateRemoveButtonsState(){
				var valContainers = $this.find('.value > .valueContainer');
				if($this.options.optional){
					valContainers.addClass('removable');
				} else if($this.data.multiple){
					if(valContainers.length > 1){
						valContainers.addClass('removable');
					} else {
						valContainers.removeClass('removable');
					}
				} else {
					valContainers.removeClass('removable');
				}
			}
			
			function collectDataFromEditors(){
				var editors = $this.find('.value > .valueContainer > ._dwp_editor');
				$this.data.value = null;
				editors.each(function(){
					var editor = $this.$(this).jsb();
					var val = editor.getData();
					if($jsb.isObject(val) && val.getValue){	// in case of primitive editor
						val = val.getValue();
					}
					if(!$this.data.value){
						$this.data.value = val;
					} else if(!$jsb.isArray($this.data.value)){
						$this.data.value = [$this.data.value, val];
					} else {
						$this.data.value.push(val);
					}
				});
				if($this.options.onChange){
					$this.options.onChange.call($this, $this.data.value);
				}
			}
*/			
			function appendEditor(valueDesc){
				var opts = {
					tool: $this.tool,
					placeholder: 'Задайте константу',
					onChange: function(){
//						collectDataFromEditors();
					}
				};
				if($this.editorOptions){
					$jsb.merge(opts, $this.editorOptions);
				}
				var editorCls = $this.editorCls;
				var editor = new editorCls(opts);
				editor.addClass('valueEditor');
				$this.renderers.push(editor);
				
				var valContainer = $this.$('<div class="valueContainer"></div>');
				valElt.append(valContainer);
				valContainer.append(editor.getElement());
				
				if($this.scheme.binding == 'field'){
					var bindingSelector = new DataBindingSelector({
						scope: $this.binding,
						value: valueDesc.binding || $this.supply,
						wrapper: $this.wrapper,
						
						onChange: function(){
							valueDesc.binding = this.getDataScheme();
							if(valueDesc.binding){
								valContainer.addClass('isBound');
							}
						}
					});
					valContainer.append('<div class="separator">или</div>');
					valContainer.append(bindingSelector.getElement());
				}
				
				if($this.options.optional || $this.scheme.multiple){
					var removeButton = new Button({
						cssClass: 'roundButton btn10 btnCancel',
						tooltip: 'Удалить',
						onClick: function(){
/*							valContainer.remove();
							removeButton.destroy();
							editor.destroy();
							updateRemoveButtonsState();
							var valContainers = $this.find('.value > .valueContainer');
							if(valContainers.length == 0 && $this.options.onRemove){
								$this.options.onRemove();
							}
							collectDataFromEditors();*/
						}
					});
					
					valContainer.append(removeButton.getElement());
//					updateRemoveButtonsState();
				}
				
				if(JSB.isDefined(valueDesc.value)){
					editor.setData(valueDesc.value, true);
				}
				
				return editor;
			}
			
			if($this.scheme.itemType){
				lookupItemEditor(function(editorCls, options){
					$this.editorCls = editorCls;
					$this.editorOptions = options;
					if(!$this.values.values){
						$this.values.values = [];
					}
					
					if($this.values.values.length == 0){
						// create empty editor
						var value = null;
						if(JSB.isDefined($this.scheme.itemValue)){
							value = $this.scheme.itemValue;
						}
						if(value == '$field' && $this.supply && $this.supply.field){
							value = $this.supply.field;
						}
						$this.values.values[0] = {
							value: value,
							binding: null
						};
						appendEditor($this.values.values[0]);
					} else {
						for(var i = 0; i < $this.values.values.length; i++){
							appendEditor($this.values.values[i]);
						}
					}
				});
			}
			
		},
		
		constructSelect: function(){
			this.attr('entry', 'select');
			this.addClass('hasHeader');
			
			// fill items
			var items = [];
			var val = 0;
			if(!JSB.isNull(this.values.chosenIdx)){
				val = this.values.chosenIdx;
			}
			for(var i = 0; i < this.scheme.items.length; i++ ){
				var item = this.scheme.items[i];
				items.push({
					key: '' + i,
					element: item.name
				});
			}
			
			function setupValue(idx){
				$this.destroyRenderers();
				$this.values.chosenIdx = idx;
				var item = $this.scheme.items[$this.values.chosenIdx];
				if(!$this.values.items){
					$this.values.items = [];
				}
				if(!$this.values.items[idx]){
					$this.values.items[idx] = {};
				}
				var itemRenderer = new $class({
					scheme: item,
					values: $this.values.items[idx],
					wrapper: $this.wrapper,
					tool: $this.tool,
					binding: $this.binding,
					supply: $this.supply,
					showHeader: false,
					onChange: $this.options.onChange
				});
				$this.renderers.push(itemRenderer);
				$this.bodyElt.empty();
				$this.bodyElt.append(itemRenderer.getElement());
			}
			
			var header = this.$('<div class="header"></div>');
			this.append(header);
			
			if(this.scheme.optional){
				// show checkbox caption
				header.append(`#dot <div jsb="JSB.Widgets.CheckBox" onchange="{{=this.callbackAttr(function(){  })}}" label="{{=$this.scheme.name}}"></div>`);
			} else {
				// show simple caption
				header.append(this.$('<div class="caption"></div>').text(this.scheme.name));
			}
			
			if(this.scheme.multiple){
				// create append button
				var btnAdd = new Button({
					cssClass: 'roundButton btn10 btnCreate',
					tooltip: 'Добавить значение',
					onClick: function(){
					}
				});
				header.append(btnAdd.getElement());
			}
			
			this.selector = new ComboBox({
				items: items,
				value: '' + val,
				onChange: function(key){
					var idx = parseInt(key);
					setupValue(idx)
					if($this.options.onChange){
						$this.options.onChange.call($this, idx);
					}
				}
			});
			header.append(this.selector.getElement());
			
			// add value
			this.bodyElt = this.$('<div class="body"></div>');
			this.append(this.bodyElt);
			
			setupValue(val);
		},
	}
}