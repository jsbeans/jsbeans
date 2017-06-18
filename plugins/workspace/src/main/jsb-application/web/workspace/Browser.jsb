{
	$name: 'JSB.Workspace.Browser',
	$parent: 'JSB.Widgets.Widget',
	
	$require: ['JSB.Workspace.WorkspaceController', 
	           'JSB.Workspace.FileBrowserView',
	           'JSB.Widgets.TabView',
	           'JSB.Widgets.Button',
	           'JQuery.UI.Effects'],
	
	$sync: {
		updateCheckInterval: 0
	},
	
	currentWorkspace: null,
	currentNode: null,
	manager: null,
	wmKey: null,
	views: {},
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('Browser.css');
			this.addClass('workspaceBrowser');
			
			this.tabView = new TabView({
				allowCloseTab: false,
				allowNewTab: false
			});
			this.append(this.tabView);
			
			this.addView('fileBrowser', 'Объекты', new FileBrowserView());
			this.addView('fileBrowser2', 'Файлы', new FileBrowserView());
			
			
			
			if(this.options.wmKey){
				this.bindManager(this.options.wmKey);
			}

			this.subscribe('Workspace.Explorer.nodeOpen', function(sender, msg, node){
				if(!$jsb.isInstanceOf(sender, 'JSB.Workspace.Explorer') || sender.wmKey != $this.wmKey){
					return;
				}
				$jsb.setCurrentNode(node);
			});
		},
		
		addView: function(id, title, view){
			if(this.views[id]){
				return;
			}
			this.views[id] = view;
			return this.tabView.addTab(title, view, {id: id});
		},
		
		activateView: function(id){
			if(!this.views[id]){
				return;
			}
			this.tabView.switchTab(id);
			this.views[id].setCurrentNode(node);
		},
		
		setCurrentNode: function(node){
			if(!$jsb.isInstanceOf(node, 'JSB.Workspace.ExplorerNode') || this.currentNode == node){
				return;
			}
			this.currentNode = node;
			if(this.currentNode.descriptor.type == 'node'){
				// file browser view
				this.activateView('fileBrowser');
			} else {
				// entry view
			}
			this.refresh();
		},
		
		bindManager: function(wmKey, callback){
			this.server().bindManager(wmKey, function(mgr){
				$this.manager = mgr;
				$this.wmKey = wmKey;
				if(callback){
					callback.call($this);
				}
			});
		},
		
		refresh: function(){},
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