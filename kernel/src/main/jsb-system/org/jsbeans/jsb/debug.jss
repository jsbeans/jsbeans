JSO({
	name:'Debug',
	require: {
		'Kernel': 'Kernel'
	},
	server: {
		singleton: true,
		globalize: true,
		body: {
			list: function(template){
				if(JSO().isNull(template)){
					template = {};
				}
				return Kernel.ask('ExecutionDebuggerService', 'AccessSignalLogMessage', {
					operation: 'Lookup',
					withArtifact: false,
					template: template,
					onlyWaiting: false,
					offset: 0,
					limit: 0
				});
			},
			
			clear: function(){
				return Kernel.ask('ExecutionDebuggerService', 'AccessSignalLogMessage', {
					operation: 'Remove',
					withArtifact: false,
					template: {},
					onlyWaiting: false,
					offset: 0,
					limit: 0
				});
			}
		}
	}
});
