JSB({
	name:'Ontoed.LogView',
	parent: 'JSB.Widgets.Widget',
	require: ['Ontoed.WorkspaceManager', 'JSB.Widgets.ListBox', 'JSB.Widgets.ToolBar'],
	
	common: {
		sync: true,
		
		items: {}
	},
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('logView');
			this.loadCss('logview.css');
			
			this.toolbar = new JSB.Widgets.ToolBar();
			this.append(this.toolbar);
			
			this.toolbar.addItem({
				key: 'clear',
				element: '<div class="icon" title="Очистить журнал"></div>',
				click: function(){
					self.server.clear(function(){
						self.items = {},
						self.listBox.clear();
					});
				}
			});
			
			this.toolbar.addSeparator();
			
			this.toolbar.addItem({
				key: 'scrollLock',
				checkbox: true,
				element: '<div class="icon" title="Заблокировать скроллинг"></div>',
				click: function(){
				}
			});

			
			this.listBox = new JSB.Widgets.ListBox({
				allowHover: false,
				allowSelect: false
			});
			this.append(this.listBox);
		},
		
		onAfterSync: function(syncInfo){
			var self = this;
			var itemsToAdd = [];
			if(syncInfo.items && syncInfo.items.d && Object.keys(syncInfo.items.d).length > 0){
				for(var fId in syncInfo.items.d){
					if(syncInfo.items.d[fId].ex){
						itemsToAdd.push(this.items[fId]);
					} else {
						this.removeItem(fId);
					}
				}
			}
			
			if(itemsToAdd.length > 0){
				itemsToAdd.sort(function(a, b){
					return a.timestamp - b.timestamp;
				});
			}
			
			var lastItem = null;
			for(var i in itemsToAdd){
				lastItem = this.addItem(itemsToAdd[i]);
			}
			if(lastItem && !self.toolbar.isChecked('scrollLock')){
				JSB().deferUntil(function(){
					// scroll bottom
					if(!self.toolbar.isChecked('scrollLock')){
						self.listBox.scrollTo(lastItem.wrapper);
					}
				}, function(){
					return lastItem.wrapper.width() > 0 && lastItem.wrapper.height() > 0;
				}, 100, false, 'onAfterSync' + this.getId());
			}
			
		},
		
		addItem: function(desc){
			var self = this;
			function htmlEncode(value){
				return self.$('<div/>').text(value).html();
			}
			
			var key = '' + desc.timestamp;
			var date = new Date(desc.timestamp);
			var elt = this.$(#dot{{
				<div class="level"></div>
				<div class="timestamp">{{=date.toLocaleTimeString() + '.' + date.getUTCMilliseconds()}}</div>
				<div class="message">{{=htmlEncode(desc.message)}}</div>
			}});
			
			return this.listBox.addItem({
				key: key,
				element: elt,
				cssClass: desc.level,
				desc: desc
			});
		},
		
		removeItem: function(key){
			
		}
	},
	
	server: {
		singleton: true,
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			
			// subscribe event
			Workspace.logs().setCallback(function(desc){
				self.addItem(desc);
			});
			
			// load all logs
			var itemArr = Workspace.logs().all();
			for(var i in itemArr){
				self.addItem(itemArr[i]);
			}
		},
	
		addItem: function(desc){
			var timeStampStr = '' + desc.timestamp;
			this.items[timeStampStr] = {
				timestamp: desc.timestamp,
				level: desc.level,
				message: desc.message
			}
		},
		
		clear: function(){
			this.items = {};
			Workspace.logs().clear();
		}
	}
});