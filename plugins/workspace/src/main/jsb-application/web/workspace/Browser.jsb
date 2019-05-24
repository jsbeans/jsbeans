/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Workspace.Browser',
	$parent: 'JSB.Widgets.Widget',
	
	$require: ['JSB.Workspace.WorkspaceController',
	           'JSB.Workspace.Navigator',
	           'JSB.Controls.TabView',
	           'JSB.Widgets.Button',
	           'jQuery.UI.Effects'],
	
	$sync: {
		updateCheckInterval: 0
	},
	
	currentWorkspace: null,
	currentNode: null,
	manager: null,
	wmKey: null,
	nodeViewRegistry: {},
	views: {},
	
	$client: {
		$require: ['css:Browser.css'],
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('workspaceBrowser');
			
			this.tabView = new TabView({
				allowCloseTab: false,
				allowNewTab: false,
				onSwitchTab: function(id){
					if($this.views[id]){
						var viewArr = $this.getAvailableViews();
						var viewOpts = null;
						for(var i = 0; i < viewArr.length; i++){
							if(viewArr[i].viewEntry.id == id){
								viewOpts = viewArr[i];
								break;
							}
						}
						$this.views[id].ctrl.setCurrentEntry($this.currentNode ? $this.currentNode.getTargetEntry() : null, viewOpts);
					}
				}
			});
			this.append(this.tabView);
			
			this.navigator = new Navigator(this.options);
			this.append(this.navigator);
			
			if(this.options.wmKey){
				this.bindManager(this.options.wmKey);
			}

			this.subscribe('JSB.Workspace.nodeOpen', function(sender, msg, node){
				if(sender.wmKey != $this.wmKey){
					return;
				}
				$this.setCurrentNode(node);
			});
			
			this.subscribe('JSB.Workspace.changeWorkspace', function(sender, msg, w){
				if(sender.wmKey != $this.wmKey){
					return;
				}
				$this.setCurrentWorkspace(w);
				$this.setCurrentNode(null);	// display root
			});
		},
		
		setCurrentWorkspace: function(w){
			this.currentWorkspace = w;
			this.manager = w.workspaceManager;
		},
		
		addView: function(id, title, viewCls){
			if(!this.views[id]){
				this.views[id] = this.tabView.addTab(title, viewCls, {id: id, dontSwitchOnCreate: true });
				this.views[id].tab.resize(function(){
					JSB.defer(function(){
						$this.updateNavigator();
					}, 100, 'addView_' + $this.getId());
				});
			}
			
			return this.views[id];
		},
		
		activateView: function(id, opts){
			if(!this.views[id]){
				return;
			}
			this.tabView.switchTab(id);
			$this.views[id].ctrl.setCurrentEntry($this.currentNode ? $this.currentNode.getTargetEntry() : null, opts);
		},
		
		getActiveView: function(){
		    if(!this.tabView.getCurrentTab()){
		        return null;
		    }
			return this.tabView.getCurrentTab().id;
		},
		
		setCurrentNode: function(node){
			if(node && (!$jsb.isInstanceOf(node, 'JSB.Workspace.ExplorerNode') || this.currentNode == node)){
				return;
			}
			if(!this.currentWorkspace){
				$jsb.deferUntil(function(){
					$this.setCurrentNode(node);
				}, function(){
					return $this.currentWorkspace;
				}, 100, true, 'setCurrentNode' + $this.getId());
			}
			this.currentNode = node;
			var nodeType = this.currentNode ? this.currentNode.getJsb().$name : null;
			if(this.nodeViewRegistry[nodeType]){
				this.updateViewsForNode();
			} else {
                // hide all tabs
                var tabs = this.tabView.find('> .tabPane > li');
                tabs.css('display', 'none');
                
                var queryType = nodeType;
                if(JSB.isInstanceOf(this.currentNode, 'JSB.Workspace.EntryNode')){
                	queryType = this.currentNode.getTargetEntry().getJsb().$name;
                }

				WorkspaceController.server().queryBrowserViews(this.wmKey, queryType, function(viewArr){
					$this.nodeViewRegistry[nodeType] = viewArr;
					// ensure all view jsbs loaded
					$jsb.chain(viewArr, function(viewDesc, c){
						if($this.views[viewDesc.viewType]){
							viewDesc.viewEntry = $this.views[viewDesc.viewType];
							c.call($this);
						} else {
							$jsb.lookup(viewDesc.viewType, function(cls){
								viewDesc.viewEntry = $this.addView(viewDesc.viewType, viewDesc.caption, cls);
								c.call($this);
							});
						}
					}, function(){
						$this.updateViewsForNode(true);
					});
				});
			}
		},
		
		getAvailableViews: function(){
			var nodeType = this.currentNode ? this.currentNode.getJsb().$name : null;
			return this.nodeViewRegistry[nodeType];
		},
		
		updateViewsForNode: function(ignorePrevView){
			var viewArr = this.getAvailableViews();
			var currentViewId = this.getActiveView();

			// hide all tabs
			var tabs = this.tabView.find('> .tabPane > li');
			tabs.css('display', 'none');
			
			if(viewArr.length == 0){
				return;
			}
			
			// show visible
			for(var i = 0; i < viewArr.length; i++){
				viewArr[i].viewEntry.tab.css('display', '');
				if(viewArr[i].icon){
					viewArr[i].viewEntry.tab.find('> .icon').css('background-image', 'url(' + viewArr[i].icon + ')')
				}
				if(viewArr[i].caption){
					viewArr[i].viewEntry.tab.find('> .title').text(viewArr[i].caption);
				}
			}
			
			// reorder tabs
			var posMap = {};
			for(var i = 0; i < viewArr.length; i++){
				posMap[viewArr[i].viewEntry.id] = i;
			}
			this.tabView.sortTabs(function(a, b){
				return posMap[b.id] - posMap[a.id];
			});
			
			// activate view
			var bActivated = false;
			if(!ignorePrevView && currentViewId){
				for(var i = 0; i < viewArr.length; i++){
					if(viewArr[i].viewEntry.id == currentViewId){
						this.activateView(currentViewId, viewArr[i]);
						bActivated = true;
						break;
					}
				}
			}
			if(!bActivated){
				// activate first view
				this.activateView(viewArr[0].viewEntry.id, viewArr[0]);
			}
			
			this.updateNavigator();
		},
		
		bindManager: function(wmKey, callback){
			$this.wmKey = wmKey;
			$this.navigator.bindManager(wmKey);
			this.server().bindManager(wmKey, function(mgr){
				$this.manager = mgr;
				if(callback){
					callback.call($this);
				}
			});
		},
		
		updateNavigator: function(){
			var tabs = this.tabView.find('> ul.tabPane > li:visible');
			var size = 16;
			for(var i = 0; i < tabs.length; i++){
				size += this.$(tabs[i]).outerWidth(true);
			}
			this.navigator.getElement().css('width', 'calc(100% - ' + size + 'px)');
		}
	},
	
	$server: {
		$constructor: function(){
			$base();
		},
		
		bindManager: function(wmKey){
			this.manager = WorkspaceController.ensureManager(wmKey);
			this.wmKey = wmKey;
			return this.manager;
		},
		
	}
}