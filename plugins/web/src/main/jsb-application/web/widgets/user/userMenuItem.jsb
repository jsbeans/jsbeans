{
	$name: 'UserMenuItem',
	$parent: 'JSB.Widgets.Actor',
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