{
	$name: 'DataCube.Model.Dashboard',
	$parent: 'JSB.Workspace.Entry',
	
	getWidgetCount: function(){
		return this.widgetCount;
	},
	
	widgetCount: 0,
	lastUpdated: null,
	
	$client: {
		enumWidgets: function(callback){
			$this.server().getWrappers(callback);
		}
	},
	
	$server: {
		layout: null,
		wrappers: {},
		
		$require: ['JSB.Workspace.WorkspaceController',
		           'DataCube.Model.Widget'],
		
		loaded: false,
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, 0.5, 'DataCube.DashboardNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(this.property('widgets')){
				this.widgetCount = this.property('widgets');
			}
			if(this.property('lastUpdated')){
				this.lastUpdated = this.property('lastUpdated');
			}
		},
		
		destroy: function(){
			if(this.workspace.existsArtifact(this.getLocalId() + '.dashboard')){
				this.workspace.removeArtifact(this.getLocalId() + '.dashboard');
			}
			$base();
		},
		
		updateLayout: function(layout){
			this.load();
			// check layout to be stored
			function checkLayoutFailed(lEntry){
				if(lEntry && lEntry.widgets){
					for(var i = 0; i < lEntry.widgets.length; i++){
						var wServerId = lEntry.widgets[i];
						if(!$this.wrappers[wServerId]){
							return wServerId;
						}
					}
				} 
				if(lEntry && lEntry.containers){
					for(var i = 0; i < lEntry.containers.length; i++){
						var failId = checkLayoutFailed(lEntry.containers[i]);
						if(failId){
							return failId;
						}
					}
				}
				
				return false;
			}
			
			var failId = checkLayoutFailed(layout);
			if(failId){
				JSB.getLogger().warn('Wrong layout: Unable to find widget entry for: ' + failId);
				return;
			}
			
			this.layout = layout;
			JSB.getLogger().info('Layout saved: ' + JSON.stringify(layout, null, 4));
			
			this.store();
			this.doSync();
		},
		
		createWidgetWrapper: function(wType, wName){
			this.load();
			var wwId = JSB.generateUid();
			var wWrapper = new Widget(wwId, this.workspace, this, wName, wType);
			this.wrappers[wwId] = wWrapper;
			this.widgetCount = Object.keys(this.wrappers).length;
			this.addChildEntry(wWrapper);
			this.store();
			this.doSync();
			return wWrapper;
		},
		
		removeWidgetWrapper: function(wwId){
			this.load();
			if(!this.wrappers[wwId]){
				throw new Error('Failed to find widget wrapper with id: ' + wwId);
			}
			delete this.wrappers[wwId];
			this.fixupLayout();
			this.widgetCount = Object.keys(this.wrappers).length;
			var cEntry = this.removeChildEntry(wwId);
			if(cEntry){
				cEntry.remove();
			}
			this.store();
			this.doSync();
			return true;
		},
		
		fixupLayout: function(){},
		
		store: function(){
			this.load();
			var mtxName = 'store_' + this.getId();
			JSB.getLocker().lock(mtxName);
			try {
				var desc = {
					layout: this.layout,
					wrappers: {}
				}
				for(var wId in this.wrappers){
					var wWrapper = this.wrappers[wId];
					desc.wrappers[wId] = {
						jsb: wWrapper.getWidgetType(),
						name: wWrapper.getName(),
						values: wWrapper.getValues(),
						sourcesIds: wWrapper.getSourcesIds()
					}
				}
				this.widgetCount = Object.keys(this.wrappers).length;
				this.lastUpdated = Date.now();
				this.property('widgets', this.widgetCount);
				this.property('lastUpdated', this.lastUpdated);
				this.workspace.writeArtifactAsJson(this.getLocalId() + '.dashboard', desc);
			} finally {
				JSB.getLocker().unlock(mtxName);	
			}
			this.workspace.store();
		},
		
		load: function(){
			var bLocked = false;
			var bNeedStore = false;
			if(!this.loaded){
				var mtxName = 'load_' + this.getId();
				JSB.getLocker().lock(mtxName);
				bLocked = true;
			}
			if(!this.loaded){
				if(this.workspace.existsArtifact(this.getLocalId() + '.dashboard')){
					var mtxName = 'load_' + this.getId();
					JSB.getLocker().lock(mtxName);
					try {
						// read layout
						var snapshot = this.workspace.readArtifactAsJson(this.getLocalId() + '.dashboard');
						this.layout = snapshot.layout;

						// read wrappers
						this.wrappers = this.getChildren();
						
						for(var wId in snapshot.wrappers){
							var wDesc = snapshot.wrappers[wId];
							
							if(!this.wrappers[wId]){
								var wWrapper = this.workspace.entry(wId);
								if(!wWrapper){
									bNeedStore = true;
									wWrapper = new Widget(wId, this.workspace, this, wDesc.name, wDesc.jsb, wDesc.values);
									this.addChildEntry(wWrapper);
								}
								
								this.wrappers[wId] = wWrapper;
							}
						}
						
						// remove unused wrappers
						var unusedWrappers = JSB.clone(this.wrappers);
						function performLayoutEntry(lEntry){
							if(lEntry && lEntry.widgets){
								for(var i = 0; i < lEntry.widgets.length; i++){
									var wServerId = lEntry.widgets[i];
									if(unusedWrappers[wServerId]){
										delete unusedWrappers[wServerId];
									}
								}
							} 
							if(lEntry && lEntry.containers){
								for(var i = 0; i < lEntry.containers.length; i++){
									performLayoutEntry(lEntry.containers[i]);
								}
							} 
						}
						
						performLayoutEntry(this.layout);
						
						for(var wId in unusedWrappers){
							bNeedStore = true;
							var cEntry = this.removeChildEntry(wId);
							if(cEntry){
								cEntry.remove();
							}
							delete this.wrappers[wId];
						}
						
					} finally {
						JSB.getLocker().unlock(mtxName);	
					}
					
					this.widgetCount = Object.keys(this.wrappers).length;
				}
				this.loaded = true;
			}
			if(bLocked){
				var mtxName = 'load_' + this.getId();
				JSB.getLocker().unlock(mtxName);
			}
			if(bNeedStore){
				this.store();
				this.doSync();
			}
			
			return {
				layout: this.layout,
				wrappers: this.wrappers
			}
		},
	
		getSources: function(){
			var sources = {};
			this.load();
			
			for(var wId in this.wrappers){
				var wWrapper = this.wrappers[wId];
				var srcMap = wWrapper.getSourceMap();
				for(var srcId in srcMap){
					if(!sources[srcId]){
						sources[srcId] = this.workspace.entry(srcId);
					}
					var srcArr = srcMap[srcId];
					for(var i = 0; i < srcArr.length; i++){
						var srcArrId = srcArr[i];
						if(!sources[srcArrId]){
							sources[srcArrId] = this.workspace.entry(srcArrId);
						}
					}
				}
			}
			
			return sources;
		},
		
		getWrappers: function(){
			$this.load();
			return $this.wrappers;
		}
	}
}