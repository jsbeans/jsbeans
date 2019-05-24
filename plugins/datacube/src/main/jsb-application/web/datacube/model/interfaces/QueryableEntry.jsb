/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Model.QueryableEntry',
	$parent: 'DataCube.Model.SettingsEntry',
	
	getQueryableContainer: function(){
		throw new Error('QueryableEntry.getQueryableContainer should be overridden');
	},

	$server: {
		$require: ['DataCube.Export.ExportManager',
		           'JSB.Web.Download'],

		createQuerySelect: function(selectedFields, useContext, useSourceContext){
            var fields = this.extractFields(),
                context = this.getFullId(),
                select = {};

            for(var i in fields){
                if(selectedFields && !selectedFields[i]){
                    continue;
                }

                select[i] = {
                    $context: useContext ? context : undefined,
                    $field: i,
                    $sourceContext: useSourceContext ? context : undefined
                };
            }

            return select;
	    },

		executeQuery: function(opts){
			throw new Error('QueryableEntry.executeQuery should be overridden');
		},

		isQuerySupport: function(){
		    return false;
		},

        /**
        * Экспотирует запрос
        *
        * @param {string} format - формат экспорта
        * @param {string} name - имя файла
        * @param {Object} [query] - запрос
        */
		exportData: function(format, name, query) {
	    	var fileName = ExportManager.getExportFileName(format, name);
			var ct = ExportManager.getContentType(format);
			var mode = ExportManager.getContentMode(format);
			var encoding = ExportManager.getEncoding(format);
			var dh = new Download(fileName, {mode: mode, contentType: ct, encoding: encoding}, function(stream) {
				var exporter = ExportManager.createExporter(format, stream, {name: name, file: fileName});
				// write into download stream
				try {
				    if(query) {
				        exporter.iterate($this.getQueryableContainer().executeQuery(query, {}, false));
				    } else {
					    exporter.iterate($this.executeQuery({ useCache: true }));
                    }
				} finally {
					exporter.destroy();
				}
			});

			return dh;
		},
		
		extendQuery: function(query, opts){
			var preparedQuery = JSB.clone(query);
			var params = {};
            if(!preparedQuery || Object.keys(preparedQuery).length == 0){
            	preparedQuery = { $select: {}};
            }
            var extQuery = (opts && opts.extQuery) || {};
			var useCache = (opts && opts.useCache) || false;
            if(extQuery && Object.keys(extQuery).length > 0){
            	var qDesc = this.getQueryableContainer().parametrizeQuery(extQuery);
            	params = qDesc.params;

            	// merge queries
            	if(qDesc.query.$filter && Object.keys(qDesc.query.$filter).length > 0){
            		if(preparedQuery.$filter){
            			preparedQuery.$filter = {$and:[preparedQuery.$filter, qDesc.query.$filter]}
            		} else {
            			preparedQuery.$filter = qDesc.query.$filter;
            		}
            	}

            	if(qDesc.query.$cubeFilter && Object.keys(qDesc.query.$cubeFilter).length > 0){
            		if(preparedQuery.$cubeFilter){
            			preparedQuery.$cubeFilter = {$and:[preparedQuery.$cubeFilter, qDesc.query.$cubeFilter]}
            		} else {
            			preparedQuery.$cubeFilter = qDesc.query.$cubeFilter;
            		}
            	}

            	if(qDesc.query.$postFilter && Object.keys(qDesc.query.$postFilter).length > 0){
            		if(preparedQuery.$postFilter){
            			preparedQuery.$postFilter = {$and:[preparedQuery.$postFilter, qDesc.query.$postFilter]}
            		} else {
            			preparedQuery.$postFilter = qDesc.query.$postFilter;
            		}
            	}

            	if(qDesc.query.$sort){
            		preparedQuery.$sort = qDesc.query.$sort;
            	}

            	if(qDesc.query.$select){
            		JSB.merge(preparedQuery.$select, qDesc.query.$select);
            	}

            	if(qDesc.query.$groupBy){
            		if(!preparedQuery.$groupBy){
            			preparedQuery.$groupBy = qDesc.query.$groupBy;
            		} else {
            			JSB.merge(preparedQuery.$groupBy, qDesc.query.$groupBy);
            		}
            	}
            	
            	if(qDesc.query.$params){
            		if(!preparedQuery.$params){
            			preparedQuery.$params = qDesc.query.$params;
            		} else {
            			JSB.merge(preparedQuery.$params, qDesc.query.$params);
            		}
            	}

            }
            if(opts && opts.wrapQuery && Object.keys(opts.wrapQuery).length > 0){
            	var q = JSB.clone(opts.wrapQuery);
            	if(preparedQuery.$cubeFilter){
            		if(q.$cubeFilter){
            			q.$cubeFilter = {$and:[q.$cubeFilter, preparedQuery.$cubeFilter]};
            		} else {
            			q.$cubeFilter = preparedQuery.$cubeFilter;
            		}
            		delete preparedQuery.$cubeFilter;
            	}
            	q.$from = preparedQuery;
            	preparedQuery = q;
            }
            
            return {query: preparedQuery, params: params};
		},

		extractFields: function(opts){
			throw new Error('QueryableEntry.extractFields should be overridden');
		},
		
		extractParams: function(opts){
			JSB.getLogger().warn('Please override method "QueryableEntry.extractParams" in bean "' + this.getJsb().getDescriptor().$name + '"');
			return {};
		}
	}
}