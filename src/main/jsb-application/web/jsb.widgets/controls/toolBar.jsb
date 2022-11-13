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
	$name:'JSB.Widgets.ToolBar',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		$require: ['css:toolBar.css'],
		$constructor: function(opts){
			$base(opts);
			this.addClass('_dwp_toolBar');
			this.itemContainer = this.$('<ul class="_dwp_tbContainer"></ul>');
			this.append(this.itemContainer);
		},
		
		itemMap: {},
		itemList: [],
		groups: {},
		groupItems: {},
		
		get: function(key){
			return this.itemMap[key];
		},
		
		resolveItem: function(obj){
			var itemObj = {
				checkbox: false,
				allowHover: true,
				group: null
			};
			if(JSB().isPlainObject(obj) && !JSB().isNull(obj.element) && !JSB().isInstanceOf(obj, 'JSB.Widgets.Control')){
				JSB().merge(itemObj, obj);
				if(JSB().isInstanceOf(itemObj.element, 'JSB.Widgets.Control')){
					itemObj.obj = itemObj.element;
					itemObj.element = itemObj.element.getElement();
				} else if(JSB().isNull(itemObj.key) && JSB().isString(itemObj.element)){
					itemObj.key = itemObj.element;
				}
			} else if(JSB().isInstanceOf(obj, 'JSB.Widgets.Control')){
				itemObj.element = obj.getElement();
				itemObj.obj = obj;
			} else if(JSB().isString(obj)){
				itemObj.element = obj;
				itemObj.key = obj;
			} else {
				itemObj.element = this.$(obj);
				itemObj.key = itemObj.element.text();
			}
			
			return itemObj;
		},
		
		wrapItem: function(itemObj){
			var self = this;
			if(JSB().isNull(itemObj.element)){
				return;
			}
			var item = itemObj.element;
			
			var itemWrapper = this.$('<li class="_dwp_toolBarItem"></li>');
			if(itemObj.allowHover){
				itemWrapper.addClass('allowHover');
			}
			if(itemObj.checkbox){
				itemWrapper.addClass('checkbox');
			}
			if(itemObj.group){
				itemWrapper.addClass('group');
			}
			
			if(!JSB().isNull(itemObj.key)){
				itemWrapper.attr("key", itemObj.key);	
			}
			
			if(itemObj.cssClass){
				itemWrapper.addClass(itemObj.cssClass);
			}
			
			if(itemObj.tooltip){
				itemWrapper.attr('title', itemObj.tooltip);
			}
			
			itemWrapper.append(item);
			
			return itemWrapper;
		},
		
		_createItem: function(item){
			var self = this;
			var itemObj = this.resolveItem(item);
			var itemWrapper = this.wrapItem(itemObj);
			itemObj.wrapper = itemWrapper; 
			this.itemList.push(itemObj);
			if(!JSB().isNull(itemObj.key)){
			    this.itemMap[itemObj.key] = itemObj;
			}
			if(itemObj.disabled){
				this.enableItem(itemObj.key, false);
			}
			if(itemObj.checkbox || itemObj.group){
				this.checkItem(itemObj.key, itemObj.checked);
			}
			if(itemObj.group){
				if( !this.groups[itemObj.group] ){
					this.groups[itemObj.group] = [];
				}
				this.groups[itemObj.group].push(itemObj);
			}
			itemObj.wrapper.click(function(evt){
				if(itemObj.disabled){
					return;
				}
				if(itemObj.checkbox){
					self.checkItem(itemObj.key, !self.isChecked(itemObj.key));
					if(itemObj.click && JSB().isFunction(itemObj.click)){
						itemObj.click.call(this, evt, itemObj.key, itemObj);
					}
					if(itemObj.onClick && JSB().isFunction(itemObj.onClick)){
						itemObj.onClick.call(this, evt, itemObj.key, itemObj);
					}
				} else if(itemObj.group){
					if(!self.isChecked(itemObj.key)){
						self.checkItem(itemObj.key, true);
						if(itemObj.click && JSB().isFunction(itemObj.click)){
							itemObj.click.call(this, evt, itemObj.key, itemObj);
						}
						if(itemObj.onClick && JSB().isFunction(itemObj.onClick)){
							itemObj.onClick.call(this, evt, itemObj.key, itemObj);
						}
					}
				} else if(itemObj.click && JSB().isFunction(itemObj.click)){
					itemObj.click.call(this, evt, itemObj.key, itemObj);
				} else if(itemObj.onClick && JSB().isFunction(itemObj.onClick)){
					itemObj.onClick.call(this, evt, itemObj.key, itemObj);
				}
			});
			
			return itemObj;
		},

		addItem: function(item){
			var itemObj = this._createItem(item);
			this.itemContainer.append(itemObj.wrapper);
			return itemObj;
		},
		
		clear: function(){
			this.itemMap = {};
			this.itemList = [];
			this.groups = {};
			this.groupItems = {};
			this.itemContainer.empty();
		},
		
		insertItem: function(item, beforeKey, afterKey){
			var itemObj = this._createItem(item);
			var beforeItem = null, afterItem = null;
			if(beforeKey){
				beforeItem = this.itemMap[beforeKey];
			}
			if(afterKey){
				afterItem = this.itemMap[afterKey];
			}
			if(beforeItem){
				itemObj.wrapper.insertBefore(beforeItem.wrapper);
			} else if(afterItem){
				itemObj.wrapper.insertAfter(afterItem.wrapper);
			}
			
			return itemObj;
		},
		
		addSeparator: function(desc){
			var itemWrapper = this.$('<li class="_dwp_toolBarSeparator"></li>');
			var itemObj = {
				wrapper: itemWrapper
			};
			this.itemContainer.append(itemWrapper);
			if(desc){
				$jsb.merge(itemObj, desc);
				if(desc.key){
					itemWrapper.attr("key", desc.key);	
				}
				if(desc.cssClass){
					itemWrapper.addClass(desc.cssClass);
				}
			}
			
			if(itemObj.key){
				 this.itemMap[itemObj.key] = itemObj;
				 this.itemList.push(itemObj);
			}
			
			return itemObj;
		},
		
		checkItem: function(key, b){
			var itemObj = this.itemMap[key];
			if(b){
				itemObj.wrapper.addClass('checked');
				if(itemObj.group){
					this.groupItems[itemObj.group] = itemObj.key;
					// uncheck all other items in group
					for(var i in this.groups[itemObj.group]){
						var curObj = this.groups[itemObj.group][i];
						if(curObj == itemObj){
							continue;
						}
						this.checkItem(curObj.key, false);
					}
				}
			} else {
				itemObj.wrapper.removeClass('checked');
			}
		},
		
		getGroupSelection: function(group){
			return this.groupItems[group];
		},
		
		isChecked: function(key){
			var itemObj = this.itemMap[key];
			if(!itemObj || !itemObj.wrapper){
				return false;
			}
			return itemObj.wrapper.is('.checked');
		},
		
		enableItem: function(key, b){
			var itemObj = this.itemMap[key];
			if(!itemObj || !itemObj.wrapper){
				return;
			}
			if(b){
				itemObj.disabled = false;
				itemObj.wrapper.removeClass('disabled');
			} else {
				itemObj.disabled = true;
				itemObj.wrapper.addClass('disabled');
			}
			if(JSB().isInstanceOf(itemObj.obj, 'JSB.Widgets.Button')){
				itemObj.obj.getElement().css('opacity', 1);
				itemObj.obj.enable(b);
			}
		},
		
		showItem: function(key, b){
			var itemObj = this.itemMap[key];
			if(!itemObj || !itemObj.wrapper){
				return;
			}
			if(b){
				itemObj.wrapper.removeClass('hidden');
			} else {
				itemObj.wrapper.addClass('hidden');
			}

		},
		
		getItems: function(){
			return this.itemList;
		}
	}
}