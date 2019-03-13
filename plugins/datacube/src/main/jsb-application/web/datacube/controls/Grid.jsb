{
	$name: 'DataCube.Controls.Grid',
	$parent: 'JSB.Widgets.Widget',

	$require: ['Handsontable',
	           'JSB.Controls.Button',
	           'DataCube.Controls.Error',
	           'css:Grid.css'],

	$client: {
	    _currentLoadId: null,
	    _entry: null,
	    _query: null,
	    _sort: undefined,

		$constructor: function(opts){
			$base(opts);
			this.addClass('grid');

            this.table = new Handsontable({
            	noDataMessage: opts && opts.noDataMessage || 'Нет данных',
                table: {
                    rowHeaders: false,
                    readOnly: false,
                    manualRowMove: false,
                    /*
                    manualColumnResize: true,
                    manualRowResize: true,
                    rowHeights: 40
                    */
                },
                callbacks: {
                    createHeader: function(i, header) {
                        if(!header) {
                            return i + 1;
                        }

                        var cssClass = "btnSort upSort";

                        if($this._sort && Object.keys($this._sort.$sort[0])[0] === header){
                            cssClass = $this._sort.$sort[0][header] === 1 ? "btnSort upSort" : "btnSort downSort";
                        }

		                var sortButton = `#dot <div
                            jsb="JSB.Controls.Button"
                            class="{{=cssClass}}"
                            icon=true
                            onclick="{{=$this.callbackAttr(function(evt){ $this.sortButtonClick(evt, { column: i, header: header }); })}}" >
                        </div>`;

                        return '<span class="headerName">' + header + '</span>' + sortButton;
                     },
                    preLoader: function(rowCount){
                        if(!$this._eof){
                            $this.fetch(false, rowCount);
                        }
                    }
                }
            });
            this.append($this.table);

            this.error = new Error();
            this.append(this.error);
		},

		clear: function(){
		    this.error.hide();
            this.table.clear();

            this._eof = false;
            this._sort = undefined;
		},

		exportData: function(key, name, callback){
			this.server().doExport(key, name, function(dh, fail){
				callback.call();
				if(dh){
					dh.download();
				}
			});
		},

		/**
		* Загружает новые данные
		*
		* @param {boolean} [isNeedRefresh] - загрузить данные с самого начала?
		* @param {integer} [rowCount] - номер строки, с которой нужно добавлять данные
		*/
		fetch: function(isNeedRefresh, rowCount){
		    this.getElement().loader();

		    var curLoadId = this._currentLoadId = JSB.generateUid(),
		        fetchOpts = {
                    entry: this._entry,
                    query: this._query,
                    sort: this._sort,
                    isNeedRefresh: isNeedRefresh
		        };

		    this.server().fetch(fetchOpts, function(res, fail){
		        if($this._currentLoadId !== curLoadId){
		            return;
		        }

		        $this.getElement().loader('hide');

		        if(fail){
		            $this.error.show(fail.message);
		            return;
		        }

		        if(res.data.length !== 0){
		            if(JSB.isDefined(rowCount)){
		                $this.table.addArray(rowCount, res.data);
                    } else {
                        $this.table.loadData(res.data);
                    }
		        }

		        if(res.eof){
		            $this._eof = true;
		        } else {
                    if($this.table.getElement().height() >= $this.table.getElement().find('.ht_master.handsontable > div.wtHolder > .wtHider').height()){
                        $this.fetch(false, $this.table.getRowCount());
                    }
		        }
		    });
		},

		refresh: function(entry, query){
		    this.clear();

		    this._entry = entry;
		    this._query = query;

		    this.fetch(true);
		},

		sortButtonClick: function(evt, obj){
		    this._sort = {$sort:[{}]};

		    if(this.$(evt.target).hasClass('upSort')){
		        this.$(evt.target).removeClass('upSort').addClass('downSort');

		        this._sort.$sort[0][obj.header] = -1;
		    } else {
		        this.$(evt.target).removeClass('downSort').addClass('upSort');

		        this._sort.$sort[0][obj.header] = 1;
		    }

		    this.fetch(true);
		}
	},

	$server: {
		$require: ['DataCube.Export.ExportManager',
		           'JSB.Web.Download'],

        _dataIterator: null,

	    destroy: function(){
	    	this.clearIterator();
	    	$base();
	    },

	    clearIterator: function(){
	    	if(this._dataIterator) {
	    		try {
	    			this._dataIterator.close();
	    		} catch(e){}
	    		this._dataIterator = null;
	    	}
	    },

        /**
        * Загружает новые данные
        *
        * @param {Object} fetchOpts
        * @param {Object} fetchOpts.entry - entry, у которого вызывается запрос
        * @param {Object} [fetchOpts.query] - запрос, если не сохранён в entry
        * @param {Object} [fetchOpts.sort] - запрос сортировки
        * @param {boolean} [fetchOpts.isNeedRefresh] - заменить итератор?
        */
	    fetch: function(fetchOpts){
	        var res = {
	            data: [],
	            eof: false
	        },
	        count = 0;

	        if(fetchOpts.isNeedRefresh){
                this.clearIterator();

                try{
                    // вызов из редактора запросов (несохранённый запрос)
                    if(fetchOpts.query){
                        if(fetchOpts.sort){
                            JSB.merge(fetchOpts.query, fetchOpts.sort);
                        }

                        this._dataIterator = fetchOpts.entry.getQueryableContainer().executeQuery(fetchOpts.query, {}, false);
                    } else {    // вызов готового запроса
                        this._dataIterator = fetchOpts.entry.executeQuery({
                            extQuery: fetchOpts.sort,
                            useCache: true
                        });
                    }
                } catch(e){
                    this.clearIterator();

                    throw e;
                }
	        }

	        try{
                while(count < 20){
                    var element = this._dataIterator.next();

                    if(!element){
                        res.eof = true;
                        break;
                    }

                    res.data.push(element);
                    count++;
                }
	        } catch(e){
                this.clearIterator();

                throw e;
	        }

	        return res;
	    },

	    doExport: function(format, name){
	    	var fileName = ExportManager.getExportFileName(format, name);
			var ct = ExportManager.getContentType(format);
			var mode = ExportManager.getContentMode(format);
			var encoding = ExportManager.getEncoding(format);
			var dh = new Download(fileName, {mode: mode, contentType: ct, encoding: encoding}, function(stream){
				var exporter = ExportManager.createExporter(format, stream, {name: name, file: fileName});
				// write into download stream
				try {
					exporter.iterate($this.exportObj.source.executeQuery($this.exportObj.query, $this.exportObj.queryParams, $this.exportObj.provider));
				} finally {
					exporter.destroy();
				}
			});

			return dh;
	    }
	}
}