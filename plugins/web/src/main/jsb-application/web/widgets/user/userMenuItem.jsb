{
	$name: 'UserMenuItem',
	$client: {
		$constructor: function(opts){
			$base(opts);
		},
		
		execute: function(){
			// should be overriden
			throw 'UserMenuItem: Method execute should be overriden';
		}
	}
}