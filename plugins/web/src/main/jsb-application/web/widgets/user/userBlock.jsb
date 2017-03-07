{
	name: 'UserBlock',
	parent: 'JSB.Widgets.Control',
	require: {
		'JSB.Widgets.ListBox': 'ListBox',
		'JSB.Widgets.ToolManager': 'ToolManager',
		'UserMenuTool': 'UserMenuTool'
	},
	
	common: {
		sync: true,
		
		user: null
	},
	
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('userBlock');
			this.loadCss('userBlock.css');

			this.append(#dot {{
				<div class="loggedPanel">
					<div class="icon"></div>
					<div class="link name"></div>
					<div class="downBtn"></div>
				</div>
				<div class="registerPanel">
					{{? this.options.enter}}
					<div class="link enter">Вход</div>
					{{?}}
					{{? this.options.register}}
					<div class="link register">Регистрация</div>
					{{?}}
				</div>
			}});
/*			
			this.getElement().css({display:'none'});
			this.updateUser(function(){
				self.getElement().css({display:''});
			});
*/			
			this.find('.link.enter').click(function(){
				// on enter clicked
				debugger;
			});

			this.find('.link.register').click(function(){
				// on register clicked
				debugger;
			});
			
			this.find('.loggedPanel').click(function(evt){
				self.showUserMenu(evt);
			});
			
			this.subscribe(['userLogout'], function(sender, msg, params){
				if(sender == self){
					return;
				}
				self.user = null;
				self.updateUser();
			});
		},

		menuItems: null,
		instanceCache: {},
		
		options: {
			enter: true,
			register: true
		},
		
		onAfterSync: function(syncInfo){
			var self = this;
			if(!syncInfo.isChanged('user')){
				return;
			}
			this.updateUser();
			if(this.user && this.user.name && this.user.name.length > 0){
				self.publish('userLogin', this.user.name);
			} else {
				self.publish('userLogout');
			}
		},
		
		updateUser: function(){
			var self = this;
			if(self.user && self.user.name && self.user.name.length > 0){
				self.addClass('loggedin');
				self.find('.loggedPanel').addClass(self.user.type);
				self.find('.name').text(self.user.name);
			} else {
				self.removeClass('loggedin');
			}
			
			self.server().collectMenuItems(function(items){
				self.items = items;
				self.constructUserMenu();
			});
		},
		
		showUserMenu: function(evt){
			var self = this;
			var toolMgr = JSO().getInstance('JSB.Widgets.ToolManager');
			var elt = this.$(evt.currentTarget);
			var autoBox = toolMgr.activate({
				id: '_dwp_droplistTool',
				cmd: 'show',
				data: this.menuItems,
				scope: null,
				target: {
					selector: this.find('.loggedPanel'),
					dock: 'bottom',
					offsetVert: 4
				},
				callback: function(key, item, evt){
					self.executeCommand(key, evt);
				}
			});
		},
		
		constructUserMenu: function(){
			// sort items
			var items = [];
			for(var i in this.items){
				items.push(this.items[i]);
			}
			items.sort(function(a, b){
				return a.order - b.order;
			});
			
			this.menuItems = [];
			var lastGroup = null;
			
			// build toolCtrl
			for(var i in items){
				if(lastGroup && items[i].group && lastGroup != items[i].group){
					// add separator
					this.menuItems.push({
						allowHover: false,
						allowSelect: false,
						key: lastGroup + 'Separator',
						element: '<div class="separator""></div>',
						cssClass: 'userMenuItemSeparator'
					});

				}
				this.menuItems.push({
					key: items[i].jso,
					element: '<div class="menuItem" key="'+items[i].jso+'"><div class="icon"></div><div class="text">'+items[i].displayName+'</div></div>',
					cssClass: 'userMenuItem'
				});
				
				lastGroup = items[i].group;
			}
		},
		
		executeCommand: function(key, evt){
			var self = this;
			var item = this.items[key];
			if(item.widget){
				function _showWidget(w){
					var toolMgr = JSO().getInstance('JSB.Widgets.ToolManager');
					var elt = self.$(evt.currentTarget);
					toolMgr.activate({
						id: '_dwp_userMenuTool',
						cmd: 'show',
						data: w,
						scope: null,
						target: {
							selector: null	// screen center
						},
						callback: function(res){
						}
					});
				}
				
				var w = null;
				if(this.instanceCache[key]){
					w = this.instanceCache[key];
					_showWidget(w);
				} else {
					JSO().lookup(item.jso, function(wcls){
						w = new wcls();
						self.instanceCache[key] = w;
						_showWidget(w);
					});
				}
			} else {
				if(this.instanceCache[key]){
					w = this.instanceCache[key];
					w.execute();
				} else {
					JSO().lookup(item.jso, function(wcls){
						w = new wcls();
						self.instanceCache[key] = w;
						w.execute();
					});
				}
			}
		}
	},
	
	server: {
		onSyncCheck: function(){
			this.user = this.getCurrentUser();
		},
		
		getCurrentUser: function(){
			var user = Kernel.user();
			if(!user){
				return {name: null, type: null};
			}
			return {name: user, type: user.indexOf('@') > 0 ? 'person':'organization'};
		},
		
		collectMenuItems: function(){
			var retObj = {};
			var items = Repo.list('User/Menu').items;
			for(var i in items){
				if(!items[i].isSubclassOf('JSB.Widgets.Widget') && !items[i].isSubclassOf('UserMenuItem')){
					continue;
				}
				retObj[i] = items[i].expose;
				retObj[i].jso = i;
				retObj[i].widget = items[i].isSubclassOf('JSB.Widgets.Widget');
			}
			return retObj;
		}
	}
}