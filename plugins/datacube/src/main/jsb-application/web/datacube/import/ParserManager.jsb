{
	$name: 'DataCube.ParserManager',
	$singleton: true,
	
	$client: {
		supportedMap: {},
		
		getSupportedParsers: function(entry, callback){
			function getParserScheme(jsb){
				if(!jsb || !jsb.getDescriptor() || !jsb.isSubclassOf('DataCube.Parser')){
					return;
				}
				
				return JSB.merge(true, {}, getParserScheme(jsb.getParent()) || {}, jsb.getDescriptor().$scheme || {})
			}
			this.server().getSupportedParsers(entry, function(supported){
				JSB.chain(supported, function(pDesc, c){
					JSB.lookup(pDesc.jsb, function(pCls){
						pDesc.jsbClass = pCls;
						pDesc.scheme = getParserScheme(pCls.jsb);//pCls.jsb.$scheme;
						c(pDesc);
					});
				}, function(pDescArr){
					callback(pDescArr);
				});
			});
		},
	},
	
	$server: {
		parsers: {},
		
		registerParser: function(parserJsb, opts){
			if(!(parserJsb instanceof JSB)){
				throw new Error('Only JSB object expected in registerParser');
			}
			if(!parserJsb.isSubclassOf('DataCube.Parser')){
				throw new Error('Bean "'+parserJsb.$name+'" is not subclassed from "DataCube.Parser"');
			}
			
			this.parsers[parserJsb.$name] = {opts: opts};
		},
		
		getSupportedParsers: function(fileEntry){
			var supported = [];
			for(var pJsb in this.parsers){
				var pDesc = this.parsers[pJsb];
				var pOpts = pDesc.opts;
				if(!pOpts || !pOpts.accepts || !JSB.isFunction(pOpts.accepts)){
					continue;
				}
				var bAccepts = pOpts.accepts.call(this, fileEntry);
				if(bAccepts){
					supported.push({
						jsb: pJsb,
						name: pOpts.name
					});
				}
			}
			
			return supported;
		}
	}
}