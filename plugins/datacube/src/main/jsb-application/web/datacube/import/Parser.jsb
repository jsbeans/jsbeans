{
	$name: 'DataCube.Parser',
	$session: false,
	
	$scheme: {
		parserSettings: {
			render: 'group',
	        name: 'Настройки парсера',
	        items: {}
		},
		
		structure: {
			render: 'parserBinding'
		},
		
		tablesSettings: {
			render: 'group',
	        name: 'Настройки таблиц',
	        
	        multiple: {
                createDefault: false,
                uniqueNames: true
            },
	        items: {
	        	tableSettings: {
	        		render: 'group',
	        		name: 'Таблица',
	        		editableName: true,
	        		items: {}
	        	}
	        }
		}
	},
	
	$server: {
		entry: null,
		context: null,
		
		$constructor: function(entry, context){
			$base();
			this.entry = entry;
			this.context = context;
		},
		
		analyze: function(){
			throw new Error('This method should be overriden');
		}
	}
}