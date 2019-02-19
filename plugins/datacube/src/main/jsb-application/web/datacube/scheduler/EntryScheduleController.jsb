{
	$name: 'DataCube.Scheduler.EntryScheduleController',
	$singleton: true,
	
	$server: {
		$require: ['JSB.Scheduler.ScheduleController',
		           'JSB.Workspace.WorkspaceController',
		           'DataCube.Model.ScheduleControllerSettings'],
		
		_jobMap: {},
		_scheduleControllerSettings: null,
		
		$constructor: function(){
			$base();
			
			WorkspaceController.ensureTrigger('ready', function(){
				$this._scheduleControllerSettings = WorkspaceController.getSystemEntry('scheduleControllerSettings');
				$this._load();
				
				$this.setTrigger('ready');
			});
		},
		
		_load: function(){
			if($this._scheduleControllerSettings.existsArtifact('.jobs')){
				$this.lock('_jobMap');
				try {
					$this._jobMap = $this._scheduleControllerSettings.loadArtifact('.jobs');
					var failedKeys = [];
					for(var key in $this._jobMap){
						if(!$this._createCronJob($this._jobMap[key])){
							failedKeys.push(key);
						}
					}
					for(var i = 0; i < failedKeys.length; i++){
						if($this._jobMap[failedKeys[i]]){
							delete $this._jobMap[failedKeys[i]];
						}
					}
				} finally {
					$this.unlock('_jobMap');
				}
			}
		},
		
		_store: function(){
			JSB.defer(function(){
				$this.lock('_jobMap');
				try {
					$this._scheduleControllerSettings.storeArtifact('.jobs', $this._jobMap);
				} finally {
					$this.unlock('_jobMap');
				}
			}, 1000, '_store' + $this.getId());
		},
		
		_createCronJob: function(jobDesc){
			if(!jobDesc.jobKey || !jobDesc.cronPattern){
				return false;
			}
			ScheduleController.registerCronJob(jobDesc.jobKey, jobDesc.cronPattern, function(key){
				var workspace = null, entry = null;
				var jDesc = $this._jobMap[key];
				if(!jDesc){
					// remove from Scheduler
					ScheduleController.unregisterJob(key);
					return;
				}
				if(WorkspaceController.existsWorkspace(jDesc.wId)){
					workspace = WorkspaceController.getWorkspace(jDesc.wId);
				}
				if(workspace && workspace.existsEntry(jDesc.eId)){
					entry = workspace.entry(jDesc.eId);
				}
				if(entry){
					entry.publish('DataCube.Scheduler.EntryScheduleController.executeJob', jDesc);
				} else {
					$this._removeCronJob(key);
				}
			});
			return true;
		},
		
		_removeCronJob: function(key){
			ScheduleController.unregisterJob(key);
			if(!$this._jobMap[key]){
				return;
			}
			$this.lock('_jobMap');
			try {
				if($this._jobMap[key]){
					delete $this._jobMap[key];
				}
			} finally {
				$this.unlock('_jobMap');	
			}
			$this._store();
		},
		
		registerJob: function(entry, key, cronPattern, opts){
			$this.ensureTrigger('ready', function(){
				$this.lock('_jobMap');
				try {
					// generate map entry
					var mKey = entry.getWorkspace().getId() + '/' + entry.getId() + '/' + key;
					$this._jobMap[mKey] = {
						jobKey: mKey,
						wId: entry.getWorkspace().getId(),
						eId: entry.getId(),
						key: key,
						cronPattern: cronPattern
					};
					if(opts){
						$this._jobMap[mKey].opts = opts;
					}
					$this._createCronJob($this._jobMap[mKey]);
				} finally {
					$this.unlock('_jobMap');
				}
				$this._store();
			});
		},
		
		unregisterJob: function(entry, key){
			$this.ensureTrigger('ready', function(){
				var mKey = entry.getWorkspace().getId() + '/' + entry.getId() + '/' + key;
				$this._removeCronJob(mKey);
			});
		}
	}
}