{
	$name: 'DataCube.TextStreamParser',
	$parent: 'DataCube.Parser',
	$session: false,
	$scheme: {
		parserSettings: {
			items: {
				encoding: {
					render: 'select',
					name: 'Кодировка',
					items: {
						encUtf8: {
							name: 'UTF-8',
							
						},
						encUtf16: {
							name: 'UTF-16',
							
						}
					}
			    }
			}
		}
	},
	
	$server: {
		stream: null,
		encodingMap: {
			'encUtf8': 'UTF-8',
			'encUtf16': 'UTF-16'
		},
		
		$constructor: function(entry, context){
			$base(entry, context);
			var val = context.find('encoding').value();
			var charset = this.encodingMap[val];
			this.stream = entry.read({
				stream: true,
				binary: false,
				charset: charset
			})
		},
	}
}