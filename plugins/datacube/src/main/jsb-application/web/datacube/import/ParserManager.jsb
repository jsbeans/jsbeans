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
		
		createParser: function(entry, parser, values){
			if(!this.parsers[parser]){
				throw new Error('Failed to find parser: ' + parser);
			}
			var pJsbClass = JSB.get(parser).getClass();
			var bootstrap = 'Datacube.Unimap.Bootstrap';
			var valSel = new ValueSelector({
				bootstrap: bootstrap,
				values: values
			});
			return new pJsbClass(entry, valSel);
		},
		
		runStructureAnalyzing: function(entry, parser, values){
			var pInst = this.createParser(entry, parser, values);
			JSB.defer(function(){
				JSB.getLogger().debug('Analyzing structure for: ' + entry.getName());
				entry.property('status', 1);
				var struct = null;
				try {
					try {
						pInst.analyze();
					} catch(e){
						if(e != 'Break'){
							throw e;
						}
					}
					struct = pInst.getStruct();
					pInst.prepare();
					
					entry.property('structure', struct);
					entry.property('status', 0);
					JSB.getLogger().debug('Analysis complete for: ' + entry.getName() + ': ' + JSON.stringify(struct, null, 4));
					$this.client().onAnalysisComplete(entry, struct, {});
				} finally {
					pInst.destroy();
				}
			}, 0);
			return pInst;
		},
		
		executePreview: function(entry, parser, values){
			var pInst = this.createParser(entry, parser, values);
			try {
				try {
					pInst.parse(function(tableDesc, rowData){
						debugger;
					});
				} catch(e){
					if(e != 'Break'){
						throw e;
					}
				} 
				
				// combine tables
			} finally {
				pInst.destroy();
			}
		}
	}
}