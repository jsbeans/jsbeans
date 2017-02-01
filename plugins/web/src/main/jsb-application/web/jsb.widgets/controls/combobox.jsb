JSB({
	name:'JSB.Widgets.ComboBox',
	parent: 'JSB.Widgets.Control',
	require: {
		'JSB.Widgets.PrimitiveEditor': 'Editor',
		'JSB.Widgets.ToolManager': 'ToolManager',
		'JSB.Widgets.DroplistTool': 'DroplistTool'
	},
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('combobox.css');
			this.addClass('_dwp_comboBox');
			this.init();
		},
		
		options: {
			dropDown: true,
			items: [],
			value: '',
			enabled: true,
			onChange: function(key, obj){}
		},
		init: function(){
			var self = this;
			this.items = [];
			this.itemMap = {};
			if(JSO().isArray(this.options.items)){
				for(var i in this.options.items){
					this.addItem(this.options.items[i]);
				}
			}
			if(this.options.dropDown){
				// create dropdown list
				this.addClass('_dwp_dropDown');
				this.getElement().click(function(evt){
					if(!self.options.enabled) return;
					self.onDropDownClick();
				});
			} else {
				// create editable
				this.addClass('_dwp_editable');
				this.editor = new self.Editor({
					placeholder: this.options.placeholder
				});
				this.append(this.editor);
				this.ddBtn = this.$('<div class="_dwp_dropBtn"><div class="_dwp_dropIcon"></div></div>');
				this.append(this.ddBtn);
				this.ddBtn.click(function(evt){
					if(!self.options.enabled) return;
					self.onDropDownClick();
				});
			}
			if(this.options.value){
				this.setData(this.options.value);
			}
			
			this.enable(this.options.enabled);
		},
		
		resolveItem: function(obj){
			var itemObj = {
			};
			if(JSO().isPlainObject(obj) && !JSO().isNull(obj.element)){
				JSO().merge(itemObj, obj);
				if(JSO().isInstanceOf(itemObj.element, 'JSB.Widgets.Control')){
					itemObj.element = itemObj.element.getElement(); 
				} else if(JSO().isNull(itemObj.key) && JSO().isString(itemObj.element)){
					itemObj.key = itemObj.element;
				}
			} else if(JSO().isInstanceOf(obj, 'JSB.Widgets.Control')){
				itemObj.element = obj.getElement();
			} else if(JSO().isString(obj)){
				itemObj.element = obj;
				itemObj.key = obj;
			} else {
				itemObj.element = this.$(obj);
				itemObj.key = itemObj.element.text();
			}
			
			return itemObj;
		},

		
		onDropDownClick: function(){
			this.showDropList(this.items);
		},
		
		showDropList: function(list){
			var self = this;
			var toolMgr = JSO().getInstance('JSB.Widgets.ToolManager');
			if(!JSO().isNull(this.autoBox) && this.autoBox.isVisible()){
				if(JSO().isNull(list) || list.length == 0){
					this.autoBox.close();
					this.autoBox = null;
				} else {
					this.autoBox.setData({data: list, callback: function(val){
						self.changed = true;
						self.setData(val);
					}});
				}
				return;
			}
			if(!JSO().isNull(list) && list.length > 0){
				this.autoBox = toolMgr.activate({
					id: '_dwp_droplistTool',
					cmd: 'show',
					data: list,
					scope: this,
					target: {
						selector: this.getElement(),
						dock: 'bottom'
					},
					callback: function(val){
						self.changed = true;
						var data = val;
						if(self.itemMap[val]){
							data = self.itemMap[val];
						}
						self.setData(data);
					}
				});
			}

		},
		
		addItem: function(item){
			var itemObj = this.resolveItem(item);
			this.items.push(itemObj);
			this.itemMap[itemObj.key] = itemObj;
		},
		
		setItems: function(items){
			this.clear();
			if(!JSB.isArray(items)){
				items = [items];
			}
			for(var i = 0; i < items.length; i++){
				this.addItem(items[i]);
			}
		},
		
		setData: function(val){
			var valObj = this.resolveItem(val);
			if(this.options.dropDown){
				// check the specified data is existed in drop list
				if(JSO().isNull(this.selectedObject) || this.selectedObject.key != valObj.key) {
					if(this.itemMap[valObj.key]){
						valObj = this.itemMap[valObj.key];
					}
					this.getElement().empty();
					var innerElt = this.$('<div class="_dwp_cbContainer"></div>');
					innerElt.append(valObj.element);
					this.getElement().append(innerElt);
					this.getElement().append('<div class="_dwp_dropBtn"></div>');
					this.selectedObject = valObj;
					if(!JSO().isNull(this.options.onChange)){
						this.options.onChange(valObj.key, valObj);
					}
				}
			} else {
				var val = valObj.element;
				if(JSB.isObject(val) || JSB.isArray(val)){
					val = valObj.key;
				}
				if(this.editor.getData().getValue() != val){
					this.editor.setData(val);
					if(!JSO().isNull(this.options.onChange)){
						this.options.onChange(valObj.key, valObj);
					}
				}
			}
			this.getElement().attr('value', valObj.key);
		},
		
		getItems: function(){
			return this.items;
		},
		
		getData: function(){
			if(this.options.dropDown){
				return this.selectedObject
			} else {
				return this.editor.getData().getValue();
			}
		},
		
		clear: function(){
			this.items = [];
			this.itemMap = {};
		},
		
		enable: function(b){
			this.options.enabled = b;
			if(b) 
				this.removeClass('disabled');
			else 
				this.addClass('disabled');
		}
	}
});
