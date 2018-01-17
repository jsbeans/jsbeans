{
	$name: 'DataCube.Export.Export',
	$parent: 'JSB.Controls.Control',
	$client: {
	    $require: [],
	    $constructor: function(opts){
	        $base(opts);

	        if(opts.highcharts){
	            this.loadScript('Highcharts-export-data.js');
	        }

	        this._downloadAttrSupported = window.document.createElement('a').download !== undefined;

	        this.addClass('exportBtn');
	        this.loadCss('Export.css');

	        this.menu = this.$('<ul class="hidden"></ul>');
	        this.append(this.menu);

	        this.createMenu();

	        this.getElement().click(function(){
	            $this.menu.toggleClass('hidden');
	        });
	    },

	    options: {
	        exportFormats: ['xls'],
	        getData: null   // must be function from widget
	    },

	    _exportFormats: {
	        xls: 'Excel'
	    },

	    createMenu: function(){
	        for(var i = 0; i < this.options.exportFormats.length; i++){
	            this.menu.append('<li key="' + this.options.exportFormats[i] + '"> Скачать ' + this._exportFormats[this.options.exportFormats[i]] + '</li>');
	        }

	        this.menu.find('li').click(function(evt){
	            $this.menu.addClass('hidden');
	            $this.exportData($this.$(evt.target).attr('key'));
	        });
	    },

	    exportData: function(format){
	        switch(format){
	            case 'xls':
	                this.downloadXLS();
	                break;
	        }
	    },

	    downloadXLS: function(){
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
                this.createTable() +
                '</body></html>',

                base64 = function(s) {
                    return window.btoa(unescape(encodeURIComponent(s))); // #50
                };

            this.fileDownload(
                uri + base64(template),
                'xls',
                template,
                'application/vnd.ms-excel'
            );
	    },

	    fileDownload: function(href, extension, content){
	        var name = 'Виджет';

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
                this.append(a); // #111
                a.click();
                a.remove();

            } else {
                throw new Error('Браузер не поддерживает скачивание файлов');
            }
	    },

	    createTable: function(){
            var html = '<table><thead>',
                rows = this.options.getData.call();

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
	    }
	}
}