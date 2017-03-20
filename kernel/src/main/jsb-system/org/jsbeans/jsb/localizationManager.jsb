{
	$name:'JSB.LocalizationManager',
	$singleton: true,
	$client: {
		$constructor: function(opts){
			$base(opts);
		},
	},
	
	$server: {
		$constructor: function(){
			$base();
		},
	}

}