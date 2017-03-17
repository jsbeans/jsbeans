{
	$name:'Service',
	$require: ['Kernel'],
	$server: {
		$singleton: true,
		$globalize: true,
		
		list: function(opts){
			var res = Kernel.ask('ServiceManagerService','svcList');
			if(!JSO().isNull(res) && !JSO().isNull(res.result) && !JSO().isNull(res.result.services)){
				return res.result.services;
			}
			return null;
		}
	}
}