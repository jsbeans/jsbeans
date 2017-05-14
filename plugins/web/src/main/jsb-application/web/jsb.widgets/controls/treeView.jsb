{
	$name:'JSB.Widgets.TreeView',
	$parent: 'JSB.Widgets.Control',
	$require: {
		ScrollBox: 'JSB.Widgets.ScrollBox'
	},
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('treeView.css');
			this.addClass('_dwp_treeview');
			this.scrollBox = new ScrollBox(this.options);
			this.append(this.scrollBox);
			this.rootElt = this.$('<ul class="_dwp_treeViewContainer"></ul>');
			this.scrollBox.append(this.rootElt);
			this.$('body').mousemove(function(evt){
				self.elementUnderCursor = self.$(evt.target);
			});
			this.getElement().click(function(evt){
				if(!self.getSelected()){
					return;
				}
				self.selectItem(null, evt)
			});
			
			if(this.options.allowHover){
				this.addClass('allowHover');
			}
			if(this.options.allowSelect){
				this.addClass('allowSelect');
			}
		},
		
		options: {
			allowSelect: true,
			allowHover: true,
			selectMulti: false,
			collapsed: false,
			// events
			onSelectionChanged: null
		},
		
		itemMap: {},
		selStack: [],
		controls: {},
		
		resolveItem: function(obj){
			var itemObj = {};
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
			
			if(itemObj.obj){
				this.controls[itemObj.obj.getId()] = itemObj.obj;
			}
			
			return itemObj;
		},
		
		wrapItem: function(itemObj){
			var self = this;
			if(JSB().isNull(itemObj.element)){
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
			
			if(!JSB().isNull(itemObj.key)){
				itemWrapper.attr("key", itemObj.key);	
			}
			
			itemObj.wrapper = itemWrapper;

			itemObj.ecToggleElt = this.$('<div class="_dwp_expandCollapseToggle hidden"></div>').click(function(evt){
				// toggle expand/collapse
				itemWrapper.toggleClass('collapsed');
				evt.stopPropagation();
			}).mouseover(function(evt){
				evt.stopPropagation();
			});
			var nodeHeader = this.$('<div class="_dwp_nodeHeader"></div>')
				.append(itemObj.ecToggleElt)
				.append('<div class="_dwp_nodeIcon"></div>')
				.append(this.$('<div class="_dwp_itemContainer"></div>').append(item));
			
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
					JSB().cancelDefer('treeView_highlight');
				    self.highlightItem(itemObj.key);
				});
				nodeHeader.mouseout(function(){
					// check element under cursor has the same parent
					JSB().defer(function(){
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
		
		unhighlightAll: function(){
			this.rootElt.find('li._dwp_treeViewNode').removeClass('highlighted');
			this.lastHighlighted = null;
		},
		
		highlightItem: function(key){
			if(this.lastHighlighted == key){
				return;
			}
			var item = this.itemMap[key];
			var wrapper = this.rootElt.find('li._dwp_treeViewNode[key="'+key+'"]');
			this.unhighlightAll();
			wrapper.addClass('highlighted');
			this.lastHighlighted = key;
		},
		
		getSelected: function(){
			var self = this;
			var selectedCls = 'selected';
			var itemWrapper = self.rootElt.find('.' +selectedCls);
			var selKey = null;
			var selItem = null;
			if(itemWrapper.length == 1){
				selKey = itemWrapper.attr('key');
				selItem = self.itemMap[selKey];
			} else if(itemWrapper.length > 1){
				selKey = [];
				selItem = [];
				for(var i = 0; i < itemWrapper.length; i++ ){
					var k = self.$(itemWrapper[i]).attr('key');
					selKey.push(k);
					selItem.push(self.itemMap[k]);
				}
			}
			return selItem;
		},
		
		selectItem: function(key, evt){
			var self = this;
			var selectedCls = 'selected';
			var itemWrapper = this.rootElt.find('.' +selectedCls);
			
			function callChanged(){
				if(JSB().isNull(self.options.onSelectionChanged)){
					return;
				}
				var itemWrapper = self.rootElt.find('.' +selectedCls);
				var selKey = null;
				var selItem = null;
				if(itemWrapper.length == 1){
					selKey = itemWrapper.attr('key');
					selItem = self.itemMap[selKey];
				} else if(itemWrapper.length > 1){
					selKey = [];
					selItem = [];
					for(var i = 0; i < itemWrapper.length; i++ ){
						var k = self.$(itemWrapper[i]).attr('key');
						selKey.push(k);
						selItem.push(self.itemMap[k]);
					}
				}
				self.options.onSelectionChanged.call(self, selKey, selItem, evt);
			}
			
			if(this.options.selectMulti){
				if(evt && evt.ctrlKey){
					// toggle selection
					for(var i = 0; i < itemWrapper.length; i++ ){
						if(this.$(itemWrapper[i]).attr('key') == key){
							// remove key selection
							this.$(itemWrapper[i]).removeClass(selectedCls);
							callChanged();
							return;
						}
					}
				} else {
					if(itemWrapper.length == 1 && itemWrapper.attr('key') == key){
						return;
					}
					// remove old selection
					itemWrapper.removeClass(selectedCls);
				}
			} else {
				if(itemWrapper.length > 0){
					var oldKey = itemWrapper.attr('key');
					if(oldKey == key){
						return;
					}
					itemWrapper.removeClass(selectedCls);
				}
			}
			if(key){
				itemWrapper = this.rootElt.find('li._dwp_treeViewNode[key="'+key+'"]');
				if(itemWrapper.length > 0){
					itemWrapper.addClass(selectedCls);
				}
				
				this.selStack.push(key);
			}
			
			callChanged();
		},

		clear: function(){
			for(var i in this.controls){
				this.controls[i].destroy();
			}
			this.controls = {};
			this.selStack = [];
			this.itemMap = {};
			this.rootElt.empty();
		},
		
		get: function(key){
			return this.itemMap[key];
		},
		
		getChildNodes: function(key){
			// get parent node
			var keyArr = [];
			var liArr = this.rootElt.find('li[key="'+key+'"] > ul._dwp_childContainer > li');
			for(var i = 0; i < liArr.length; i++ ){
				var curLi = this.$(liArr.get(i));
				keyArr.push(curLi.attr('key'));
			}
			
			return keyArr;
		},
		
		addNode: function(item, parentKey){
			var itemObj = this.resolveItem(item);
			if(itemObj.key && this.itemMap[itemObj.key]){
				throw 'JSB.Widgets.TreeView.addNode: Key "' + itemObj.key + '" already exists';
			}
			var wrappedItem = this.wrapItem(itemObj);
			var parentElt = this.rootElt;
			this._applyFilteredToItem(itemObj);

			if(parentKey){
				var parentObj = this.itemMap[parentKey];
				if(!parentObj || !parentObj.childContainerElt || parentObj.childContainerElt.length === 0){
					return;
				}
				parentElt = parentObj.childContainerElt;
/*				
				// search for another parent
				parentElt = this.rootElt.find('li[key="'+parentKey+'"] > ul._dwp_childContainer');
				if(parentElt.length === 0){
					return;
				}
*/
				if(!itemObj.filtered){
					parentObj.ecToggleElt.removeClass('hidden');
				}
//				this.rootElt.find('li[key="'+parentKey+'"] > ._dwp_nodeHeader > ._dwp_expandCollapseToggle').removeClass('hidden');
				itemObj.parent = parentKey;
			} else {
				itemObj.parent = null;
			}
			parentElt.append(wrappedItem);
			
			if(!JSB().isNull(itemObj.key)){
			    this.itemMap[itemObj.key] = itemObj;
			}
			
			if(this.rootElt["0"].firstChild != null)
				this.classRemove(this.rootElt["0"].firstChild, 'collapsed');
			
			return itemObj;
		},
		
		replaceNode: function(item, oldKey){
			if(!oldKey){
				throw 'No key to replace specified';
			}
			var itemObj = this.resolveItem(item);
			var wrappedItem = this.wrapItem(itemObj);
			
			var oldObj = this.itemMap[oldKey];
			if(!oldObj){
				return;
			}
			var parentKey = oldObj.parent;
			var wrapper = oldObj.wrapper;
			wrapper.after(wrappedItem);
			itemObj.parent = parentKey;
			
			if(!JSB().isNull(itemObj.key)){
			    this.itemMap[itemObj.key] = itemObj;
			}
			
			this.deleteNode(oldKey);
			this._applyFilteredToItem(itemObj);
			
			return itemObj;
		},
		
		deleteNode: function(key, deleteCallback){
			var self = this;
			var itemObj = this.itemMap[key];
			var pKey = itemObj.parent;
			
			if(deleteCallback){
				deleteCallback.call(self, itemObj);
			}
			
			// delete children
			var children = this.rootElt.find('li[key="'+key+'"] > ul > li');
			children.each(function(){
				self.deleteNode(self.$(this).attr('key'), deleteCallback);
			});

			// delete self
			this.rootElt.find('li[key="'+key+'"]').remove();
			if(JSB().isInstanceOf(itemObj.element, 'JSB.Widgets.Control')){
				if(this.controls[itemObj.element.getId()]){
					delete this.controls[itemObj.element.getId()];
				}
				itemObj.element.destroy();
			}
			delete this.itemMap[key];
			
			if(pKey){
				var oldPContainerCh = this.rootElt.find('li[key="'+pKey+'"] > ul._dwp_childContainer > li[filtered="false"]');
				if(oldPContainerCh.length == 0){
					this.rootElt.find('li[key="'+pKey+'"] > ._dwp_nodeHeader > ._dwp_expandCollapseToggle').addClass('hidden');
				}
			}
			
			// changes selection if required
			if(this.selStack[this.selStack.length - 1] == key){
				var bSel = false;
				while(this.selStack.length > 0){
					var selKey = this.selStack.pop();
					if(this.itemMap[selKey]){
						this.selectItem(selKey);
						bSel = true;
						break;
					}
				}
				if(!bSel){
					// select first
					var firstNodeKey = this.rootElt.find('> li:first-child').attr('key');
					this.selectItem(firstNodeKey);
				}
			}
		},
		
		moveNode: function(key, targetParentKey){
			var itemObj = this.itemMap[key];
			var pKey = itemObj.parent;
			if(pKey == targetParentKey){
				return;
			}
			var parentContainer = this.rootElt;
			if(targetParentKey){
				parentContainer = this.rootElt.find('li[key="'+targetParentKey+'"] > ul._dwp_childContainer');
				if(!itemObj.filtered){
					this.rootElt.find('li[key="'+targetParentKey+'"] > ._dwp_nodeHeader > ._dwp_expandCollapseToggle').removeClass('hidden');
				}
				itemObj.parent = targetParentKey;
			} else {
				itemObj.parent = null;
			}
			parentContainer.append(itemObj.wrapper);
			if(pKey){
				var oldPContainerCh = this.rootElt.find('li[key="'+pKey+'"] > ul._dwp_childContainer > li[filtered="false"]');
				if(oldPContainerCh.length == 0){
					this.rootElt.find('li[key="'+pKey+'"] > ._dwp_nodeHeader > ._dwp_expandCollapseToggle').addClass('hidden');
				}
			}
		},
		
		sort: function(){
			var self = this;
			var fromKey = null;
			var callback = null;
			if(JSB().isFunction(arguments[0])){
				callback = arguments[0];
			} else {
				fromKey = arguments[0];
				callback = arguments[1];
			}
			
			if(fromKey && !this.itemMap[fromKey]){
				throw 'TreeView.sort: Invalid key specified: ' + fromKey;
			}
			if(!JSB().isFunction(callback)){
				throw 'TreeView.sort: Sort callback should be specified';
			}
			
			var itemArr = [];
			var ulContainer = this.rootElt;
			if(fromKey){
				ulContainer = this.getElement().find('li[key="'+fromKey+'"] > ul');
			}
			
			var children = ulContainer.find('> li');
			children.each(function(){
				var key = self.$(this).attr('key');
				self.sort(key, callback);
				itemArr.push(self.itemMap[key]);
			});
			
			itemArr.sort(callback);
			
			// rebuild according to new order
			for(var i = 0; i < itemArr.length; i++ ){
				ulContainer.append(itemArr[i].wrapper);
			}
		},
		
		toggleNode: function(key){
			var wrapper = this.get(key).wrapper;
			wrapper.toggleClass('collapsed');
		},
		
		expandNode: function(key){
			var wrapper = this.get(key).wrapper;
			wrapper.removeClass('collapsed');
		},

		collapseNode: function(key){
			var wrapper = this.get(key).wrapper;
			wrapper.addClass('collapsed');
		},
		
		expandToNode: function(key){
			var item = this.itemMap[key];
			if(item.parent){
				this.expandNode(item.parent);
				this.expandToNode(item.parent);
			}
		},
		
		scrollTo: function(key){
			if(JSB().isString(key)){
				// it's a key
				var elt = this.getElement().find('li[key="'+key+'"]');
				this.scrollBox.scrollToElement(elt);
			} else if(JSB().isNumber(key)){
				// offset
				var left = 0;
				var top = key;
				this.scrollBox.scrollTo(-left, -top);
			} else {
				this.scrollBox.scrollToElement(key);
			}
		},
		
		_applyFilteredToItem: function(item, filtered){
			var self = this;
			
			if(JSB.isNull(filtered)){
				var filterCallback = this.options.filter;
				filtered = false;
				if(filterCallback){
					filtered = !filterCallback.call(this, item);
				}
			}
			item.wrapper.attr('filtered', filtered);
			item.filtered = filtered;
			if(item.parent){
				var parentItem = this.itemMap[item.parent];
				if(!filtered){
					// reset parent filter
					if(parentItem.filtered){
						this._applyFilteredToItem(parentItem, false);
					}
					parentItem.ecToggleElt.removeClass('hidden');
				} else {
					if(parentItem.wrapper.find('> ul._dwp_childContainer > li[filtered="false"]').length == 0){
						parentItem.ecToggleElt.addClass('hidden');
					}
				}
			}
				
		},
		
		setFilter: function(filterCallback){
			this.setOption('filter', filterCallback);
			
			// iterate over all items and apply filter
			for(var key in this.itemMap){
				var item = this.itemMap[key];
				this._applyFilteredToItem(item);
			}
		},
		
		classRemove: function(el, className) {
			if (el.classList)
				el.classList.remove(className)
			else if (hasClass(el, className)) {
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
				el.className=el.className.replace(reg, ' ')
				}
		}
	}
}