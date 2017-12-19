{
	$name: 'DataCube.Query.ViewsOptimizer',

	$server: {
	    $require: [
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],

        buildViews: function (dcQuery) {
            $this.lookupLocalViews(dcQuery, function(view, count){
                if (count > 1) {
                    for(var q in view.linkedQueries) {
                        var query = view.linkedQueries[q];
                        query.$select = $this._buildSelectFromView(view);
                        query.$filter = $this._buildFilterFromView(query.$filter, view);
                        query.$from = view.name;
                    }
                }
            });
        },

        lookupViews: function (dcQuery, viewCallback) {
            var views = {}, viewsUseCount = {}, viewKeysOrder = [];
            $this.lookupLocalViews(dcQuery, function(viewKey, viewQuery, viewFields, query){
                viewsUseCount[viewKey] = (viewsUseCount[viewKey]||0) + 1
                if(!views[viewKey]) {
                    var view = views[viewKey] = {
                        key: viewKey,
                        name: 'v'+$this._extractKey(obj).substring(0,4),
                        fields:  viewFields,
                        query: viewQuery,
                        linkedQueries: [query],
                    };
                    viewKeysOrder.push(view);
                } else {
                    var view = views[viewKey];
                    view.linkedQueries.push(query);
                    $this._mergeFields(view.fields, viewFields);
                }
            });
            for (var i in viewKeysOrder) {
                var key = viewKeysOrder[i];
                viewCallback(views[key], viewsUseCount[key]);
            }
        },

        lookupLocalViews: function (dcQuery, localViewCallback) {
            dcQuery = JSB.merge(true, {}, dcQuery);

            $this.walkSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
                if (query.$sql) {
                    return; // skip embedded SQL query
                }
                if (!$this._isQueryContainsView(query)) {
                    return; // skip no view query
                }

                var viewKey = $this._extractViewKey(query);
                var viewQuery = $this._extractViewQuery(query);
                var viewFields = $this._extractViewFields(query, viewKey, viewQuery);

                localViewCallback(viewKey, viewQuery, viewFields, query);
            });
        },

        _isQueryContainsView: function(query){
            // содержит $groupBy или $filter
            // если содержит $groupBy, то он не содержит полей внешних запросов
        },

        _extractKey: function(keyObject){
        },

        _extractViewKey: function(query){
            var key = {
                $groupBy: query.$groupBy,
                $filter: $this._extractFilterWithoutForeignFields(query.$filter),
            };
            return $this._extractKey(key);
        },

        _extractViewQuery: function(query){
            // $groupBy (if has no foreign fields)
            // $filter without foreign fields condition
            // replace $filter`s not foreign fields with view aliases
        },
        _extractFilterWithoutForeignFields: function(filter) {
            // $filter without foreign fields condition
        }

        _extractViewFields: function(query, viewKey, viewQuery) {
            // $select expressions as fields
            // $sort expressions as fields
            // $filter expressions as fields (skip foreign fields)
        },

        _buildSelectFromView: function(view){
            // all view fields with aliases
        },

        _buildFilterFromView: function(filter, view){
            // remove view filter
            // replace view fields by aliases
        },
	}
}