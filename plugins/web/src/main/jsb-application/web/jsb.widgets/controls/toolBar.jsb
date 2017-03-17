{
	$name:'JSB.Widgets.ToolBar',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('toolBar.css');
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
			if(JSO().isPlainObject(obj) && !JSO().isNull(obj.element) && !JSO().isInstanceOf(obj, 'JSB.Widgets.Control')){
				JSO().merge(itemObj, obj);
				if(JSO().isInstanceOf(itemObj.element, 'JSB.Widgets.Control')){
					itemObj.obj = itemObj.element;
					itemObj.element = itemObj.element.getElement();
				} else if(JSO().isNull(itemObj.key) && JSO().isString(itemObj.element)){
					itemObj.key = itemObj.element;
				}
			} else if(JSO().isInstanceOf(obj, 'JSB.Widgets.Control')){
				itemObj.element = obj.getElement();
				itemObj.obj = obj;
			} else if(JSO().isString(obj)){
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
			if(JSO().isNull(itemObj.element)){
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
			
			if(!JSO().isNull(itemObj.key)){
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

		addItem: function(item){
			var self = this;
			var itemObj = this.resolveItem(item);
			var itemWrapper = this.wrapItem(itemObj);
			itemObj.wrapper = itemWrapper; 
			this.itemContainer.append(itemWrapper);
			this.itemList.push(itemObj);
			if(!JSO().isNull(itemObj.key)){
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
					if(itemObj.click && JSO().isFunction(itemObj.click)){
						itemObj.click.call(this, evt, itemObj.key, itemObj);
					}
				} else if(itemObj.group){
					if(!self.isChecked(itemObj.key)){
						self.checkItem(itemObj.key, true);
						if(itemObj.click && JSO().isFunction(itemObj.click)){
							itemObj.click.call(this, evt, itemObj.key, itemObj);
						}
					}
				} else if(itemObj.click && JSO().isFunction(itemObj.click)){
					itemObj.click.call(this, evt, itemObj.key, itemObj);
				}
			});
			
			return itemObj;
		},
		
		addSeparator: function(desc){
			var itemWrapper = this.$('<li class="_dwp_toolBarSeparator"></li>');
			this.itemContainer.append(itemWrapper);
			
			if(desc){
				if(desc.key){
					itemWrapper.attr("key", desc.key);	
				}
				if(desc.cssClass){
					itemWrapper.addClass(desc.cssClass);
				}
			}
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
			if(JSO().isInstanceOf(itemObj.obj, 'JSB.Widgets.Button')){
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