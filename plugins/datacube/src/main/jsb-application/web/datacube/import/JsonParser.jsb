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
			    }
			}
		}
	},
	
	$require: ['DataCube.ParserManager'],
	$server: {
		$require: ['Peg', 'JSB.IO.FileSystem'],
		
		$bootstrap: function(){
			ParserManager.registerParser(this, {
				name: 'JSON',
				accepts: function(entry){
					return JSB.isInstanceOf(entry, 'DataCube.Model.JsonFile');
				}
			});
		},
		
		$constructor: function(entry, values){
			$base(entry, values);
			
			this.jsonGrammar = `#dot
			// JSON Grammar
			// ============
			//
			// Based on the grammar from RFC 7159 [1].
			//
			// Note that JSON is also specified in ECMA-262 [2], ECMA-404 [3], and on the
			// JSON website [4] (somewhat informally). The RFC seems the most authoritative
			// source, which is confirmed e.g. by [5].
			//
			// [1] http://tools.ietf.org/html/rfc7159
			// [2] http://www.ecma-international.org/publications/standards/Ecma-262.htm
			// [3] http://www.ecma-international.org/publications/standards/Ecma-404.htm
			// [4] http://json.org/
			// [5] https://www.tbray.org/ongoing/When/201x/2014/03/05/RFC7159-JSON

			// ----- 2. JSON Grammar -----
			{
				var PARSER = JSB.getInstance('{{=$this.getId()}}');
				var CUR_FIELD = null;
				var CUR_STRUCT = null;
				var FIELD_STACK = [];
				var STRUCT_STACK = [];
			}

			JSON_text
			  = ws value:value ws { return value; }

			begin_array     = ws "[" ws { PARSER.beginArray(CUR_FIELD); if(CUR_STRUCT == 0){CUR_FIELD++;} FIELD_STACK.push(CUR_FIELD); CUR_FIELD = 0; STRUCT_STACK.push(CUR_STRUCT); CUR_STRUCT = 0; }
			begin_object    = ws "{" ws { PARSER.beginObject(CUR_FIELD); if(CUR_STRUCT == 0){CUR_FIELD++;} FIELD_STACK.push(CUR_FIELD); CUR_FIELD = null; STRUCT_STACK.push(CUR_STRUCT); CUR_STRUCT = 1; }
			end_array       = ws "]" ws { PARSER.endArray(); CUR_FIELD = FIELD_STACK.pop(); CUR_STRUCT = STRUCT_STACK.pop(); }
			end_object      = ws "}" ws { PARSER.endObject(); CUR_FIELD = FIELD_STACK.pop(); CUR_STRUCT = STRUCT_STACK.pop(); }
			name_separator  = ws ":" ws
			value_separator = ws "," ws

			ws "whitespace" = [ \t\n\r]*

			// ----- 3. Values -----

			value
			  = false { PARSER.setValue(CUR_FIELD, false); if(CUR_STRUCT == 0){CUR_FIELD++;} }
			  / null { PARSER.setValue(CUR_FIELD, null); if(CUR_STRUCT == 0){CUR_FIELD++;} }
			  / true { PARSER.setValue(CUR_FIELD, true); if(CUR_STRUCT == 0){CUR_FIELD++;} }
			  / object
			  / array
			  / n:number { PARSER.setValue(CUR_FIELD, n); if(CUR_STRUCT == 0){CUR_FIELD++;} }
			  / s:string { PARSER.setValue(CUR_FIELD, s); if(CUR_STRUCT == 0){CUR_FIELD++;} }

			false = "false" { return false; }
			null  = "null"  { return null;  }
			true  = "true"  { return true;  }

			// ----- 4. Objects -----

			object
			  = begin_object
			    members:(
			      head:member
			      tail:(value_separator m:member { return m; })*
			      {
			    	return {};
/*			        var result = {};

			        [head].concat(tail).forEach(function(element) {
			          result[element.name] = element.value;
			        });

			        return result;*/
			      }
			    )?
			    end_object
			    { return members !== null ? members: {}; }

			member
			  = name:(name2:string name_separator { CUR_FIELD = name2; return name2;}) value:value {
			      return { name: name, value: value };
			    }

			// ----- 5. Arrays -----

			array
			  = begin_array
			    values:(
			      head:value
			      tail:(value_separator v:value { return v; })*
			      {
			    	  return [];
//			    	  return [head].concat(tail);
			      }
			    )?
			    end_array
			    { return values !== null ? values : []; }

			// ----- 6. Numbers -----

			number "number"
			  = minus? int f:frac? e:exp? { return f || e ? parseFloat(text()) : parseInt(text()); }

			decimal_point
			  = "."

			digit1_9
			  = [1-9]

			e
			  = [eE]

			exp
			  = e (minus / plus)? DIGIT+

			frac
			  = decimal_point DIGIT+

			int
			  = zero / (digit1_9 DIGIT*)

			minus
			  = "-"

			plus
			  = "+"

			zero
			  = "0"

			// ----- 7. Strings -----

			string "string"
			  = quotation_mark chars:char* quotation_mark { return chars.join(""); }

			char
			  = unescaped
			  / escape
			    sequence:(
			        '"'
			      / "\\"
			      / "/"
			      / "b" { return "\b"; }
			      / "f" { return "\f"; }
			      / "n" { return "\n"; }
			      / "r" { return "\r"; }
			      / "t" { return "\t"; }
			      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
			          return String.fromCharCode(parseInt(digits, 16));
			        }
			    )
			    { return sequence; }

			escape
			  = "\\"

			quotation_mark
			  = '"'

			unescaped
			  = [^\0-\x1F\x22\x5C]

			// ----- Core ABNF Rules -----

			// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
			DIGIT  = [0-9]
			HEXDIG = [0-9a-f]i
			`;

		},
		
		execute: function(){
			var parser = Peg.generate(this.jsonGrammar);
			Peg.parseStream(parser, this.stream, {
				onProgress: function(position, available){
					var total = $this.getFileSize();
					position = total - available;
					var progress = Math.round(position * 100 / total);
					$this.publish('Parser.progress', {progress: progress, position: position, total: total});
				}
			});
		}
	}
}