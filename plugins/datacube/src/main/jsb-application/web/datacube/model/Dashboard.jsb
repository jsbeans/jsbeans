{
	$name: 'JSB.DataCube.Model.Dashboard',
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
		           'JSB.DataCube.Model.Widget'],
		
		loaded: false,
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.DashboardNode');
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
			this.removeChildEntry(wwId);
			this.store();
			this.doSync();
			return true;
		},
		
		store: function(){
			var mtxName = 'store_' + this.getId();
			JSB.getLocker().lock(mtxName);
			
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
			
			JSB.getLocker().unlock(mtxName);
			this.workspace.store();

		},
		
		load: function(){
			if(!this.loaded){
				var bNeedStore = false;
				if(this.workspace.existsArtifact(this.getLocalId() + '.dashboard')){
					// read layout
					var snapshot = this.workspace.readArtifactAsJson(this.getLocalId() + '.dashboard');
					this.layout = snapshot.layout;
					
					// read wrappers
					this.wrappers = {};
					for(var wId in snapshot.wrappers){
						var wDesc = snapshot.wrappers[wId];
						var wWrapper = this.workspace.entry(wId);
						if(!wWrapper){
							bNeedStore = true;
							wWrapper = new Widget(wId, this.workspace, this, wDesc.name, wDesc.jsb, wDesc.values);
							this.addChildEntry(wWrapper);
						}
						
						this.wrappers[wId] = wWrapper;
					}
					this.widgetCount = Object.keys(this.wrappers).length;
					if(bNeedStore){
						this.workspace.store();
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
			if(JSB.isInstanceOf(source, 'JSB.DataCube.Model.Slice')){
				var cube = source.getCube();
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