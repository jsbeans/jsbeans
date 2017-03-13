{
	$name: 'JSB.Widgets.CheckboxTreeView',
	$parent: 'JSB.Widgets.TreeView',
	$require: ['JSB.Widgets.CheckBox'],
	$client: {
		options:{
			allowSelect: false
		},
		
		checkedItems: [],
		
		wrapItem: function(itemObj){
			var self = this;
			
			if(JSO().isNull(itemObj.element)){
				return;
			}
			var item = itemObj.element;
			
			var itemWrapper = this.$('<li class="_dwp_treeViewNode"></li>');
			
			var collapsed = self.options.collapsed;
			if(!JSB().isNull(itemObj.collapsed)){
				collapsed = itemObj.collapsed;
			}
			if(collapsed){
				itemWrapper.addClass('collapsed');
			}
			
			if(itemObj.cssClass){
				itemWrapper.addClass(itemObj.cssClass);
			}
			
			if(!JSO().isNull(itemObj.key)){
				itemWrapper.attr("key", itemObj.key);	
			}
			
			itemObj.wrapper = itemWrapper;

			itemObj.ecToggleElt = this.$('<div class="_dwp_expandCollapseToggle hidden"></div>').click(function(evt){
				itemWrapper.toggleClass('collapsed');
				evt.stopPropagation();
			}).mouseover(function(evt){
				evt.stopPropagation();
			});
			
			var isChecked;
			if(itemObj.isChecked != undefined){
				isChecked = itemObj.isChecked;
				this.setCheck(itemObj, itemObj.checkKey)
			}
			else
				isChecked = self.isChecked(itemObj.checkKey);
			
			var cb = new CheckBox({
				label: item,
				checked: isChecked,
				onChange: function(bChecked){
					self.changeCheck(bChecked, itemObj);
				}
			});
			
			var nodeHeader = this.$('<div class="_dwp_nodeHeader"></div>')
				.append(itemObj.ecToggleElt)
				.append('<div class="_dwp_nodeIcon"></div>')
				.append(this.$('<div class="_dwp_itemContainer"></div>').append(cb.getElement()));
			
			itemWrapper.append(nodeHeader);
			itemObj.childContainerElt = this.$('<ul class="_dwp_childContainer"></ul>');
			itemWrapper.append(itemObj.childContainerElt);
			
			if(itemObj.allowHover != false){
				itemWrapper.addClass('allowHover');
				nodeHeader.mouseover(function(evt){
					if(!self.options.allowHover){
						return;
					}
					self.elementUnderCursor = self.$(evt.target);
					JSO().cancelDefer('treeView_highlight');
				    self.highlightItem(itemObj.key);
				});
				nodeHeader.mouseout(function(){
					// check element under cursor has the same parent
					JSO().defer(function(){
						if(self.elementUnderCursor && (self.elementUnderCursor.get(0) == nodeHeader.get(0) || self.elementUnderCursor.closest('._dwp_nodeHeader').get(0) == nodeHeader.get(0))){
							return;
						}
						self.unhighlightAll();
					}, 0, 'treeView_highlight');
					
				});
			}

			if(itemObj.allowSelect != false){
				nodeHeader.click(function(evt){
					if(!self.options.allowSelect){
						return;
					}
					self.selectItem(itemObj.key, evt);
					evt.stopPropagation();
				});
			}
			
			return itemWrapper;
		},
		
		changeCheck: function(check, obj){
			if(check){
				if(obj.obj)
					this.checkedItems[obj.checkKey] = obj.obj;
				else
					this.checkedItems[obj.checkKey] = obj;
				
				var childs = this.$(obj.childContainerElt[0].childNodes).find('._dwp_control._dwp_checkBox');
				
				for(var i = 0; i < childs.length; i++){					
					var el = this.$(childs[i]).jsb();
					
					if(el != null)
						el.setChecked(true);
				}
			}
			else{
				this.checkedItems[obj.checkKey] = false;
				var childs = this.$(obj.childContainerElt[0].childNodes).find('._dwp_control._dwp_checkBox');
				
				for(var i = 0; i < childs.length; i++){					
					var el = this.$(childs[i]).jsb();
					
					if(el != null)
						el.setChecked(false);
				}
			}
			
			if(JSB().isNull(this.options.onSelectionChanged)){
				return;
			}
			this.options.onSelectionChanged.call(this, this.checkedItems);
		},
		
		isChecked: function(key){
			if(this.checkedItems[key])
				return true;
			else
				return false;
		},
		
		setCheck: function(obj, key){
			this.checkedItems[key] = obj;	
		}
	}
}