{
	$name: 'JSB.DataCube.Model.Dashboard',
	$parent: 'JSB.Workspace.Entry',
	
	getWidgetCount: function(){
		return this.widgetCount;
	},
	
	widgetCount: 0,
	
	$client: {
		filterBySource: {},
		
		
		addFilter: function(filterDesc){
			// acquire cube slices by current source
			this.server().acquireAssiciatedSources(filterDesc.source, function(sourceArr){
				for(var i = 0; i < sourceArr.length; i++){
					var sourceId = sourceArr[i];
					if(!$this.filterBySource[sourceId]){
						$this.filterBySource[sourceId] = [];
					}
					$this.filterBySource[sourceId].push({
						filter: filterDesc.filter,
						type: filterDesc.type
					});
				}
				$this.publish('DataCube.Model.Dashboard.filterChanged');
			})
		},
		
		constructFilter: function(sourceId){
			var filterArr = this.filterBySource[sourceId];
			if(!filterArr || filterArr.length == 0){
				return null;
			}
			var filter = {};
			for(var i = 0; i < filterArr.length; i++){
				var filterDesc = filterArr[i];
				for(var j = 0; j < filterDesc.filter.length; j++){
					var fFieldDesc = filterDesc.filter[j];
					filter[fFieldDesc.field] = {$eq: fFieldDesc.value};
				}
			}
			return filter;
		}
	},
	
	$server: {
		layout: null,
		wrappers: {},
		
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.DataCube.Widgets.WidgetWrapper'],
		
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
			this.property('widgets', this.widgetCount);
			this.workspace.writeArtifactAsJson(this.getLocalId() + '.dashboard', desc);
			
			JSB.getLocker().unlock(mtxName);
			this.workspace.store();

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
					this.widgetCount = Object.keys(this.wrappers).length;
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