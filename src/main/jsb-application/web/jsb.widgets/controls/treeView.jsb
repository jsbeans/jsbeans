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
	$name:'JSB.Widgets.TreeView',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Controls.ScrollBox',
	           'css:treeView.css'],
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
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
			onSelectionChanged: function(key, item, evt){},
			onNodeSelected: function(key, bSelected, evt){},
			onNodeHighlighted: function(key, bHighlighted, evt){}
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
			itemObj.tree = this;
			
			return itemObj;
		},
		
		wrapItem: function(itemObj){
			var self = this;
			if(JSB().isNull(itemObj.element)){
				return;
			}
			var item = itemObj.element;
			
			var itemWrapper = this.$('<li class="_dwp_treeViewNode"></li>');
			
			if(itemObj.dummy){
				itemWrapper.addClass('_dwp_treeDummy');
			}
			
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
				if(itemWrapper.hasClass('collapsed')){
					if(itemObj.onCollapse){
						itemObj.onCollapse.call(this, itemObj, true);
					}
				} else {
					if(itemObj.onExpand){
						itemObj.onExpand.call(this, itemObj, true);
					}
				}
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
		
		unhighlightAll: function(excludeKey){
			var hItems = this.rootElt.find('li._dwp_treeViewNode.highlighted');
			hItems.removeClass('highlighted');
			for(var i = 0; i < hItems.length; i++){
				var hKey = this.$(hItems[i]).attr('key');
				if(excludeKey && hKey == excludeKey){
					continue;
				}
				this.options.onNodeHighlighted.call(this, hKey, false);
			}
			this.lastHighlighted = null;
		},
		
		highlightItem: function(key){
			if(this.lastHighlighted == key){
				return;
			}
			var item = this.itemMap[key];
			var wrapper = this.rootElt.find('li._dwp_treeViewNode[key="'+key+'"]');
			this.unhighlightAll(key);
			wrapper.addClass('highlighted');
			this.options.onNodeHighlighted.call(this, key, true);
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
		
		selectItem: function(key, evt, hideEvt){
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

				if(!hideEvt) {
				    self.options.onSelectionChanged.call($this, selKey, selItem, evt);
                }
			}
			
			if(this.options.selectMulti){
				if(evt && evt.ctrlKey){
					// toggle selection
					for(var i = 0; i < itemWrapper.length; i++ ){
						if(this.$(itemWrapper[i]).attr('key') == key){
							// remove key selection
							this.$(itemWrapper[i]).removeClass(selectedCls);

							if(!hideEvt) {
							    $this.options.onNodeSelected.call($this, key, false, evt);
							}

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
					for(var i = 0; i < itemWrapper.length; i++ ){
						var wKey = this.$(itemWrapper[i]).attr('key');

						if(!hideEvt) {
						    $this.options.onNodeSelected.call($this, wKey, false, evt);
                        }
					}
				}
			} else {
				if(itemWrapper.length > 0){
					var oldKey = itemWrapper.attr('key');
					if(oldKey == key){
						return;
					}

					if(!hideEvt) {
					    $this.options.onNodeSelected.call($this, oldKey, false, evt);
                    }

					itemWrapper.removeClass(selectedCls);
				}
			}
			if(key){
				itemWrapper = this.rootElt.find('li._dwp_treeViewNode[key="'+key+'"]');
				if(itemWrapper.length > 0){
					itemWrapper.addClass(selectedCls);

					if(!hideEvt) {
					    $this.options.onNodeSelected.call($this, key, true, evt);
                    }
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
		    if(JSB.isDefined(key)) {
                return this.itemMap[key];
		    } else {
		        return this.itemMap;
		    }
		},
		
		getChildNodes: function(key){
			var keyArr = [];
			var liArr = null;
			if(!key){
				liArr = this.rootElt.find('> li');
			} else {
				liArr = this.rootElt.find('li[key="'+key+'"] > ul._dwp_childContainer > li');
			}
			for(var i = 0; i < liArr.length; i++ ){
				var curLi = this.$(liArr.get(i));
				keyArr.push(curLi.attr('key'));
			}
			
			return keyArr;
		},

		isChild: function(parentKey, childKey, bRecursively){
		    if(bRecursively){
		        function find(parentKey, childKey){
		            var keyArr = $this.getChildNodes(parentKey);
		            if(keyArr.indexOf(childKey) > -1){
		                return true;
		            } else {
		                for(var i = 0; i < keyArr.length; i++){
		                    if(find(keyArr[i], childKey)){
		                        return true;
		                    }
		                }
		            }
		        }

		        return find(parentKey, childKey);
		    } else {
		        return this.getChildNodes(parentKey).indexOf(childKey) > -1;
		    }
		},
		
		isDynamicChildren: function(key){
			if(!key){
				return false;
			}
			var parentObj = this.itemMap[key];
			if(!parentObj){
				return false;
			}
			return parentObj.dynamicChildren;
		},
		
		addNode: function(item, parentKey){
			var itemObj = this.resolveItem(item);
			if(itemObj.key && this.itemMap[itemObj.key]){
				throw 'JSB.Widgets.TreeView.addNode: Key "' + itemObj.key + '" already exists';
			}
			var wrappedItem = this.wrapItem(itemObj);
			var parentElt = this.rootElt;
			if(!itemObj.dummy){
				this._applyFilteredToItem(itemObj);
			}

			if(parentKey){
				var parentObj = this.itemMap[parentKey];
				if(!parentObj || !parentObj.childContainerElt || parentObj.childContainerElt.length === 0){
					return;
				}
				parentElt = parentObj.childContainerElt;
				if(parentObj.dynamicChildren && itemObj.key != parentKey + '_dummy'){
					parentObj.dynamicChildren = false;
					this.deleteNode(parentKey + '_dummy');
				}
				if(!itemObj.filtered){
					parentObj.ecToggleElt.removeClass('hidden');
				}
				itemObj.parent = parentKey;
			} else {
				itemObj.parent = null;
			}
			parentElt.append(wrappedItem);
			
			if(!JSB().isNull(itemObj.key)){
			    this.itemMap[itemObj.key] = itemObj;
			}
			if(itemObj.dynamicChildren && itemObj.key){
				// insert dummy loader
				var loadingText = itemObj.childrenLoadingText || 'Loading';
				this.addNode({
					dummy: true,
					allowHover: false,
					allowSelect: false,
					key: itemObj.key + '_dummy',
					element: '<div class="_dwp_dummyChild"><div class="icon"></div><div class="text">'+loadingText+'</div></div>'
				}, itemObj.key);
			}
			return itemObj;
		},
		
		replaceNode: function(item, oldKey){
			if(!oldKey){
				throw 'No key to replace specified';
			}
			var oldObj = this.itemMap[oldKey];
			if(!oldObj){
				return;
			}
			var itemObj = this.resolveItem(item);
			var bPrevObj = false;
			var wrappedItem = null;
			if(itemObj.element === oldObj.element){
				oldObj.element.detach();
			}
			
			var parentKey = oldObj.parent;
			var wrapper = oldObj.wrapper;
			wrappedItem = this.wrapItem(itemObj);
			wrapper.after(wrappedItem);
			itemObj.parent = parentKey;
			this.deleteNode(oldKey);
			
			if(!JSB().isNull(itemObj.key)){
			    this.itemMap[itemObj.key] = itemObj;
			}
			
			if(itemObj.dynamicChildren && itemObj.key){
				// insert dummy loader
				var loadingText = itemObj.childrenLoadingText || 'Loading';
				this.addNode({
					dummy: true,
					allowHover: false,
					allowSelect: false,
					key: itemObj.key + '_dummy',
					element: '<div class="_dwp_dummyChild"><div class="icon"></div><div class="text">'+loadingText+'</div></div>'
				}, itemObj.key);
			}
			
			this._applyFilteredToItem(itemObj);
			
			return itemObj;
		},
		
		deleteNode: function(key, deleteCallback){
			var self = this;
			var itemObj = this.itemMap[key];
			if(!itemObj){
				throw new Error('No tree element found by key: ' + key);
			}
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
				/*
				if(!bSel){
					// select first
					var firstNodeKey = this.rootElt.find('> li:first-child').attr('key');
					this.selectItem(firstNodeKey);
				}
				*/
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
		
		isCollapsed: function(key){
			var wrapper = this.get(key).wrapper;
			return wrapper.hasClass('collapsed');
		},
		
		isExpanded: function(key){
			return !this.isCollapsed(key);
		},
		
		expandNode: function(key){
			if(this.isExpanded(key)){
				return;
			}
			var itemObj = this.get(key);
			var wrapper = itemObj.wrapper;
			wrapper.removeClass('collapsed');
			if(itemObj.onExpand){
				itemObj.onExpand.call(this, itemObj);
			}
		},

		collapseNode: function(key){
			if(this.isCollapsed(key)){
				return;
			}
			var itemObj = this.get(key);
			var wrapper = itemObj.wrapper;
			wrapper.addClass('collapsed');
			if(itemObj.onCollapse){
				itemObj.onCollapse.call(this, itemObj);
			}
		},
		
		collapseAll: function(){
			var liArr = this.find('li._dwp_treeViewNode:not(.collapsed):not(._dwp_treeDummy)');
			for(var i = 0; i < liArr.length; i++){
				var key = this.$(liArr[i]).attr('key');
				if(key){
					this.collapseNode(key);
				}
			}
		},
		
		expandAll: function(){
			var liArr = this.find('li._dwp_treeViewNode.collapsed:not(._dwp_treeDummy)');
			for(var i = 0; i < liArr.length; i++){
				var key = this.$(liArr[i]).attr('key');
				if(key){
					this.expandNode(key);
				}
			}
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
				if(!item.dummy){
					this._applyFilteredToItem(item);
				}
			}
		},
		
		classRemove: function(el, className) {
			if (el.classList){
				el.classList.remove(className)
			} else if (hasClass(el, className)) {
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
				el.className=el.className.replace(reg, ' ');
			}
		}
	}
}