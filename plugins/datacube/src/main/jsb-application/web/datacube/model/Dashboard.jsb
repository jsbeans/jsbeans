{
	$name: 'JSB.DataCube.Model.Dashboard',
	$parent: 'JSB.Workspace.Entry',
	
	getWidgetCount: function(){
		return this.widgetCount;
	},
	
	widgetCount: 0,
	layout: null,
	wrappers: {},
	
	$client: {
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.DataCube.Widgets.WidgetWrapper'],
		
		loaded: false,
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.DashboardNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
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
			var wwId = 'wWrap_' + JSB.generateUid();
			var wWrapper = new WidgetWrapper(wwId, this, wType, {});
			wWrapper.setName(wName);
			this.wrappers[wwId] = wWrapper;
			this.widgetCount = Object.keys(this.wrappers).length;
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
			this.workspace.writeArtifactAsJson(this.getLocalId() + '.dashboard', desc);
			
			JSB.getLocker().unlock(mtxName);
		},
		
		load: function(){
			if(!this.loaded){
				if(this.workspace.existsArtifact(this.getLocalId() + '.dashboard')){
					// read layout
					var snapshot = this.workspace.readArtifactAsJson(this.getLocalId() + '.dashboard');
					this.layout = snapshot.layout;
					
					// read wrappers
					this.wrappers = {};
					for(var wId in snapshot.wrappers){
						var wDesc = snapshot.wrappers[wId];
						var wWrapper = new WidgetWrapper(wId, this, wDesc.jsb, wDesc.values);
						wWrapper.setName(wDesc.name);
						this.wrappers[wId] = wWrapper;
					}
				}
				this.loaded = true;
			}
			
			return {
				layout: this.layout,
				wrappers: this.wrappers
			}
		}
	}
}