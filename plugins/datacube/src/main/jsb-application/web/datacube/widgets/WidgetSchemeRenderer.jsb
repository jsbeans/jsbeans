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
			if(this.options.showHeader && this.scheme.name){
				this.addClass('hasHeader');
				var header = this.$('<div class="header"></div>');
				this.append(header);
				
				if(this.scheme.optional){
					// show checkbox caption
					header.append(`#dot <div jsb="JSB.Widgets.CheckBox" onchange="{{=this.callbackAttr(function(){  })}}" label="{{=$this.scheme.name}}"></div>`);
				} else {
					// show simple caption
					header.append(this.$('<div class="caption"></div>').text(this.scheme.name));
				}
				if(this.scheme.binding){
					if(this.scheme.binding == 'array'){
						this.bindingSelector = new DataBindingSelector({
							scheme: this.scheme,
							values: this.values,
							wrapper: this.wrapper,
							onChange: function(){
								$this.binding = $this.bindingSelector.getDataScheme();
								fillGroup();
							}
						});
						header.append(this.bindingSelector.getElement());
					} 
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

			
			function fillGroupItems(groupIdx, binding){
				if(!binding){
					binding = $this.binding;
				}
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
						binding: binding,
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
			
			function fillGroup(){
				if(!$this.values.binding && $this.scheme.binding){
					$this.values.binding = $this.binding;
				}
				if($this.values && $this.values.groups && $this.values.groups.length > 0){
					for(var i = 0; i < $this.values.groups.length; i++){
						fillGroupItems(i);
					}
				} else {
					if($this.scheme.multiple == 'auto'){
						var record = null;
						if($this.binding.type == 'array' && $this.binding.arrayType.type == 'object'){
							record = $this.binding.arrayType.record;
						} else if($this.binding.type == 'object'){
							record = $this.binding.record;
						}
						if(record){
							var fieldArr = Object.keys(record);
							for(var i = 0; i < fieldArr.length; i++){
								fillGroupItems(i, record[fieldArr[i]]);
							}
						}
					} else {
						fillGroupItems(0);
					}
				}
			}
			
			if(!$this.scheme.binding || $this.bindingSelector.isFilled()){
				fillGroup();
			}
			
		},
		
		constructItem: function(){
			this.attr('entry', 'item');
			if(this.options.showHeader){
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
			function appendEditor(value){
				var opts = {
					tool: $this.tool,
					onChange: function(){
						collectDataFromEditors();
					}
				};
				if($this.editorOptions){
					$jsb.merge(opts, $this.editorOptions);
				}
				var editorCls = $this.editorCls;
				var editor = new editorCls(opts);
				$this.renderers.push(editor);
				
				var valContainer = $this.$('<div class="valueContainer"></div>');
				valElt.append(valContainer);
				valContainer.append(editor.getElement());
				
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
				
				if(value){
					editor.setData(value, true);
				}
				
				return editor;
			}
			
			if($this.scheme.editor){
				lookupItemEditor(function(editorCls, options){
					$this.editorCls = editorCls;
					$this.editorOptions = options;
					var values = $this.values.values;
					if(!values){
						values = [];
					}
					if(!$jsb.isArray(values)){
						values = [values];
					}
					if(values.length == 0){
						// create empty editor
						var value = null;
						if($this.scheme.value){
							value = $this.scheme.value;
						}
						if(value == '$field' && $this.binding && $this.binding.field){
							value = $this.binding.field;
						}
						appendEditor(value);
					} else {
						for(var i = 0; i < values.length; i++){
							appendEditor(values[i]);
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