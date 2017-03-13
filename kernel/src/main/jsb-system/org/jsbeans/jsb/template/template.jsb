{
	$name:'Template',
	$require: {
		'Kernel': 'Kernel',
		'Log': 'Log'
	},
	$server: {
		$singleton: true,
		$globalize: true,
		$constructor: function(){},

		exec: function(te, pattern, json){
			var execProc = 'exec_' + te;
			if(!this[execProc]){
				throw 'Unable to find template engine: ' + te;
			}
			return this[execProc](pattern, json);
		}
	}
}