{
	$name:'Debug',
	$require: {
		'Kernel': 'Kernel'
	},
	$server: {
		$singleton: true,
		$globalize: true,
		list: function(template){
			if(JSB().isNull(template)){
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