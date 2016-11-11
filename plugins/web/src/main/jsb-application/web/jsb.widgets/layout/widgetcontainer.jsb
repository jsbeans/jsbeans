JSB({
	name:'JSB.Widgets.WidgetContainer',
	parent:'JSB.Widgets.Control',
	require: {
		'JSB.Widgets.TabView': 'TabView'
	},
	client: {
		widgets: {},
		
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('widgetcontainer.css');
			this.getElement().addClass('_dwp_widgetContainer');
			
			var twOpts = {
				showTabs: this.options.caption,
				allowNewTab: false,
				allowCloseTab: this.options.allowClose
			};
			
			if(opts && opts.onActivateWidget){
				twOpts.onSwitchTab = function(tab){
					var tab = this.resolveTab(tab);
					opts.onActivateWidget.call(self, tab.ctrl, tab.opts);
				}
			}
			
			this.wcView = new self.TabView(twOpts);
			
			JSB().deferUntil(function(){
				self.getClientContainer().append(self.wcView.getElement());
			}, function(){
				return self.getClientContainer();
			});
			
		},
		
		options: {
			caption: false,
			allowClose: false
		},
		
			// members
			
		destroy: function(){
			for(var i in this.widgets){
				this.widgets[i].w.destroy();
				
			}
			this.widgets = {};
			this.base();
		},
		
		getElement: function(){
			return this.element;
		},
		
		attachWidget: function(w, desc){
			if(!w || !JSB().isInstanceOf(w, 'JSB.Widgets.Widget')){
				throw 'WidgetContainer: Failed to attach widget';
			}
			if(w.container == this){
				return;	// already attached
			}
			
			desc = desc || {};
			
			w.detachContainer();
			
			var title = desc.title || desc.id || w.getId();
			var tab = this.wcView.addTab(title, w, desc);
			this.widgets[w.getId()] = {tab: tab, w: w};
			w.container = this;
			
			this.updateBehavior(w.getBehavior());
		},
		
		detachWidget: function(w){
			if(JSB().isString(w)){
				w = this.widgets[w].w;
			}
			if(!w){
				return null;
			}

			// detach widget from tab view
			w.getElement().detach();
			var tab = this.widgets[w.getId()].tab;
			var entry = this.wcView.resolveTab(tab);
			entry.ctrl = null;
			
			delete this.widgets[w.getId()];
			this.wcView.removeTab(tab);
			w.container = null;
			
			return w;
		},
		
		getWidget: function(id){
			if(id){
				return this.widgets[id].w;
			}
			
			if(Object.keys(this.widgets).length === 0){
				return null;
			}
			
			return this.widgets[Object.keys(this.widgets)[0]].w;
		},
		
		getTab: function(id){
			if(id){
				return this.widgets[id].tab;
			}
			if(Object.keys(this.widgets).length === 0){
				return null;
			}
			
			return this.widgets[Object.keys(this.widgets)[0]].tab;
		},
		
		switchWidget: function(w){
			if(JSB().isString(w)){
				w = this.widgets[w].w;
			}
			var tab = this.widgets[w.getId()].tab;
			this.wcView.switchTab(tab);
		},
		
		updateBehavior: function(b){
			// nothing todo
			
		},
		
		getClientContainer: function(){
			return this.getElement();
		}

	}
});