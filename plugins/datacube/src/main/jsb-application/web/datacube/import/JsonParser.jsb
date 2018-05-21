{
	$name: 'DataCube.JsonParser',
	$parent: 'DataCube.TextStreamParser',
	$scheme: {
		trimValues: {
	        render: 'item',
	        name: 'Обрезать пробелы в строках',
	        optional: 'checked',
	        editor: 'none'
	    },
		multiTable: {
	        render: 'item',
	        name: 'Разбить на несколько таблиц',
	        optional: true,
	        editor: 'none'
	    }
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