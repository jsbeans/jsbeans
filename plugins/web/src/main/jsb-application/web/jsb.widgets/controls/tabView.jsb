{
	$name:'JSB.Widgets.TabView',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('tabView.css');
			this.init();
		},
		
		options: {
			allowCloseTab: true,
			allowNewTab: true,
			tabPosition: 'top',
			showTabs: true
		},
		
		currentTab: null,
		tabs: {},
		
		init: function(){
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

			// create tab pane
			this.tabPane = this.$('<ul class="_dwp_tabPane"></ul>');
			this.append(this.tabPane);
			if(this.options.allowNewTab){
				this.newTab = this.$('<li class="_dwp_newTab"><div class="_dwp_icon"></div></li>');
				this.tabPane.append(this.newTab);
				this.newTab.click(function(){
					if(!JSO().isNull(self.options.onTabClick)){
						self.options.onTabClick();
					}
				});
			}
			if(!this.options.showTabs){
				this.addClass('_dwp_hiddenTabs');
			}

			// add tab arrows
			
			// create client area
			this.clientPane = this.$('<div class="_dwp_clientPane"></div>');
			this.append(this.clientPane);
			
			this.tabPane.resize(function(){
				self.updateSizes();
			});
		},
		
		containsTab: function(tab){
			var entry = this.resolveTab(tab);
			return !JSO().isNull(entry);
		},
		
		addTab: function(title, ctrl, opts){
			var self = this;
			opts = opts || {};
			var uid = opts.id || JSO().generateUid();
			
			// add tab
			var tab = this.$('<li class="_dwp_tab" clientId="'+uid+'"></li>');
			tab.append('<div class="_dwp_icon"></div>');
			tab.append(this.$('<div class="_dwp_tabText"></div>').text(title));
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
				this.tabPane.append(tab);
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
			var clientWrap = this.$('<div id="'+uid+'" class="_dwp_clientPaneWrapper"></div>');
			clientWrap.css({display:'none'});
			clientWrap.append(ctrl.getElement());
			this.clientPane.append(clientWrap);
			
			self.tabs[uid] = {
				id: uid,
				title: title,
				tab: tab,
				wrap: clientWrap,
				ctrl: ctrl,
				opts: opts
			};
			
			if(!(this.options.dontSwitchOnCreate || opts.dontSwitchOnCreate)){
				this.switchTab(uid);
			}
			
			if(opts.disabled){
				this.enableTab(self.tabs[uid], false);
			}
			
			return self.tabs[uid];
		},
		
		resolveTab: function(tab){
			if(JSO().isString(tab)){
				// check for id
				if(!JSO().isNull(this.tabs[tab])){
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
				if(!JSO().isNull(tab.id) && !JSO().isNull(tab.tab)){
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
		
		showTab: function(tab, b){
			var entry = this.resolveTab(tab);
			if(b){
				entry.tab.removeClass('hidden');
			} else {
				entry.tab.addClass('hidden');
			}
		},
		
		enableTab: function(tab, b){
			var entry = this.resolveTab(tab);
			if(b){
				entry.tab.removeClass('disabled');
			} else {
				entry.tab.addClass('disabled');
			}
		},
		
		switchTab: function(tab){
			var self = this;
			var entry = this.resolveTab(tab);
			var activeTab = self.tabPane.find('.active');
			if(entry.tab.attr('clientId') == activeTab.attr('clientId')){
				return;
			}
			activeTab.removeClass('active');
			entry.tab.addClass('active');
			var showArea = self.clientPane.find('#' + entry.tab.attr('clientId'));
			showArea.css('display','');
			self.clientPane.find('#' + activeTab.attr('clientId')).css('display','none');
			self.currentTab = entry;
			if(this.options.onSwitchTab){
				this.options.onSwitchTab.call(self, tab);
			}
			
			return self.currentTab;
		},
		
		getCurrentTab: function(){
			return this.currentTab;
		},
		
		removeTab: function(tab){
			var entry = this.resolveTab(tab);
			var activeTab = this.tabPane.find('.active');
			var needSwitch = (entry.tab.attr('clientId') == activeTab.attr('clientId'));
			if(!JSO().isNull(entry.opts.onRemoveCallback)){
				entry.opts.onRemoveCallback(entry.ctrl, tab);
			}
			if(!JSO().isNull(this.options.onRemoveTab)){
				this.options.onRemove(tab);
			}
			entry.wrap.remove();
			entry.tab.remove();
			if(entry.ctrl && JSO().isInstanceOf(entry.ctrl, 'JSB.Widgets.Control')) {
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
		
		clear: function(){
			for(var i in this.tabs){
				if(this.tabs[i].ctrl && JSO().isInstanceOf(this.tabs[i].ctrl, 'JSB.Widgets.Control')) {
					this.tabs[i].ctrl.destroy();
				}
			}
			this.tabs = {};
			this.clientPane.empty();
			this.tabPane.empty();
		},
		
		updateSizes: function(){
			var tabPaneRc = this.tabPane.get(0).getBoundingClientRect();
			var css = {};
			if(this.options.tabPosition == 'bottom'){
				css = {
					top: 0,
					bottom: tabPaneRc.height,
					left: 0,
					right: 0 
				};
				
			} else if(this.options.tabPosition == 'left'){
				css = {
					top: 0,
					bottom: 0,
					left: tabPaneRc.width,
					right: 0 
				};
			} else if(this.options.tabPosition == 'right'){
				css = {
					top: 0,
					bottom: 0,
					left: 0,
					right: tabPaneRc.width 
				};
			} else {
				// top
				css = {
					top: tabPaneRc.height,
					bottom: 0,
					left: 0,
					right: 0 
				};
			}
			this.clientPane.css(css);

		}
	}
}