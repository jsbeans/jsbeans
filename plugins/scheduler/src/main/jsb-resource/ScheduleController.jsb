{
	$name: 'JSB.Scheduler.ScheduleController',
	$singleton: true,
	
	$server: {
		$require: ['java:org.quartz.impl.StdSchedulerFactory',
		           'java:org.quartz.CronScheduleBuilder',
		           'java:org.quartz.TriggerBuilder',
		           'java:org.quartz.JobBuilder',
		           'java:org.quartz.JobKey',
		           'java:org.quartz.JobDataMap',
		           'java:org.jsbeans.scheduler.ExecuteScriptJob'],
		schedulerFactory: null,
		scheduler: null,
		jobMap: {},
		
		$constructor: function(){
			$base();
			
			this.schedulerFactory = new StdSchedulerFactory();
			
			try {
				this.scheduler = this.schedulerFactory.getScheduler();
				this.scheduler.start();
				JSB.getLogger().info('Quartz scheduler started');
			} catch (e) {
				JSB.getLog().error(e);
			} 
		},
		
		registerCronJob: function(taskId, cronPattern){
			var jobKey = JobKey.jobKey(taskId);
			if(this.scheduler.checkExists(jobKey)){
				var jobDetails = this.scheduler.getJobDetail(jobKey);
				var pattern = '' + jobDetails.getJobDataMap().get("cronPattern").toString();
				if(pattern == cronPattern){
					return;
				}
				this.scheduler.deleteJob(jobKey);
			}
			function toQuartzPattern(pat){
				var parts = pat.split(/\s+/i);
				if(parts[parts.length - 1] == '*'){
					parts[parts.length - 1] = '?';
				}
				while(parts.length < 6){
					parts.splice(0, 0, '0');
				}
				var outPat = '';
				for(var i = 0; i < parts.length; i++){
					if(outPat.length > 0){
						outPat += ' ';
					}
					outPat += parts[i];
				}
				
				return outPat;
			}
			var cronTrigger = TriggerBuilder.newTrigger().withSchedule(CronScheduleBuilder.cronSchedule(toQuartzPattern(cronPattern))).build();
			var jobParams = new JobDataMap();
			jobParams.put('cronPattern', cronPattern);
			jobParams.put('taskId', taskId);
			jobParams.put('script', 'JSB().getInstance("JSB.Scheduler.ScheduleController").onExecute("'+taskId+'")');
			var job = JobBuilder.newJob(ExecuteScriptJob).withIdentity(taskId).setJobData(jobParams).build();
			
			var args = [];
			var callback = null;
			for(var i = 2; i < arguments.length; i++){
				var arg = arguments[i];
				if(JSB.isFunction(arg)){
					callback = arg;
				} else {
					args.push(arg);
				}
			}
			this.lock('jobMap');
			try {
				this.jobMap[taskId] = {
					cronPattern: cronPattern,
					callback: callback,
					args: args
				}
				
				this.scheduler.scheduleJob(job, cronTrigger);
			} finally {
				this.unlock('jobMap');
			}
		},
		
		unregisterJob: function(taskId){
			var jobKey = JobKey.jobKey(taskId);
			if(this.scheduler.checkExists(jobKey)){
				this.scheduler.deleteJob(jobKey);
			}
			
			if(this.jobMap[taskId]){
				this.lock('jobMap');
				if(this.jobMap[taskId]){
					delete this.jobMap[taskId];
				}
				this.unlock('jobMap');
			}
		},
		
		onExecute: function(taskId){
			if(this.jobMap[taskId]){
				var jobDesc = null;
				this.lock('jobMap');
				if(this.jobMap[taskId]){
					jobDesc = JSB.clone(this.jobMap[taskId]);
				}
				this.unlock('jobMap');
				if(jobDesc){
					JSB.defer(function(){
						var args = jobDesc.args;
						if(jobDesc.callback){
							var callArgs = [taskId].concat(args);
							
							jobDesc.callback.apply($this, callArgs);
						}
						$this.publish('JSB.Scheduler.ScheduleController', {
							id: taskId,
							params: args.length == 1 ? args[0] : args
						});
						
					}, 0);
				}
			}
		}
	}
}