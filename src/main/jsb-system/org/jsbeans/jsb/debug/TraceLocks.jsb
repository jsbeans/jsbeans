{
	$name:'JSB.Debug.TraceLocks',
	$singleton: true,
	
	$server: {
		$require: ['JSB.System.Kernel', 
		           'JSB.System.Log', 
		           'JSB.System.Config'],	
		
		_lockMap: {},
		_lockCheckInterval: 600000,
		_lockWarnTimeout: 3600000,
		
		$constructor: function(){
			if(Config.has('kernel.jshub.traceLocksCheckInterval')){
				this._lockCheckInterval = Config.get('kernel.jshub.traceLocksCheckInterval');
			}
			if(Config.has('kernel.jshub.traceLocksWarnTimeout')){
				this._lockWarnTimeout = Config.get('kernel.jshub.traceLocksWarnTimeout');
			}
			if(!this._lockCheckInterval || !this._lockWarnTimeout){
				return;
			}
			JSB.interval(function(){
				try {
					$this.checkLocks();	
				}catch(e){
					Log.error(e, true);
				}
			}, this._lockCheckInterval, '__lockCheckInterval_' + $this.getId());
		},
		
		checkLocks: function(){
			var stats = Kernel.lockStats();
			var curMap = {};
			for(var i = 0; i < stats.length; i++){
				var statEntry = stats[i];
				curMap[statEntry.lock] = {ts: Date.now(), stack: statEntry.stack};
			}
			
			// compare maps
			// remove unexisted
			var locksToDelete = [];
			for(var l in this._lockMap){
				if(!curMap[l]){
					locksToDelete.push(l);
				}
			}
			for(var i = 0; i < locksToDelete.length; i++){
				delete this._lockMap[locksToDelete[i]];
			}
			
			// add new
			for(var l in curMap){
				if(!this._lockMap[l]){
					this._lockMap[l] = curMap[l];
				}
			}
			
			// generate warns
			var now = Date.now();
			var warnList = [];
			for(var l in this._lockMap){
				if(now - this._lockMap[l].ts > this._lockWarnTimeout){
					warnList.push({
						lock: l,
						duration: now - this._lockMap[l].ts,
						stack: this._lockMap[l].stack
					});
				}
			}
			if(warnList.length > 0){
				warnList.sort(function(a, b){
					return b.duration - a.duration;
				});
				Log.warn('TraceLocks: long locks detected: ' + JSON.stringify(warnList, null, 4));
				$this.publish('JSB.Debug.TraceLocks', warnList);
			}
		}
		
	}
}