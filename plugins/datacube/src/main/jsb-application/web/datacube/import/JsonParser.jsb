{
	$name: 'DataCube.JsonParser',
	$parent: 'DataCube.Parser',
	$scheme: {
		
	},
	
	$require: ['DataCube.ParserManager'],
	$server: {
		
		$bootstrap: function(){
			ParserManager.registerParser(this, {
				name: 'JSON',
				accepts: function(entry){
					return JSB.isInstanceOf(entry, 'DataCube.Model.JsonFile');
				}
			});
		}
	}
}