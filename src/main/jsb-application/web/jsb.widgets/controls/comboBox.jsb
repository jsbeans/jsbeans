/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.Widgets.ComboBox',
	$parent: 'JSB.Widgets.Control',
	$require: {
		Editor: 'JSB.Widgets.PrimitiveEditor',
		ToolManager: 'JSB.Widgets.ToolManager',
		DroplistTool: 'JSB.Widgets.DroplistTool',
		DropTreeTool: 'JSB.Widgets.DropTreeTool'
	},
	$client: {
		$require: ['css:comboBox.css'],
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('_dwp_comboBox');
			this.init();
		},
		
		options: {
			dropDown: true,
			items: [],
			value: '',
			enabled: true,
			tree: false,
			listLazyLoad: false,
			readonly: false,
			placeholder: 'Выберите из списка',
			onChange: function(key, obj){},
			onEditorChange: function(value, evt){}
		},
		
		init: function(){
			var self = this;
			this.items = [];
			this.itemMap = {};
			this.initialized = false;
			
			var items = this.options.items;
			if(JSB.isFunction(items)){
				items = items.call(this);
			}
			if(!JSB.isArray(items)){
				items = [items];
			}
			for(var i = 0; i < items.length; i++){
				this.addItem(items[i]);
			}
			
			if(this.options.readonly) {
				this.options.enabled = false;
				this.addClass('readonly');
			}
			
			if(this.options.dropDown){
				// create dropdown list
				this.addClass('_dwp_dropDown');
				this.getElement().append('<div class="_dwp_cbContainer empty"></div>');
				this.getElement().append('<div class="_dwp_dropBtn"></div>');

				this.getElement().click(function(evt){
					if(!$this.options.enabled) return;
					if($this.options.readonly) return;
					$this.onDropDownClick();
				});
			} else {
				// create editable
				this.addClass('_dwp_editable');
				this.editor = new Editor({
					placeholder: this.options.placeholder,
					onChange: this.options.onEditorChange,
					readonly: this.options.readonly
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
			this.initialized = true;
		},
		
		resolveItem: function(obj){
			var itemObj = {};
			if(JSB().isPlainObject(obj) && !JSB().isNull(obj.element)){
				JSB().merge(itemObj, obj);
				if(JSB().isInstanceOf(itemObj.element, 'JSB.Widgets.Control')){
					itemObj.element = itemObj.element.getElement(); 
				} else if(JSB().isNull(itemObj.key) && JSB().isString(itemObj.element)){
					itemObj.key = itemObj.element;
				}
			} else if(JSB().isString(obj)){
				itemObj.element = obj;
				itemObj.key = obj;
			} else if(JSB().isInstanceOf(obj, 'JSB.Widgets.Control')){
				itemObj.element = obj.getElement();
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
			var toolMgr = JSB().getInstance('JSB.Widgets.ToolManager');
			if(this.autoBox && this.autoBox.isVisible()){
				if(JSB().isNull(list) || list.length == 0){
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
			if(!JSB().isNull(list) && list.length > 0){
				this.autoBox = toolMgr.activate({
					id: this.options.tree ? '_dwp_dropTreeTool' :
					    this.options.listLazyLoad ? '_dwp_droplistLazyLoadTool' : '_dwp_droplistTool',
					key: this.options.key || 'cb_' + $this.getId(),
					cmd: 'show',
					toolOpts: this.options.toolOpts,
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
			
			function _fillMap(valObj){
				$this.itemMap[valObj.key] = valObj;
				if(JSB.isArray(valObj.children)){
					for(var i = 0; i < valObj.children.length; i++){
						var chObj = $this.resolveItem(valObj.children[i]);
						_fillMap(chObj);
					}
				}	
			}
			_fillMap(itemObj);
			
		},
		
		setItems: function(items){
			this.clear();
			if(JSB.isFunction(items)){
				items = items.call(this);
			}
			if(!JSB.isArray(items)){
				items = [items];
			}
			for(var i = 0; i < items.length; i++){
				this.addItem(items[i]);
			}
			if(this.selectedObject && this.selectedObject.key){
				if(this.itemMap[this.selectedObject.key]){
					this.selectedObject = this.itemMap[this.selectedObject.key];
				} else {
					this.setData(null);
				}
			}
		},
		
		setData: function(val){
			if(this.options.dropDown){
				if(!val){
					this.selectedObject = null;
					var cbContainerElt = this.find('> ._dwp_cbContainer');
					cbContainerElt.empty();
					cbContainerElt.addClass('empty');
					this.getElement().removeAttr('value');
					if(!JSB().isNull(this.options.onChange) && this.initialized){
						this.options.onChange.call($this, null, null);
					}
					return;
				}
				var valObj = this.resolveItem(val);
				// check the specified data is existed in drop list
				if(JSB().isNull(this.selectedObject) || this.selectedObject.key != valObj.key) {
					if(this.itemMap[valObj.key]){
						valObj = this.itemMap[valObj.key];
					}
					var dt = valObj.element;
					if(dt){
						if(!JSB.isString(dt)){
							dt = $this.$(valObj.element).clone();
						}
						this.find('> ._dwp_cbContainer').empty().append(dt);
						this.find('> ._dwp_cbContainer').removeClass('empty');
						this.selectedObject = valObj;
						this.getElement().attr('value', valObj.key);
					} else {
						this.find('> ._dwp_cbContainer').empty();
						this.find('> ._dwp_cbContainer').addClass('empty');
						this.selectedObject = null;
						this.getElement().removeAttr('value');
					}
					
					if(!JSB().isNull(this.options.onChange) && this.initialized){
						this.options.onChange.call($this, valObj ? valObj.key : null, valObj);
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
			} else {
				var valObj = this.resolveItem(val);
				var val = valObj.element;
				if(JSB.isObject(val) || JSB.isArray(val)){
					val = valObj.key;
				}
				if(this.editor.getData().getValue() != val){
					this.editor.setData(val);
					if(!JSB().isNull(this.options.onChange) && this.initialized){
						this.options.onChange.call($this, valObj.key, valObj);
					}
				}
				this.getElement().attr('value', valObj.key);
			}
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
}