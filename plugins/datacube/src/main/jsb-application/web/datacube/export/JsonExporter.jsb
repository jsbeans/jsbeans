/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Export.JsonExporter',
	$parent: 'DataCube.Export.Exporter',
	$session: false,
	
	$server: {
		$require: ['DataCube.Export.ExportManager'],
		
		$bootstrap: function(){
			ExportManager.registerExporter(this, {
				key: 'json',
				ext: 'json',
				contentType: 'application/json',
				mode: 'text',
				name: 'JSON (*.json)'
			});
		},
		
		count: 0,
		
		begin: function(){
			this.getStream().write('[');
		},
		
		write: function(item){
			if(this.count > 0){
				this.getStream().writeLine(',');
			}
			this.getStream().write(JSON.stringify(item));
			this.count++;
		},
		
		end: function(){
			this.getStream().write(']');
		}
	}
}