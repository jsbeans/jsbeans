JSB({
	name: 'Ontoed.Model.Axiom',
	parent: 'Ontoed.Model.Entity',
	require: ['Ontoed.Host'],
	
	common: {
		getEntityType: function(){
			return 'Axiom';
		}
	},
	
	client: {
		constructor: function(desc){
			this.base(desc);
		}
	},
	
	server: {
		constructor: function(id, desc, onto){
			onto.axiomProfiler.probe('constructAxiom:base');
			this.base(id, desc, onto);
			
			// parse axiom
			onto.axiomProfiler.probe('constructAxiom:parse');
			
			this.info.resolver = this.parse(this.info.functionalExpression.trim()).value;
			
			// update axiom entities
			for(var eid in this.info.signature){
				if(this.ontology.entities[eid]){
					this.ontology.entities[eid].axioms[this.info.md5] = this;
				}
			}
		},
		
		destroy: function(){
			// remove relations in entities
			for(var eid in this.info.signature){
				if(this.ontology.entities[eid] && this.ontology.entities[eid].axioms[this.info.md5]){
					delete this.ontology.entities[eid].axioms[this.info.md5];
				}
			}
			
			this.getSuperClass('Ontoed.Model.Entity').destroy.call(this);
		},
		
		parse: function(expression){
			// parse next token
			var tokenPos = 0;
			var token = '';
			while(expression[tokenPos] == ' '){
				tokenPos++;
			}
			var curPos = tokenPos;
			// extract token
			if(expression[curPos] == '"'){
				// parse string
				for(curPos++; curPos < expression.length; curPos++){
					if(expression[curPos] == '"'){
						// check escaped
						if(expression[curPos - 1] == '\\'){
							continue;
						}
						break;
					}
				}
			}
			for(; curPos < expression.length
					&& expression[curPos] != ' ' 
					&& expression[curPos] != '('
					&& expression[curPos] != ')'; curPos++ ){
			}
			token = expression.substr(tokenPos, curPos - tokenPos);
			
			// detect token type
			while(expression[curPos] == ' '){
				curPos++;
			}
			
			if(expression[curPos] == '('){
				// token is axiom type
				var scope = {
					type: token,
					items: []
				};
				
				// extract expression inside parens
				var parens = 0;
				var lastParen = 0;
				for( lastParen = curPos + 1; lastParen < expression.length; lastParen++ ){
					if(expression[lastParen] == '('){
						parens++;
					}
					if(expression[lastParen] == ')'){
						parens--;
						
						if(parens < 0){
							break;
						}
					}
				}
				var subExpr = expression.substr(curPos + 1, lastParen - (curPos + 1));
				if(subExpr.length == 0){
					throw 'Wrong search for subexpression: ' + expression
				}
				
				var curExpression = subExpr;
				while(true){
					var res = this.parse(curExpression);
					if(!res){
						break;
					}
					scope.items.push(res.value);
					if(res.position >= curExpression.length){
						break;
					}
					curExpression = curExpression.substr(res.position);
				}
				
				return {value: scope, position: lastParen + 1};
			} else {
				// token is entity or literal
				if(this.ontology.iriMap[token]){
					// entity
					return {
						value: this.ontology.iriMap[token],
						position: tokenPos + token.length
					}
				} else {
					// literal, type name or facet
					
					return {
						value: this.parseLiteral(token),
						position: tokenPos + token.length
					}
				}
			}
		},
		
		parseLiteral: function(str){
			
			function clearQuotes(val){
				if(val.startsWith('"') && val[val.length - 1] == '"'){
					// look for other "
					var pp = 1;
					for(; pp < val.length; pp++){
						if(val[pp] == '"' && val[pp - 1] != '\\'){
							break;
						}
					}
					if(pp == val.length - 1 || val[pp + 1] == '@'){
						val = val.substr(1, pp - 1);
					}
				}
				return val;
			}
			
			var desc = {
				string: str
			};
			// check is facet
			var facet = Ontoed.Host.getFacet(str);
			if(facet){	// check is facet
				desc.type = 'facet';
				desc.value = str;
				desc.name = facet.name;
				desc.enum = facet.value;
			} else if(str.indexOf('xsd:') == 0 || str.indexOf('rdfs:') == 0){ // check is type name
				desc.type = 'typeName';
				desc.value = str;
			} else {
				desc.type = 'literal';
				
				// check for type existence
				var typeExPos = str.indexOf('^^');
				if(typeExPos >= 0){
					desc.datatype = str.substr(typeExPos + 2);
					var valuePart = str.substr(0, typeExPos);
					
					if(desc.datatype == 'xsd:int' || desc.datatype == 'xsd:integer'){
						desc.value = parseInt(clearQuotes(valuePart));
					} else if(desc.datatype == 'xsd:bool' || desc.datatype == 'xsd:boolean'){
						if(valuePart.indexOf('false') >= 0){
							desc.value = true;
						} if(valuePart.indexOf('0') >= 0){
							desc.value = false;
						} else {
							desc.value = true;
						}
					} else if(desc.datatype == 'xsd:float' || desc.datatype == 'xsd:double'){
						desc.value = parseFloat(clearQuotes(valuePart));
					} else if(desc.datatype == 'xsd:string'){
						desc.value = clearQuotes(valuePart);
					} else {
						desc.value = valuePart;
					} 
				} else {
					// try to detect type
					if(str.indexOf('@') >= 0 || str.startsWith('"')){
						desc.datatype = 'xsd:string';
						desc.value = clearQuotes(str);
					} else if(!isNaN(parseInt(str))){
						var val = parseInt(str);
						desc.value = val;
						desc.datatype = 'xsd:int';
					} else if(!isNaN(parseFloat(str))){
						var val = parseFloat(str);
						desc.value = val;
						desc.datatype = 'xsd:int';
					} else {
						desc.datatype = 'xsd:string';
						desc.value = clearQuotes(str);
					}
				}
			}
			
			return desc;
		}
	}
});