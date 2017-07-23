{
	$name: 'JSB.DataCube.Widgets.WidgetSchemeRenderer',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Widgets.PrimitiveEditor',
	           'JSB.Widgets.ComboBox',
	           'JSB.Widgets.Button',
	           'JSB.Widgets.ToolManager',
	           'JSB.DataCube.Widgets.DataBindingSelector',
	           'JSB.DataCube.Widgets.EmbeddedWidgetSelector'],
	
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
			if(this.scheme.name){
				this.values.name = this.scheme.name;
			}
			if(this.scheme.key){
				this.values.key = this.scheme.key;
			}
			if(this.scheme.type){
				this.values.type = this.scheme.type;
			}
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
		
		getValues: function(){
			return this.values;
		},
		
		update: function(){
			this.getElement().empty();
			if(this.options.outletHeader){
				this.options.outletHeader.empty();
			}
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
			case 'widget':
				this.constructWidget();
				break;
			}
		},
		
		constructGroup: function(){
			this.attr('entry', 'group');
			if(this.scheme.binding){
				this.addClass('hasBinding');
			}
			
			if(!$this.values.groups){
				$this.values.groups = [];
			}
			
			function updateGroupUsedVisibility(){
				if($this.values.used){
					$this.addClass('used');	
				} else {
					$this.removeClass('used');
				}
			}

			var header = null;
			if(this.options.showHeader && this.scheme.name){
				this.addClass('hasHeader');
				header = this.$('<div class="header"></div>');
				this.append(header);
				
				if(this.scheme.optional){
					// show checkbox caption
					header.append(`#dot <div jsb="JSB.Widgets.CheckBox" class="caption" onchange="{{=this.callbackAttr(function(checked){ $this.values.used = checked; updateGroupUsedVisibility(); })}}" label="{{=$this.scheme.name}}" checked="{{=$this.values.used}}"></div>`);
				} else {
					// show simple caption
					header.append(this.$('<div class="caption"></div>').text(this.scheme.name));
					this.values.used = true;
				}
			} else {
				this.values.used = true;
				header = this.options.outletHeader;
			}
			
			updateGroupUsedVisibility();

			if(header){
				if((this.scheme.binding == 'field') || ((this.scheme.binding == 'array' || this.scheme.binding == 'record') && !this.binding)){
					this.bindingSelector = new DataBindingSelector({
						scope: $this.binding,
						value: $this.values.binding,
						wrapper: this.wrapper,
						onChange: function(){
							var binding = this.getDataScheme();
							if(!binding){
								$this.values.binding = null;
								$this.update();
								return;
							}
							if(binding.source){
								$this.values.binding = binding;
							} else {
								$this.values.binding = $this.wrapper.getBindingRelativePath($this.binding, binding);
							}
							 
							fillGroup(binding);
						}
					});
					header.append(this.bindingSelector.getElement());
					header.removeClass('hidden');

				}
				if(this.scheme.multiple){
					this.addClass('hasMultiple');
					// create append button
					var btnAdd = new Button({
						cssClass: 'roundButton btn10 btnCreate',
						tooltip: 'Добавить запись',
						enabled: false,
						onClick: function(){
							fillGroupItems($this.values.groups.length, $this.values.binding || $this.binding);
							updateGroupButtons();
						}
					});
					header.append(btnAdd.getElement());
					header.removeClass('hidden');

				}
			}
			
			////////
			
			function updateGroupButtons(){
				if(!$this.scheme.multiple){
					return;
				}
				if(header){
					var btnAdd = header.find('> .btnCreate').jsb();
					if(btnAdd){
						btnAdd.enable($this.values.groups.length > 0);
					}
				}
				var btns = $this.bodyElt.find('> .items > .btnDelete');
				for(var i = 0; i < btns.length; i++){
					$this.$(btns.get(i)).jsb().enable(btns.length > 1);
				}
			}
			
			function reorderGroups(){
				var groups = $this.bodyElt.find('> .items');
				for(var i = 0; i < groups.length; i++){
					$this.$(groups.get(i)).attr('idx', i);
				}
			}
			
			function reorderValues(){
				var groups = $this.bodyElt.find('> .items');
				for(var i = 0; i < groups.length; i++){
					var oldIdx = parseInt($this.$(groups.get(i)).attr('idx'));
					if(oldIdx == i){
						continue;
					}
					$this.$(groups.get(i)).attr('idx', i);
					if(oldIdx < i){
						continue;
					}
					var gg = $this.values.groups[oldIdx];
					$this.values.groups.splice(oldIdx, 1);
					$this.values.groups.splice(i, 0, gg);
				}
			}

			
			function fillGroupItems(groupIdx, binding, supply){
				var ul = $this.$('<div class="items"></div>');
				ul.attr('idx', groupIdx);
				$this.bodyElt.append(ul);
				if(!$this.values.groups[groupIdx]){
					$this.values.groups[groupIdx] = {
						items: []
					};
				}
				var groupValues = $this.values.groups[groupIdx];
				
				if($this.scheme.multiple){
					var removeButton = new Button({
						cssClass: 'roundButton btn10 btnDelete',
						tooltip: 'Удалить запись',
						onClick: function(evt){
							var gIdx = parseInt(ul.attr('idx'));
							if(JSB.isNull(gIdx)){
								return;
							}
							$this.values.groups.splice(gIdx, 1);
							ul.remove();
							reorderGroups();
							updateGroupButtons();
						}
					});
					ul.append(removeButton.getElement());
				}
				
				function addItem(item, values){
					var liElt = $this.$('<div class="item"></div>');
					var itemRenderer = new $class({
						scheme: item,
						values: values,
						wrapper: $this.wrapper,
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
					if(!groupValues.items[i]){
						groupValues.items[i] = {};
					}
					addItem(item, groupValues.items[i]);
				}

			}
			
			function fillGroup(childBinding){
				$this.bodyElt.empty();
				if(!$this.values.binding && $this.scheme.binding){
					if(!childBinding || childBinding.source){
						$this.values.binding = childBinding;
					} else {
						$this.values.binding = $this.wrapper.getBindingRelativePath($this.binding, childBinding);
					}
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
				updateGroupButtons();
			}
			
			//////
			
			this.bodyElt = this.$('<div class="body"></div>');
			this.append(this.bodyElt);
			if(this.scheme.multiple){
				this.bodyElt.sortable({
					update: function(evt, ui){
						reorderValues();
					}
				});
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
			
			function updateItemUsedVisibility(){
				if($this.values.used){
					$this.addClass('used');	
				} else {
					$this.removeClass('used');
				}
			}

			var header = null;
			if(this.options.showHeader && this.scheme.name){
				header = this.$('<div class="header"></div>');
				this.append(header);
				
				if(this.scheme.optional){
					// show checkbox caption
					header.append(`#dot <div jsb="JSB.Widgets.CheckBox" class="caption" onchange="{{=this.callbackAttr(function(checked){ $this.values.used = checked; updateItemUsedVisibility(); })}}" label="{{=$this.scheme.name}}" checked="{{=$this.values.used}}"></div>`);
				} else {
					// show simple caption
					header.append(this.$('<div class="caption"></div>').text(this.scheme.name));
					this.values.used = true;
				}
				
			} else {
				this.values.used = true;
				header = this.options.outletHeader;
			}

			updateItemUsedVisibility();
			
			var valElt = this.$('<div class="value"></div>');
			this.append(valElt);
			
			function lookupItemEditor(callback){
				if($this.scheme.editor){
					if($this.scheme.editor == 'string'){
						callback(PrimitiveEditor, $this.scheme.options);
					} else if($this.scheme.editor == 'none'){
						callback(null, null);
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
			
			function reorderItemValues(){
				var contElts = valElt.find('> .valueContainer');
				for(var i = 0; i < contElts.length; i++){
					$this.$(contElts.get(i)).attr('idx', i);
				}
			}
			
			function updateItemButtons(){
				if(!$this.scheme.multiple){
					return;
				}
				if(header){
					var btnAdd = header.find('> .btnCreate').jsb();
					if(btnAdd){
						btnAdd.enable($this.values.values.length > 0);
					}
				}
				var btns = valElt.find('> .valueContainer > .btnDelete');
				for(var i = 0; i < btns.length; i++){
					$this.$(btns.get(i)).jsb().enable(btns.length > 1);
				}
			}


			function setupEditor(idx){
				var valueDesc = $this.values.values[idx];
				var editorCls = $this.editorCls;

				var valContainer = $this.$('<div class="valueContainer"></div>');
				valContainer.attr('idx', idx);
				valElt.append(valContainer);
				
				if(editorCls){
					var editor = new editorCls(JSB.merge({
						placeholder: 'Задайте константу'
					},$this.editorOptions || {}, {
						onChange: function(val){
							valueDesc.value = val;
						}
					}));
					editor.addClass('valueEditor');
					$this.renderers.push(editor);
					valContainer.append(editor.getElement());
				}
				
				if($this.scheme.binding == 'field'){
					var bindingSelector = new DataBindingSelector({
						scope: $this.binding,
						value: valueDesc.binding || $this.supply,
						wrapper: $this.wrapper,
						
						onChange: function(){
							var binding = this.getDataScheme();
							if(!binding){
								valueDesc.binding = null;
								valContainer.removeClass('isBound');
								return;
							}
							if(binding.source){
								valueDesc.binding = binding;
							} else {
								valueDesc.binding = $this.wrapper.getBindingRelativePath($this.binding, binding);
							}
							 
							if(valueDesc.binding){
								valContainer.addClass('isBound');
							} else {
								valContainer.removeClass('isBound');
							}
						}
					});
					if(editorCls){
						valContainer.append('<div class="separator">или</div>');
					}
					valContainer.append(bindingSelector.getElement());
					if(bindingSelector.isFilled()){
						var binding = bindingSelector.getDataScheme();
						if(binding.source){
							valueDesc.binding = binding;
						} else {
							valueDesc.binding = $this.wrapper.getBindingRelativePath($this.binding, binding);
						}
					}
					if(valueDesc.binding){
						valContainer.addClass('isBound');
					}
				}
				
				if($this.scheme.multiple){
					var removeButton = new Button({
						cssClass: 'roundButton btn10 btnDelete',
						tooltip: 'Удалить значение',
						onClick: function(){
							var idx = parseInt(valContainer.attr('idx'));
							$this.values.values.splice(idx, 1);
							valContainer.remove();
							reorderItemValues();
							updateItemButtons();
						}
					});
					
					valContainer.append(removeButton.getElement());
				}
				
				if(JSB.isDefined(valueDesc.value) && editor){
					editor.setData(valueDesc.value, true);
				}
				
				return editor;
			}
			
			if(header){
				if(this.scheme.multiple){
					this.addClass('hasMultiple');
					// create append button
					var btnAdd = new Button({
						cssClass: 'roundButton btn10 btnCreate',
						tooltip: 'Добавить значение',
						onClick: function(){
							$this.values.values.push({
								value: '',
								binding: null
							});
							setupEditor($this.values.values.length - 1);
							updateItemButtons();
						}
					});
					header.append(btnAdd.getElement());
					header.removeClass('hidden');
				}
			}

			
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
					if(value == '$field'){
						value = '';
					}
					$this.values.values[0] = {
						value: value,
						binding: null
					};
					setupEditor(0);
				} else {
					for(var i = 0; i < $this.values.values.length; i++){
						setupEditor(i);
					}
				}
				updateItemButtons();
			});
			
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
			
			function updateSelectUsedVisibility(){
				if($this.values.used){
					$this.addClass('used');	
				} else {
					$this.removeClass('used');
				}
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
				$this.outletHeader.empty();
				var itemRenderer = new $class({
					scheme: item,
					values: $this.values.items[idx],
					wrapper: $this.wrapper,
					binding: $this.binding,
					supply: $this.supply,
					showHeader: false,
					outletHeader: $this.outletHeader,
					onChange: $this.options.onChange
				});
				$this.renderers.push(itemRenderer);
				$this.bodyElt.empty();
				$this.bodyElt.append(itemRenderer.getElement());
				$this.bodyElt.attr('item', item.type);

			}
			
			var header = null;
			if(this.options.showHeader && this.scheme.name){
				header = this.$('<div class="header"></div>');
				this.append(header);
				
				if(this.scheme.optional){
					// show checkbox caption
					header.append(`#dot <div jsb="JSB.Widgets.CheckBox" class="caption" onchange="{{=this.callbackAttr(function(checked){ $this.values.used = checked; updateSelectUsedVisibility(); })}}" label="{{=$this.scheme.name}}" checked="{{=$this.values.used}}"></div>`);
				} else {
					// show simple caption
					header.append(this.$('<div class="caption"></div>').text(this.scheme.name));
					this.values.used = true;
				}
			} else {
				header = this.options.outletHeader;
				this.values.used = true;
			}
			
			updateSelectUsedVisibility();
			
			if(header){
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
				header.removeClass('hidden');
				this.outletHeader = this.$('<div class="header hidden"></div>');
				header.after(this.outletHeader);
			}
			// add value
			this.bodyElt = this.$('<div class="body"></div>');
			this.append(this.bodyElt);
			
			setupValue(val);
		},
		
		constructWidget: function(){
			this.attr('entry', 'widget');
			if(this.scheme.binding){
				this.addClass('hasBinding');
			}
			
			function updateWidgetUsedVisibility(){
				if($this.values.used){
					$this.addClass('used');	
				} else {
					$this.removeClass('used');
				}
			}

			var header = null;
			if(this.options.showHeader && this.scheme.name){
				header = this.$('<div class="header"></div>');
				this.append(header);
				
				if(this.scheme.optional){
					// show checkbox caption
					header.append(`#dot <div jsb="JSB.Widgets.CheckBox" class="caption" onchange="{{=this.callbackAttr(function(checked){ $this.values.used = checked; updateWidgetUsedVisibility(); })}}" label="{{=$this.scheme.name}}" checked="{{=$this.values.used}}"></div>`);
				} else {
					// show simple caption
					header.append(this.$('<div class="caption"></div>').text(this.scheme.name));
					this.values.used = true;
				}
			} else {
				this.values.used = true;
				header = this.options.outletHeader;
			}
			
			updateWidgetUsedVisibility();
			
			function fillWidgetPane(){
				var bodyElt = $this.find('> .body');
				if(!$this.values.values){
					$this.values.values = {};
				}
				
				JSB.lookup($this.values.widget.jsb, function(wCls){
					var wScheme = $this.wrapper.extractWidgetScheme(wCls.jsb);
					var wSchemeRenderer = new $class({
						scheme: wScheme,
						values: $this.values.values,
						wrapper: $this.wrapper,
						binding: $this.binding,
						supply: $this.supply,
						onChange: $this.options.onChange
					});
					$this.renderers.push(wSchemeRenderer);
					bodyElt.empty().append(wSchemeRenderer.getElement());
				});
			}
			
			if(header){
				this.widgetSelector = new EmbeddedWidgetSelector({
					value: $this.values.widget,
					wrapper: this.wrapper,
					onChange: function(){
						$this.values.widget = this.getDescriptor();
						if(!$this.values.widget){
							$this.update();
							return;
						}
						fillWidgetPane();
					}
				});
				header.append(this.widgetSelector.getElement());
				header.removeClass('hidden');
			}
			
			var bodyElt = this.$('<div class="body"></div>');
			this.append(bodyElt);
			if($this.values.widget){
				fillWidgetPane();
			}
		}
	}
}