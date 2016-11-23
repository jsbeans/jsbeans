JSB({
	name:'JSB.Widgets.ItemList',
	parent: 'JSB.Widgets.ListBox',
	require: {
		'JSB.Widgets.ItemList.View': 'ItemListView'
	},
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('itemlist.css');
			this.addClass('_dwp_itemList');
			
			if(!this.options.views.basic){
				this.options.views.basic = new self.ItemListView();
			}
			
			this.switchView(this.options.view);
			this.setReadOnly(this.options.readOnly);
		},
		
		options: {
			views: {},
			view: 'basic',
			onSelected: function(tgtObj){},
			readOnly: false,
		},
		
		setReadOnly: function(b){
			this.options.readOnly = b;
			if(b){
				this.addClass('readonly');
			} else {
				this.removeClass('readonly');
			}
		},
		
		isReadOnly: function(){
			return this.options.readOnly;
		},
		
		switchView: function(viewName){
			var self = this;
			var viewInstance = this.options.views[viewName];
			if(!viewInstance){
				throw 'ItemList Error: Wrong view specified: ' + viewName;
			}
			if(this.viewInstance){
				this.viewInstance.deactivate();
				this.viewInstance.container = null;
			}
			if(this.viewName){
				this.rootElt.removeClass(this.viewName);
			}
			this.viewInstance = viewInstance;
			this.viewInstance.list = this;
			this.viewInstance.container = this.rootElt;
			this.viewInstance.activate(this.rootElt);
			this.viewName = viewName;
			this.rootElt.addClass(this.viewName);
			this.viewInstance.update();
			this.publish('JSB.Widgets.ItemList.switchView', this.viewName);
			this.each(function(itemObj){
				itemObj.obj.viewChanged(self.viewName);
			});
		},
		
		getSupportedViews: function(){
			return this.options.views;
		},
		
		getCurrentView: function(){
			return this.viewInstance;
		},
		
		getCurrentViewName: function(){
			return this.viewName;
		},
		
		addItem: function(item, id){
			if(JSO().isNull(id)){
				id = item.getId();
			}
			item.key = id;
			item.list = this;
			var it = this.base(JSO().merge(true, {}, item.options, {
				key: id,
				element: item
			}));
			
			this.publish('JSB.Widgets.ItemList.addItem', {id: id, item: item});
			
			return it;
		},

		insertItem: function(key, item, id){
			if(JSO().isNull(id)){
				id = JSO().generateUid();
			}
			item.key = id;
			item.list = this;
			var it = this.base(key, JSO().merge(true, {}, item.options, {
				key: id,
				element: item
			}));
			
			this.publish('JSB.Widgets.ItemList.insertItem', {key: key, id: id, item: item});
			return it;
		},
		
		deleteItem: function(key){
			this.base(key);
			this.publish('JSB.Widgets.ItemList.deleteItem', {id: key});
		},
		
		addSeparator: function(id){
			this.getSuperClass().addItem.call(this, {
				allowHover: false,
				allowSelect: false,
				key: id,
				cssClass: '_dwp_separator',
				element: ''
			});
		},
		
		insertSeparator: function(key, id){
			this.getSuperClass().insertItem.call(this, key, {
				allowHover: false,
				allowSelect: false,
				key: id,
				cssClass: '_dwp_separator',
				element: ''
			});
		},

		get: function(id){
			var itemObj = this.base(id);
			if(itemObj && itemObj.obj){
				return itemObj.obj;
			}
			return null;
		},
		
		clear: function(){
			this.base();
			this.publish('JSB.Widgets.ItemList.clear');
		},
		
		append: function(obj){
			if(JSO().isInstanceOf(obj, 'JSB.Widgets.ListItem')){
				this.addItem(obj);
				return this;
			} 
			
			return this.base(obj);
		}
	}
});

JSB({
	name:'JSB.Widgets.ItemList.View',
	parent: 'JSB.Widgets.Actor',
	require: {},
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			JSB.merge(true, this.options, opts);
		},
		
		options: {},
		container: null,
		
		getContainer: function(){
			return this.container;
		},
		
		activate: function(c){
			this.container = c;
			this.container.css({
				height: ''
			});
		},
		
		deactivate: function(){
			this.container = null;
		},
		
		isActive: function(){
			return this.container !== null;
		},
		
		update: function(){}
	}
});

JSB({
	name:'JSB.Widgets.ListItem',
	parent: 'JSB.Widgets.Control',
	require: {},
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('itemlist.css');
			this.addClass('_dwp_listItem');
			
			// add close btn
			if(this.options.close){
				this.closeBtn = this.$('<div class="_dwp_closeBtn"></div>');
				this.append(this.closeBtn);
				this.closeBtn.click(function(evt){
					if(self.list.options.readOnly){
						return;
					}
					if(self.options.onClose){
						var can = self.options.onClose.call(self, evt, function(can){
							if(can){
								self.deleteSelf();
								evt.stopPropagation();
							}
						});
						if(can){
							self.deleteSelf();
							evt.stopPropagation();
						}
					} else {
						self.deleteSelf();
						evt.stopPropagation();
					}
				});
				
			}
		},
		
		options: {
			onSelected: function(tgtObj){},
			close: true,
			allowHover: true,
			allowSelect: true
		},
		
		deleteSelf: function(){
			this.list.deleteItem(this.key);
			this.destroy();
		},
		
		viewChanged: function(viewName){
			console.log('viewChanged: ' + viewName);
		},
		
		getKey: function(){
			return this.key;
		}
	}
});