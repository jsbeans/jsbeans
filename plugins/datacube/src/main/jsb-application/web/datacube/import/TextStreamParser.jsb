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
		
		$constructor: function(entry, values){
			$base(entry, values);
			var val = this.getContext().find('encoding').value();
			var charset = this.encodingMap[val];
			this.stream = entry.read({
				stream: true,
				binary: false,
				charset: charset
			});
		},
		
		destroy: function(){
			this.stream.close();
			$base();
		},
		
		getSourcePreview: function(){
			var val = this.getContext().find('encoding').value();
			var charset = this.encodingMap[val];
			var stream = this.getEntry().read({
				stream: true,
				binary: false,
				charset: charset
			});
			var lines = [];
			try {
				var data = stream.read(131062);
				lines = data.split(/\n/i);
				lines = lines.slice(0, 100);
			} finally {
				stream.close();
			}
			return lines;
		}
	}
}