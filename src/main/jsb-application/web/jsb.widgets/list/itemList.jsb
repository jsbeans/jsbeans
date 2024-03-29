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
	$name:'JSB.Widgets.ItemList',
	$parent: 'JSB.Widgets.ListBox',
	$require: {
		ItemListView: 'JSB.Widgets.ItemList.View'
	},
	$client: {
		$require: ['css:itemList.css'],
		$constructor: function(opts){
			var self = this;
			this._onScrollHandler = opts && opts.onScroll;
			var extOpts = JSB.merge({}, opts, {onScroll: function(x, y){
				return $this._handleOnScroll(x, y);
			}})
			$base(extOpts);
			this.addClass('_dwp_itemList');
			
			if(!this.options.views.basic){
				this.options.views.basic = new ItemListView();
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
		
		_handleOnScroll: function(x, y){
			// do something
			$this.publish('JSB.Widgets.ItemList.scroll', {x: x, y: y});
			if($this._onScrollHandler){
				return $this._onScrollHandler.call($this, x, y);
			}
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
			if(JSB().isNull(id)){
				id = item.getId();
			}
			item.key = id;
			item.list = this;
			var it = $base(JSB().merge(true, {}, item.options, {
				key: id,
				element: item
			}));
			
			this.publish('JSB.Widgets.ItemList.addItem', {id: id, item: item});
			
			return it;
		},

		insertItem: function(key, item, id){
			if(JSB().isNull(id)){
				id = JSB().generateUid();
			}
			item.key = id;
			item.list = this;
			var it = $base(key, JSB().merge(true, {}, item.options, {
				key: id,
				element: item
			}));
			
			this.publish('JSB.Widgets.ItemList.insertItem', {key: key, id: id, item: item});
			return it;
		},
		
		deleteItem: function(key){
			$base(key);
			this.publish('JSB.Widgets.ItemList.deleteItem', {id: key});
		},
		
		addSeparator: function(id){
			$super.addItem({
				allowHover: false,
				allowSelect: false,
				key: id,
				cssClass: '_dwp_separator',
				element: ''
			});
		},
		
		insertSeparator: function(key, id){
			$super.insertItem(key, {
				allowHover: false,
				allowSelect: false,
				key: id,
				cssClass: '_dwp_separator',
				element: ''
			});
		},

		get: function(id){
			var itemObj = $base(id);
			if(itemObj && itemObj.obj){
				return itemObj.obj;
			}
			return null;
		},
		
		clear: function(){
			$base();
			this.publish('JSB.Widgets.ItemList.clear');
		},
		
		append: function(obj){
			if(JSB().isInstanceOf(obj, 'JSB.Widgets.ListItem')){
				this.addItem(obj);
				return this;
			} 
			
			return $base(obj);
		}
	}
}