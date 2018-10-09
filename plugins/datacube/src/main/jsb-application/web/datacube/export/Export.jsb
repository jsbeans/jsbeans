{
	$name: 'DataCube.Export.Export',
	$client: {
	    $singleton: true,
	    $constructor: function(opts){
	        $base(opts);

	        $jsb.loadScript('htmlToCanvas.js');

	        this._downloadAttrSupported = window.document.createElement('a').download !== undefined;
	    },

	    exportData: function(format, data, fileName){
	        switch(format){
	            case 'xls':
	                this.downloadXLS(data, fileName);
	                break;
                case 'csv':
                    this.downloadCSV(data, fileName);
                    break;
                case 'json':
                    this.downloadJSON(data, fileName);
                    break;
                case 'png':
                    this.downloadImage(data, fileName);
                break;
	        }
	    },

	    downloadCSV: function(rows, fileName){
            var csv = '',
                // use ';' for direct to Excel
                itemDelimiter = ';',
                // '\n' isn't working with the js csv data extraction
                lineDelimiter = '\n';

            rows.forEach(function(row, i){
                var val = '',
                    j = row.length,
                    n = (1.1).toLocaleString()[1];

                while (j--) {
                    val = row[j];
                    if (typeof val === 'string') {
                        val = '"' + val + '"';
                    }
                    if (typeof val === 'number') {
                        if (n === ',') {
                            val = val.toString().replace('.', ',');
                        }
                    }
                    row[j] = val;
                }
                // Add the values
                csv += row.join(itemDelimiter);

                // Add the line delimiter
                if (i < rows.length - 1) {
                    csv += lineDelimiter;
                }
            });

            this.fileDownload(
                'data:text/csv,\uFEFF' + encodeURIComponent(csv),
                'csv',
                csv,
                fileName
            );
	    },
	    
	    downloadJSON: function(rows, fileName){
	    	var json = [];
	    	var header = rows[0];
	    	for(var i = 1; i < rows.length; i++){
	    		var r = {};
	    		for(var j = 0; j < header.length; j++){
	    			r[header[j]] = rows[i][j];
	    		}
	    		json.push(r);
	    	}
	    	var data = JSON.stringify(json, null, 4);

            this.fileDownload(
                'data:text/json,\uFEFF' + encodeURIComponent(data),
                'json',
                data,
                fileName
            );
	    },

	    downloadXLS: function(data, fileName){
            var uri = 'data:application/vnd.ms-excel;base64,',

                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
                'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
                'xmlns="http://www.w3.org/TR/REC-html40">' +
                '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
                '<x:ExcelWorksheets><x:ExcelWorksheet>' +
                '<x:Name>Ark1</x:Name>' +
                '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>' +
                '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>' +
                '</xml><![endif]-->' +
                '<style>td{border:none;font-family: Calibri, sans-serif;} ' +
                '.number{mso-number-format:"0.00";} ' +
                '.text{ mso-number-format:"\@";}</style>' +
                '<meta name=ProgId content=Excel.Sheet>' +
                '<meta charset=UTF-8>' +
                '</head><body>' +
                this.createTable(data) +
                '</body></html>',

                base64 = function(s) {
                    return window.btoa(unescape(encodeURIComponent(s))); // #50
                };

            this.fileDownload(
                uri + base64(template),
                'xls',
                template,
                fileName
            );
	    },

	    fileDownload: function(href, extension, content, name){
            // MS specific. Check this first because of bug with Edge (#76)
            if (window.Blob && window.navigator.msSaveOrOpenBlob) {
                // Falls to msSaveOrOpenBlob if download attribute is not supported
                var blobObject = new window.Blob(
                    ['\uFEFF' + content], // #7084
                    {
                        type: 'text/csv'
                    }
                );
                window.navigator.msSaveOrOpenBlob(blobObject, name + '.' + extension);

                // Download attribute supported
            } else if (this._downloadAttrSupported) {
                var a = window.document.createElement('a');
                a.href = href;
                a.download = name + '.' + extension;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                throw new Error('Браузер не поддерживает скачивание файлов');
            }
	    },

	    createTable: function(rows){
            var html = '<table><thead>';

            rows.forEach(function(row, i){
                var tag = i ? 'td' : 'th',
                    val,
                    j,
                    n =(1.1).toLocaleString()[1];

                html += '<tr>';
                for (j = 0; j < row.length; j = j + 1) {
                    val = row[j];
                    // Add the cell
                    if (typeof val === 'number') {
                        val = val.toString();
                        if (n === ',') {
                            val = val.replace('.', n);
                        }
                        html += '<' + tag + ' class="number">' + val + '</' + tag + '>';

                    } else {
                        html += '<' + tag + ' class="text">' +
                            (val === undefined ? '' : val) + '</' + tag + '>';
                    }
                }

                html += '</tr>';

                if (!i) {
                    html += '</thead><tbody>';
                }
            });

            html += '</tbody></table>';

            return html;
	    },

	    downloadImage: function(widget, fileName){
	        html2canvas(widget).then(function(canvas){
	            $this.fileDownload(canvas.toDataURL("image/png"), 'png', canvas.toDataURL("image/png"), fileName);
	        });
	    }
	}
}