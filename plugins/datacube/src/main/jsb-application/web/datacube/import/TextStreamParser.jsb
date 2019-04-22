{
	$name: 'DataCube.TextStreamParser',
	$parent: 'DataCube.FileParser',
	$session: false,
	$scheme: {
		parserSettings: {
			items: {
				encoding: {
					render: 'select',
					name: 'Кодировка',
					items: {
						'UTF-8': { name: 'UTF-8' },
						'UTF-16': { name: 'UTF-16' },
						'UTF-16BE': { name: 'UTF-16BE' },
						'UTF-16LE': { name: 'UTF-16LE' },
						'UTF-32': { name: 'UTF-32' },
						'UTF-32BE': { name: 'UTF-32BE' },
						'UTF-32LE': { name: 'UTF-32LE' },
						'windows-1250': { name: 'Windows-1250, Windows Eastern European' },
						'windows-1251': { name: 'Windows-1251, Windows Cyrillic' },
						'windows-1252': { name: 'Windows-1252, Windows Latin-1' },
						'windows-1253': { name: 'Windows-1253, Windows Greek' },
						'windows-1254': { name: 'Windows-1254, Windows Turkish' },
						'windows-1257': { name: 'Windows-1257, Windows Baltic' },
						'KOI8-R': { name: 'KOI8-R, Russian' },
						'KOI8-U': { name: 'KOI8-U, Ukrainian' },
						'US-ASCII': { name: 'ASCII' },
						'IBM855': { name: 'IBM855, IBM Cyrillic' },
						'IBM866': { name: 'IBM866, MS-DOS Russian' },
						'ISO-8859-1': { name: 'ISO-8859-1, Latin Alphabet No. 1' },
						'ISO-8859-2': { name: 'ISO-8859-2, Latin Alphabet No. 2' },
						'ISO-8859-4': { name: 'ISO-8859-4, Latin Alphabet No. 4' },
						'ISO-8859-5': { name: 'ISO-8859-5, Latin/Cyrillic Alphabet' },
						'ISO-8859-7': { name: 'ISO-8859-7, Latin/Greek Alphabet (ISO-8859-7:2003)' },
						'ISO-8859-9': { name: 'ISO-8859-9, Latin Alphabet No. 5' },
						'ISO-8859-13': { name: 'ISO-8859-13, Latin Alphabet No. 7' },
						'ISO-8859-15': { name: 'ISO-8859-15, Latin Alphabet No. 9' }
					}
			    }
			}
		}
	},
	
	$server: {
		stream: null,
		text: null,
		
		$constructor: function(source, values){
			$base(source, values);
			this.stream = this.setupSourceStream();
			if(!this.stream){
				if(JSB.isString(source)){
					this.text = source;
				} else {
					throw new Error('Invalid input source');
				}
			}
		},
		
		setupSourceStream: function(){
			var charset = this.getContext().find('encoding').value();
			var source = this.getSource();
			if(JSB.isInstanceOf(source, 'JSB.Workspace.FileEntry')){
				return source.read({
					stream: true,
					binary: false,
					charset: charset
				});
			} else if(JSB.isString(source)){
				// generate stream from string
				return null;
			} else if(JSB.isInstanceOf(source, 'JSB.IO.TextStream')){
				return this.getSource();
			}
		},
		
		destroy: function(){
			if(this.stream){
				this.stream.close();
			}
			$base();
		},
		
		getSourcePreview: function(){
			var charset = this.getContext().find('encoding').value();
			var stream = this.setupSourceStream();
			var text = null;
			if(!stream){
				var source = this.getSource();
				if(JSB.isString(source)){
					text = source;
				} else {
					throw new Error('Invalid input source');
				}
			}
			var lines = [];
			try {
				var data = text || stream.read(131062);
				lines = data.split(/\n/i);
				lines = lines.slice(0, 100);
			} finally {
				if(stream){
					stream.close();
				}
			}
			return lines;
		}
	}
}