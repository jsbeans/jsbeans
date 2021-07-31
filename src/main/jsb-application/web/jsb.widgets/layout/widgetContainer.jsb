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
	$name:'JSB.Widgets.WidgetContainer',
	$parent:'JSB.Widgets.Control',
	$require: {
		TabView: 'JSB.Widgets.TabView'
	},
	$client: {
		$require: ['css:widgetContainer.css'],

		widgets: {},
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
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
			this.widgets[w.getId()] = {
			    desc: desc,
			    tab: tab,
			    w: w
            };
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
				if(this.widgets[id]){
					return this.widgets[id].w;
				} else {
					for(var wId in this.widgets){
						if(this.widgets[wId].tab.id == id){
							return this.widgets[wId].w;
						}
					}
					throw new Error('Failed to find widget by id: ' + id);
				}
			}
			
			if(Object.keys(this.widgets).length === 0){
				return null;
			}
			
			return this.widgets[Object.keys(this.widgets)[0]].w;
		},
		
		getTab: function(id){
			if(id){
				id = this.getWidget(id).getId();
				return this.widgets[id].tab;
			}
			if(Object.keys(this.widgets).length === 0){
				return null;
			}
			
			return this.widgets[Object.keys(this.widgets)[0]].tab;
		},
		
		switchWidget: function(w){
			if(JSB().isString(w)){
				w = this.getWidget(w);
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
			// nothing to do
		},
		
		getClientContainer: function(){
			return this.getElement();
		},

		hideWidget: function(wId) {
			this.wcView.hideTab(this.widgets[this.getWidget(wId).getId()].tab);
		},

		showWidget: function(wId) {
		    this.wcView.showTab(this.widgets[this.getWidget(wId).getId()].tab);
		}
	}
}