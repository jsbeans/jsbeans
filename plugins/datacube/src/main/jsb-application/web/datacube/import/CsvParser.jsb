{
	$name: 'DataCube.CsvParser',
	$parent: 'DataCube.TextStreamParser',
	$session: false,
	$scheme: {
		parserSettings: {
			items: {
				delimiter: {
			        render: 'comboEditor',
			        name: 'Разделитель',
			        value: ',',
			        items: {
			        	',': {
			        		name: ','
			        	},
			        	';': {
			        		name: ';'
			        	},
			        	'\t': {
			        		name: '\\t'
			        	},
			        	'|': {
			        		name: '|'
			        	}
			        }
			    },
			    
			    escapeChar: {
			        render: 'comboEditor',
			        name: 'Escape-символ',
			        value: '"',
			        items: {
			        	'"': {
			        		name: '"'
			        	},
			        	'\'': {
			        		name: '\''
			        	}
			        }
			    },
			    
			    header: {
			    	render: 'item',
			    	name: 'Названия столбцов в первой строке',
			    	optional: 'checked',
			    	editor: 'none'
			    },

			    resolveTypes: {
			    	render: 'item',
			    	name: 'Распознавать типы данных',
			    	optional: 'checked',
			    	editor: 'none'
			    },

				trimValues: {
			        render: 'item',
			        name: 'Обрезать пробелы в строках',
			        optional: 'checked',
			        editor: 'none'
			    },
			    
				skipEmptyRows: {
			        render: 'item',
			        name: 'Пропускать пустые записи',
			        optional: 'checked',
			        editor: 'none'
			    }

			}
		}
	},
	
	$require: ['DataCube.ParserManager'],
	$server: {
		$require: ['Peg', 'JSB.IO.FileSystem'],
		
		$bootstrap: function(){
			ParserManager.registerParser(this, {
				name: 'CSV',
				accepts: function(entry){
					return JSB.isInstanceOf(entry, 'DataCube.Model.CsvFile');
				}
			});
		},
		
		$constructor: function(entry, context){
			$base(entry, context);
			var comma = this.getContext().find('delimiter').value();
			var quote = this.getContext().find('escapeChar').value();
			var useHeader = this.getContext().find('header').checked();
			var resolveTypes = this.getContext().find('resolveTypes').checked();
			var trimValues = this.getContext().find('trimValues').checked();
			var skipEmptyRows = this.getContext().find('skipEmptyRows').checked();
			
			this.csvGrammar = `#dot
			//
			// CSV grammar based on RFC 4180 (http://www.ietf.org/rfc/rfc4180.txt)
			//
			
			{
				var PARSER = JSB.getInstance('{{=$this.getId()}}');
				var USE_HEADER = {{=useHeader}};
				var RESOLVE_TYPES = {{=resolveTypes}};
				var TRIM_VALUES = {{=trimValues}};
				var SKIP_EMPTY = {{=skipEmptyRows}};
				var CUR_RECORD = 0;
				var COLUMNS = null;
				PARSER.beginArray(null);
			}

			file        = r1:record r2:(NL r:record {return r;})* NL? {
				PARSER.endArray();
				return [];
			}
			record      = f1:field f2:(COMMA f:field {return f;})* {
				if(SKIP_EMPTY && f1.length == 0 && f2.length == 0){
					return null;
				}
				var record = [f1].concat(f2);
				if(TRIM_VALUES){
					for(var i = 0; i < record.length; i++){
						record[i] = record[i].trim();
					}
				}
				if(USE_HEADER){
					if(!COLUMNS){
						COLUMNS = [];
						for(var i = 0; i < record.length; i++){
							COLUMNS[i] = record[i];
						}
						return null;
					}
				}
				PARSER.beginObject(CUR_RECORD);
				function transformValue(val){
					if(!RESOLVE_TYPES){
						return val;
					}
					var nv = val.toLowerCase().trim();
					if(nv == 'false'){
						return false;
					} else if(nv == 'true'){
						return true;
					}
					if(/^[+-]?[\.e0-9]+$/i.test(nv)){
						var fVal = parseFloat(nv);
						var iVal = parseInt(nv);
						if(!JSB.isNaN(fVal) && !JSB.isNaN(iVal)){
							if(fVal == iVal){
								return iVal;
							} else {
								return fVal;
							}
						} else if(!JSB.isNaN(fVal)){
							return fVal;
						} else if(!JSB.isNaN(iVal)){
							return iVal;
						}
					}
					return val;
				}
				for(var i = 0; i < record.length; i++){
					var colName = COLUMNS && COLUMNS.length > i ? COLUMNS[i] : 'Col_' + (i + 1);
					PARSER.setValue(colName, transformValue(record[i]));
				}
				PARSER.endObject();
				CUR_RECORD++;
				return null;
			}
			field       = escaped / non_escaped
			escaped     = DQUOTE chars:(TEXTDATA / COMMA / CR / LF / D_DQUOTE)* DQUOTE { return chars.join(""); }
			non_escaped = chars:TEXTDATA* { return chars.join(""); }
			COMMA       = '{{=comma}}'
			CR          = '\r'
			DQUOTE      = '{{=quote}}'
			LF          = '\n'
			NL          = CR LF / CR / LF
			TEXTDATA    = [^{{=quote}}{{=comma}}\r\n]
			D_DQUOTE    = '{{=quote}}' '{{=quote}}'
			`;

		},
		
		execute: function(){
			var parser = Peg.generate(this.csvGrammar);
			Peg.parseStream(parser, this.stream);
		},
		
		prepare: function(){
		}
	}
}