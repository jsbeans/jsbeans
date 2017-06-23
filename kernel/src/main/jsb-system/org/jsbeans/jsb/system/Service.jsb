{
	$name:'JSB.System.Service',

	$server: {
		$require: ['JSB.System.Kernel'],
		$singleton: true,
		$globalize: 'Service',
		
		list: function(opts){
			var res = Kernel.ask('ServiceManagerService','svcList');
			if(!JSB().isNull(res) && !JSB().isNull(res.result) && !JSB().isNull(res.result.services)){
				return res.result.services;
			}
			return null;
		}
	}
}