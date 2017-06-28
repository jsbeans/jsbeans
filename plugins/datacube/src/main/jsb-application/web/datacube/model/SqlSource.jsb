{
	$name: 'JSB.DataCube.Model.SqlSource',
	$parent: 'JSB.Workspace.Entry',
	$require: ['JSB.DataCube.Model.SqlTable'],
	
	details: null,
	
	getDetails: function(){
		return this.details;
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'jsb.store.StoreManager'],
		
		settings: null,
		
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.SqlSourceNode');
		},

		$constructor: function(id, workspace){
			$base(id, workspace);
			this.settings = this.property('settings');
			this.details = this.property('details');
		},
		
		getSettings: function(){
			return this.settings;
		},
		
		
		updateSettings: function(settings){
			this.settings = JSB.merge({
				name: settings.url,
				type: 'jsb.store.sql.SQLStore',
			}, settings);
			this.property('settings', this.settings);
			this.workspace.store();
		},
		
		testConnection: function(settings){
			this.updateSettings(settings);
			
			// test connection
			var store = StoreManager.getStore(this.settings);
			store.getConnection(true).close();
			return true;
		},
		
		getStore: function(){
			return StoreManager.getStore(this.settings);
		},
		
		extractScheme: function(){
			$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Соединение с базой данных', success: true}, {session: true});
			var store = this.getStore();
			var lastPP = -1;
			$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Получение списка таблиц', success: true}, {session: true});
			var schema = store.extractSchema(function(idx, total){
				var pp = Math.round(idx * 100 / total);
            	if(pp > lastPP){
            		$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Обновление схемы ' + pp + '%', success: true}, {session: true});
            		lastPP = pp;
            	}
			});
			$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Сохранение схемы', success: true}, {session: true});
			
			// TODO: update entries
			for(var sName in schema){
				var sDesc = schema[sName];
				for(var tName in sDesc.tables){
					var tDesc = sDesc.tables[tName];
					var tEntry = new SqlTable(this.getLocalId() + '|' + sName + '|' + tName, this.workspace, tDesc);
					this.addChildEntry(tEntry);
				}
			}
			
			// construct details
			var details = {
				updated: Date.now(),
				schemes: 0,
				tables: 0,
				columns: 0
			};
			for(var sName in schema){
				details.schemes++;
				var sDesc = schema[sName];
				for(var tName in sDesc.tables){
					details.tables++;
					var tDesc = sDesc.tables[tName];
					for(var cName in tDesc.columns){
						details.columns++;
					}
				}
			}
			this.details = details;
			this.property('details', this.details);
			this.workspace.store();
			this.doSync();
			
			return details;
		}
	}
}