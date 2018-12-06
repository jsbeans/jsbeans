{
	$name: 'DataCube.Export.XlsExporter',
	$parent: 'DataCube.Export.Exporter',
	$session: false,
	
	$server: {
		$require: ['DataCube.Export.ExportManager', 'JSB.Web'],
		
		$bootstrap: function(){
			ExportManager.registerExporter(this, {
				key: 'xls',
				ext: 'xls',
				contentType: 'application/vnd.ms-excel',
				mode: 'text',
				name: 'Excel (*.xls)'
			});
		},
		
		count: 0,
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
			var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
            'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
            'xmlns="http://www.w3.org/TR/REC-html40">' +
            '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
            '<x:ExcelWorksheets><x:ExcelWorksheet>' +
            '<x:Name>'+(this.getOptions() && this.getOptions().name || 'sheet1')+'</x:Name>' +
            '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>' +
            '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>' +
            '</xml><![endif]-->' +
            '<style>td{border:none;font-family: Calibri, sans-serif;} ' +
            '.number{mso-number-format:"0.00";} ' +
            '.text{ mso-number-format:"\@";}</style>' +
            '<meta name=ProgId content=Excel.Sheet>' +
            '<meta charset=UTF-8>' +
            '</head><body><table><thead>';
			this.getStream().write(template);
			
		},
		
		write: function(item){
			if(this.count == 0){
				// generate header
				var keys = Object.keys(item);
				this.getStream().write('<tr>');
				for(var i = 0; i < keys.length; i++){
					var key = keys[i];
					this.getStream().write('<th>' + key + '</th>');
				}
				this.getStream().write('</tr></thead><tbody>');
			}
			this.getStream().write('<tr>');
			var keys = Object.keys(item);
			for(var i = 0; i < keys.length; i++){
				var key = keys[i];
				var val = item[key];
				
				if(JSB.isString(val) && val.length > 0){
					this.getStream().write('<td class="text">');
					val = val.trim();
					this.getStream().write(val);
				} else if(JSB.isNumber(val)){
					this.getStream().write('<td class="number">');
					val = '' + val;
					if(this.comma == ','){
						val = val.replace('.', ',');
					}
					this.getStream().write(val);
				} else {
					this.getStream().write('<td class="text">');
					this.getStream().write(JSON.stringify(val));
				}
				this.getStream().write('</td>');
			}
			
			this.getStream().write('</tr>');
			this.count++;
		},
		
		end: function(){
			this.getStream().write('</tbody></table></body></html>');
		}
	}
}