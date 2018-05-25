{
	$name: 'DataCube.ParserManager',
	$singleton: true,
	
	$client: {
		supportedMap: {},
		
		getSupportedParsers: function(entry, callback){
			this.server().getSupportedParsers(entry, callback);
		},
		
		onAnalysisComplete: function(entry, struct, values){
			$this.publish('ParserManager.analysisComplete', {entry: entry, struct:struct, values:values});
		},
	},
	
	$server: {
		$require: ['Unimap.ValueSelector'],
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
			function getParserScheme(jsb){
				if(!jsb || !jsb.getDescriptor() || !jsb.isSubclassOf('DataCube.Parser')){
					return;
				}
				
				return JSB.merge(true, {}, getParserScheme(jsb.getParent()) || {}, jsb.getDescriptor().$scheme || {})
			}
			
			var supported = [];
			for(var pJsbName in this.parsers){
				var pDesc = this.parsers[pJsbName];
				var pOpts = pDesc.opts;
				if(!pOpts || !pOpts.accepts || !JSB.isFunction(pOpts.accepts)){
					continue;
				}
				var bAccepts = pOpts.accepts.call(this, fileEntry);
				if(bAccepts){
					var pJsb = JSB.get(pJsbName);
					supported.push({
						jsb: pJsbName,
						scheme: getParserScheme(pJsb),
						name: pOpts.name
					});
				}
			}
			
			return supported;
		},
		
		runStructureAnalyzing: function(entry, parser, values){
			if(!this.parsers[parser]){
				throw new Error('Failed to find parser: ' + parser);
			}
			var pJsbClass = JSB.get(parser).getClass();
			var bootstrap = 'Datacube.Unimap.Bootstrap';
			var valSel = new ValueSelector({
				bootstrap: bootstrap,
				values: values
			});
			var pInst = new pJsbClass(entry, valSel);
			JSB.defer(function(){
				JSB.getLogger().debug('Analyzing structure for: ' + entry.getName());
				entry.property('status', 1);
				pInst.analyze();
				var struct = pInst.getStruct();
				entry.property('structure', struct);
				entry.property('status', 0);
				JSB.getLogger().debug('Analysis complete for: ' + entry.getName() + ': ' + JSON.stringify(struct, null, 4));
				$this.client().onAnalysisComplete(entry, struct, {});
			}, 0);
			return pInst;
		}
	}
}