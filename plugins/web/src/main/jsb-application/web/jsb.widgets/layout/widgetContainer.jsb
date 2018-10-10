{
	$name:'JSB.Widgets.WidgetContainer',
	$parent:'JSB.Widgets.Control',
	$require: {
		TabView: 'JSB.Widgets.TabView'
	},
	$client: {
		widgets: {},
		
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			$jsb.loadCss('widgetContainer.css');
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
			
			this.wcView = new TabView(twOpts);
			
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
			$base();
		},
		
		getElement: function(){
			return this.element;
		},
		
		attachWidget: function(w, desc){
			if(!w || !JSB().isInstanceOf(w, 'JSB.Widgets.Widget')){
				throw 'WidgetContainer: Failed to attach widget';
			}
			if(w.getContainer() == this){
				return;	// already attached
			}
			
			desc = desc || {};
			
			w.detachContainer();
			
			var title = desc.title || w.getTitle() || desc.id || w.getId();
			var tab = this.wcView.addTab(title, w, desc);
			this.widgets[w.getId()] = {tab: tab, w: w};
			w.setContainer(this);
			
			this.updateBehavior(w.getBehavior());
			this.publish('JSB.Widgets.WidgetContainer.widgetAttached', w);
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
			w.setContainer(null);
			
			this.publish('JSB.Widgets.WidgetContainer.widgetDetached', w);
			
			return w;
		},
		
		getActiveWidget: function(){
			var curTab = this.wcView.getCurrentTab();
			if(curTab){
				return curTab.ctrl;
			}
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
		
		renameWidget: function(w, newName){
			if(JSB.isString(w)){
				w = this.widgets[w].w;
			}
			w.title = newName;
			var tab = this.widgets[w.getId()].tab;
			this.wcView.renameTab(tab, newName);
		},
		
		updateBehavior: function(b){
			// nothing todo
			
		},
		
		getClientContainer: function(){
			return this.getElement();
		}
	}
}