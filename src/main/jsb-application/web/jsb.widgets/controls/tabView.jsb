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
	$name: 'JSB.Widgets.TabView',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['css:tabView.css'],

		currentTab: null,
		tabs: {},

		$constructor: function(opts){
			$base(opts);

			var self = this;
			this.addClass('_dwp_tabview');

			if(this.options.tabPosition == 'bottom'){
				this.addClass('_dwp_tabBottom');
			}

			if(this.options.tabPosition == 'left'){
				this.addClass('_dwp_tabLeft');
			}

			if(this.options.tabPosition == 'right'){
				this.addClass('_dwp_tabRight');
			}

			if(!this.options.tabPosition || this.options.tabPosition == 'top'){
				this.addClass('_dwp_tabTop');
			}
			
			if(this.options.tabAlign == 'start') {
				this.addClass('_dwp_tabAlignStart');
			} else if(this.options.tabAlign == 'center') {
				this.addClass('_dwp_tabAlignCenter');
			} else if(this.options.tabAlign == 'end') {
				this.addClass('_dwp_tabAlignEnd');
			}

			// create tab pane
			this.tabPane = this.$('<div class="_dwp_tabPane"></div>');
			this.append(this.tabPane);

			// create scrollbar
			this.tabScrollBar = $this.$('<div class="_jsb_tabScrollbar"></div>');
			this.leftArrow = this.$('<div class="_jsb_handle left"></div>');
			this.rightArrow = this.$('<div class="_jsb_handle right"></div>');
			this.tabScrollBar.append(this.leftArrow);
			this.tabScrollBar.append(this.rightArrow);
			this.leftArrow.click(function(){
				$this.scrollTab('back');
			});
			this.rightArrow.click(function(){
				$this.scrollTab('front');
			});
			this.tabPane.append(this.tabScrollBar);

			// create scrollable pane
			this.tabScrollPane = $this.$('<ul class="_jsb_tabScrollPane"></ul>');
			this.tabPane.append(this.tabScrollPane);


			if(this.options.allowNewTab){
				this.newTab = this.$('<li class="_dwp_newTab"><div class="_dwp_icon"></div></li>');
				this.tabScrollPane.append(this.newTab);
				this.newTab.click(function(){
					if(!JSB().isNull(self.options.onTabClick)){
						self.options.onTabClick();
					}
				});
			}
			if(!this.options.showTabs){
				this.addClass('_dwp_hiddenTabs');
			}

			// create client area
			this.clientPane = this.$('<div class="_dwp_clientPane"></div>');
			this.append(this.clientPane);

			this.tabPane.resize(()=>{
				if(!$this.options.showTabs || !$this.tabPane.is(':visible')){
					return;
				}
				$this.updateSizes();
			});
		},
		
		options: {
			allowCloseTab: true,
			allowNewTab: true,
			tabPosition: 'top',
			tabAlign: 'start',
			showTabs: true
		},
		
		showTabs: function(bShow){
			if(this.options.showTabs == bShow){
				return;
			}
			this.options.showTabs = bShow;
			if(!this.options.showTabs){
				this.addClass('_dwp_hiddenTabs');
			} else {
				this.removeClass('_dwp_hiddenTabs');
			}
			this.updateSizes();
		},
		
		changePosition: function(newPos){
			if(this.options.tabPosition == newPos){
				return;
			}
			this.options.tabPosition = newPos;
			if(this.options.tabPosition == 'bottom'){
				this.addClass('_dwp_tabBottom');
				this.removeClass('_dwp_tabLeft');
				this.removeClass('_dwp_tabRight');
				this.removeClass('_dwp_tabTop');
			}

			if(this.options.tabPosition == 'left'){
				this.addClass('_dwp_tabLeft');
				this.removeClass('_dwp_tabBottom');
				this.removeClass('_dwp_tabRight');
				this.removeClass('_dwp_tabTop');
			}

			if(this.options.tabPosition == 'right'){
				this.addClass('_dwp_tabRight');
				this.removeClass('_dwp_tabBottom');
				this.removeClass('_dwp_tabLeft');
				this.removeClass('_dwp_tabTop');
			}

			if(this.options.tabPosition == 'top'){
				this.addClass('_dwp_tabTop');
				this.removeClass('_dwp_tabBottom');
				this.removeClass('_dwp_tabLeft');
				this.removeClass('_dwp_tabRight');
			}
			
			this.updateSizes();
		},
		
		changeAlign: function(newAlign){
			if(this.options.tabAlign == newAlign){
				return;
			}
			this.options.tabAlign = newAlign;
			if(this.options.tabAlign == 'start'){
				this.addClass('_dwp_tabAlignStart');
				this.removeClass('_dwp_tabAlignCenter');
				this.removeClass('_dwp_tabAlignEnd');
			} else if(this.options.tabAlign == 'center'){
				this.addClass('_dwp_tabAlignCenter');
				this.removeClass('_dwp_tabAlignStart');
				this.removeClass('_dwp_tabAlignEnd');
			} else if(this.options.tabAlign == 'end'){
				this.addClass('_dwp_tabAlignEnd');
				this.removeClass('_dwp_tabAlignStart');
				this.removeClass('_dwp_tabAlignCenter');
			}

			this.updateSizes();
		},

		activateTab: function(uid){
		    this.tabs[uid].ctrl = new this.tabs[uid].cls();
		    this.tabs[uid].wrap.append(this.tabs[uid].ctrl.getElement());
		},

		addTab: function(title, cls, opts){
			var self = this;
			opts = opts || {};
			var uid = opts.id || JSB().generateUid();

			// add tab
			var tab = this.$('<li class="_dwp_tab" clientId="'+uid+'"></li>');
			tab.append('<div class="_dwp_icon"></div>');
			tab.append(this.$('<div class="_dwp_tabText"></div>').append(title));
			if(this.options.allowCloseTab || opts.allowCloseTab){
				var closeBtn = this.$('<div class="_dwp_closeBtn"></div>');
				tab.append(closeBtn);
				closeBtn.click(function(evt){
					var id = self.$(evt.currentTarget).parent().attr('clientId');
					self.removeTab(id);
				});
			}
			if(this.newTab){
				this.newTab.before(tab);
			} else {
				this.tabScrollPane.append(tab);
			}
			tab.click(function(evt){
				if(evt.which == 2 && (self.options.allowCloseTab || opts.allowCloseTab) && !tab.hasClass('disabled')){
					self.removeTab(uid);
				}
				if(tab.hasClass('active') || tab.hasClass('disabled')){
					return;
				}
				if(evt.which == 1){
					self.switchTab(uid);
				}
			});

			// add client
			var clientWrap = this.$('<div key="'+uid+'" class="_dwp_clientPaneWrapper"></div>');
			//clientWrap.css({display:'none'});

			if(JSB.isFunction(cls)){
                self.tabs[uid] = {
                    id: uid,
                    title: title,
                    tab: tab,
                    wrap: clientWrap,
                    cls: cls,
                    opts: opts
                };
			} else {
				if(JSB.isInstanceOf(cls, 'JSB.Widgets.Control') || JSB.isInstanceOf(cls, 'JSB.Controls.Control')){
					clientWrap.append(cls.getElement());
				} else {
					clientWrap.append(cls);
				}

                self.tabs[uid] = {
                    id: uid,
                    title: title,
                    tab: tab,
                    wrap: clientWrap,
                    ctrl: cls,
                    opts: opts
                };
			}

			this.clientPane.append(clientWrap);

			if(!(this.options.dontSwitchOnCreate || opts.dontSwitchOnCreate)){
				this.switchTab(uid);
			}

			if(opts.disabled){
				this.enableTab(self.tabs[uid], false);
			}

			return self.tabs[uid];
		},

		clear: function(){
			for(var i in this.tabs){
				if(this.tabs[i].ctrl && JSB().isInstanceOf(this.tabs[i].ctrl, 'JSB.Widgets.Control')) {
					this.tabs[i].ctrl.destroy();
				}
			}
			this.tabs = {};
			this.clientPane.empty();
			this.tabPane.empty();
		},

		containsTab: function(tab){
			var entry = this.resolveTab(tab);
			return !JSB().isNull(entry);
		},

		enableTab: function(tab, b){
			var entry = this.resolveTab(tab);
			if(b){
				entry.tab.removeClass('disabled');
			} else {
				entry.tab.addClass('disabled');
			}
		},

		getCurrentTab: function(){
			return this.currentTab;
		},

		getTabs: function(){
			return this.tabs;
		},

		isEnabled: function(tab){
			var entry = this.resolveTab(tab);
			if(entry.tab.hasClass('disabled')){
				return false;
			}
			return true;
		},

		removeTab: function(tab) {
			var entry = this.resolveTab(tab);
			var activeTab = this.tabPane.find('> ._jsb_tabScrollPane > .active');
			var needSwitch = (entry.tab.attr('clientId') == activeTab.attr('clientId'));
			if(!JSB().isNull(entry.opts.onRemoveCallback)){
				entry.opts.onRemoveCallback(entry.ctrl, tab);
			}
			if(!JSB().isNull(this.options.onRemoveTab)){
				this.options.onRemove(tab);
			}
			entry.wrap.remove();
			entry.tab.remove();

            if(entry.ctrl && JSB().isInstanceOf(entry.ctrl, 'JSB.Widgets.Control')) {
                entry.ctrl.destroy();
            }

			delete this.tabs[entry.id];
			if(needSwitch){
				for(var t in this.tabs){
					this.switchTab(t);
					break;
				}
			}
		},

		renameTab: function(oldName, newName){
			var entry = this.resolveTab(oldName);
			entry.tab.find('._dwp_tabText').text(newName);
			entry.title = newName;
		},

		resolveTab: function(tab){
			if(JSB().isString(tab)){
				// check for id
				if(!JSB().isNull(this.tabs[tab])){
					return this.tabs[tab];
				}

				// check for name
				for(var i in this.tabs){
					var e = this.tabs[i];
					if(e.title == tab){
						return e;
					}
				}
			} else {
				if(!JSB().isNull(tab.id) && !JSB().isNull(tab.tab)){
					return tab;
				}
				for(var i in this.tabs){
					var e = this.tabs[i];
					if(e.tab.get(0) == tab.get(0)){
						return e;
					}
				}
			}
			return null;
		},

		scrollTab: function(dir){
			var tabElt = this.tabScrollPane.get(0);
			var newScroll = 0;
			if(this.options.tabPosition == 'top' || this.options.tabPosition == 'bottom') {
				var scrollSize = Math.round($this.tabScrollBar.width() / 2);
				if(dir == 'front'){
					newScroll = tabElt.scrollLeft + scrollSize;
					if(tabElt.scrollWidth - newScroll < tabElt.offsetWidth){
						newScroll = tabElt.scrollWidth - tabElt.offsetWidth;
					}
					tabElt.scrollLeft = newScroll;
				} else {
					newScroll = tabElt.scrollLeft - scrollSize;
					if(newScroll < 0){
						newScroll = 0;
					}
					tabElt.scrollLeft = newScroll;
				}
			} else {
				// TODO:
			}
			this.updateTabScroll(newScroll);
		},

		showTab: function(tab, b){
			var entry = this.resolveTab(tab);
			if(b){
				entry.tab.removeClass('hidden');
			} else {
				entry.tab.addClass('hidden');
			}
		},

		sortTabs: function(callback){
			var itemArr = [];

			for(var uid in this.tabs){
				itemArr.push(this.tabs[uid]);
			}
			itemArr.sort(callback);

			// rebuild according to new order
			for(var i = 0; i < itemArr.length; i++ ){
				this.tabScrollPane.append(itemArr[i].tab);
			}
		},

		switchTab: function(tab){
			var self = this;
			var entry = this.resolveTab(tab);
			var activeTab = self.tabPane.find('> ._jsb_tabScrollPane > .active');
			if(entry.tab.attr('clientId') == activeTab.attr('clientId')){
				return;
			}
			activeTab.removeClass('active');
			entry.tab.addClass('active');
			var showArea = self.clientPane.find('> ._dwp_clientPaneWrapper[key="' + entry.tab.attr('clientId') + '"]');
			showArea.addClass('active');
			self.clientPane.find('> ._dwp_clientPaneWrapper[key="' + activeTab.attr('clientId') + '"]').removeClass('active');
			self.currentTab = entry;
			if(!entry.ctrl){
			    this.activateTab(entry.id);
			}
			if(this.options.onSwitchTab){
				this.options.onSwitchTab.call(self, tab);
			}

			return self.currentTab;
		},

		updateSizes: function(){
			var tabPaneRc = this.tabPane.get(0).getBoundingClientRect();

			var css = {};
			var tabScrollCss = {};
			if(this.options.tabPosition == 'bottom'){
				css = {
					top: 0,
					bottom: tabPaneRc.height,
					left: 0,
					right: 0
				};
				tabScrollCss = {
					left: 0,
					right: 0,
					bottom: 0,
					height: tabPaneRc.height
				};

			} else if(this.options.tabPosition == 'left'){
				css = {
					top: 0,
					bottom: 0,
					left: tabPaneRc.width,
					right: 0
				};
				tabScrollCss = {
					top: 0,
					left: 0,
					bottom: 0,
					width: tabPaneRc.width
				};
			} else if(this.options.tabPosition == 'right'){
				css = {
					top: 0,
					bottom: 0,
					left: 0,
					right: tabPaneRc.width
				};
				tabScrollCss = {
					top: 0,
					right: 0,
					bottom: 0,
					width: tabPaneRc.width
				};
			} else {
				// top
				css = {
					top: tabPaneRc.height,
					bottom: 0,
					left: 0,
					right: 0
				};
				tabScrollCss = {
					left: 0,
					right: 0,
					top: 0,
					height: tabPaneRc.height
				};
			}
			this.clientPane.css(css);
			//this.tabScrollBar.css(tabScrollCss);

			// check tab pane width for scrolling
			this.updateTabScroll();
		},

		updateTabScroll: function(newScroll){
			var tabElt = this.tabScrollPane.get(0);
			if(JSB.isNull(newScroll)){
				newScroll = tabElt.scrollLeft;
			}
			if(this.options.tabPosition == 'top' || this.options.tabPosition == 'bottom'){
				if(tabElt.scrollWidth > tabElt.offsetWidth){
					this.tabPane.addClass('scrollable');
					
					if(newScroll > 0){
						$this.tabScrollBar.addClass('hasLeft');
					} else {
						$this.tabScrollBar.removeClass('hasLeft');
					}
					if(tabElt.scrollWidth - newScroll > tabElt.offsetWidth){
						$this.tabScrollBar.addClass('hasRight');
					} else {
						$this.tabScrollBar.removeClass('hasRight');
					}
					
				} else {
					this.tabPane.removeClass('scrollable');
				}
			} else {
				// TODO: for vertical orientation
			}
		},

		hideTab: function(tab) {
		    let entry = this.resolveTab(tab);

		    if(entry.tab.hasClass('hidden')) {
		        return;
		    }

		    entry.tab.addClass('hidden');

			if(entry.tab.attr('clientId') == this.tabPane.find('> ._jsb_tabScrollPane > .active').attr('clientId')) {
				for(var t in this.tabs) {
					this.switchTab(t);
					break;
				}
			}
		},

		showTab: function(tab) {
		    this.resolveTab(tab).tab.removeClass('hidden');
		}
	}
}