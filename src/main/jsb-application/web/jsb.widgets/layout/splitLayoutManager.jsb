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
	$name: 'JSB.Widgets.SplitLayoutManager',
	$parent: 'JSB.Widgets.Widget',
	$require: {
		SplitBox: 'JSB.Widgets.SplitBox',
		TabView: 'JSB.Widgets.TabView',
		WidgetContainer: 'JSB.Widgets.WidgetContainer',
		FloatingContainer: 'JSB.Widgets.FloatingContainer'
	},
	$client: {
		$constructor: function(opts){
			$base(opts);

			this._widgetsCount = Object.keys(this.options.widgets).length;

			this.construct();
		},
		
		paneMap: {},
		_widgetsCount: 0,
		_widgetsReadyCount: 0,

		options: {
			layouts: {},
			widgets: {},
			widgetsReadyCallback: null
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
						desc.lastSplitPosition = position = desc.panes[i].size;
					} else if(JSB().isArray(position)){
						position.push(desc.panes[i].size);
					} else {
						position = [position, desc.panes[i].size];
					}
				}

				// setup SplitBox
				var sb = new SplitBox({
					overlay: $this.options.overlay,
					type: desc.split,
					position: position,
					onChange: function(idx, pos){
						desc.lastSplitPosition = pos;
					}
				});
				
				// setup panes
				for(var i = 0; i < desc.panes.length; i++ ) {
					(function(idx){
						var paneDesc = desc.panes[idx];
						paneDesc.ancestor = desc;
						if(paneDesc.key){
							if(!self.paneMap[layoutName]){
								self.paneMap[layoutName] = {};
							}
							self.paneMap[layoutName][paneDesc.key] = paneDesc;
						}
						self.constructArea(paneDesc, layoutName, function(ctrl){
							if(ctrl){
								paneDesc.ctrl = ctrl;
								var pane = sb.addToPane(idx, ctrl);
								if(paneDesc.key){
									ctrl.attr('key', paneDesc.key);
									pane.attr('key', paneDesc.key);
								}
								if(desc.split == 'vertical'){
									if(paneDesc.minSize){
										pane.css('min-width', paneDesc.minSize);
									}
									if(paneDesc.maxSize){
										pane.css('max-width', paneDesc.maxSize);
									}
								} else {
									if(paneDesc.minSize){
										pane.css('min-height', paneDesc.minSize);
									}
									if(paneDesc.maxSize){
										pane.css('max-height', paneDesc.maxSize);
									}
								}
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
					},
					position: 'fixed',
					allowClose: false,
/*					
					allowDock: true,
					dockedHorz: true,
					dockedVert: true
*/					
				};
				if(desc.caption){
					wcOpts.caption = desc.caption;
				}
				var ctrl = null;
				if(desc.floating){
					ctrl = new FloatingContainer(wcOpts);
				} else {
					ctrl = new WidgetContainer(wcOpts);
				}
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

                    if(self._widgetsReadyCount === self._widgetsCount){
                        if(JSB.isFunction(self.options.widgetsReadyCallback)){
                            self.options.widgetsReadyCallback.call(self);
                        }

                        $this.setTrigger('initialized');
                    }
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
									wDesc.jsb = JSB().isBean(wCls) ? wCls : new wCls(JSB.merge({ layoutManager: $this }, wDesc.options));
									self._widgetsReadyCount++;
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

		ensureInitialize: function(callback){
		    this.ensureTrigger('initialized', callback);
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
			
			this.getElement().attr('layout', layoutName);
			
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
		
		getPaneSplitBox: function(key, layoutName){
			if(!layoutName){
				layoutName = this.options.defaultLayout;
			}
			var pane = this.getPane(key, layoutName);
			var sb = null;
			if(pane){
				sb = pane.ctrl;
			}
			if(JSB().isInstanceOf(sb, 'JSB.Widgets.SplitBox')){
				return sb;
			}
		},
		
		expandPane: function(key, layoutName, animObj){
			if(!layoutName){
				layoutName = this.options.defaultLayout;
			}
			var pane = this.getPane(key, layoutName);
			var ancestor = pane && pane.ancestor;
			if(!ancestor || !ancestor.panes){
				return;
			}
			let paneIdx = null;
			for(let i = 0; i < ancestor.panes.length; i++){
				if(ancestor.panes[i] === pane){
					paneIdx = i;
					break;
				}
			}
			if(JSB.isNull(paneIdx)){
				return;
			}
			var sb = ancestor && ancestor.ctrl;
			if(!JSB.isInstanceOf(sb, 'JSB.Widgets.SplitBox')){
				return;
			}
			var container = sb.getPane(paneIdx);
			sb.setSplitterPosition(0, ancestor.lastSplitPosition || ancestor.size, animObj, ()=>{
				// release size in ctrl to prevent child elements from layout change
				if(ancestor.split == 'vertical'){
					pane.ctrl.getElement().css('width', '');
				} else {
					pane.ctrl.getElement().css('height', '');
				}
				
				if(JSB.isDefined(pane.minSize)){
					if(ancestor.split == 'vertical'){
						container && container.css('min-width', pane.minSize);
					} else {
						container && container.css('min-height', pane.minSize);
					}
				}
			});
			
		},
		
		collapsePane: function(key, layoutName, animObj){
			if(!layoutName){
				layoutName = this.options.defaultLayout;
			}
			var pane = this.getPane(key, layoutName);
			var ancestor = pane && pane.ancestor;
			if(!ancestor || !ancestor.panes){
				return;
			}
			let paneIdx = null;
			for(let i = 0; i < ancestor.panes.length; i++){
				if(ancestor.panes[i] === pane){
					paneIdx = i;
					break;
				}
			}
			if(JSB.isNull(paneIdx)){
				return;
			}
			var sb = ancestor && ancestor.ctrl;
			
			if(!JSB.isInstanceOf(sb, 'JSB.Widgets.SplitBox')){
				return;
			}
			
			// remove minimal constraints from container
			if(JSB.isDefined(pane.minSize)){
				var container = sb.getPane(paneIdx);
				if(ancestor.split == 'vertical'){
					container && container.css('min-width', '');
				} else {
					container && container.css('min-height', '');
				}
			}
			
			// fix size in ctrl to prevent child elements from layout change
			if(ancestor.split == 'vertical'){
				pane.ctrl.getElement().css('width', pane.ctrl.getElement().width()+'px');
			} else {
				pane.ctrl.getElement().css('height', pane.ctrl.getElement().height()+'px');
			}
			
			// collapse pane
			if(paneIdx == 0){
				sb.setSplitterPosition(0, 0, animObj);
			} else {
				sb.setSplitterPosition(0, 1, animObj);
			}
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

		getWidget: function(wName){
		    return this.options.widgets[wName].jsb;
		},
		
		construct: function(){
			var self = this;
			this.addClass('_jsb_splitLayoutManager');
			this.layoutsView = new TabView({
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
							if(layoutDesc.key){
								layoutDesc.ctrl.attr('key', layoutDesc.key);
							}
							if(name == self.options.defaultLayout){
								self.layoutsView.switchTab(name);
							}
						});
					})(l);
				}
			}
			
			this.getElement().attr('layout', this.options.defaultLayout);
		}
	}
}