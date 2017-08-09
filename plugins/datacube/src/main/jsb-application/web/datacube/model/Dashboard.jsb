{
	$name: 'DataCube.Model.Dashboard',
	$parent: 'JSB.Workspace.Entry',
	
	getWidgetCount: function(){
		return this.widgetCount;
	},
	
	widgetCount: 0,
	
	$client: {
	},
	
	$server: {
		layout: null,
		wrappers: {},
		
		$require: ['JSB.Workspace.WorkspaceController',
		           'DataCube.Model.Widget'],
		
		loaded: false,
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'DataCube.DashboardNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(this.property('widgets')){
				this.widgetCount = this.property('widgets');
			}
		},
		
		destroy: function(){
			if(this.workspace.existsArtifact(this.getLocalId() + '.dashboard')){
				this.workspace.removeArtifact(this.getLocalId() + '.dashboard');
			}
			$base();
		},
		
		updateLayout: function(layout){
			this.layout = layout;
			JSB.getLogger().info('layout: ' + JSON.stringify(layout, null, 4));
			
			this.store();
			this.doSync();
		},
		
		createWidgetWrapper: function(wType, wName){
			var wwId = JSB.generateUid();
			var wWrapper = new Widget(wwId, this.workspace, this, wName, wType, {});
			this.wrappers[wwId] = wWrapper;
			this.widgetCount = Object.keys(this.wrappers).length;
			this.addChildEntry(wWrapper);
			this.store();
			this.doSync();
			return wWrapper;
		},
		
		removeWidgetWrapper: function(wwId){
			if(!this.wrappers[wwId]){
				throw new Error('Failed to find widget wrapper with id: ' + wwId);
			}
			delete this.wrappers[wwId];
			this.widgetCount = Object.keys(this.wrappers).length;
			var cEntry = this.removeChildEntry(wwId);
			if(cEntry){
				cEntry.remove();
			}
			this.store();
			this.doSync();
			return true;
		},
		
		store: function(){
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
						values: wWrapper.getValues()
					}
				}
				this.widgetCount = Object.keys(this.wrappers).length;
				this.property('widgets', this.widgetCount);
				this.workspace.writeArtifactAsJson(this.getLocalId() + '.dashboard', desc);
			} finally {
				JSB.getLocker().unlock(mtxName);	
			}
			this.workspace.store();

		},
		
		load: function(){
			if(!this.loaded){
				var bNeedStore = false;
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
					if(bNeedStore){
						this.store();
						this.doSync();
					}
				}
				this.loaded = true;
			}
			
			return {
				layout: this.layout,
				wrappers: this.wrappers
			}
		},
		
		acquireAssiciatedSources: function(sourceId){
			var sourceArr = [];
			var source = this.workspace.entry(sourceId);
			if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
				var cube = source.getCube();
				cube.load();
				var sliceMap = cube.getSlices();
				for(var sId in sliceMap){
					sourceArr.push(sId);
				}
			} else {
				sourceArr.push(sourceId);
			}
			
			return sourceArr;
		}
	}
}