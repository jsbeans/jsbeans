{
	$name: 'DataCube.Query.QueryCacheController',
	$singleton: true,
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		cacheMap: {},
		enabled: false,
		tickInterval: 5000,
		cacheControllerSettings: null,
		
		$constructor: function(){
			$base();
			if(Config.has('datacube.queryCache.enabled') && Config.get('datacube.queryCache.enabled')){
				this.enabled = true;
			}
			if(!this.enabled){
				return;
			}
			if(Config.has('datacube.queryCache.controllerTickInterval')){
				this.tickInterval = Config.get('datacube.queryCache.controllerTickInterval');
			}
			
			function doTick(){
				$this.tick();
				JSB.defer(doTick, $this.tickInterval);
			}
			
			
			WorkspaceController.ensureTrigger('ready', function(){
				$this.cacheControllerSettings = WorkspaceController.getSystemEntry('cacheControllerSettings');
				doTick();
				$this.setTrigger('ready');
			});
				
		},
		
		registerCache: function(cacheInst){
			if(this.cacheMap[cacheInst.getId()]){
				return;
			}
			JSB.getLocker().lock('QueryCacheMap');
			if(!this.cacheMap[cacheInst.getId()]){
				this.cacheMap[cacheInst.getId()] = cacheInst;
			}
			JSB.getLocker().unlock('QueryCacheMap');
		},
		
		unregisterCache: function(cacheInst){
			if(!this.cacheMap[cacheInst.getId()]){
				return;
			}
			JSB.getLocker().lock('QueryCacheMap');
			if(this.cacheMap[cacheInst.getId()]){
				delete this.cacheMap[cacheInst.getId()];
			}
			JSB.getLocker().unlock('QueryCacheMap');
		},
		
		getStats: function(){
			var instanceCount = 0;
			var queryCount = 0;
			var itemCount = 0;
			var cellCount = 0;
			for(var cmId in this.cacheMap){
				instanceCount++;
				var cm = this.cacheMap[cmId];
				var qcMap = cm.getCacheMap();
				for(var qmId in qcMap){
					queryCount++;
					var qDesc = qcMap[qmId];
					itemCount += qDesc.buffer.length;
					cellCount += qDesc.cells;
				}
			}
			return {
				instances: instanceCount,
				queries: queryCount,
				items: itemCount,
				cells: cellCount
			};
		},
		
		tick: function(){
/*			
			var stats = this.getStats();
			JSB.getLogger().info('QueryCacheInfo: instances: ' + stats.instances + '; queries: ' + stats.queries + '; items: ' + stats.items);
*/			
		}
		
		
	}
}