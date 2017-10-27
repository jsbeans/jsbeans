{
	$name:'JSB.Controls.TabView',
	$parent: 'JSB.Controls.Control',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('jsb-tabview');
			this.loadCss('tabView.css');

			// todo: styles for another tab position
            this.tabPane = this.$('<ul class="tabPane ' + this.options.tabPosition + '"></ul>');
            this.append(this.tabPane);

            // todo: add new tab

            this.clientPane = this.$('<div class="clientPane"></div>');
            this.append(this.clientPane);

            if(!this.options.showTabs){
                this.tabPane.addClass('hidden');
            }
		},

		options: {
			tabPosition: 'top',
			showTabs: true
		},

		currentTab: null,
		tabs: {},

		activateTab: function(uid){
		    this.tabs[uid].ctrl = new this.tabs[uid].cls();
		    this.tabs[uid].wrap.append(this.tabs[uid].ctrl.getElement());
		},

		addTab: function(title, cls, opts){
			opts = opts || {};
			var uid = opts.id || JSB().generateUid();

			// add tab
			var tab = this.$('<li clientId="'+uid+'"><div class="icon"></div><div class="title">' + title + '</div></li>');
			this.tabPane.append(tab);

			tab.click(function(evt){
                $this.switchTab(uid);
			});

			// add client
			var clientWrap = this.$('<div key="'+uid+'" class="clientPaneWrapper"></div>');
			clientWrap.css({display:'none'});

			if(JSB.isFunction(cls)){
                this.tabs[uid] = {
                    id: uid,
                    title: title,
                    tab: tab,
                    wrap: clientWrap,
                    cls: cls,
                    opts: opts
                };
			} else {
			    clientWrap.append(cls.getElement());

                this.tabs[uid] = {
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
				this.enableTab(this.tabs[uid], false);
			}

			return this.tabs[uid];
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

		removeTab: function(tab){
			var entry = this.resolveTab(tab);
			var activeTab = this.tabPane.find('.active');
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
			entry.tab.find('.title').text(newName);
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
				this.tabPane.append(itemArr[i].tab);
			}
		},

		switchTab: function(tab){
			var entry = this.resolveTab(tab);

			var activeTab = this.tabPane.find('.active');
			if(entry.tab.attr('clientId') == activeTab.attr('clientId')){
				return;
			}
			activeTab.removeClass('active');
			entry.tab.addClass('active');

			var showArea = this.clientPane.find('.clientPaneWrapper[key="' + entry.tab.attr('clientId') + '"]');
			showArea.css('display','');
			this.clientPane.find('.clientPaneWrapper[key="' + activeTab.attr('clientId') + '"]').css('display','none');
			this.currentTab = entry;

			if(!entry.ctrl){
			    this.activateTab(entry.id);
			}
			if(this.options.onSwitchTab){
				this.options.onSwitchTab.call(this, tab);
			}

			return this.currentTab;
		}
	}
}