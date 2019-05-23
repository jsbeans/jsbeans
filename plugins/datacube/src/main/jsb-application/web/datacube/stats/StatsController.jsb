/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Stats.StatsController',
	$singleton: true,
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'DataCube.SqlMaterializer',
		           'JSB.System.Kernel',
		           'DataCube.Model.StatsControllerSettings',
		           'JSB.Scheduler.ScheduleController'],
		
		_statsStorage: null,
		_statsSettings: null,
		_wsLogTableDesc: null,
		_materializer: null,
		_wsLogBatch: [],
		_enabled: false,
		_persisting: false,
		
		$constructor: function(){
			$base();
			
			WorkspaceController.ensureTrigger('ready', function(){
				$this._statsStorage = WorkspaceController.getSystemEntry('statsStorage');
				$this._statsSettings = WorkspaceController.getSystemEntry('statsControllerSettings');
				$this._materializer = new SqlMaterializer(null, $this._statsStorage);
				
				$this.ensureTables();
				
				$this.subscribe('DataCube.Model.SettingsEntry.settingsUpdated', function(sender){
					if(sender != $this._statsSettings){
						return;
					}
					$this.updateStatsSettings();
				});
				
				$this.updateStatsSettings();
				
				$this.setTrigger('ready');
			});
		},
		
		updateStatsSettings: function(){
			var ctx = $this._statsSettings.getSettingsContext();
			this._enabled = ctx.find('useStats').checked();
			if(this._enabled){
				// register jobs
				ScheduleController.registerCronJob('statsUpdateJob', ctx.find('updateInterval').value(), function(){
					$this.persistStatsData();
				});
				
				if(ctx.find('cleanupSettings').checked()){
					ScheduleController.registerCronJob('statsCleanupJob', ctx.find('cleanupTime').value(), function(){
						$this.cleanupStatsData();
					});
				} else {
					ScheduleController.unregisterJob('statsCleanupJob');
				}
				
			} else {
				// unregister jobs
				ScheduleController.unregisterJob('statsUpdateJob');
				ScheduleController.unregisterJob('statsCleanupJob');
			}
		},
		
		destroy: function(){
			if($this._materializer){
				$this._materializer.destroy();
			}
			$base();
		},
		
		ensureWorkspaceLogTable: function(){
			var fields = {
				id: {type: 'string'},
				timestamp: {type: 'integer'},
				action: {type: 'string'},
				user: {type: 'string'},
				client: {type: 'string'},
				wid: {type: 'string'},
				eid: {type: 'string'},
				workspace_name: {type: 'string'},
				entry_type: {type: 'string'},
				entry_name: {type: 'string'},
				param_str: {type: 'string'},
				param_int: {type: 'integer'},
				param_double: {type: 'double'},
				param_entry_wid: {type: 'string'},
				param_entry_eid: {type: 'string'},
				param_entry_type: {type: 'string'},
				param_entry_name: {type: 'string'},
				param_entry_workspace_name: {type: 'string'}
			};
			$this._wsLogTableDesc = $this._materializer.createTable('workspace_log', fields, {useExistingTable: true});
			
			// ensure indices
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_id', {id:true}, {useExistingIndex: true});
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_timestamp', {timestamp:true}, {useExistingIndex: true});
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_action', {action:true}, {useExistingIndex: true});
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_user', {user:true}, {useExistingIndex: true});
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_client', {client:true}, {useExistingIndex: true});
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_wid', {wid:true}, {useExistingIndex: true});
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_eid', {eid:true}, {useExistingIndex: true});
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_wid_eid', {wid: true, eid:true}, {useExistingIndex: true});
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_entry_type', {entry_type:true}, {useExistingIndex: true});
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_entry_name', {entry_name:true}, {useExistingIndex: true});
			$this._materializer.createIndex($this._wsLogTableDesc.table, '_idx_workspace_name', {workspace_name:true}, {useExistingIndex: true});
			
			// subscribe workspace messages
			$this.subscribe('JSB.Workspace.Entry.created', function(sender){
				if(WorkspaceController.getSystemWorkspace() == sender.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('wsEntryCreated', sender);
			});
			$this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(WorkspaceController.getSystemWorkspace() == sender.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('wsEntryUpdated', sender);
			});
			$this.subscribe('JSB.Workspace.Entry.removed', function(sender){
				if(WorkspaceController.getSystemWorkspace() == sender.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('wsEntryRemoved', sender);
			});
			$this.subscribe('JSB.Workspace.Entry.addChild', function(sender, msg, entry){
				if(WorkspaceController.getSystemWorkspace() == sender.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('wsChildAppended', sender, entry);
			});
			$this.subscribe('JSB.Workspace.Entry.removeChild', function(sender, msg, entry){
				if(WorkspaceController.getSystemWorkspace() == sender.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('wsChildRemoved', sender, entry);
			});
			$this.subscribe('JSB.Workspace.Entry.setParent', function(sender, msg, entry){
				if(WorkspaceController.getSystemWorkspace() == sender.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('wsParentChanged', sender, entry);
			});
/*			
			$this.subscribe('JSB.Workspace.Entry.storeArtifact', function(sender, msg, name){
				if(WorkspaceController.getSystemWorkspace() == sender.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('wsArtifactStored', sender, name);
			});
			$this.subscribe('JSB.Workspace.Entry.removeArtifact', function(sender, msg, name){
				if(WorkspaceController.getSystemWorkspace() == sender.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('wsArtifactRemoved', sender, name);
			});
*/			
			// view access
			$this.subscribe('JSB.Workspace.BrowserView.setCurrentEntry', function(sender, msg, entry){
				if(WorkspaceController.getSystemWorkspace() == entry.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('dcViewAccess', entry, sender);
			});
			
			// widget access
			$this.subscribe('DataCube.Widgets.Widget.fetch', function(widget, msg, entry){
				if(WorkspaceController.getSystemWorkspace() == entry.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('dcWidgetAccess', entry, widget);
			});
			
			// dashboard access
			$this.subscribe('DataCube.Dashboard.get', function(dashboard, msg, entry){
				if(WorkspaceController.getSystemWorkspace() == entry.getWorkspace()){
					return;
				}
				$this.appendWorkspaceLog('dcDashboardAccess', entry, dashboard);
			});
			
			// page access
			$this.subscribe('JSB.Widgets.Page.get', function(sender){
				$this.appendWorkspaceLog('jsbPageAccess', null, sender);
			});
		},
		
		ensureTables: function(){
			$this.ensureWorkspaceLogTable();
		},
		
		appendWorkspaceLog: function(action, entry, param){
			if(!action){
				throw new Error('Missing log action');
			}
			if(!$this._enabled){
				return;
			}
			$this.ensureTrigger('ready', function(){
				var wrObj = {
					id: JSB.generateUid(),
					timestamp: Date.now(),
					action: action,
					user: Kernel.user(),
					client: Kernel.clientAddr()
				}
				if(entry){
					wrObj.wid = entry.getWorkspace().getId();
					wrObj.eid = entry.getId();
					wrObj.entry_type = entry.getJsb().getDescriptor().$name;
					wrObj.entry_name = entry.getName();
					wrObj.workspace_name = entry.getWorkspace().getName();
				}
				if(param){
					if(JSB.isInteger(param)){
						wrObj.param_int = param;
					} else if(JSB.isString(param)){
						wrObj.param_str = param;
					} else if(JSB.isDouble(param)){
						wrObj.param_double = param;
					} else if(JSB.isBoolean(param)){
						wrObj.param_int = (param ? 1: 0);
					} else if(JSB.isDate(param)){
						wrObj.param_int = param.getTime();
					} else if(JSB.isBean(param)){
						if(JSB.isInstanceOf(param, 'JSB.Workspace.Entry')){
							wrObj.param_entry_wid = param.getWorkspace().getId();
							wrObj.param_entry_name = param.getName();
							wrObj.param_entry_workspace_name = param.getWorkspace().getName();
						}
						wrObj.param_entry_eid = param.getId();
						wrObj.param_entry_type = param.getJsb().getDescriptor().$name;
					} else if(JSB.isObject(param) || JSB.isArray(param)){
						wrObj.param_str = JSON.stringify(param);
					}
				}

				// run on another thread
				JSB.defer(function(){
					var mtx = 'wsLogBatch';
					$this.lock(mtx);
					try {
						$this._wsLogBatch.push(wrObj);
					} finally {
						$this.unlock(mtx);
					}
				}, 0);
			});
		},
		
		persistStatsData: function(){
			if($this._persisting){
				return;
			}
			JSB.defer(function(){
				if($this._persisting){
					return;
				}
				var mtx = 'wsLogBatch';
				$this.lock(mtx);
				try {
					$this._persisting = true;
					if($this._wsLogBatch && $this._wsLogBatch.length > 0){
						$this._materializer.insert($this._wsLogTableDesc.table, $this._wsLogBatch);
					}
				} finally {
					$this._wsLogBatch = [];
					$this._persisting = false;
					$this.unlock(mtx);	
				}
				
			}, 0);
		},
		
		cleanupStatsData: function(){
			// TODO:
		}
	}
}