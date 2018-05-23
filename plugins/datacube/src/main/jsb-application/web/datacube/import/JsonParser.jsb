{
	$name: 'DataCube.JsonParser',
	$parent: 'DataCube.TextStreamParser',
	$session: false,
	$scheme: {
		parserSettings: {
			items: {
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
			}
		}
	},
	
	$require: ['DataCube.ParserManager'],
	$server: {
		$require: ['Peg', 'JSB.IO.FileSystem'],
		
		$constructor: function(){
			var grammarPath = FileSystem.join(this.getJsb().getFullPath(), 'json.grammar.peg');
			this.jsonGrammar = FileSystem.read(grammarPath);
		},
		
		$bootstrap: function(){
			ParserManager.registerParser(this, {
				name: 'JSON',
				accepts: function(entry){
					return JSB.isInstanceOf(entry, 'DataCube.Model.JsonFile');
				}
			});
		},
		
		analyze: function(){
			// do something with this.stream
			debugger;
			var parser = Peg.generate(this.jsonGrammar);
			var obj = Peg.parseStream(parser, this.stream);
			debugger;
			this.stream.close();
		}
	}
}