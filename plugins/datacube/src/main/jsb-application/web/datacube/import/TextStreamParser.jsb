{
	$name: 'DataCube.TextStreamParser',
	$parent: 'DataCube.Parser',
	$scheme: {
		encoding: {
			render: 'select',
			name: 'Кодировка',
			items: {
				encUtf8: {
					name: 'UTF-8',
					editor: 'none'
				},
				encUtf16: {
					name: 'UTF-16',
					editor: 'none'
				}
			}
	    }
	},
	
	$server: {
	}
}