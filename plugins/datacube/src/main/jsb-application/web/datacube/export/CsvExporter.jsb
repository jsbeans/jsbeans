{
	$name: 'DataCube.Export.CsvExporter',
	$parent: 'DataCube.Export.Exporter',
	$session: false,
	
	$server: {
		$require: ['DataCube.Export.ExportManager', 'JSB.Web'],
		
		$bootstrap: function(){
			ExportManager.registerExporter(this, {
				key: 'csv',
				ext: 'csv',
				contentType: 'text/csv',
				mode: 'text',
				encoding: 'windows-1251',
				name: 'Значения разделенные запятыми (*.csv)'
			});
		},
		
		count: 0,
		delimiter: ';',
		comma: '.',
		
		$constructor: function(manager, stream, opts){
			$base(manager, stream, opts);
			var rh = Web.getRequestHeaders();
			var locale = rh['Accept-Language'];
			if(locale.indexOf('ru') >= 0){
				this.comma = ',';
			}
		},
		
		begin: function(){
			
		},
		
		write: function(item){
			if(this.count == 0){
				// generate header
				var keys = Object.keys(item);
				for(var i = 0; i < keys.length; i++){
					var key = keys[i];
					this.getStream().write(key);
					if(i < keys.length - 1){
						this.getStream().write(this.delimiter);
					}
				}
				this.getStream().writeLine('');
			}
			var keys = Object.keys(item);
			for(var i = 0; i < keys.length; i++){
				var key = keys[i];
				var val = item[key];
				if(JSB.isString(val) && val.length > 0){
					val = val.trim();
					var needQuote = false;
					if(val.indexOf(';') >= 0 || val.indexOf('"') >= 0){
						needQuote = true;
					}
					val = val.replace(/\"/g, '""');
					if(needQuote){
						val = '"' + val + '"';
					}
					this.getStream().write(val);
				} else if(JSB.isNumber(val)){
					val = '' + val;
					if(this.comma == ','){
						val = val.replace('.', ',');
					}
					this.getStream().write(val);
				} else {
					this.getStream().write(JSON.stringify(val));
				}
				if(i < keys.length - 1){
					this.getStream().write(this.delimiter);
				}
			}
			this.getStream().writeLine('');
			this.count++;
		},
		
		end: function(){
			
		}
	}
}