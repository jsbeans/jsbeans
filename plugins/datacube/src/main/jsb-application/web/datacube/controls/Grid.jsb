{
	$name: 'DataCube.Controls.Grid',
	$parent: 'JSB.Widgets.Widget',

	$require: ['JSB.Controls.Grid',
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

            this.table = new Grid({
            	noDataMessage: opts && opts.noDataMessage || 'Нет данных',

            	headerRenderer: function(el, index){
                    var cssClass = "btnSort";

                    if($this._sort && Object.keys($this._sort.$sort[0])[0] === index){
                        cssClass += $this._sort.$sort[0][index] === 1 ? " upSort" : " downSort";
                    }

                    el.append('<span class="headerName">' + index + '</span>');

                    el.append(new Button({
                        cssClass: cssClass,
                        icon: true,
                        onClick: function(evt){
                            $this.sortButtonClick(evt.currentTarget, index);
                        }
                    }));

                    return el;
            	},

            	preloader: function(){
                    if(!$this._eof){
                        $this.fetch();
                    }
            	}
            });
            this.append(this.table);
            
            this.loader = this.$('<div class="loader">Загрузка</div>');
            this.table.find('.grid-master').append(this.loader);

            this.error = new Error();
            this.append(this.error);
		},

		clear: function(){
		    this.error.hide();
            this.table.clear();

            this._eof = false;
            this._sort = undefined;
            this.removeClass('eof');
            this.removeClass('hasMore');
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
		*/
		fetch: function(isNeedRefresh){
			if(isNeedRefresh){
				this.getElement().loader();
				$this.removeClass('hasMore');
			} else {
				this.addClass('preloading');	
			}

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
		        

		        if(isNeedRefresh){
		        	$this.getElement().loader('hide');
		        } else {
		        	$this.removeClass('preloading');	
		        }

		        if(fail){
		            $this.error.show(fail.message);
		            return;
		        }

		        if(res.eof){
		            $this._eof = true;
		            $this.addClass('eof');
		            $this.removeClass('hasMore');
		        } else {
		        	$this.addClass('hasMore');
		        }

		        if(res.data.length !== 0){
		            if(isNeedRefresh){
		                $this.table.setData(res.data);
                    } else {
                        $this.table.addArray(res.data);
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

		sortButtonClick: function(target, field){
		    this._sort = {$sort:[{}]};

		    if(this.$(target).hasClass('upSort')){
		        this._sort.$sort[0][field] = -1;
		    } else {
		        this._sort.$sort[0][field] = 1;
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