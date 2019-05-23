/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Export.ExportManager',
	$singleton: true,
	$sync: {
		updateCheckInterval: 0
	},
	
	exporters: {},
	
	listExporters: function(){
		return this.exporters;
	},
	
	$client: {
		$constructor: function(){
			$base();
			$this.doSync();
		},
		
		runScript: function(proc){
			return eval(proc);
		}
	},
	
	$server: {
		registerExporter: function(exporterJsb, opts){
			if(!(exporterJsb instanceof JSB)){
				throw new Error('Only JSB object expected in registerExporter');
			}
			if(!exporterJsb.isSubclassOf('DataCube.Export.Exporter')){
				throw new Error('Bean "'+exporterJsb.$name+'" is not subclassed from "DataCube.Export.Exporter"');
			}
			
			this.exporters[opts.key] = JSB.merge({jsb:exporterJsb.$name}, opts);
			this.doSync();
		},
		
		createExporter: function(key, stream, opts){
			var eDesc = this.exporters[key];
			if(!eDesc){
				throw new Error('Unknown exporter: ' + key);
			}
			var eJsb = JSB.get(eDesc.jsb);
			var ExporterClass = eJsb.getClass();
			var exporter = new ExporterClass(this, stream, opts);
			return exporter;
		},
		
		getExportFileName: function(key, title){
			var eDesc = this.exporters[key];
			if(!eDesc){
				throw new Error('Unknown exporter: ' + key);
			}
			return title + '.' + eDesc.ext;
		},
		
		getContentType: function(key){
			var eDesc = this.exporters[key];
			if(!eDesc){
				throw new Error('Unknown exporter: ' + key);
			}
			return eDesc.contentType;
		},
		
		getContentMode: function(key){
			var eDesc = this.exporters[key];
			if(!eDesc){
				throw new Error('Unknown exporter: ' + key);
			}
			return eDesc.mode;
		},
		
		getEncoding: function(key){
			var eDesc = this.exporters[key];
			if(!eDesc){
				throw new Error('Unknown exporter: ' + key);
			}
			return eDesc.encoding || 'UTF-8';
		},
		
	}
}