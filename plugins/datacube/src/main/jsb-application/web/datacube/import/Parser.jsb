{
	$name: 'DataCube.Parser',
	
	$scheme: {
		parserSettings: {
			render: 'group',
	        name: 'Настройки парсера',
	        items: {}
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
	}
}