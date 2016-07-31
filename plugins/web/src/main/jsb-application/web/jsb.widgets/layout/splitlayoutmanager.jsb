JSB({
	name: 'JSB.Widgets.SplitLayoutManager',
	parent: 'JSB.Widgets.Widget',
	require: {
		'JSB.Widgets.SplitBox': 'SplitBox',
		'JSB.Widgets.TabView': 'TabView',
		'JSB.Widgets.WidgetContainer': 'WidgetContainer'
	},
	client: {
		constructor: function(opts){
			this.base(opts);
			this.construct();
		},
		
		paneMap: {},
		
		options: {
			layouts: {},
			widgets: {}
		},
		
		constructArea: function(desc, layoutName, callback){
			var self = this;
			if(desc.split && desc.panes){
				// construct SplitBox
				var position = null;
				var totalSize = 0;
				var missedCount = 0;
				for(var i in desc.panes){
					if(!JSB().isNull(desc.panes[i].size)){
						totalSize += desc.panes[i].size;
					} else {
						missedCount++;
					}
				}
				if(totalSize > 1){
					throw 'Invalid layout size: ' + JSON.stringify(desc);
				}
				
				// fixup missing sizes
				var restSize = 1.0 - totalSize;
				if(missedCount){
					var missedSize = restSize / missedCount;
					for(var i in desc.panes){
						if(JSB().isNull(desc.panes[i].size)){
							desc.panes[i].size = missedSize;
						} 
					}
				}
				
				// collect positions for SplitBox
				for(var i = 0; i < desc.panes.length - 1; i++){
					if(JSB().isNull(position)){
						position = desc.panes[i].size;
					} else if(JSB().isArray(position)){
						position.push(desc.panes[i].size);
					} else {
						position = [position, desc.panes[i].size];
					}
				}

				// setup SplitBox
				var sb = new self.SplitBox({
					type: desc.split,
					position: position
				});
				
				// setup panes
				for(var i = 0; i < desc.panes.length; i++ ) {
					(function(idx){
						var paneDesc = desc.panes[idx];
						if(paneDesc.key){
							if(!self.paneMap[layoutName]){
								self.paneMap[layoutName] = {};
							}
							self.paneMap[layoutName][paneDesc.key] = paneDesc;
						}
						self.constructArea(paneDesc, layoutName, function(ctrl){
							if(ctrl){
								paneDesc.ctrl = ctrl;
								sb.addToPane(idx, ctrl);
							}
						});
					})(i);
				}
				
				if(callback){
					callback.call(self,sb);
				}
			} else if(desc.widgets){
				// create widget container
				var wcOpts = {
					onActivateWidget: function(w, opts){
						if(self.options.defaultLayout != layoutName || desc.ignoreTrackWidgetChange){
							return;
						}
						desc.defaultWidget = opts.id;
						self.publish('_jsb_activateWidget', {widget: w, opts: opts});
					}
				};
				if(desc.caption){
					wcOpts.caption = desc.caption;
				}
				var ctrl = new self.WidgetContainer(wcOpts);
				if(desc.key){
					ctrl.getElement().attr('key', desc.key);
				}
				if(callback){
					callback.call(self,ctrl);
				}
				
				// assign widgets
				var widgets = [];
				if(!JSB().isArray(desc.widgets)){
					desc.widgets = [desc.widgets];
				}
				
				function _checkWidgetInstances(){
					for(var i = 0; i < desc.widgets.length; i++ ){
						var wName = desc.widgets[i];
						var wDesc = self.options.widgets[wName];
						if(!wDesc.jsb || !JSB().isBean(wDesc.jsb) ){
							return;
						}
					}
					
					if(self.options.defaultLayout != layoutName){
						return;
					}
					desc.ignoreTrackWidgetChange = true;
					for(var i = 0; i < desc.widgets.length; i++ ){
						var wName = desc.widgets[i];
						if(!desc.defaultWidget){
							desc.defaultWidget = wName;
						}

						var wDesc = self.options.widgets[wName];
						var wOpts = {
							title: wDesc.title,
							id: wName
						};
						ctrl.attachWidget(wDesc.jsb, wOpts);
					}
					desc.ignoreTrackWidgetChange = false;
					var wDesc = self.options.widgets[desc.defaultWidget];
					ctrl.switchWidget(wDesc.jsb);
					
				}
				
				for(var i = 0; i < desc.widgets.length; i++ ){
					(function(idx){
						var wName = desc.widgets[idx];
						if(!JSB().isString(wName)){
							throw 'Expected widget id but found: ' + JSON.stringify(wName);
						}
						var wDesc = self.options.widgets[wName];
						if(!wDesc){
							throw 'Unknown widget id specified: ' + wName;
						}
						
						if(wDesc.jsb && JSB().isBean(wDesc.jsb)){
							_checkWidgetInstances();
						} else {
							if(!wDesc.jsb || !JSB().isString(wDesc.jsb)){
								throw 'Parameter "jsb" is missing or invalid: ' + JSON.stringify(wDesc);
							}
							JSB().lookup(wDesc.jsb, function(wCls){
								if(!JSB().isBean(wDesc.jsb)){
									wDesc.jsb = JSB().isBean(wCls) ? wCls : new wCls(wDesc.options || {});
								}
								_checkWidgetInstances();
							});
						}
					})(i);
				}
				
			} else {
				throw 'Invalid layout descriptor specified: ' + JSON.stringify(desc);
			}
		},
		
		updateArea: function(desc){
			var self = this;
			if(!desc){
				return;
			}
			if(desc.panes){
				for(var i = 0; i < desc.panes.length; i++ ) {
					var paneDesc = desc.panes[i];
					this.updateArea(paneDesc);
				}
			} else if(desc.widgets) {
				var wc = desc.ctrl;
				desc.ignoreTrackWidgetChange = true;
				for(var i = 0; i < desc.widgets.length; i++ ){
					var wName = desc.widgets[i];
					if(!desc.defaultWidget){
						desc.defaultWidget = wName;
					}
					var wDesc = self.options.widgets[wName];
					var wOpts = {
						title: wDesc.title,
						id: wName
					};
					wDesc.jsb.detachContainer();
					wc.attachWidget(wDesc.jsb, wOpts);
				}
				desc.ignoreTrackWidgetChange = false;
				var wDesc = self.options.widgets[desc.defaultWidget];
				wc.switchWidget(wDesc.jsb);
			}
		},
		
		switchLayout: function(layoutName){
			var self = this;
			if(!layoutName || !this.options.layouts || !this.options.layouts[layoutName]){
				return;
			}
			
			if(self.options.defaultLayout == layoutName){
				return;
			}
			
			self.options.defaultLayout = layoutName;
			
			// switch tab
			this.layoutsView.switchTab(layoutName);
			
			// reattach widgets
			this.updateArea(self.options.layouts[layoutName]);
			
			this.publish('_jsb_switchLayout', layoutName);
		},
		
		addLayout: function(name, layoutDesc){},
		
		addWidget: function(name, widgetDesc){},
		
		getPane: function(key, layoutName){
			if(!layoutName){
				layoutName = this.options.defaultLayout;
			}
			var paneMap = this.paneMap[layoutName];
			if(!paneMap){
				return null;
			}
			return paneMap[key];
		},
		
		getPaneContainer: function(key, layoutName){
			var pane = this.getPane(key, layoutName);
			var wc = null;
			if(pane){
				wc = pane.ctrl;
			}
			if(JSB().isInstanceOf(wc, 'JSB.Widgets.WidgetContainer')){
				return wc;
			}
			return null;
		},
		
		construct: function(){
			var self = this;
			this.addClass('_jsb_splitLayoutManager');
			this.layoutsView = new self.TabView({
				showTabs: false,
				allowNewTab: false,
				allowCloseTab: false,
				dontSwitchOnCreate: true
			});
			this.append(this.layoutsView);
			
			// construct layouts
			if(this.options.layouts){
				for(var l in this.options.layouts){
					(function(name){
						if(!self.options.defaultLayout){
							self.options.defaultLayout = name;
						}
						var layoutDesc = self.options.layouts[name];
						self.constructArea(layoutDesc, name, function(ctrl){
							layoutDesc.ctrl = ctrl;
							self.layoutsView.addTab(name, ctrl, {});
							if(name == self.options.defaultLayout){
								self.layoutsView.switchTab(name);
							}
						});
					})(l);
				}
			}
		}
	}
});