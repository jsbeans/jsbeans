JSB({
	name:'JSB.Widgets.ListBox',
	parent: 'JSB.Widgets.Control',
	require: {
		'JSB.Widgets.ScrollBox': 'ScrollBox'
	},
	client: {
		constructor: function(opts){
			this.base(opts);
			this.loadCss('listbox.css');
			var self = this;
			var elt = this.getElement();
			elt.addClass('_dwp_listBox');
			if(this.options.emptyText){
				this.noItemsElt = this.$('<div class="_dwp_noItems"></div>');
				this.noItemsElt.addClass('visible');
				this.noItemsElt.text(this.options.emptyText);
			}
			elt.append(this.noItemsElt);
			this.scrollBox = new self.ScrollBox(this.options);
			elt.append(this.scrollBox.getElement());
			this.rootElt = this.$('<ul class="_dwp_listBoxContainer"></ul>');
			this.scrollBox.append(this.rootElt);
			this.itemList = [];
			this.itemMap = {};
			this.setupEventHandlers();
			if(this.options.selectMulti){
				this.initSelector();
			}
		},
		
		selected: [],
		
		options: {
			selectMulti: false,
			onSelectionChanged: function(key, item, evt){}
		},
		
		initSelector: function(){
			var self = this;
			this.selectorRect = this.$('<div class="_dwp_listBoxSelector"></div>');
			this.append(this.selectorRect);
			this.selectorRect.css({
				'display': 'none'
			});
			this.scrollBox.getElement().mousedown(function(evt){
				if(evt.which == 1 && !self.isSelecting && !self.isHover){
					self.isSelecting = true;
					self.selectorRect.css({
						'display': 'block'
					});
					var pt = self.screenToLocal(evt.pageX, evt.pageY);
					self.selectorPos = {x: pt.x, y: pt.y};
					self.selectorRect.css({
						left: pt.x,
						top: pt.y,
						width: 0,
						height: 0
					});
					evt.stopPropagation();
				} 
			});

			
			function onUp(evt){
				if(self.isSelecting && evt.which == 1){
					var keys = self.getHighlightedItemKey();
					self.selectorRect.css({
						'display': 'none'
					});

					if(evt.altKey){
						// subtract highlighted from current selection
						self.selectItem(keys, null, true, true);
					} else if(evt.ctrlKey){
						// append highlighted to current selection
						self.selectItem(keys, null, true);
					} else {
						self.selectItem(keys, null);
					}
					self.isSelecting = false;
					//evt.stopPropagation();
				}
			}
			
			function onMove(evt){
				if(self.isSelecting){
					var pt = self.screenToLocal(evt.pageX, evt.pageY);
					var minPt = {x: Math.min(pt.x, self.selectorPos.x), y: Math.min(pt.y, self.selectorPos.y)};
					var maxPt = {x: Math.max(pt.x, self.selectorPos.x), y: Math.max(pt.y, self.selectorPos.y)};
					self.selectorRect.css({
						left: minPt.x,
						top: minPt.y,
						width: maxPt.x - minPt.x,
						height: maxPt.y - minPt.y
					});
					self.highlightItemsInRect(minPt, maxPt);
					evt.stopPropagation();
				}
			}

			this.$(document).mouseup(onUp);
			this.$(document).mousemove(onMove);
/*
				this.scrollBox.getElement().mouseup(onUp);
				this.selectorRect.mouseup(onUp);
				
				this.scrollBox.getElement().mousemove(onMove);
				this.selectorRect.mousemove(onMove);
*/
		},
		
		highlightItemsInRect: function(pt1, pt2){
			var self = this;
			var scrPt1 = this.localToScreen(pt1.x, pt1.y);
			var scrPt2 = this.localToScreen(pt2.x, pt2.y);
			var hLst = this.rootElt.find('> li').filter(function() {
		        offset = self.$(this).offset();
		        var eltPt1 = {x: offset.left, y: offset.top};
		        var eltPt2 = {x: offset.left + self.$(this).outerWidth(), y: offset.top + self.$(this).outerHeight()};
		        if(eltPt2.x < scrPt1.x){
		        	return false;	// item is leftside from the selection
		        }
		        if(eltPt1.x > scrPt2.x){
		        	return false;	// item is rightside from the selection
		        }
		        if(eltPt2.y < scrPt1.y){
		        	return false;	// item is top from the selection
		        }
		        if(eltPt1.y > scrPt2.y){
		        	return false;	// item is bottom from the selection
		        }
		        
		        return true;	// ietm and selection are overlaping
		    });
			
			var keyArr = [];
			for(var i = 0; i < hLst.length; i++ ){
				keyArr.push(this.$(hLst[i]).attr('key'));
			}
			
			this.highlightItem(keyArr);
		},
		
		setupEventHandlers: function(){
			var self = this;
			this.$('body').on({
				keydown: function(evt){
					if(!self.isFocused()){
						return;
					}
					if(evt.which == 40){
						self.hoverDown();
					} else if(evt.which == 38){
						self.hoverUp();
					} else if(evt.which == 13){
						// 'enter' pressed
						var hi = self.getHighlightedItem();
						if(hi){
							self.selectItem(hi.key, evt);
						}
					}
				},
				keyup: function(evt){
					if(!self.isFocused()){
						return;
					}
					if(evt.which == 13){
						evt.stopPropagation();
					}
				}
			});
		},
		
		resolveItem: function(obj){
			var itemObj = {
				allowSelect: true,
				allowHover: true
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
			
			var itemWrapper = this.$('<li class="_dwp_listBoxItem"></li>');
			
			if(itemObj.cssClass){
				itemWrapper.addClass(itemObj.cssClass);
			}
			
			if(!JSO().isNull(itemObj.key)){
				itemWrapper.attr("key", itemObj.key);	
			}

			if(itemObj.allowHover){
				itemWrapper.addClass('allowHover');
				itemWrapper.mouseover(function(){
					if(!self.isSelecting){
						self.isHover = true;
						self.highlightItem(itemObj.key);
					}
				});
				itemWrapper.mouseout(function(){
					if(!self.isSelecting) {
						self.isHover = false;
						self.rootElt.find('> li._dwp_listBoxItem').removeClass('highlighted');
					}
				});

			}
			
			itemWrapper.append(item);
			
			if(itemObj.allowSelect || self.options.selectMulti){
				itemWrapper.click(function(evt){
					if(self.isSelecting){
						return;
					}
					var key = self.$(evt.currentTarget).attr('key');
					if(self.options.selectMulti){
						if(evt.shiftKey){
							var keys = self.collectShiftSelected(key);
							if(keys){
								self.selectItem(keys, evt, true);
							}
						} else if(evt.ctrlKey){
							// toggle item selection
							if(self.isSelected(key)){
								self.selectItem(key, evt, true, true);
							} else {
								self.selectItem(key, evt, true);
							}
						} else if(evt.altKey){
							self.selectItem(key, evt, true, true);
						} else {
							self.selectItem(key, evt);
						}
					} else {
						self.selectItem(key, evt);
					}
				});
				if(this.isSelected(itemObj.key)){
					itemWrapper.addClass('selected');
				}
			}
			
			return itemWrapper;
		},
		
		collectShiftSelected: function(key){
			var curLi = this.rootElt.find('> li._dwp_listBoxItem[key="'+key+'"]');
			// try to collect up
			var sel = curLi.prevUntil('li.selected').addBack();
			if(sel.length < 1 || !this.$(sel[0]).prev().is('.selected')){
				sel = curLi.nextUntil('li.selected').addBack();
				if(sel.length < 1 || !this.$(sel[sel.length - 1]).next().is('.selected')) {
					return null;
				}
			}
			var keyArr = [];
			for(var i = 0; i < sel.length; i++ ){
				keyArr.push(this.$(sel[i]).attr('key'));
			}
			return keyArr;
		},
		
		get: function(key){
			if(this.itemMap[key]){
				return this.itemMap[key];
			}
			return null;
		},
		
		addItem: function(item){
			if(this.noItemsElt){
				this.noItemsElt.removeClass('visible');
			}
			var itemObj = this.resolveItem(item);
			itemObj.wrapper = this.wrapItem(itemObj);
			this.rootElt.append(itemObj.wrapper);
			this.itemList.push(itemObj);
			if(!JSO().isNull(itemObj.key)){
			    this.itemMap[itemObj.key] = itemObj;
			}
			
			return itemObj;
		},
		
		deleteItem: function(key){
			// unselect if needed
			var keyArr = [];
			if(JSO().isArray(key)){
				keyArr = key;
			} else {
				keyArr = [key];
			}
			var bSelModified = false;
			for(var z = keyArr.length - 1; z >= 0; z--){
				var key = keyArr[z];
				
				// remove from selection
				var selIdx = this.selected.indexOf(key);
				if(selIdx >= 0){
					bSelModified = true;
					this.selected.splice(selIdx, 1);
				}

				var itemWrapper = this.rootElt.find('> li._dwp_listBoxItem[key="'+key+'"]');
				itemWrapper.remove();
				
				// remove from list
				for(var i = this.itemList.length - 1; i >= 0; i--){
					var obj = this.itemList[i];
					if(obj.key == key){
						this.itemList.splice(i, 1);
					}
				}
				
				// remove from map
				if(this.itemMap[key]){
				    delete this.itemMap[key];
				}
			}
			
			if(bSelModified){
				// notify
				this.notifySelChanged();
			}
			
			if(this.noItemsElt && this.itemList.length === 0){
				this.noItemsElt.addClass('visible');
			}

		},
		
		insertItem: function(key, item) {
			if(this.noItemsElt){
				this.noItemsElt.removeClass('visible');
			}

			var itemObj = this.resolveItem(item);
			var itemWrapper = this.rootElt.find('> li._dwp_listBoxItem[key="'+key+'"]');
			itemObj.wrapper = this.wrapItem(itemObj);
			itemWrapper.before(itemObj.wrapper);
			for(var i in this.itemList){
				if(this.itemList[i].key == key){
					this.itemList.splice(i, 0, itemObj);
					if(!JSO().isNull(itemObj.key)){
					    this.itemMap[itemObj.key] = itemObj;
					}
					break;
				}
			}
			
			return itemObj;
		},
		
		selectItem: function(key, evt, keepSelection, unselect){
			var selectedCls = 'selected';
			var keyArr = [];
			if(!JSO().isArray(key)){
				keyArr.push(key);
			} else {
				keyArr = key;
			}
			
			if(!unselect){
				// check selection changed
				var itemWrapper = this.rootElt.find('> .' +selectedCls);
				if(itemWrapper.length > 0){
					if(itemWrapper.length == keyArr.length){
						var dif = false; 
						// generate key map
						var keyMap = {};
						for(var i in keyArr){
							keyMap[keyArr[i]] = true;
						}
						for(var i = 0; i < itemWrapper.length; i++ ){
							var curKey = this.$(itemWrapper[i]).attr('key'); 
							if(!keyMap[curKey]){
								dif = true;
								break;
							}
						}
						if(!dif){
							return;
						}
					}
				}
				
				// change selection
				if(!keepSelection){
					itemWrapper.removeClass(selectedCls);
					this.selected = [];
				}
			}
			
			for(var i in keyArr){
				var key = keyArr[i];
				if(!key){
					continue;
				}
				itemWrapper = this.rootElt.find('> li._dwp_listBoxItem[key="'+key+'"]');
				if(itemWrapper.length > 0){
					if(unselect){
						itemWrapper.removeClass(selectedCls);
					} else {
						itemWrapper.addClass(selectedCls);
					}
				}
				var idx = this.selected.indexOf(key);
				if(unselect){
					// remove key from the currently selected
					if(idx >= 0){
						this.selected.splice(idx, 1);
					}
				} else {
					if(idx == -1){
						this.selected.push(key);
					}
				}
			}
			
			this.notifySelChanged(evt);
		},
		
		notifySelChanged: function(evt){
			if(!JSO().isNull(this.options.onSelectionChanged)){
				var itemArr = [];
				
				for(var i = 0; i < this.selected.length; i++ ){
					var key = this.selected[i];
					itemArr.push(this.itemMap[key]);
				}
				if(this.selected.length == 0){
					this.options.onSelectionChanged.call(this, null, null, evt);
				} else {
					this.options.onSelectionChanged.call(this, this.selected.length == 1 ? this.selected[0] : this.selected, itemArr.length == 1 ? itemArr[0] : itemArr, evt);
				}
			}
		},
		
		isSelected: function(key){
			return this.selected.indexOf(key) >= 0;
		},
		
		isHighlighted: function(key){
			return this.rootElt.find('> li._dwp_listBoxItem[key="'+key+'"]').is('.highlighted');
		},
		
		getSelected: function(){
			var selArr = [];
			for(var i = 0; i < this.selected.length; i++){
				selArr.push(this.get(this.selected[i]));
			}
			return selArr;
		},
		
		getHighlightedItem: function(){
			var itemWrapper = this.rootElt.find('.highlighted');
			if(itemWrapper.length == 0){
				return null;
			}
			var itemList = [];
			for(var i = 0; i < itemWrapper.length; i++ ){
				var key = this.$(itemWrapper[i]).attr('key');
				itemList.push(this.itemMap[key]);
			}
			return itemList.length == 1 ? itemList[0] : itemList;
		},

		getHighlightedItemKey: function(){
			var itemWrapper = this.rootElt.find('.highlighted');
			if(itemWrapper.length == 0){
				return null;
			}
			var keyList = [];
			for(var i = 0; i < itemWrapper.length; i++ ){
				var key = this.$(itemWrapper[i]).attr('key');
				keyList.push(key);
			}
			return keyList.length == 1 ? keyList[0] : keyList;
		},

		highlightItem: function(key){
			this.rootElt.find('> li._dwp_listBoxItem').removeClass('highlighted');
			var keyArr = [];
			if(!JSO().isArray(key)){
				keyArr.push(key);
			} else {
				keyArr = key;
			}
			for(var i in keyArr){
				var key = keyArr[i];
				var item = this.itemMap[key];
				var wrapper = this.rootElt.find('> li._dwp_listBoxItem[key="'+key+'"]');
				wrapper.addClass('highlighted');
			}
		},
		
		hoverDown: function(){
			var item = this.getHighlightedItem();
			var cKey = null;
			if(item == null){
				// take first item to highlight
				if(this.itemList.length > 0){
					cKey = this.itemList[0].key; 
				}
			} else {
				var i;
				for(i = 0; i < this.itemList.length; i++ ){
					if(this.itemList[i].key == item.key){
						break;
					}
				}
				if(i < this.itemList.length - 1){
					cKey = this.itemList[i + 1].key;
				}
			}
			
			if(cKey){
				this.highlightItem(cKey);
			}
		},
		
		hoverUp: function(){
			var item = this.getHighlightedItem();
			var cKey = null;
			if(item == null){
				// take first item to highlight
				if(this.itemList.length > 0){
					cKey = this.itemList[0].key; 
				}
			} else {
				var i;
				for(i = 0; i < this.itemList.length; i++ ){
					if(this.itemList[i].key == item.key){
						break;
					}
				}
				if(i > 0){
					cKey = this.itemList[i - 1].key;
				}
			}
			
			if(cKey){
				this.highlightItem(cKey);
			}
		},
		
		keys: function(){
			var keyArr = [];
			for(var i in this.itemList){
				keyArr.push(this.itemList[i].key);
			}
			return keyArr;
		},
		
		length: function(){
			return this.itemList.length;
		},
		
		each: function(callback){
			for(var i in this.itemList){
				if(callback(this.itemList[i])){
					break;
				}
			}
		},

		clear: function(){
			this.selected = [];
            this.itemList = [];
            this.itemMap = {};
            this.rootElt.find('> li._dwp_listBoxItem').remove();
            
			if(this.noItemsElt){
				this.noItemsElt.addClass('visible');
			}

		},
		
		sort: function(callback){
			var self = this;
			if(!callback){
				return;
			}
			this.rootElt.empty();
			this.itemList.sort(callback);
			this.each(function(itemObj){
				self.rootElt.append(self.wrapItem(itemObj));
			});
		},
		
		scrollTo: function(target, y){
			if(JSB().isString(target)){
				// it's a key
				var elt = this.getElement().find('li[key="'+target+'"]');
				this.scrollBox.scrollToElement(elt);
			} else if(JSB().isNumber(target)){
				// offset
				var left = target;
				var top = y;
				this.scrollBox.scrollTo(-left, -top);
			} else {
				this.scrollBox.scrollToElement(target);
			}
		}
	}
});
