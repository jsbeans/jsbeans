{
	$name: 'DataCube.Query.Accelerator.QuerySplitterAccelerator',

	$server: {
		$require: [
		    'DataCube.Query.Accelerator.AcceleratorRegistry',
		    'DataCube.Query.QueryUtils',
        ],

        $bootstrap: function(){
        	//AcceleratorRegistry.register(this);
        },

		getDescriptor: function(){
		    return {
		        name: $this.getJsb().$name,
		        displayName: 'Формировать упрощённые зпросы',
		        description: 'Разбить запрос среза на несколько упрощенных для различных комбинаций используемых полей',
		    };
		},

		enable: function(slice){
		    $this.disable(slice);
		    // TODO implement

		    $this._buildSlices(slice);
		},

		disable: function(slice){
            var slices = QueryUtils.extractReplacementSlices(slice);
            for(var sid in slices) {
                if(slices[dis].property(this.getJsb().$name)) {
                    slices[sid].remove();
                }
            }
		},

		_buildSlices: function(slice) {
		    // TODO
            // если содержит $join - все варианты с удалением $join и его полей
            // если $union содержит непересекающиеся подзапросы
            // без выходных полей, содержащих подзапросы
		},

		splitQuery: function(query, usedFields, defaultCube){
		    QueryUtils.throwError(JSB.isArray(usedFields), 'Used fields list is not array');

		    var originalQuery = query;
		    query = JSB.clone(query);

		    // 1: remove unused from $select
		    for(var alias in query.$select) {
		        if (usedFields.indexOf(alias) == -1) {
		            delete query.$select[alias];
		        }
		    }

		    if (Object.keys(query.$select).length == 0) {
		        return query = {};
		    }

		    // 2: find used source fields
		    var usedInputFields = QueryUtils.extractInputFields(query); // TODO usedInputFields -> array

		    // 3: split source
		    if (query.$from) {
		        var sourceQuery = JSB.isString(query.$from) ? query.$views[view] : query.$from;
		        query.$from = $this.splitQuery(sourceQuery, usedInputFields, defaultCube);
		    } else if (query.$provider || query.$cube) {
		        // nothing to do
		    } else if (query.$join) {
		        query.$join.$left  = $this.splitQuery(query.$join.$left, usedInputFields, defaultCube);
		        query.$join.$right = $this.splitQuery(query.$join.$right, usedInputFields, defaultCube);

                var leftUnused = $this._checkHasOnlyJoinKeyFields(query.$join.$left, query.$join.$filter, query);
                var rightUnused = $this._checkHasOnlyJoinKeyFields(query.$join.$right, query.$join.$filter, query);
		        if (leftUnused || rightUnused) {
                    // remove unused join
                    $this._removeJoin(query, leftUnused, rightUnused, defaultCube);
                }
            } else if (query.$union) {
                for(var i = 0 ; i < query.$union.length; i++) {
                    query.$union[i] = $this.splitQuery(query.$union[i], usedInputFields, defaultCube);
                    if (Object.keys(query.$union[i].$select).length == 0) {
                        // remove unused union
                        query.$union.splice(i--, 1);
                    }

                    if(query.$union.length == 0) {
                        // if whole query unused - replace with {}
                        QueryUtils.jsonReplaceBody(query, {});
                    }
                }
            }

            return query;
		},

		_checkHasOnlyJoinKeyFields : function(query, joinFilter, rootQuery, defaultCube){
		    var filterFields = {};
            $this.walkInputFieldsCandidates(
                    {$filter: joinFilter, $join: query.$join},
                    defaultCube,
                    {rootQuery:rootQuery},
                    function (field, context, q, isExp
            ) {
                if (context && context == query.$context) {
                    filterFields[field] = field;
                }
            });

            var queryFields = QueryUtils.extractOutputFields(query);
            var notFilterFieldsCount = 0;
            for(var field in queryFields) {
                if (!filterFields[field]) {
                    notFilterFieldsCount ++;
                }
            }
            return notFilterFieldsCount == 0;
		},

		_removeJoin : function(query, leftUnused, rightUnused, defaultCube){
		     // simple - replace unused with empty query
            if(leftUnused && rightUnused) {
                // if whole query unused - replace with {}
                QueryUtils.jsonReplaceBody(query, {});
            } else if(leftUnused) {
		        query.$join.$left = {};
		        query.$join.$filter = {};
		    } else if (rightUnused) {
		        query.$join.$right = {};
		        query.$join.$filter = {};
		    }

		    /** TODO сделать нормальную замену тела запроса правым или левым
		        (но там нужно учитывать изменение группировки,
		        например, в сложныъх случаях использовать старый прием с пустым запросом)
		    */
		},
	}
}