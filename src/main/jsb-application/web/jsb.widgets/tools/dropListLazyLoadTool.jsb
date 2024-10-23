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
	$name:'JSB.Widgets.DroplistLazyLoadTool',
	$parent: 'JSB.Widgets.Tool',
	$require: {
		ListBox: 'JSB.Widgets.ListBox'
	},
	$client: {
		$require: ['css:dropListLazyLoadTool.css'],
		$bootstrap: function(){
			// register tooltip
			var self = this;
			JSB().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
				toolMgr.registerTool({
					id: '_dwp_droplistLazyLoadTool',
					jso: self,
					wrapperOpts: {
						exclusive: '_dwp_droplistLazyLoadTool',
						modal: false,
						hideByOuterClick: true,
						hideInterval: 0,
						cssClass: '_dwp_droplistLazyLoadToolWrapper'
					}
				});
			});
		},
		
		$constructor: function(opts){
			$base(opts);
			this.construct();
		},

		options: {
		    height: 200,
		    scrollPosMultiplierY: 1,
		    lazyLoadAmount: 20,
		    lazyLoadOffsetPrev: null,
		    lazyLoadOffsetPost: null,
		    valuePivot: null,
		    valueStep: 1
		},
		
		construct: function() {
			var self = this;
			this.addClass('_dwp_droplistLazyLoadTool');
			this.listbox = new ListBox({
				onSelectionChanged: function(key, item, evt){
					if(!item.dontClose){
						self.complete();
					}
					if(!JSB().isNull(self.data.callback)){
						self.data.callback(key, item, evt);
					}
					evt.stopPropagation();
				},
				onScroll: function() {
				    var listBox = self.getListBox();

//				    var scrollX = listBox.scrollBox.getScrollPosition().x;
                    var scrollY = listBox.scrollBox.getScrollPosition().y;

                    var scrollBoxY = listBox.scrollBox.getElement().innerHeight();
                    var scrollPaneY = listBox.scrollBox.scrollPane.outerHeight();
                    var k = self.getOption('scrollPosMultiplierY');

                    var itemList = self.getData().slice();
                    var itemFirst = parseFloat(itemList[0].key);
                    var itemLast = parseFloat(itemList[itemList.length - 1].key);

                    var amountPrev = amountPost = self.getOption('lazyLoadAmount');
                    var step = self.getOption('valueStep');
                    var pivot = self.getOption('valuePivot')

                    var isPrepend = isAppend = false;

                    if (listBox.scrollY != scrollY && (scrollY > -k * scrollBoxY)) {;
                        var offsetPrev = self.getOption('lazyLoadOffsetPrev');

                        if (!JSB().isNull(offsetPrev)) {
                            var valueMin = pivot - offsetPrev * step;
                            if (itemFirst > valueMin) {
                                isPrepend = true;

                                if ((itemFirst - valueMin) / step < amountPrev) {
                                    amountPrev = (itemFirst - valueMin) / step;
                                }
                            }
                        } else {
                            isPrepend = true;
                        }
                    }

                    if (listBox.scrollY != scrollY && (scrollPaneY - (scrollBoxY - scrollY) < k * scrollBoxY)) {
                        var offsetPost = self.getOption('lazyLoadOffsetPost');

                        if (!JSB().isNull(offsetPost)) {
                            var valueMax = pivot + offsetPost * step;
                            if (itemLast < valueMax) {
                                isAppend = true;

                                if ((valueMax - itemLast / step) < amountPost) {
                                    amountPost = (valueMax - itemLast / step);
                                }
                            }
                        } else {
                            isAppend = true;
                        }
                    }

                    if (isPrepend || isAppend) {
                        var comboBoxInstance = self.getWrapper().getScope();
                        var wrapper = self.getWrapper();

                        if (isPrepend) {
                            for (let i = 1; i <= amountPrev; i++) {
                                itemList.unshift(comboBoxInstance.resolveItem(itemFirst - i * step + ''));
                            }
                        }

                        if (isAppend) {
                            for (let i = 1; i <= amountPost; i++) {
                                itemList.push(comboBoxInstance.resolveItem(itemLast + i * step + ''));
                            }
                        }

                        comboBoxInstance.setItems(itemList);
                        wrapper.params.data = itemList;
                        wrapper.setData(wrapper.params);

                        if (isPrepend) {
                            var scrollBoxYOffset = (listBox.scrollBox.scrollPane.outerHeight() - scrollPaneY) / (isAppend ? 2 : 1);
                            listBox.scrollBox.scroll.scrollTo(0, -scrollBoxYOffset + scrollY);
                            scrollY = listBox.scrollBox.getScrollPosition().y;
                        }
                    }

//				    listBox.scrollX = scrollX;
				    listBox.scrollY = scrollY;
				},
				height: this.getOption('height')
			});
			this.append(this.listbox);
		},
		
		complete: function() {
			this.close();	// close tool
		},
		
		onMessage: function(sender, msg, params ) {
		},

		onShow: function() {
            this.getListBox().scrollBox.getOption('onScroll') && this.getListBox().scrollBox.getOption('onScroll')();
		},
		
		update: function() {
			var self = this;
			var arr = this.data.data;
			this.listbox.detach();
			this.listbox.clear();
			for(var i in arr){
				this.listbox.addItem(arr[i]);
			}
			this.listbox.attach();
		},

		getToolId: function() {
		    return this.data.id;
		},

		getListBox: function() {
			return this.listbox;
		},
		
		setFocus: function() {
			this.listbox.setFocus();
		}
	}
}